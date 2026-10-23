import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { FAQ_LIST } from "@/lib/data/faqs";
import { CUSTOMER_REVIEWS } from "@/lib/data/reviews";
import { Suspense } from "react";
import { GA_MEASUREMENT_ID, GoogleAnalyticsPageview } from "@/lib/analytics";
import { LanguageProvider } from "@/components/LanguageProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b171c",
};

export const metadata: Metadata = {
  title: "Rental Mobil Bali & Tiket Fastboat Nusa Penida Gili | BaliRide",
  description: "Platform resmi booking sewa mobil Bali dengan supir, airport transfer Ngurah Rai, dan tiket kapal cepat fastboat Sanur ke Nusa Penida, Lembongan, dan Gili Trawangan.",
  keywords: [
    "rental mobil bali",
    "sewa mobil bali",
    "fastboat sanur nusa penida",
    "tiket fastboat bali",
    "airport transfer bali",
    "private driver bali",
    "fastboat nusa lembongan",
    "fastboat padang bai gili trawangan",
    "transportasi pariwisata bali"
  ],
  authors: [{ name: "BaliRide Tourism Platform" }],
  creator: "BaliRide Transport",
  publisher: "BaliRide Tourism Network",
  metadataBase: new URL("https://baliride-trans.com"),
  alternates: {
    canonical: "/",
    languages: {
      "id-ID": "/id",
      "en-US": "/en",
    },
  },
  openGraph: {
    title: "Rental Mobil Bali & Tiket Fastboat Nusa Penida | BaliRide",
    description: "Sewa mobil all-in dengan supir berlisensi & tiket fastboat resmi ke Nusa Penida & Gili. Konfirmasi instan via WhatsApp tanpa akun.",
    url: "https://baliride-trans.com",
    siteName: "BaliRide Tourism Transport",
    images: [
      {
        url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "BaliRide Tourism Transport and Fastboat",
      },
    ],
    locale: "id_ID",
    alternateLocale: ["en_US"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rental Mobil Bali & Fastboat Nusa Penida | BaliRide",
    description: "Cari layanan transportasi dan fastboat resmi di Bali. Booking mudah via WhatsApp.",
    images: ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Enhanced Schema JSON-LD (PRD Section 11 & 16)
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        "@id": "https://baliride-trans.com/#organization",
        "name": "BaliRide Transport & Fastboat Hub",
        "url": "https://baliride-trans.com",
        "logo": "https://baliride-trans.com/logo.png",
        "image": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
        "telephone": "+6281234567890",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Jl. Hang Tuah No. 45, Sanur Kaja",
          "addressLocality": "Denpasar Selatan",
          "addressRegion": "Bali",
          "postalCode": "80227",
          "addressCountry": "ID"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": -8.6753,
          "longitude": 115.2625
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "06:00",
          "closes": "23:00"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "1240",
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": CUSTOMER_REVIEWS.map(r => ({
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": r.name
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": r.rating,
            "bestRating": "5"
          },
          "reviewBody": r.comment
        }))
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://baliride-trans.com/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Beranda",
            "item": "https://baliride-trans.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Rental Mobil Bali",
            "item": "https://baliride-trans.com/#services"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Jadwal Fastboat",
            "item": "https://baliride-trans.com/#routes"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Destinasi",
            "item": "https://baliride-trans.com/#destinations"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://baliride-trans.com/#faq",
        "mainEntity": FAQ_LIST.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }
    ]
  };

  return (
    <html lang="id" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Outfit:wght@300;400;500;600;700&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* Google Analytics 4 — PRD Section 31 */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', { page_path: window.location.pathname });
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased text-[#f3efe6] bg-[#0b171c] min-h-screen flex flex-col">
        <Suspense fallback={null}>
          <GoogleAnalyticsPageview />
        </Suspense>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

