import { BookingStatus, BookingFormData } from "@/types";

export interface BookingRecord extends BookingFormData {
  id: string;
  bookingCode: string;
  createdAt: string;
  status: BookingStatus;
  whatsappDeliveryStatus: {
    dispatchedViaGateway: boolean;
    sentToAdmin: boolean;
    sentToCustomer: boolean;
    error?: string;
  };
}

// Global in-memory storage during process lifetime
const globalBookings: BookingRecord[] = [];

export const BookingStore = {
  createBooking(data: BookingFormData, bookingCode: string): BookingRecord {
    const newRecord: BookingRecord = {
      ...data,
      id: `bk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      bookingCode,
      createdAt: new Date().toISOString(),
      status: "PENDING",
      whatsappDeliveryStatus: {
        dispatchedViaGateway: false,
        sentToAdmin: false,
        sentToCustomer: false,
      },
    };

    globalBookings.unshift(newRecord);
    return newRecord;
  },

  updateDeliveryStatus(
    bookingCode: string,
    status: { dispatchedViaGateway: boolean; sentToAdmin: boolean; sentToCustomer: boolean; error?: string }
  ) {
    const found = globalBookings.find((b) => b.bookingCode === bookingCode);
    if (found) {
      found.whatsappDeliveryStatus = status;
      if (status.sentToAdmin || status.sentToCustomer) {
        found.status = "CONTACTED";
      }
    }
  },

  getAllBookings(): BookingRecord[] {
    return globalBookings;
  },

  getBookingByCode(bookingCode: string): BookingRecord | undefined {
    return globalBookings.find((b) => b.bookingCode === bookingCode);
  },
};
