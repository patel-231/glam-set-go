export type ServiceCategory = 
  | 'hair'
  | 'skin'
  | 'makeup'
  | 'bridal'
  | 'nails'
  | 'treatments'
  | 'groom_draping'
  | 'courses';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  shortDescription: string;
  description: string;
  price: number;
  isStartingPrice: boolean; // e.g., starting at ₹1,499
  requiresConsultation: boolean;
  durationMinutes: number;
  imageUrl?: string;
  isActive: boolean;
  preparationNotes?: string;
  recommendedFor?: string;
}

export type AppointmentStatus = 
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'rejected'
  | 'no_show';

export type PaymentStatus = 
  | 'pending_at_salon'
  | 'paid_at_salon'
  | 'refunded'
  | 'waived';

export type InSalonPaymentMethod = 
  | 'cash'
  | 'upi_qr'
  | 'card_pos'
  | 'not_collected';

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  specialization: string[];
  avatarUrl?: string;
  isActive: boolean;
  workingDays: number[]; // 0 = Sunday, 1 = Monday, etc.
  startHour: string; // "10:00"
  endHour: string;   // "20:00"
}

export interface Appointment {
  id: string;
  referenceNumber: string; // e.g. "GSG-26-8921"
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceIds: string[];
  serviceNames: string[];
  totalPrice: number;
  totalDurationMinutes: number;
  staffId: string; // 'any' or specific staff id
  staffName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // "10:30"
  status: AppointmentStatus;
  paymentMethod: 'pay_at_salon';
  paymentStatus: PaymentStatus;
  inSalonPaymentDetails?: {
    method: InSalonPaymentMethod;
    amountPaid: number;
    collectedAt?: string;
    collectedBy?: string;
    notes?: string;
  };
  customerNotes?: string;
  referenceImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalonOffer {
  id: string;
  title: string;
  tagline: string;
  description: string;
  discountType: 'fixed_price' | 'percentage_off' | 'flat_off';
  discountValue: number; // e.g. 249 or 20%
  eligibleServiceIds: string[];
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  termsAndConditions: string[];
  isActive: boolean;
  badge?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'hair' | 'makeup' | 'bridal' | 'nails' | 'skin' | 'studio';
  imageUrl: string;
  caption: string;
  dateAdded: string;
}

export interface AcademyCourse {
  id: string;
  title: string;
  duration: string;
  format: string; // "Hands-on Practical & Theory"
  description: string;
  topics: string[];
  fee: number;
  isStartingFee?: boolean;
  eligibility: string;
  seatsPerBatch: number;
  nextBatchDate: string;
  isActive: boolean;
}

export interface CourseEnquiry {
  id: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  studentPhone: string;
  studentEmail?: string;
  priorExperience: string;
  message?: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'enrolled' | 'closed';
  notes?: string;
}

export interface BusinessSettings {
  salonName: string;
  tagline: string;
  phone: string;
  whatsAppNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  instagramHandle: string;
  openingHours: {
    weekdays: string;
    weekends: string;
  };
  slotDurationMinutes: number;
  cancellationPolicy: string;
  allowSelfCancellationHours: number; // e.g. 4 hours before
  autoConfirmBookings: boolean;
}
