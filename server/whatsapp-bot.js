const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');
const { Client, LocalAuth } = require('whatsapp-web.js');
const path = require('path');
const fs = require('fs');

const PORT = process.env.WA_GATEWAY_PORT || 3001;
const OPERATOR_DEFAULT_PHONE = process.env.WA_OPERATOR_PHONE || '6287761459651';

// Detect installed Chrome on Windows for optimal Puppeteer speed
const potentialChromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  process.env.CHROME_BIN || '',
];
const detectedChrome = potentialChromePaths.find(p => p && fs.existsSync(p));

const app = express();
app.use(cors());
app.use(express.json());

// State management
let clientState = {
  status: 'INITIALIZING', // INITIALIZING | QR_READY | AUTHENTICATED | READY | DISCONNECTED | ERROR
  qrRaw: null,
  qrDataUrl: null,
  userInfo: null,
  lastConnectedAt: null,
  lastError: null,
  loadingPercent: 0,
};

const messageLogs = [];

function addLog(type, details) {
  const entry = {
    id: Date.now() + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
    type,
    ...details,
  };
  messageLogs.unshift(entry);
  if (messageLogs.length > 50) messageLogs.pop();
  return entry;
}

/**
 * Standardize phone number to WhatsApp international format (e.g. 628xxxxxxxxxx@c.us)
 */
function formatWhatsAppNumber(phone) {
  if (!phone) return null;
  let cleaned = phone.replace(/[^0-9]/g, '');

  // Convert Indonesian local 08xx to 628xx
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }

  // Ensure it ends with @c.us
  if (!cleaned.endsWith('@c.us')) {
    return `${cleaned}@c.us`;
  }
  return cleaned;
}

/**
 * Currency formatter for Rupiah
 */
function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

// Initialize WhatsApp Web Client
let client = null;

function initWhatsAppClient() {
  clientState.status = 'INITIALIZING';
  clientState.lastError = null;

  try {
    const puppeteerOpts = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
      ],
    };

    if (detectedChrome) {
      console.log(`🧭 Using detected Chrome binary: ${detectedChrome}`);
      puppeteerOpts.executablePath = detectedChrome;
    }

    client = new Client({
      authStrategy: new LocalAuth({
        dataPath: path.join(__dirname, '..', '.wwebjs_auth'),
        clientId: 'bali-transport-gateway',
      }),
      puppeteer: puppeteerOpts,
    });

    client.on('loading_screen', (percent, message) => {
      console.log(`⏳ Loading WhatsApp Web: ${percent}% - ${message}`);
      clientState.loadingPercent = percent;
    });

    client.on('qr', async (qr) => {
      console.log('📌 WhatsApp QR Code received! Scan with WhatsApp on your phone.');
      clientState.status = 'QR_READY';
      clientState.qrRaw = qr;
      try {
        clientState.qrDataUrl = await QRCode.toDataURL(qr, { width: 320, margin: 2 });
      } catch (err) {
        console.error('Failed to generate QR Data URL:', err);
      }
    });

    client.on('authenticated', () => {
      console.log('✅ WhatsApp authenticated successfully.');
      clientState.status = 'AUTHENTICATED';
      clientState.qrRaw = null;
      clientState.qrDataUrl = null;
    });

    client.on('auth_failure', (msg) => {
      console.error('❌ WhatsApp authentication failure:', msg);
      clientState.status = 'ERROR';
      clientState.lastError = `Auth failure: ${msg}`;
    });

    client.on('ready', () => {
      console.log('🚀 WhatsApp Gateway is READY to send and receive messages!');
      clientState.status = 'READY';
      clientState.lastConnectedAt = new Date().toISOString();
      if (client.info) {
        clientState.userInfo = {
          wid: client.info.wid ? client.info.wid._serialized : null,
          pushname: client.info.pushname || 'Bali Transport Operator',
          platform: client.info.platform || 'whatsapp-web.js 1.34.7',
        };
      }
    });

    client.on('disconnected', (reason) => {
      console.warn('⚠️ WhatsApp client was disconnected:', reason);
      clientState.status = 'DISCONNECTED';
      clientState.lastError = reason;
      clientState.userInfo = null;
    });

    // Optional incoming message handler for auto-reply / logging
    client.on('message', async (msg) => {
      if (msg.isStatus || msg.from.includes('@g.us')) return;

      addLog('INCOMING', {
        from: msg.from,
        body: msg.body,
      });

      const lower = (msg.body || '').trim().toLowerCase();
      if (lower === 'halo' || lower === 'hi' || lower === 'ping') {
        try {
          await msg.reply('Halo! Terima kasih telah menghubungi Bali Transport & Fastboat Platform. Ada yang bisa kami bantu terkait tiket Fastboat atau Sewa Mobil hari ini?');
        } catch (err) {
          console.error('Failed to send auto-reply:', err);
        }
      }
    });

    client.initialize().catch((err) => {
      console.error('Failed to initialize WhatsApp client:', err);
      clientState.status = 'ERROR';
      clientState.lastError = err.message;
    });
  } catch (err) {
    console.error('Error instantiating WhatsApp Client:', err);
    clientState.status = 'ERROR';
    clientState.lastError = err.message;
  }
}

// API Routes
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    data: {
      status: clientState.status,
      isReady: clientState.status === 'READY',
      userInfo: clientState.userInfo,
      hasQr: !!clientState.qrDataUrl,
      loadingPercent: clientState.loadingPercent,
      lastConnectedAt: clientState.lastConnectedAt,
      lastError: clientState.lastError,
      timestamp: new Date().toISOString(),
      version: 'whatsapp-web.js 1.34.7',
    },
  });
});

app.get('/api/qr', (req, res) => {
  res.json({
    success: true,
    data: {
      status: clientState.status,
      qrDataUrl: clientState.qrDataUrl,
      qrRaw: clientState.qrRaw,
    },
  });
});

app.post('/api/restart', async (req, res) => {
  try {
    if (client) {
      await client.destroy().catch(() => {});
    }
    initWhatsAppClient();
    res.json({ success: true, message: 'WhatsApp client restarted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/logs', (req, res) => {
  res.json({ success: true, data: messageLogs });
});

/**
 * Send raw message endpoint
 */
app.post('/api/send', async (req, res) => {
  if (clientState.status !== 'READY' || !client) {
    return res.status(503).json({
      success: false,
      error: `WhatsApp client is not ready. Current status: ${clientState.status}`,
    });
  }

  const { to, message } = req.body;
  if (!to || !message) {
    return res.status(400).json({ success: false, error: 'Parameters "to" and "message" are required.' });
  }

  const formattedTo = formatWhatsAppNumber(to);
  try {
    const sentMsg = await client.sendMessage(formattedTo, message);
    addLog('SENT', { to: formattedTo, body: message });

    res.json({
      success: true,
      data: {
        id: sentMsg.id ? sentMsg.id._serialized : null,
        to: formattedTo,
        timestamp: sentMsg.timestamp,
      },
    });
  } catch (err) {
    console.error('Failed to send WhatsApp message:', err);
    addLog('SEND_ERROR', { to: formattedTo, error: err.message });
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Specific booking dispatch endpoint matching PRD Section 6.1
 */
app.post('/api/send-booking', async (req, res) => {
  const booking = req.body;
  if (!booking || !booking.bookingId || !booking.customerPhone) {
    return res.status(400).json({
      success: false,
      error: 'Missing required booking parameters (bookingId, customerPhone).',
    });
  }

  const operatorPhone = booking.operatorPhone || OPERATOR_DEFAULT_PHONE;

  // Format booking message matching PRD Section 6.1
  const messageLines = [
    'Halo, ada pemesanan layanan pariwisata baru!',
    '',
    `📋 *Booking ID:* ${booking.bookingId}`,
    `👤 *Nama:* ${booking.customerName}`,
    `📱 *WhatsApp Customer:* ${booking.customerPhone}`,
    `🚗 *Layanan / Rute:* ${booking.selectedItemTitle}`,
    `📅 *Tanggal:* ${booking.bookingDate}${booking.bookingTime ? ` (Pukul ${booking.bookingTime})` : ''}`,
    `👥 *Jumlah Penumpang:* ${booking.passengerCount} orang`,
    `📍 *Lokasi Jemput:* ${booking.pickupLocation || '-'}`,
    `🏁 *Tujuan / Drop-off:* ${booking.dropoffLocation || '-'}`,
    `💰 *Estimasi Total:* ${formatRupiah(booking.estimatedPrice)}`,
  ];

  if (booking.notes && booking.notes.trim()) {
    messageLines.push(`📝 *Catatan:* ${booking.notes.trim()}`);
  } else {
    messageLines.push('📝 *Catatan:* Mohon informasi ketersediaan armada/jadwal.');
  }

  messageLines.push('');
  messageLines.push('Pesan ini dikirim otomatis oleh *WhatsApp Gateway (whatsapp-web.js 1.34.7)*.');

  const fullAdminMessage = messageLines.join('\n');

  // Customer confirmation message
  const customerConfirmationLines = [
    `Halo *${booking.customerName}*! Terima kasih telah melakukan pemesanan di Bali Transport & Fastboat Platform.`,
    '',
    `Nomor referensi Anda adalah: *${booking.bookingId}*`,
    `Layanan: *${booking.selectedItemTitle}*`,
    `Tanggal: *${booking.bookingDate}* (${booking.passengerCount} Pax)`,
    `Estimasi Biaya: *${formatRupiah(booking.estimatedPrice)}*`,
    '',
    'Tim operator kami sedang memproses pesanan Anda dan akan segera mengonfirmasi ketersediaan via chat WhatsApp ini. Mohon ditunggu ya!',
    '',
    'Salam hangat,',
    'Tim Bali Transport & Fastboat Service',
  ];
  const fullCustomerMessage = customerConfirmationLines.join('\n');

  // If WhatsApp Client is not connected, respond with status so frontend can provide fallback
  if (clientState.status !== 'READY' || !client) {
    return res.json({
      success: false,
      gatewayReady: false,
      status: clientState.status,
      message: 'WhatsApp Gateway is not currently ready/paired. Please use manual WhatsApp link.',
      bookingId: booking.bookingId,
    });
  }

  const results = {
    sentToAdmin: false,
    sentToCustomer: false,
    errors: [],
  };

  // 1. Send to Operator/Admin
  try {
    const adminDest = formatWhatsAppNumber(operatorPhone);
    if (adminDest) {
      await client.sendMessage(adminDest, fullAdminMessage);
      results.sentToAdmin = true;
      addLog('BOOKING_SENT_ADMIN', { to: adminDest, bookingId: booking.bookingId });
    }
  } catch (err) {
    console.error('Failed to send booking notification to admin:', err);
    results.errors.push(`Admin: ${err.message}`);
  }

  // 2. Send confirmation to Customer
  try {
    const custDest = formatWhatsAppNumber(booking.customerPhone);
    if (custDest) {
      await client.sendMessage(custDest, fullCustomerMessage);
      results.sentToCustomer = true;
      addLog('BOOKING_SENT_CUSTOMER', { to: custDest, bookingId: booking.bookingId });
    }
  } catch (err) {
    console.error('Failed to send confirmation to customer:', err);
    results.errors.push(`Customer: ${err.message}`);
  }

  res.json({
    success: true,
    gatewayReady: true,
    bookingId: booking.bookingId,
    results,
  });
});

// Start express server and WhatsApp Client
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🤖 WhatsApp Gateway Service running on http://localhost:${PORT}`);
  console.log(`📦 Using whatsapp-web.js version: 1.34.7`);
  console.log(`======================================================\n`);
  initWhatsAppClient();
});
