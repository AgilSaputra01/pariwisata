export type ServiceCategory = 
  | 'CAR_RENTAL' 
  | 'AIRPORT_TRANSFER' 
  | 'PRIVATE_DRIVER' 
  | 'TOUR_PACKAGE' 
  | 'FASTBOAT';

export type BookingStatus = 
  | 'PENDING'
  | 'CONTACTED'
  | 'CONFIRMED'
  | 'WAITING_PAYMENT'
  | 'PAID'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED';

export interface TransportService {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  priceStartingFrom?: number;
  capacity: string;
  luggageCapacity?: string;
  transmission?: string;
  included: string[];
  popular?: boolean;
  image: string;
  badge?: string;
}

export interface FastboatRoute {
  id: string;
  departurePort: string;
  arrivalPort: string;
  destinationName: string;
  durationMinutes: number;
  pricePerPerson?: number;
  childPrice?: number;
  schedules: string[];
  operators: string[];
  included: string[];
  popular?: boolean;
  image: string;
}

export interface DestinationItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  transportTypes: string[];
  travelTime: string;
  highlights: string[];
  image: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "fastboat" | "car-rental" | "travel-tips";
  image: string;
  date: string;
  readTime: string;
  relatedTags: string[];
}

export interface ReviewItem {
  id: string;
  name: string;
  origin: string;
  rating: number;
  date: string;
  tripType: string;
  comment: string;
  serviceUsed: string;
  verified: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'booking' | 'car' | 'fastboat' | 'payment';
}

export interface BookingFormData {
  customerName: string;
  customerPhone: string;
  serviceType: 'car' | 'fastboat';
  selectedItemId: string;
  selectedItemTitle: string;
  bookingDate: string;
  bookingTime?: string;
  passengerCount: number;
  pickupLocation: string;
  dropoffLocation: string;
  notes?: string;
  estimatedBudget?: string;
}
