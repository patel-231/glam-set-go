import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Service, 
  StaffMember, 
  SalonOffer, 
  GalleryItem, 
  AcademyCourse, 
  CourseEnquiry, 
  BusinessSettings, 
  Appointment, 
  AppointmentStatus,
  InSalonPaymentMethod
} from '../types';
import { 
  INITIAL_SERVICES, 
  INITIAL_STAFF, 
  INITIAL_OFFERS, 
  INITIAL_GALLERY, 
  INITIAL_COURSES, 
  INITIAL_SETTINGS, 
  INITIAL_APPOINTMENTS 
} from '../data/initialData';

interface BookingRequestData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceIds: string[];
  staffId: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // "10:30 AM"
  customerNotes?: string;
}

interface SalonContextType {
  // Data
  services: Service[];
  staff: StaffMember[];
  offers: SalonOffer[];
  gallery: GalleryItem[];
  courses: AcademyCourse[];
  enquiries: CourseEnquiry[];
  settings: BusinessSettings;
  appointments: Appointment[];

  // Modal controls
  isBookingModalOpen: boolean;
  selectedServiceForBooking: Service | null;
  openBookingModal: (preselectedService?: Service) => void;
  closeBookingModal: () => void;

  isLookupModalOpen: boolean;
  openLookupModal: () => void;
  closeLookupModal: () => void;

  isEnquiryModalOpen: boolean;
  selectedCourseForEnquiry: AcademyCourse | null;
  openEnquiryModal: (course?: AcademyCourse) => void;
  closeEnquiryModal: () => void;

  // Booking operations
  createAppointment: (data: BookingRequestData) => { success: boolean; appointment?: Appointment; error?: string };
  cancelAppointment: (id: string, reason?: string) => { success: boolean; error?: string };
  rescheduleAppointment: (id: string, newDate: string, newTimeSlot: string) => { success: boolean; error?: string };
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  recordInSalonPayment: (id: string, details: { method: InSalonPaymentMethod; amountPaid: number; collectedBy?: string; notes?: string }) => void;
  getAppointmentByReference: (ref: string) => Appointment | undefined;
  getAppointmentsByPhone: (phone: string) => Appointment[];
  getAvailableSlots: (date: string, staffId: string, durationMinutes: number) => { time: string; available: boolean }[];

  // Admin CRUD operations
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;

  addOffer: (offer: Omit<SalonOffer, 'id'>) => void;
  updateOffer: (id: string, updates: Partial<SalonOffer>) => void;
  deleteOffer: (id: string) => void;

  addStaff: (member: Omit<StaffMember, 'id'>) => void;
  updateStaff: (id: string, updates: Partial<StaffMember>) => void;
  deleteStaff: (id: string) => void;

  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'dateAdded'>) => void;
  deleteGalleryItem: (id: string) => void;

  submitCourseEnquiry: (enquiry: Omit<CourseEnquiry, 'id' | 'createdAt' | 'status'>) => void;
  updateEnquiryStatus: (id: string, status: CourseEnquiry['status'], notes?: string) => void;

  updateSettings: (newSettings: Partial<BusinessSettings>) => void;
  resetToDefaultData: () => void;

  // WhatsApp Helpers
  generateWhatsAppBookingUrl: (appointment: Appointment) => string;
}

const SalonContext = createContext<SalonContextType | undefined>(undefined);

// All time slots in standard salon operation
const STANDARD_TIME_SLOTS = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
];

export const SalonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load from local storage or fallback to initial data
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('gsg_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('gsg_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [offers, setOffers] = useState<SalonOffer[]>(() => {
    const saved = localStorage.getItem('gsg_offers');
    return saved ? JSON.parse(saved) : INITIAL_OFFERS;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('gsg_gallery');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY;
  });

  const [courses] = useState<AcademyCourse[]>(() => {
    const saved = localStorage.getItem('gsg_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [enquiries, setEnquiries] = useState<CourseEnquiry[]>(() => {
    const saved = localStorage.getItem('gsg_enquiries');
    return saved ? JSON.parse(saved) : [
      {
        id: 'enq-101',
        courseId: 'crs-bridal-masterclass',
        courseTitle: 'Professional Bridal & HD Makeover Masterclass',
        studentName: 'Aarti Solanki',
        studentPhone: '9898123456',
        studentEmail: 'aarti.s@example.com',
        priorExperience: 'Beginner / Aspiring Artist',
        message: 'Interested in the upcoming November weekend batch for bridal makeup certificate.',
        createdAt: '2026-10-08T11:20:00Z',
        status: 'new',
      }
    ];
  });

  const [settings, setSettings] = useState<BusinessSettings>(() => {
    const saved = localStorage.getItem('gsg_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('gsg_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  // Modal UI state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<Service | null>(null);

  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);

  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [selectedCourseForEnquiry, setSelectedCourseForEnquiry] = useState<AcademyCourse | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('gsg_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('gsg_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('gsg_offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('gsg_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('gsg_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('gsg_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    localStorage.setItem('gsg_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('gsg_appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Modal triggers
  const openBookingModal = (preselectedService?: Service) => {
    setSelectedServiceForBooking(preselectedService || null);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedServiceForBooking(null);
  };

  const openLookupModal = () => setIsLookupModalOpen(true);
  const closeLookupModal = () => setIsLookupModalOpen(false);

  const openEnquiryModal = (course?: AcademyCourse) => {
    setSelectedCourseForEnquiry(course || null);
    setIsEnquiryModalOpen(true);
  };
  const closeEnquiryModal = () => {
    setIsEnquiryModalOpen(false);
    setSelectedCourseForEnquiry(null);
  };

  // Availability calculation (prevents double bookings)
  const getAvailableSlots = (date: string, staffId: string, _durationMinutes: number) => {
    // Active booked appointments on this date
    const dayBookings = appointments.filter(
      apt => apt.date === date && apt.status !== 'cancelled' && apt.status !== 'rejected'
    );

    return STANDARD_TIME_SLOTS.map(slot => {
      let isAvailable = true;

      if (staffId && staffId !== 'any') {
        // Specific staff check
        const hasConflict = dayBookings.some(
          apt => apt.timeSlot === slot && apt.staffId === staffId
        );
        isAvailable = !hasConflict;
      } else {
        // Any staff check: available if count of booked appointments at this slot is less than active staff count
        const activeStaffCount = staff.filter(s => s.isActive).length || 1;
        const bookedAtSlot = dayBookings.filter(apt => apt.timeSlot === slot).length;
        isAvailable = bookedAtSlot < activeStaffCount;
      }

      return { time: slot, available: isAvailable };
    });
  };

  // Appointment creation with conflict check
  const createAppointment = (data: BookingRequestData) => {
    // Validate phone number
    const cleanPhone = data.customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
    }

    if (!data.serviceIds || data.serviceIds.length === 0) {
      return { success: false, error: 'Please select at least one salon service.' };
    }

    // Double-booking concurrency check
    const existingConflicts = appointments.filter(
      apt => apt.date === data.date && 
             apt.timeSlot === data.timeSlot && 
             apt.status !== 'cancelled' && 
             apt.status !== 'rejected'
    );

    let assignedStaffId = data.staffId;
    let assignedStaffName = 'Assigned Salon Specialist';

    if (data.staffId !== 'any') {
      const isTaken = existingConflicts.some(apt => apt.staffId === data.staffId);
      if (isTaken) {
        return { 
          success: false, 
          error: 'This time slot is already reserved for the chosen specialist. Please select another time or specialist.' 
        };
      }
      const staffMember = staff.find(s => s.id === data.staffId);
      assignedStaffName = staffMember ? staffMember.name : 'Salon Specialist';
    } else {
      // Find first available active staff member for this slot
      const busyStaffIds = new Set(existingConflicts.map(apt => apt.staffId));
      const availableStaff = staff.filter(s => s.isActive && !busyStaffIds.has(s.id));

      if (availableStaff.length === 0) {
        return { 
          success: false, 
          error: 'All salon specialists are fully booked at this selected time. Please choose an alternate slot.' 
        };
      }
      assignedStaffId = availableStaff[0].id;
      assignedStaffName = availableStaff[0].name;
    }

    // Calculate totals
    const selectedServices = services.filter(s => data.serviceIds.includes(s.id));
    const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
    const totalDuration = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);
    const serviceNames = selectedServices.map(s => s.name);

    // Generate unique human-readable booking reference
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceNumber = `GSG-26-${randomSuffix}`;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      referenceNumber,
      customerName: data.customerName.trim(),
      customerPhone: cleanPhone,
      customerEmail: data.customerEmail?.trim(),
      serviceIds: data.serviceIds,
      serviceNames,
      totalPrice,
      totalDurationMinutes: totalDuration,
      staffId: assignedStaffId,
      staffName: assignedStaffName,
      date: data.date,
      timeSlot: data.timeSlot,
      status: settings.autoConfirmBookings ? 'confirmed' : 'pending',
      paymentMethod: 'pay_at_salon',
      paymentStatus: 'pending_at_salon',
      customerNotes: data.customerNotes?.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAppointments(prev => [newAppointment, ...prev]);

    return { success: true, appointment: newAppointment };
  };

  const cancelAppointment = (id: string, reason?: string) => {
    const apt = appointments.find(a => a.id === id);
    if (!apt) return { success: false, error: 'Appointment not found.' };

    setAppointments(prev =>
      prev.map(a =>
        a.id === id
          ? {
              ...a,
              status: 'cancelled' as AppointmentStatus,
              customerNotes: reason ? `${a.customerNotes || ''} [Cancellation reason: ${reason}]` : a.customerNotes,
              updatedAt: new Date().toISOString(),
            }
          : a
      )
    );
    return { success: true };
  };

  const rescheduleAppointment = (id: string, newDate: string, newTimeSlot: string) => {
    const apt = appointments.find(a => a.id === id);
    if (!apt) return { success: false, error: 'Appointment not found.' };

    // Check conflict
    const conflict = appointments.some(
      a => a.id !== id &&
           a.date === newDate &&
           a.timeSlot === newTimeSlot &&
           a.staffId === apt.staffId &&
           a.status !== 'cancelled' &&
           a.status !== 'rejected'
    );

    if (conflict) {
      return { success: false, error: 'The requested new slot is already booked for this specialist. Please choose another slot.' };
    }

    setAppointments(prev =>
      prev.map(a =>
        a.id === id
          ? {
              ...a,
              date: newDate,
              timeSlot: newTimeSlot,
              status: 'confirmed' as AppointmentStatus,
              updatedAt: new Date().toISOString(),
            }
          : a
      )
    );
    return { success: true };
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev =>
      prev.map(a =>
        a.id === id
          ? {
              ...a,
              status,
              updatedAt: new Date().toISOString(),
            }
          : a
      )
    );
  };

  const recordInSalonPayment = (
    id: string, 
    details: { method: InSalonPaymentMethod; amountPaid: number; collectedBy?: string; notes?: string }
  ) => {
    setAppointments(prev =>
      prev.map(a =>
        a.id === id
          ? {
              ...a,
              status: 'completed' as AppointmentStatus,
              paymentStatus: 'paid_at_salon',
              inSalonPaymentDetails: {
                method: details.method,
                amountPaid: details.amountPaid,
                collectedAt: new Date().toISOString(),
                collectedBy: details.collectedBy || 'Front Desk',
                notes: details.notes,
              },
              updatedAt: new Date().toISOString(),
            }
          : a
      )
    );
  };

  const getAppointmentByReference = (ref: string) => {
    const cleanRef = ref.trim().toUpperCase();
    return appointments.find(a => a.referenceNumber.toUpperCase() === cleanRef);
  };

  const getAppointmentsByPhone = (phone: string) => {
    const clean = phone.replace(/\D/g, '');
    return appointments.filter(a => a.customerPhone.replace(/\D/g, '').endsWith(clean.slice(-10)));
  };

  // Admin CRUD operations
  const addService = (newService: Omit<Service, 'id'>) => {
    const service: Service = {
      ...newService,
      id: `srv-${Date.now()}`,
    };
    setServices(prev => [service, ...prev]);
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const addOffer = (newOffer: Omit<SalonOffer, 'id'>) => {
    const offer: SalonOffer = {
      ...newOffer,
      id: `ofr-${Date.now()}`,
    };
    setOffers(prev => [offer, ...prev]);
  };

  const updateOffer = (id: string, updates: Partial<SalonOffer>) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const deleteOffer = (id: string) => {
    setOffers(prev => prev.filter(o => o.id !== id));
  };

  const addStaff = (newStaff: Omit<StaffMember, 'id'>) => {
    const member: StaffMember = {
      ...newStaff,
      id: `staff-${Date.now()}`,
    };
    setStaff(prev => [...prev, member]);
  };

  const updateStaff = (id: string, updates: Partial<StaffMember>) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteStaff = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
  };

  const addGalleryItem = (item: Omit<GalleryItem, 'id' | 'dateAdded'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setGallery(prev => [newItem, ...prev]);
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
  };

  const submitCourseEnquiry = (enquiryData: Omit<CourseEnquiry, 'id' | 'createdAt' | 'status'>) => {
    const newEnquiry: CourseEnquiry = {
      ...enquiryData,
      id: `enq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    setEnquiries(prev => [newEnquiry, ...prev]);
  };

  const updateEnquiryStatus = (id: string, status: CourseEnquiry['status'], notes?: string) => {
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status, notes: notes || e.notes } : e));
  };

  const updateSettings = (newSettings: Partial<BusinessSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetToDefaultData = () => {
    setServices(INITIAL_SERVICES);
    setStaff(INITIAL_STAFF);
    setOffers(INITIAL_OFFERS);
    setGallery(INITIAL_GALLERY);
    setSettings(INITIAL_SETTINGS);
    setAppointments(INITIAL_APPOINTMENTS);
    localStorage.clear();
  };

  // WhatsApp generator with pre-filled message
  const generateWhatsAppBookingUrl = (appointment: Appointment) => {
    const msg = `Hello Glam Set Go! 🌸\nI have booked an appointment.\n\n*Reference:* ${appointment.referenceNumber}\n*Name:* ${appointment.customerName}\n*Date:* ${appointment.date}\n*Time:* ${appointment.timeSlot}\n*Services:* ${appointment.serviceNames.join(', ')}\n*Est. Amount:* ₹${appointment.totalPrice.toLocaleString('en-IN')}\n*Payment:* Pay in-person at salon\n\nPlease confirm my slot. Thank you!`;
    return `https://wa.me/${settings.whatsAppNumber}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <SalonContext.Provider
      value={{
        services,
        staff,
        offers,
        gallery,
        courses,
        enquiries,
        settings,
        appointments,
        isBookingModalOpen,
        selectedServiceForBooking,
        openBookingModal,
        closeBookingModal,
        isLookupModalOpen,
        openLookupModal,
        closeLookupModal,
        isEnquiryModalOpen,
        selectedCourseForEnquiry,
        openEnquiryModal,
        closeEnquiryModal,
        createAppointment,
        cancelAppointment,
        rescheduleAppointment,
        updateAppointmentStatus,
        recordInSalonPayment,
        getAppointmentByReference,
        getAppointmentsByPhone,
        getAvailableSlots,
        addService,
        updateService,
        deleteService,
        addOffer,
        updateOffer,
        deleteOffer,
        addStaff,
        updateStaff,
        deleteStaff,
        addGalleryItem,
        deleteGalleryItem,
        submitCourseEnquiry,
        updateEnquiryStatus,
        updateSettings,
        resetToDefaultData,
        generateWhatsAppBookingUrl,
      }}
    >
      {children}
    </SalonContext.Provider>
  );
};

export const useSalon = () => {
  const context = useContext(SalonContext);
  if (!context) {
    throw new Error('useSalon must be used within a SalonProvider');
  }
  return context;
};
