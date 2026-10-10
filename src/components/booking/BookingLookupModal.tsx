import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  MessageCircle,
  RotateCcw
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { Appointment } from '../../types';

export const BookingLookupModal: React.FC = () => {
  const { 
    isLookupModalOpen, 
    closeLookupModal, 
    getAppointmentByReference, 
    getAppointmentsByPhone,
    cancelAppointment,
    rescheduleAppointment,
    generateWhatsAppBookingUrl,
    getAvailableSlots,
    settings
  } = useSalon();

  const [searchKey, setSearchKey] = useState('');
  const [searchResults, setSearchResults] = useState<Appointment[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);

  // Reschedule state
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [rescheduleMessage, setRescheduleMessage] = useState<string | null>(null);

  if (!isLookupModalOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchKey.trim();
    if (!query) return;

    setHasSearched(true);
    setSelectedApt(null);
    setIsRescheduling(false);

    if (query.toUpperCase().startsWith('GSG-')) {
      const apt = getAppointmentByReference(query);
      setSearchResults(apt ? [apt] : []);
    } else {
      const apts = getAppointmentsByPhone(query);
      setSearchResults(apts);
    }
  };

  const handleCancel = (id: string) => {
    if (confirm('Are you sure you want to cancel this salon appointment?')) {
      const res = cancelAppointment(id, 'Customer self-cancellation via web portal');
      if (res.success) {
        alert('Your appointment has been cancelled.');
        // Refresh local view
        if (selectedApt) {
          setSelectedApt({ ...selectedApt, status: 'cancelled' });
        }
      }
    }
  };

  const handleExecuteReschedule = (id: string) => {
    if (!newDate || !newTime) {
      setRescheduleMessage('Please select both a new date and time slot.');
      return;
    }

    const res = rescheduleAppointment(id, newDate, newTime);
    if (res.success) {
      alert('Appointment rescheduled successfully!');
      setIsRescheduling(false);
      if (selectedApt) {
        setSelectedApt({ ...selectedApt, date: newDate, timeSlot: newTime, status: 'confirmed' });
      }
    } else {
      setRescheduleMessage(res.error || 'Unable to reschedule to that slot.');
    }
  };

  const statusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs font-semibold">Confirmed</span>;
      case 'completed':
        return <span className="text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full text-xs font-semibold">Completed</span>;
      case 'cancelled':
        return <span className="text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full text-xs font-semibold">Cancelled</span>;
      case 'pending':
        return <span className="text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-xs font-semibold">Pending Confirmation</span>;
      default:
        return <span className="text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full text-xs">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-[#F0E8EE] shadow-2xl overflow-hidden my-auto animate-scale-up">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#FFFDF9] border-b border-[#F0E8EE] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#F07878] block">
              Customer Self-Service
            </span>
            <h2 className="text-xl font-serif font-bold text-[#483449]">
              Look Up Your Appointment
            </h2>
          </div>

          <button
            onClick={closeLookupModal}
            className="p-2 rounded-full text-[#766A77] hover:text-[#483449] hover:bg-[#F8DCE5]/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search form */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#483449] block">
              Enter Booking Reference or Registered Phone
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#766A77]" />
                <input
                  type="text"
                  placeholder="e.g. GSG-26-4819 or 9825123456"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#F0E8EE] bg-white text-sm text-[#483449] focus:outline-none focus:ring-2 focus:ring-[#F8DCE5]"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#483449] hover:bg-[#342435] text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                Search
              </button>
            </div>
            <p className="text-[11px] text-[#766A77]">
              Demo references you can test: <strong>GSG-26-4819</strong> or <strong>GSG-26-8921</strong>
            </p>
          </form>

          {/* Results list */}
          {hasSearched && searchResults.length === 0 && (
            <div className="p-6 bg-[#FFFDF9] rounded-2xl border border-[#F0E8EE] text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-[#766A77] mx-auto" />
              <h4 className="text-sm font-semibold text-[#483449]">No Appointments Found</h4>
              <p className="text-xs text-[#766A77]">
                Double check the booking reference number or phone. You can also contact the salon at <strong>+91 {settings.phone}</strong>.
              </p>
            </div>
          )}

          {searchResults.length > 0 && !selectedApt && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#483449]">
                Found {searchResults.length} Booking(s)
              </h4>

              <div className="space-y-2.5">
                {searchResults.map((apt) => (
                  <div
                    key={apt.id}
                    onClick={() => setSelectedApt(apt)}
                    className="p-4 rounded-2xl border border-[#F0E8EE] hover:border-[#F07878] bg-[#FFFDF9] hover:bg-white transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#483449]">{apt.referenceNumber}</span>
                        {statusBadge(apt.status)}
                      </div>
                      <p className="text-xs text-[#766A77]">
                        {apt.date} at {apt.timeSlot} · {apt.customerName}
                      </p>
                      <p className="text-xs font-medium text-[#483449]">
                        {apt.serviceNames.join(', ')}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-[#483449]">₹{apt.totalPrice}</span>
                      <span className="block text-[10px] text-emerald-700">Pay at Salon</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Single Detailed View */}
          {selectedApt && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0E8EE]">
                <div>
                  <span className="text-[11px] text-[#766A77] block">Booking Reference:</span>
                  <span className="text-lg font-serif font-bold text-[#483449]">{selectedApt.referenceNumber}</span>
                </div>
                {statusBadge(selectedApt.status)}
              </div>

              {/* Details card */}
              <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-[#F0E8EE] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#766A77]">Client Name:</span>
                  <span className="font-semibold text-[#483449]">{selectedApt.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#766A77]">Phone:</span>
                  <span className="font-semibold text-[#483449]">{selectedApt.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#766A77]">Date & Slot:</span>
                  <span className="font-semibold text-[#483449]">{selectedApt.date} at {selectedApt.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#766A77]">Assigned Specialist:</span>
                  <span className="font-semibold text-[#483449]">{selectedApt.staffName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#766A77]">Booked Services:</span>
                  <span className="font-semibold text-[#483449] text-right max-w-[65%]">
                    {selectedApt.serviceNames.join(', ')}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#F0E8EE]">
                  <span className="text-[#766A77]">Estimated Amount:</span>
                  <span className="text-sm font-bold text-[#483449]">₹{selectedApt.totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-800">
                  <span>Payment Mode:</span>
                  <span className="font-semibold">In-Person Pay at Salon (Upon Completion)</span>
                </div>
                {selectedApt.inSalonPaymentDetails && (
                  <div className="bg-emerald-50 p-2 rounded-lg text-emerald-800 text-[11px]">
                    ✓ Paid ₹{selectedApt.inSalonPaymentDetails.amountPaid} via {selectedApt.inSalonPaymentDetails.method.toUpperCase()} at salon counter.
                  </div>
                )}
              </div>

              {/* Reschedule panel */}
              {isRescheduling && (
                <div className="p-4 bg-white rounded-2xl border border-[#F07878] space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#F07878]">
                    Choose New Date & Slot
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="p-2 border border-[#F0E8EE] rounded-lg text-xs"
                    />
                    <select
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="p-2 border border-[#F0E8EE] rounded-lg text-xs"
                    >
                      <option value="">Select Time Slot</option>
                      {getAvailableSlots(newDate || selectedApt.date, selectedApt.staffId, selectedApt.totalDurationMinutes)
                        .filter(s => s.available)
                        .map(s => (
                          <option key={s.time} value={s.time}>{s.time}</option>
                        ))}
                    </select>
                  </div>

                  {rescheduleMessage && (
                    <p className="text-xs text-red-600">{rescheduleMessage}</p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleExecuteReschedule(selectedApt.id)}
                      className="px-4 py-2 bg-[#F07878] text-white text-xs font-semibold rounded-lg"
                    >
                      Confirm New Slot
                    </button>
                    <button
                      onClick={() => setIsRescheduling(false)}
                      className="px-3 py-2 bg-slate-100 text-[#483449] text-xs rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Actions row */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <a
                  href={generateWhatsAppBookingUrl(selectedApt)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat with Studio</span>
                </a>

                {selectedApt.status !== 'cancelled' && selectedApt.status !== 'completed' && (
                  <>
                    <button
                      onClick={() => setIsRescheduling(!isRescheduling)}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-[#FFFDF9] hover:bg-[#F8DCE5]/30 border border-[#F0E8EE] text-[#483449] rounded-xl text-xs font-semibold transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#F07878]" />
                      <span>Reschedule</span>
                    </button>

                    <button
                      onClick={() => handleCancel(selectedApt.id)}
                      className="flex items-center gap-1.5 px-4 py-2.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-xl text-xs font-semibold transition-colors ml-auto"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel Appointment</span>
                    </button>
                  </>
                )}

                {searchResults.length > 1 && (
                  <button
                    onClick={() => setSelectedApt(null)}
                    className="w-full text-center text-xs text-[#766A77] hover:underline pt-2"
                  >
                    ← Back to search results
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
