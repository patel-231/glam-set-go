import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  MessageCircle, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Building,
  Check
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { Service, Appointment } from '../../types';

export const BookingModal: React.FC = () => {
  const { 
    isBookingModalOpen, 
    closeBookingModal, 
    services, 
    staff, 
    selectedServiceForBooking, 
    createAppointment,
    getAvailableSlots,
    generateWhatsAppBookingUrl,
    settings
  } = useSalon();

  // Multi-step modal: 1: Services, 2: Specialist & Date/Slot, 3: Customer Details & Review, 4: Confirmed
  const [step, setStep] = useState<number>(1);

  // Selected services IDs
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  
  // Selected Specialist
  const [selectedStaffId, setSelectedStaffId] = useState<string>('any');

  // Selected Date
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Selected Time Slot
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Customer Contact Info
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState<string>('');

  // Submission result
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // When modal opens or preselected service changes
  useEffect(() => {
    if (isBookingModalOpen) {
      if (selectedServiceForBooking) {
        setSelectedServiceIds([selectedServiceForBooking.id]);
        setStep(2); // Jump straight to slot picker if preselected
      } else {
        setSelectedServiceIds([]);
        setStep(1);
      }
      setSelectedDate(new Date().toISOString().split('T')[0]);
      setSelectedTimeSlot('');
      setErrorMessage(null);
      setConfirmedAppointment(null);
    }
  }, [isBookingModalOpen, selectedServiceForBooking]);

  if (!isBookingModalOpen) return null;

  // Selected services calculations
  const chosenServices = services.filter((s) => selectedServiceIds.includes(s.id));
  const totalPrice = chosenServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = chosenServices.reduce((sum, s) => sum + s.durationMinutes, 0);

  // Available slots for selected date & specialist
  const availableSlots = getAvailableSlots(selectedDate, selectedStaffId, totalDuration);

  // Toggle service selection
  const handleToggleService = (serviceId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Submit appointment
  const handleConfirmBooking = () => {
    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please provide a valid 10-digit mobile number for appointment coordination.');
      return;
    }
    if (!selectedTimeSlot) {
      setErrorMessage('Please select a time slot.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = createAppointment({
      customerName,
      customerPhone,
      customerEmail,
      serviceIds: selectedServiceIds,
      staffId: selectedStaffId,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      customerNotes,
    });

    setIsSubmitting(false);

    if (result.success && result.appointment) {
      setConfirmedAppointment(result.appointment);
      setStep(4);
    } else {
      setErrorMessage(result.error || 'Failed to reserve appointment. Please try another slot.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#F0E8EE] shadow-2xl overflow-hidden my-auto animate-scale-up">
        
        {/* Top Header */}
        <div className="px-6 py-5 bg-[#FFFDF9] border-b border-[#F0E8EE] flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F07878]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#F07878]">
                Glam Set Go Studio Booking
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#483449]">
              {step === 1 && 'Step 1: Choose Your Services'}
              {step === 2 && 'Step 2: Date, Specialist & Time Slot'}
              {step === 3 && 'Step 3: Contact Details & Pay at Salon'}
              {step === 4 && 'Appointment Confirmed!'}
            </h2>
          </div>

          <button
            onClick={closeBookingModal}
            className="p-2 rounded-full text-[#766A77] hover:text-[#483449] hover:bg-[#F8DCE5]/30 transition-colors focus:outline-none"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicator (Steps 1 to 3) */}
        {step < 4 && (
          <div className="px-6 py-2.5 bg-[#FFFDF9]/60 border-b border-[#F0E8EE] flex items-center justify-between text-xs text-[#766A77]">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#483449] font-semibold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 1 ? 'bg-[#F07878] text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
              <span>Services</span>
            </div>
            <span className="text-slate-300">→</span>
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#483449] font-semibold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 2 ? 'bg-[#F07878] text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
              <span>Slot & Artist</span>
            </div>
            <span className="text-slate-300">→</span>
            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-[#483449] font-semibold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 3 ? 'bg-[#F07878] text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
              <span>Details & Pay-at-Salon</span>
            </div>
          </div>
        )}

        {/* Modal Body Container */}
        <div className="p-6 max-h-[72vh] overflow-y-auto">
          
          {/* ================= STEP 1: SERVICE SELECTION ================= */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-[#766A77]">
                Select one or more services you would like to book for your visit to our Naroda studio:
              </p>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {services.filter(s => s.isActive).map((srv) => {
                  const isChecked = selectedServiceIds.includes(srv.id);
                  return (
                    <div
                      key={srv.id}
                      onClick={() => handleToggleService(srv.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isChecked 
                          ? 'border-[#F07878] bg-[#F8DCE5]/20 shadow-2xs' 
                          : 'border-[#F0E8EE] hover:border-[#F8DCE5] bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          isChecked ? 'bg-[#F07878] border-[#F07878] text-white' : 'border-[#F0E8EE] bg-white'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>

                        <div>
                          <h4 className="text-sm font-serif font-semibold text-[#483449]">
                            {srv.name}
                          </h4>
                          <p className="text-xs text-[#766A77] line-clamp-1">
                            {srv.shortDescription}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-[#766A77]">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#F07878]" />
                              <span>{srv.durationMinutes} mins</span>
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="capitalize">{srv.category.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 pl-3">
                        <span className="text-sm font-serif font-bold text-[#483449]">
                          ₹{srv.price.toLocaleString('en-IN')}
                        </span>
                        {srv.isStartingPrice && (
                          <span className="block text-[10px] text-[#766A77]">starting</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Running summary bar */}
              {selectedServiceIds.length > 0 && (
                <div className="pt-3 border-t border-[#F0E8EE] flex items-center justify-between bg-[#FFFDF9] p-3 rounded-xl">
                  <div>
                    <span className="text-xs text-[#766A77] block">
                      {selectedServiceIds.length} service(s) selected · {totalDuration} mins est.
                    </span>
                    <span className="text-base font-serif font-bold text-[#483449]">
                      Total: ₹{totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1 px-5 py-2.5 bg-[#F07878] hover:bg-[#e06565] text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    <span>Next: Select Slot</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 2: DATE, TIME & ARTIST ================= */}
          {step === 2 && (
            <div className="space-y-5">
              
              {/* Selected Services Pill summary */}
              <div className="p-3 bg-[#FFFDF9] rounded-xl border border-[#F0E8EE] flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#483449]">
                    Selected ({chosenServices.length}):{' '}
                  </span>
                  <span className="text-[#766A77]">
                    {chosenServices.map(s => s.name).join(', ')}
                  </span>
                  <div className="text-[11px] text-[#766A77] mt-0.5">
                    Est. Duration: {totalDuration} mins · Est. Total: ₹{totalPrice.toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-[#F07878] hover:underline shrink-0 ml-2 font-medium"
                >
                  Change
                </button>
              </div>

              {/* Specialist Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#483449] block">
                  Select Makeover Specialist
                </label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => {
                    setSelectedStaffId(e.target.value);
                    setSelectedTimeSlot(''); // reset slot when specialist changes
                  }}
                  className="w-full py-2.5 px-3 rounded-xl border border-[#F0E8EE] bg-white text-sm text-[#483449] focus:outline-none focus:ring-2 focus:ring-[#F8DCE5]"
                >
                  <option value="any">✨ Any Available Salon Specialist (Recommended)</option>
                  {staff.filter(s => s.isActive).map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#483449] block">
                  Appointment Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedTimeSlot('');
                  }}
                  className="w-full py-2.5 px-3 rounded-xl border border-[#F0E8EE] bg-white text-sm text-[#483449] focus:outline-none focus:ring-2 focus:ring-[#F8DCE5]"
                />
              </div>

              {/* Time Slots */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#483449] block">
                    Available Time Slots for {selectedDate}
                  </label>
                  <span className="text-[11px] text-[#766A77]">Operating: 10:00 AM - 07:30 PM</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-52 overflow-y-auto pr-1">
                  {availableSlots.map(({ time, available }) => {
                    const isSelected = selectedTimeSlot === time;
                    return (
                      <button
                        key={time}
                        disabled={!available}
                        onClick={() => setSelectedTimeSlot(time)}
                        className={`py-2 px-1 text-xs rounded-lg font-medium transition-all text-center ${
                          !available
                            ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-[#F07878] text-white shadow-xs font-semibold cursor-pointer'
                            : 'bg-white text-[#483449] border border-[#F0E8EE] hover:bg-[#F8DCE5]/30 cursor-pointer'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
                {selectedTimeSlot ? (
                  <p className="text-xs text-emerald-700 font-medium">
                    ✓ Slot {selectedTimeSlot} is selected and reserved for you.
                  </p>
                ) : (
                  <p className="text-xs text-[#766A77]">
                    Please tap an available time button above to proceed.
                  </p>
                )}
              </div>

              {/* Step 2 navigation buttons */}
              <div className="pt-3 border-t border-[#F0E8EE] flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-xs text-[#766A77] hover:text-[#483449] font-medium"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Services</span>
                </button>

                <button
                  disabled={!selectedTimeSlot}
                  onClick={() => setStep(3)}
                  className="flex items-center gap-1 px-5 py-2.5 bg-[#F07878] hover:bg-[#e06565] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                >
                  <span>Next: Details & Payment</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: DETAILS & PAY AT SALON ================= */}
          {step === 3 && (
            <div className="space-y-5">
              
              {/* Notice: Pay at salon policy */}
              <div className="p-4 rounded-2xl bg-[#DDF3E7]/40 border border-[#DDF3E7] flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    Pay Seamlessly in Person at Salon
                  </h4>
                  <p className="text-xs text-[#483449] leading-relaxed">
                    Zero online payment is deducted now. You can settle in person at our Naroda studio counter via <strong>UPI QR (GPay / PhonePe / Paytm), Cash, or Card Machine</strong> once your service is completed.
                  </p>
                </div>
              </div>

              {/* Customer Inputs */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#483449] block">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#766A77]" />
                    <input
                      type="text"
                      placeholder="e.g. Hetal Patel"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F0E8EE] bg-white text-sm text-[#483449] focus:outline-none focus:ring-2 focus:ring-[#F8DCE5]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#483449] block">
                    Mobile Number (10 Digits) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#766A77]" />
                    <input
                      type="tel"
                      placeholder="e.g. 98250 12345"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F0E8EE] bg-white text-sm text-[#483449] focus:outline-none focus:ring-2 focus:ring-[#F8DCE5]"
                    />
                  </div>
                  <span className="text-[11px] text-[#766A77]">Used for booking confirmation SMS & WhatsApp reminder.</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#483449] block">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#766A77]" />
                    <input
                      type="email"
                      placeholder="e.g. hetal@gmail.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F0E8EE] bg-white text-sm text-[#483449] focus:outline-none focus:ring-2 focus:ring-[#F8DCE5]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#483449] block">
                    Styling Notes or Special Requests (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Sensitive skin, bridal muhurat timing, preferred hair length, etc."
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#F0E8EE] bg-white text-sm text-[#483449] focus:outline-none focus:ring-2 focus:ring-[#F8DCE5]"
                  />
                </div>
              </div>

              {/* Review Overview */}
              <div className="p-4 bg-[#FFFDF9] rounded-2xl border border-[#F0E8EE] space-y-2 text-xs">
                <h4 className="font-semibold text-[#483449] uppercase tracking-wider text-[11px]">
                  Appointment Summary
                </h4>
                <div className="flex justify-between text-[#766A77]">
                  <span>Date & Time:</span>
                  <strong className="text-[#483449]">{selectedDate} at {selectedTimeSlot}</strong>
                </div>
                <div className="flex justify-between text-[#766A77]">
                  <span>Services:</span>
                  <span className="text-[#483449] font-medium text-right max-w-[65%]">
                    {chosenServices.map(s => s.name).join(', ')}
                  </span>
                </div>
                <div className="flex justify-between text-[#766A77]">
                  <span>Total Duration:</span>
                  <span className="text-[#483449] font-medium">{totalDuration} minutes</span>
                </div>
                <div className="flex justify-between text-[#766A77] pt-2 border-t border-[#F0E8EE]">
                  <span>Estimated Total Amount:</span>
                  <span className="text-base font-serif font-bold text-[#483449]">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-800">
                  <span>Payment Mode:</span>
                  <span className="font-semibold">Pay in-person at Salon</span>
                </div>
              </div>

              {/* Error indicator */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Step 3 navigation */}
              <div className="pt-3 border-t border-[#F0E8EE] flex items-center justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1 text-xs text-[#766A77] hover:text-[#483449] font-medium"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Slots</span>
                </button>

                <button
                  disabled={isSubmitting}
                  onClick={handleConfirmBooking}
                  className="flex items-center gap-2 px-6 py-3 bg-[#F07878] hover:bg-[#e06565] disabled:bg-slate-300 text-white rounded-xl text-sm font-semibold shadow-xs cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Reserving slot...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Confirm Booking (Pay at Salon)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 4: SUCCESS / CONFIRMED ================= */}
          {step === 4 && confirmedAppointment && (
            <div className="text-center py-4 space-y-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-[#DDF3E7] text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F07878]">
                  Booking Reference
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#483449]">
                  {confirmedAppointment.referenceNumber}
                </h3>
                <p className="text-xs text-[#766A77]">
                  Thank you, {confirmedAppointment.customerName}! Your appointment is reserved.
                </p>
              </div>

              {/* Details card */}
              <div className="bg-[#FFFDF9] p-5 rounded-2xl border border-[#F0E8EE] text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-[#766A77]">Date & Time:</span>
                  <span className="font-semibold text-[#483449]">
                    {confirmedAppointment.date} · {confirmedAppointment.timeSlot}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#766A77]">Assigned Specialist:</span>
                  <span className="font-semibold text-[#483449]">
                    {confirmedAppointment.staffName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#766A77]">Services:</span>
                  <span className="font-semibold text-[#483449] text-right">
                    {confirmedAppointment.serviceNames.join(', ')}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#F0E8EE]">
                  <span className="text-[#766A77]">Amount Due at Salon:</span>
                  <span className="text-sm font-bold text-[#483449]">
                    ₹{confirmedAppointment.totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-800">
                  <span>Payment Status:</span>
                  <span className="font-semibold">Pay at Salon (Cash / UPI / Card)</span>
                </div>
                <div className="flex justify-between text-[#766A77]">
                  <span>Studio Location:</span>
                  <span className="text-[#483449]">{settings.address}, Naroda</span>
                </div>
              </div>

              {/* Action Buttons: WhatsApp Message & Close */}
              <div className="space-y-2.5 max-w-md mx-auto pt-2">
                <a
                  href={generateWhatsAppBookingUrl(confirmedAppointment)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Confirmation to Studio via WhatsApp</span>
                </a>

                <button
                  onClick={closeBookingModal}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#F0E8EE] text-xs font-semibold text-[#766A77] hover:text-[#483449] hover:bg-slate-50 transition-colors"
                >
                  Done & Back to Studio Website
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
