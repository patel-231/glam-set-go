import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Scissors, 
  Tag, 
  Users, 
  GraduationCap, 
  Settings as SettingsIcon, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  MessageCircle, 
  Phone, 
  DollarSign, 
  LogOut, 
  Lock, 
  ChevronRight,
  Filter,
  Check,
  RotateCcw,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { 
  Appointment, 
  AppointmentStatus, 
  Service, 
  SalonOffer, 
  StaffMember, 
  CourseEnquiry, 
  InSalonPaymentMethod,
  ServiceCategory 
} from '../../types';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const {
    appointments,
    services,
    offers,
    staff,
    enquiries,
    settings,
    updateAppointmentStatus,
    recordInSalonPayment,
    rescheduleAppointment,
    cancelAppointment,
    addService,
    updateService,
    deleteService,
    addOffer,
    updateOffer,
    deleteOffer,
    addStaff,
    updateStaff,
    deleteStaff,
    updateEnquiryStatus,
    updateSettings,
    resetToDefaultData,
    generateWhatsAppBookingUrl,
  } = useSalon();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('gsg_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Active admin section
  type AdminTab = 'overview' | 'appointments' | 'calendar' | 'services' | 'offers' | 'staff' | 'enquiries' | 'settings';
  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');

  // Search & filter for appointments
  const [aptSearch, setAptSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Payment Recording Modal state
  const [paymentModalApt, setPaymentModalApt] = useState<Appointment | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<InSalonPaymentMethod>('upi_qr');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentNotes, setPaymentNotes] = useState<string>('');
  const [collectedBy, setCollectedBy] = useState<string>('Front Desk');

  // Service Edit / Add Modal state
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceFormData, setServiceFormData] = useState({
    name: '',
    category: 'hair' as ServiceCategory,
    shortDescription: '',
    description: '',
    price: 350,
    isStartingPrice: false,
    requiresConsultation: false,
    durationMinutes: 45,
    imageUrl: '',
    isActive: true,
  });

  // Calendar View State
  const [calendarDate, setCalendarDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [calendarViewMode, setCalendarViewMode] = useState<'day' | 'week'>('day');

  // Authenticate PIN (default PIN 6352 matches business phone prefix)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '6352' || pinInput === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('gsg_admin_auth', 'true');
      setPinError(null);
    } else {
      setPinError('Invalid passcode. Default PIN is 6352.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('gsg_admin_auth');
  };

  // ------------------ OVERVIEW METRICS CALCULATION ------------------
  const todayStr = new Date().toISOString().split('T')[0];

  const todayAppointments = useMemo(() => {
    return appointments.filter((a) => a.date === todayStr);
  }, [appointments, todayStr]);

  const pendingAppointments = useMemo(() => {
    return appointments.filter((a) => a.status === 'pending');
  }, [appointments]);

  const confirmedAppointments = useMemo(() => {
    return appointments.filter((a) => a.status === 'confirmed');
  }, [appointments]);

  const completedAppointments = useMemo(() => {
    return appointments.filter((a) => a.status === 'completed');
  }, [appointments]);

  // Actual collected revenue from Pay at Salon records
  const totalCollectedRevenue = useMemo(() => {
    return appointments.reduce((sum, a) => {
      if (a.paymentStatus === 'paid_at_salon' && a.inSalonPaymentDetails?.amountPaid) {
        return sum + a.inSalonPaymentDetails.amountPaid;
      }
      return sum;
    }, 0);
  }, [appointments]);

  // Pending expected in-salon revenue
  const pendingInSalonRevenue = useMemo(() => {
    return appointments.reduce((sum, a) => {
      if (a.status !== 'cancelled' && a.status !== 'rejected' && a.paymentStatus === 'pending_at_salon') {
        return sum + a.totalPrice;
      }
      return sum;
    }, 0);
  }, [appointments]);

  // Filtered appointments list
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      if (statusFilter !== 'all' && apt.status !== statusFilter) return false;
      if (aptSearch.trim()) {
        const q = aptSearch.toLowerCase();
        const matchesName = apt.customerName.toLowerCase().includes(q);
        const matchesRef = apt.referenceNumber.toLowerCase().includes(q);
        const matchesPhone = apt.customerPhone.includes(q);
        if (!matchesName && !matchesRef && !matchesPhone) return false;
      }
      return true;
    });
  }, [appointments, statusFilter, aptSearch]);

  // Open Payment Recording modal
  const openPaymentModal = (apt: Appointment) => {
    setPaymentModalApt(apt);
    setPaymentAmount(apt.totalPrice);
    setPaymentMethod('upi_qr');
    setPaymentNotes('');
    setCollectedBy(apt.staffName || 'Front Desk');
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalApt) return;

    recordInSalonPayment(paymentModalApt.id, {
      method: paymentMethod,
      amountPaid: Number(paymentAmount),
      collectedBy,
      notes: paymentNotes,
    });

    setPaymentModalApt(null);
  };

  // Open Service Modal
  const openNewServiceModal = () => {
    setEditingService(null);
    setServiceFormData({
      name: '',
      category: 'hair',
      shortDescription: '',
      description: '',
      price: 350,
      isStartingPrice: false,
      requiresConsultation: false,
      durationMinutes: 45,
      imageUrl: '',
      isActive: true,
    });
    setIsServiceModalOpen(true);
  };

  const openEditServiceModal = (srv: Service) => {
    setEditingService(srv);
    setServiceFormData({
      name: srv.name,
      category: srv.category,
      shortDescription: srv.shortDescription,
      description: srv.description,
      price: srv.price,
      isStartingPrice: srv.isStartingPrice,
      requiresConsultation: srv.requiresConsultation,
      durationMinutes: srv.durationMinutes,
      imageUrl: srv.imageUrl || '',
      isActive: srv.isActive,
    });
    setIsServiceModalOpen(true);
  };

  const handleServiceFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      updateService(editingService.id, serviceFormData);
    } else {
      addService(serviceFormData);
    }
    setIsServiceModalOpen(false);
  };

  // ------------------ LOGIN SCREEN IF NOT AUTHENTICATED ------------------
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-[#FFFDF9] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#F0E8EE] p-8 shadow-xl space-y-6 text-center animate-scale-up">
          <div className="w-14 h-14 rounded-2xl bg-[#F8DCE5] text-[#F07878] flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-serif font-bold text-[#483449]">
              Glam Set Go Staff Portal
            </h2>
            <p className="text-xs text-[#766A77]">
              Management console for appointments, calendar, catalog, and in-person payments.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#483449]">
                Enter Security Passcode
              </label>
              <input
                type="password"
                placeholder="Passcode (Default: 6352)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#F0E8EE] text-center text-lg tracking-widest text-[#483449] focus:outline-none focus:ring-2 focus:ring-[#F8DCE5]"
                autoFocus
              />
            </div>

            {pinError && (
              <p className="text-xs text-red-600 font-medium">{pinError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#483449] hover:bg-[#342435] text-white rounded-xl text-sm font-semibold shadow-xs cursor-pointer transition-colors"
            >
              Sign In to Management Console
            </button>
          </form>

          <div className="pt-2 border-t border-[#F0E8EE] flex items-center justify-between text-xs text-[#766A77]">
            <button
              onClick={() => { setPinInput('6352'); }}
              className="hover:underline text-[#F07878]"
            >
              Quick Demo Fill (6352)
            </button>
            <button
              onClick={onClose}
              className="hover:text-[#483449] hover:underline"
            >
              Return to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ------------------ MAIN ADMIN DASHBOARD INTERFACE ------------------
  return (
    <div className="fixed inset-0 z-50 bg-[#FFFDF9] flex flex-col overflow-hidden text-[#483449]">
      
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-[#F0E8EE] px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFDF9] border border-[#F0E8EE] text-xs font-semibold text-[#766A77] hover:text-[#483449] rounded-lg transition-colors"
          >
            <span>← Back to Public Website</span>
          </button>
          <div className="hidden sm:block h-4 w-px bg-[#F0E8EE]" />
          <div>
            <h1 className="text-base font-serif font-bold text-[#483449] leading-tight">
              Glam Set Go · Studio Management Console
            </h1>
            <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider block">
              Naroda, Ahmedabad · Role: Studio Director / Staff
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#766A77] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar + Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Nav */}
        <aside className="w-56 bg-white border-r border-[#F0E8EE] p-3 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'appointments', label: 'Appointments', icon: Clock, count: appointments.filter(a => a.status === 'pending').length },
              { id: 'calendar', label: 'Operations Calendar', icon: CalendarIcon },
              { id: 'services', label: 'Services Catalogue', icon: Scissors, count: services.length },
              { id: 'offers', label: 'Current Offers', icon: Tag, count: offers.length },
              { id: 'staff', label: 'Staff & Schedules', icon: Users, count: staff.length },
              { id: 'enquiries', label: 'Course Enquiries', icon: GraduationCap, count: enquiries.filter(e => e.status === 'new').length },
              { id: 'settings', label: 'Salon Settings', icon: SettingsIcon },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id as AdminTab)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#F8DCE5] text-[#483449] font-bold shadow-2xs'
                      : 'text-[#766A77] hover:bg-[#FFFDF9] hover:text-[#483449]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#F07878]' : 'text-[#766A77]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#E8E0FF] font-bold text-[#483449]">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#F0E8EE] space-y-2 text-[11px] text-[#766A77]">
            <p>
              In-Salon Transactions: <strong className="text-emerald-800">Seamless</strong>
            </p>
            <button
              onClick={() => {
                if (confirm('Reset to initial sample appointments and services?')) {
                  resetToDefaultData();
                }
              }}
              className="w-full flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-[#483449] rounded-lg text-[10px] font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Demo State</span>
            </button>
          </div>
        </aside>

        {/* Dynamic Workspace Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#FFFDF9]">
          
          {/* ================= SECTION 1: OVERVIEW ================= */}
          {currentTab === 'overview' && (
            <div className="space-y-8 max-w-7xl mx-auto">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#483449]">
                  Studio Operations Overview
                </h2>
                <p className="text-xs text-[#766A77]">
                  Real-time salon figures calculated from stored appointment & in-salon payment records.
                </p>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Stat 1: Today */}
                <div className="bg-white p-5 rounded-2xl border border-[#F0E8EE] shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#766A77]">
                    <span>Today's Schedule</span>
                    <Clock className="w-4 h-4 text-[#F07878]" />
                  </div>
                  <div className="text-3xl font-serif font-bold text-[#483449]">
                    {todayAppointments.length}
                  </div>
                  <p className="text-[11px] text-[#766A77]">
                    Bookings for {todayStr}
                  </p>
                </div>

                {/* Stat 2: Pending Confirmations */}
                <div className="bg-white p-5 rounded-2xl border border-[#F0E8EE] shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#766A77]">
                    <span>Pending Requests</span>
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-3xl font-serif font-bold text-amber-700">
                    {pendingAppointments.length}
                  </div>
                  <p className="text-[11px] text-[#766A77]">
                    Require salon confirmation
                  </p>
                </div>

                {/* Stat 3: In-Salon Revenue Collected */}
                <div className="bg-white p-5 rounded-2xl border border-[#F0E8EE] shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#766A77]">
                    <span>Paid at Salon (Collected)</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-serif font-bold text-emerald-800">
                    ₹{totalCollectedRevenue.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    From {completedAppointments.length} completed treatments
                  </p>
                </div>

                {/* Stat 4: Expected In-Salon Dues */}
                <div className="bg-white p-5 rounded-2xl border border-[#F0E8EE] shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#766A77]">
                    <span>Expected at Counter</span>
                    <DollarSign className="w-4 h-4 text-[#483449]" />
                  </div>
                  <div className="text-3xl font-serif font-bold text-[#483449]">
                    ₹{pendingInSalonRevenue.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-[#766A77]">
                    Active upcoming bookings
                  </p>
                </div>
              </div>

              {/* Quick Actions & Recent Bookings table */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Recent Appointments */}
                <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#F0E8EE] shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-serif font-bold text-[#483449]">
                        Upcoming Appointments
                      </h3>
                      <p className="text-xs text-[#766A77]">Latest customer bookings</p>
                    </div>

                    <button
                      onClick={() => setCurrentTab('appointments')}
                      className="text-xs font-semibold text-[#F07878] hover:underline"
                    >
                      View All ({appointments.length})
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#FFFDF9] text-[#766A77] border-y border-[#F0E8EE]">
                        <tr>
                          <th className="py-2.5 px-3">Ref</th>
                          <th className="py-2.5 px-3">Client</th>
                          <th className="py-2.5 px-3">Date & Slot</th>
                          <th className="py-2.5 px-3">Services</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0E8EE]">
                        {appointments.slice(0, 5).map((apt) => (
                          <tr key={apt.id} className="hover:bg-[#FFFDF9]/60">
                            <td className="py-3 px-3 font-mono font-semibold">{apt.referenceNumber}</td>
                            <td className="py-3 px-3">
                              <div className="font-semibold text-[#483449]">{apt.customerName}</div>
                              <div className="text-[11px] text-[#766A77]">{apt.customerPhone}</div>
                            </td>
                            <td className="py-3 px-3">
                              <div>{apt.date}</div>
                              <div className="text-[11px] text-[#766A77]">{apt.timeSlot}</div>
                            </td>
                            <td className="py-3 px-3 max-w-[150px] truncate">
                              {apt.serviceNames.join(', ')}
                            </td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                apt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' :
                                apt.status === 'completed' ? 'bg-purple-50 text-purple-700' :
                                apt.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {apt.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              {apt.status === 'confirmed' && (
                                <button
                                  onClick={() => openPaymentModal(apt)}
                                  className="px-2.5 py-1 bg-[#DDF3E7] hover:bg-[#cceed0] text-emerald-800 rounded-lg text-[10px] font-semibold"
                                >
                                  Collect at Salon
                                </button>
                              )}
                              {apt.status === 'pending' && (
                                <button
                                  onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                                  className="px-2.5 py-1 bg-[#F8DCE5] hover:bg-[#f2cad6] text-[#483449] rounded-lg text-[10px] font-semibold"
                                >
                                  Confirm
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right side: Studio Quick Stats */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-white p-5 rounded-2xl border border-[#F0E8EE] space-y-3">
                    <h4 className="text-sm font-serif font-bold text-[#483449]">
                      Staff on Floor
                    </h4>
                    <div className="space-y-2">
                      {staff.map((m) => (
                        <div key={m.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#FFFDF9] border border-[#F0E8EE]">
                          <div>
                            <span className="font-semibold block">{m.name}</span>
                            <span className="text-[11px] text-[#766A77]">{m.role}</span>
                          </div>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                            {m.startHour} - {m.endHour}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#FFFDF9] p-5 rounded-2xl border border-[#F0E8EE] space-y-2 text-xs">
                    <h4 className="font-serif font-bold text-[#483449]">
                      In-Salon Payment Protocol
                    </h4>
                    <p className="text-[#766A77] leading-relaxed">
                      All customers book with <strong>Pay at Salon</strong>. When the service is completed, press "Collect at Salon" on their appointment to specify whether payment was received via <strong>UPI QR, Cash, or Card POS</strong>.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ================= SECTION 2: APPOINTMENTS ================= */}
          {currentTab === 'appointments' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-[#483449]">
                    Appointments & In-Salon Billing
                  </h2>
                  <p className="text-xs text-[#766A77]">
                    Manage upcoming appointments, verify customer requests, and record in-person counter collections.
                  </p>
                </div>
              </div>

              {/* Search & Status Filters */}
              <div className="bg-white p-4 rounded-2xl border border-[#F0E8EE] flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#766A77]" />
                  <input
                    type="text"
                    placeholder="Search by client name, ref, or phone..."
                    value={aptSearch}
                    onChange={(e) => setAptSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#F0E8EE] text-xs text-[#483449] focus:outline-none focus:ring-2 focus:ring-[#F8DCE5]"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar">
                  {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                        statusFilter === st
                          ? 'bg-[#483449] text-white shadow-2xs'
                          : 'bg-[#FFFDF9] text-[#766A77] border border-[#F0E8EE] hover:bg-[#F8DCE5]/30'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Appointments Table */}
              <div className="bg-white rounded-2xl border border-[#F0E8EE] overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FFFDF9] text-[#766A77] border-b border-[#F0E8EE]">
                      <tr>
                        <th className="py-3 px-4">Ref Number</th>
                        <th className="py-3 px-4">Customer Details</th>
                        <th className="py-3 px-4">Schedule & Specialist</th>
                        <th className="py-3 px-4">Services Booked</th>
                        <th className="py-3 px-4">Amount & Mode</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0E8EE]">
                      {filteredAppointments.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-[#766A77]">
                            No appointments found matching current filters.
                          </td>
                        </tr>
                      ) : (
                        filteredAppointments.map((apt) => (
                          <tr key={apt.id} className="hover:bg-[#FFFDF9]/60">
                            
                            {/* Ref */}
                            <td className="py-3.5 px-4 font-mono font-bold text-[#483449]">
                              {apt.referenceNumber}
                            </td>

                            {/* Customer */}
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-[#483449]">{apt.customerName}</div>
                              <div className="text-[11px] text-[#766A77] flex items-center gap-1">
                                <Phone className="w-3 h-3 text-[#F07878]" />
                                <a href={`tel:${apt.customerPhone}`} className="hover:underline">{apt.customerPhone}</a>
                              </div>
                              {apt.customerNotes && (
                                <div className="text-[10px] text-amber-800 bg-amber-50 p-1 rounded mt-1 max-w-xs">
                                  "{apt.customerNotes}"
                                </div>
                              )}
                            </td>

                            {/* Schedule */}
                            <td className="py-3.5 px-4">
                              <div className="font-medium text-[#483449]">{apt.date}</div>
                              <div className="text-[11px] text-[#766A77]">{apt.timeSlot}</div>
                              <div className="text-[10px] text-purple-700 font-medium">{apt.staffName}</div>
                            </td>

                            {/* Services */}
                            <td className="py-3.5 px-4 max-w-[200px]">
                              <div className="font-medium text-[#483449]">{apt.serviceNames.join(', ')}</div>
                              <div className="text-[10px] text-[#766A77]">{apt.totalDurationMinutes} mins total</div>
                            </td>

                            {/* Amount & In-Salon Details */}
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-[#483449]">₹{apt.totalPrice.toLocaleString('en-IN')}</div>
                              {apt.paymentStatus === 'paid_at_salon' ? (
                                <div className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded inline-block mt-0.5">
                                  ✓ Paid via {apt.inSalonPaymentDetails?.method?.toUpperCase()}
                                </div>
                              ) : (
                                <div className="text-[10px] text-amber-700 font-medium">
                                  Pay at Salon
                                </div>
                              )}
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                apt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' :
                                apt.status === 'completed' ? 'bg-purple-50 text-purple-700' :
                                apt.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                                apt.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {apt.status}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                              {/* WhatsApp Direct */}
                              <a
                                href={generateWhatsAppBookingUrl(apt)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 inline-flex text-emerald-700 hover:bg-emerald-50 rounded-lg"
                                title="Send WhatsApp Message"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </a>

                              {/* Pending -> Confirm */}
                              {apt.status === 'pending' && (
                                <button
                                  onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                                  className="px-2.5 py-1 bg-emerald-700 text-white rounded-lg text-[11px] font-medium hover:bg-emerald-800"
                                >
                                  Confirm
                                </button>
                              )}

                              {/* Confirmed -> Record In-Salon Payment */}
                              {apt.status === 'confirmed' && (
                                <button
                                  onClick={() => openPaymentModal(apt)}
                                  className="px-2.5 py-1 bg-[#F07878] hover:bg-[#e06565] text-white rounded-lg text-[11px] font-medium"
                                >
                                  Collect Payment
                                </button>
                              )}

                              {/* Cancel */}
                              {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                                <button
                                  onClick={() => {
                                    if (confirm('Cancel this appointment?')) {
                                      cancelAppointment(apt.id, 'Cancelled by salon admin');
                                    }
                                  }}
                                  className="p-1.5 inline-flex text-red-600 hover:bg-red-50 rounded-lg"
                                  title="Cancel Appointment"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </td>

                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION 3: CALENDAR ================= */}
          {currentTab === 'calendar' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-[#483449]">
                    Operations Schedule Calendar
                  </h2>
                  <p className="text-xs text-[#766A77]">
                    Visual room and specialist occupancy preventing double-bookings.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={calendarDate}
                    onChange={(e) => setCalendarDate(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-[#F0E8EE] bg-white text-xs text-[#483449]"
                  />
                  <button
                    onClick={() => setCalendarDate(todayStr)}
                    className="px-3 py-2 bg-[#F8DCE5] text-[#483449] rounded-xl text-xs font-semibold hover:bg-[#f2cad6]"
                  >
                    Today
                  </button>
                </div>
              </div>

              {/* Day Time Slots Visual Grid */}
              <div className="bg-white rounded-2xl border border-[#F0E8EE] p-5 shadow-2xs space-y-4">
                <h3 className="text-sm font-serif font-bold text-[#483449]">
                  Schedule for {calendarDate}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
                    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
                    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
                    '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
                    '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
                  ].map((time) => {
                    const booked = appointments.filter(
                      (a) => a.date === calendarDate && a.timeSlot === time && a.status !== 'cancelled'
                    );

                    return (
                      <div
                        key={time}
                        className={`p-3 rounded-xl border transition-all ${
                          booked.length > 0
                            ? 'bg-[#F8DCE5]/20 border-[#F8DCE5]'
                            : 'bg-[#FFFDF9] border-[#F0E8EE]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold mb-1">
                          <span className="text-[#483449]">{time}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            booked.length > 0 ? 'bg-[#F07878] text-white' : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {booked.length > 0 ? `${booked.length} Booked` : 'Available'}
                          </span>
                        </div>

                        {booked.length > 0 ? (
                          <div className="space-y-1.5 mt-2">
                            {booked.map((b) => (
                              <div key={b.id} className="bg-white p-2 rounded-lg border border-[#F0E8EE] text-[11px] space-y-0.5">
                                <div className="font-bold text-[#483449]">{b.customerName}</div>
                                <div className="text-[10px] text-[#766A77] truncate">{b.serviceNames.join(', ')}</div>
                                <div className="flex items-center justify-between text-[10px] pt-1">
                                  <span className="text-purple-700 font-medium">{b.staffName}</span>
                                  <span className="font-semibold">₹{b.totalPrice}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-[#766A77] mt-1">
                            No reserved appointments. Ready for walk-in.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION 4: SERVICES CATALOGUE ================= */}
          {currentTab === 'services' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-[#483449]">
                    Services & Pricing Menu Manager
                  </h2>
                  <p className="text-xs text-[#766A77]">
                    Configure services, starting vs fixed rates, estimated durations, and consultation flags.
                  </p>
                </div>

                <button
                  onClick={openNewServiceModal}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-[#F07878] hover:bg-[#e06565] text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Service</span>
                </button>
              </div>

              {/* Service Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="p-5 bg-white rounded-2xl border border-[#F0E8EE] flex flex-col justify-between shadow-2xs space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FFFDF9] border border-[#F0E8EE] text-[#766A77]">
                          {service.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditServiceModal(service)}
                            className="p-1 text-[#766A77] hover:text-[#483449] rounded-md hover:bg-slate-100"
                            title="Edit Service"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete service "${service.name}"?`)) {
                                deleteService(service.id);
                              }
                            }}
                            className="p-1 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50"
                            title="Delete Service"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-base font-serif font-bold text-[#483449]">
                        {service.name}
                      </h4>
                      <p className="text-xs text-[#766A77] line-clamp-2">
                        {service.shortDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#F0E8EE] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-[#766A77] block">
                          {service.isStartingPrice ? 'Starts from' : 'Fixed'}
                        </span>
                        <span className="text-base font-serif font-bold text-[#483449]">
                          ₹{service.price.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] text-[#766A77] block">
                          {service.durationMinutes} mins
                        </span>
                        <span className={`text-[10px] font-semibold ${service.isActive ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {service.isActive ? 'Active on Web' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= SECTION 5: OFFERS ================= */}
          {currentTab === 'offers' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-[#483449]">
                    Promotional Packages & Offers
                  </h2>
                  <p className="text-xs text-[#766A77]">
                    Manage active studio offers, eligible services, and expiry validity.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const newOffer: Omit<SalonOffer, 'id'> = {
                      title: 'New Studio Special Combo',
                      tagline: 'Limited Seasonal Deal',
                      description: 'Special makeover package created by lead artist.',
                      discountType: 'fixed_price',
                      discountValue: 499,
                      eligibleServiceIds: [services[0]?.id || ''],
                      startDate: todayStr,
                      endDate: '2026-12-31',
                      termsAndConditions: ['Valid on advance web booking.', 'Pay at salon post treatment.'],
                      isActive: true,
                      badge: 'New',
                    };
                    addOffer(newOffer);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-[#F07878] hover:bg-[#e06565] text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Quick Promo Offer</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offers.map((offer) => (
                  <div key={offer.id} className="p-6 bg-white rounded-2xl border border-[#F0E8EE] space-y-4 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#F07878]">{offer.tagline}</span>
                      <button
                        onClick={() => deleteOffer(offer.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete offer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="text-lg font-serif font-bold text-[#483449]">{offer.title}</h4>
                    <p className="text-xs text-[#766A77]">{offer.description}</p>

                    <div className="text-xs text-[#766A77] space-y-1 pt-2 border-t border-[#F0E8EE]">
                      <div><strong>Valid:</strong> {offer.startDate} to {offer.endDate}</div>
                      <div><strong>Status:</strong> {offer.isActive ? 'Active on Site' : 'Inactive'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= SECTION 6: STAFF ================= */}
          {currentTab === 'staff' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-[#483449]">
                    Staff & Stylist Schedules
                  </h2>
                  <p className="text-xs text-[#766A77]">
                    Manage active specialists and operational hours for slot scheduling.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {staff.map((member) => (
                  <div key={member.id} className="p-6 bg-white rounded-2xl border border-[#F0E8EE] space-y-4 shadow-2xs">
                    <div className="flex items-center gap-3">
                      {member.avatarUrl && (
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover border border-[#F0E8EE]"
                        />
                      )}
                      <div>
                        <h4 className="text-base font-serif font-bold text-[#483449]">{member.name}</h4>
                        <span className="text-xs text-[#766A77]">{member.role}</span>
                      </div>
                    </div>

                    <div className="text-xs text-[#766A77] space-y-1.5 pt-2 border-t border-[#F0E8EE]">
                      <div>
                        <strong>Hours:</strong> {member.startHour} – {member.endHour}
                      </div>
                      <div>
                        <strong>Specialization:</strong> {member.specialization.join(', ')}
                      </div>
                      <div className="text-emerald-700 font-semibold">
                        ✓ Active & Bookable on Web
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= SECTION 7: COURSE ENQUIRIES ================= */}
          {currentTab === 'enquiries' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#483449]">
                  Academy Student Admissions Tracker
                </h2>
                <p className="text-xs text-[#766A77]">
                  Prospective student inquiries for bridal makeup masterclass & cosmetology diploma.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#F0E8EE] overflow-hidden shadow-2xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FFFDF9] text-[#766A77] border-b border-[#F0E8EE]">
                    <tr>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Phone (WhatsApp)</th>
                      <th className="py-3 px-4">Course Enquired</th>
                      <th className="py-3 px-4">Experience Background</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0E8EE]">
                    {enquiries.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-[#766A77]">
                          No course admission enquiries yet.
                        </td>
                      </tr>
                    ) : (
                      enquiries.map((enq) => (
                        <tr key={enq.id} className="hover:bg-[#FFFDF9]/60">
                          <td className="py-3 px-4 font-semibold text-[#483449]">{enq.studentName}</td>
                          <td className="py-3 px-4">
                            <a href={`tel:${enq.studentPhone}`} className="hover:underline text-[#483449]">
                              {enq.studentPhone}
                            </a>
                          </td>
                          <td className="py-3 px-4 font-medium">{enq.courseTitle}</td>
                          <td className="py-3 px-4 text-[#766A77]">{enq.priorExperience}</td>
                          <td className="py-3 px-4">
                            <select
                              value={enq.status}
                              onChange={(e) => updateEnquiryStatus(enq.id, e.target.value as any)}
                              className="p-1 border border-[#F0E8EE] rounded text-[11px]"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="enrolled">Enrolled</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <a
                              href={`https://wa.me/91${enq.studentPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${enq.studentName}! This is Chetana Patel from Glam Set Go Academy in Naroda regarding your enquiry for ${enq.courseTitle}.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-semibold"
                            >
                              WhatsApp
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= SECTION 8: SETTINGS ================= */}
          {currentTab === 'settings' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#483449]">
                  Studio Configuration & Policies
                </h2>
                <p className="text-xs text-[#766A77]">
                  Update verified business info, contact numbers, and in-person payment policies.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#F0E8EE] space-y-4 shadow-2xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-[#483449] block mb-1">Salon Name</label>
                    <input
                      type="text"
                      value={settings.salonName}
                      onChange={(e) => updateSettings({ salonName: e.target.value })}
                      className="w-full p-2.5 border border-[#F0E8EE] rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#483449] block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) => updateSettings({ phone: e.target.value })}
                      className="w-full p-2.5 border border-[#F0E8EE] rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#483449] block mb-1">WhatsApp Number (e.g. 916352416168)</label>
                    <input
                      type="text"
                      value={settings.whatsAppNumber}
                      onChange={(e) => updateSettings({ whatsAppNumber: e.target.value })}
                      className="w-full p-2.5 border border-[#F0E8EE] rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#483449] block mb-1">Instagram Handle</label>
                    <input
                      type="text"
                      value={settings.instagramHandle}
                      onChange={(e) => updateSettings({ instagramHandle: e.target.value })}
                      className="w-full p-2.5 border border-[#F0E8EE] rounded-xl"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-[#483449] block mb-1">Studio Address in Naroda</label>
                    <input
                      type="text"
                      value={settings.address}
                      onChange={(e) => updateSettings({ address: e.target.value })}
                      className="w-full p-2.5 border border-[#F0E8EE] rounded-xl"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-[#483449] block mb-1">Cancellation & In-Person Payment Policy</label>
                    <textarea
                      rows={3}
                      value={settings.cancellationPolicy}
                      onChange={(e) => updateSettings({ cancellationPolicy: e.target.value })}
                      className="w-full p-2.5 border border-[#F0E8EE] rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-xs text-emerald-700 font-semibold">
                    ✓ Changes save automatically to database
                  </span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ================= MODAL: RECORD IN-SALON PAYMENT ================= */}
      {paymentModalApt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#F0E8EE] p-6 max-w-md w-full shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E8EE]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                  In-Person Counter Payment
                </span>
                <h3 className="text-lg font-serif font-bold text-[#483449]">
                  Collect Payment at Salon
                </h3>
              </div>
              <button onClick={() => setPaymentModalApt(null)} className="p-1 text-[#766A77]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-[#FFFDF9] rounded-xl border border-[#F0E8EE] text-xs space-y-1">
              <div><strong>Client:</strong> {paymentModalApt.customerName} ({paymentModalApt.referenceNumber})</div>
              <div><strong>Services:</strong> {paymentModalApt.serviceNames.join(', ')}</div>
              <div><strong>Estimated Due:</strong> ₹{paymentModalApt.totalPrice.toLocaleString('en-IN')}</div>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#483449] block">
                  Payment Mode *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'upi_qr', label: 'UPI QR (GPay)' },
                    { id: 'cash', label: 'Cash' },
                    { id: 'card_pos', label: 'Card POS' },
                  ].map((mode) => (
                    <button
                      type="button"
                      key={mode.id}
                      onClick={() => setPaymentMethod(mode.id as InSalonPaymentMethod)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                        paymentMethod === mode.id
                          ? 'border-[#F07878] bg-[#F8DCE5] text-[#483449]'
                          : 'border-[#F0E8EE] bg-white text-[#766A77]'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#483449] block">
                  Amount Received (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full p-2.5 border border-[#F0E8EE] rounded-xl text-sm font-bold text-[#483449]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#483449] block">
                  Collected By (Staff Member)
                </label>
                <input
                  type="text"
                  value={collectedBy}
                  onChange={(e) => setCollectedBy(e.target.value)}
                  className="w-full p-2 border border-[#F0E8EE] rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#483449] block">
                  Counter Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Scanned counter QR code, receipt handed over."
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full p-2 border border-[#F0E8EE] rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalApt(null)}
                  className="px-4 py-2 text-xs text-[#766A77]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Mark Completed & Paid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT SERVICE ================= */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#F0E8EE] p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E8EE]">
              <h3 className="text-lg font-serif font-bold text-[#483449]">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button onClick={() => setIsServiceModalOpen(false)} className="p-1 text-[#766A77]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleServiceFormSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#483449] block mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={serviceFormData.name}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, name: e.target.value })}
                  className="w-full p-2 border border-[#F0E8EE] rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-[#483449] block mb-1">Category *</label>
                  <select
                    value={serviceFormData.category}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, category: e.target.value as ServiceCategory })}
                    className="w-full p-2 border border-[#F0E8EE] rounded-xl"
                  >
                    <option value="hair">Hair & Styling</option>
                    <option value="treatments">Hair Treatments</option>
                    <option value="bridal">Bridal Makeovers</option>
                    <option value="makeup">Party Makeup</option>
                    <option value="skin">Skincare & Facials</option>
                    <option value="nails">Nail Art & Extensions</option>
                    <option value="groom_draping">Draping & Grooming</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#483449] block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={serviceFormData.price}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, price: Number(e.target.value) })}
                    className="w-full p-2 border border-[#F0E8EE] rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-[#483449] block mb-1">Duration (Minutes) *</label>
                  <input
                    type="number"
                    required
                    value={serviceFormData.durationMinutes}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, durationMinutes: Number(e.target.value) })}
                    className="w-full p-2 border border-[#F0E8EE] rounded-xl"
                  />
                </div>

                <div className="flex items-center gap-4 pt-5">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={serviceFormData.isStartingPrice}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, isStartingPrice: e.target.checked })}
                    />
                    <span>Starting Price</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={serviceFormData.requiresConsultation}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, requiresConsultation: e.target.checked })}
                    />
                    <span>Consultation</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#483449] block mb-1">Short Description</label>
                <input
                  type="text"
                  value={serviceFormData.shortDescription}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, shortDescription: e.target.value })}
                  className="w-full p-2 border border-[#F0E8EE] rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-[#483449] block mb-1">Full Description</label>
                <textarea
                  rows={2}
                  value={serviceFormData.description}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                  className="w-full p-2 border border-[#F0E8EE] rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-[#483449] block mb-1">Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={serviceFormData.imageUrl}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, imageUrl: e.target.value })}
                  className="w-full p-2 border border-[#F0E8EE] rounded-xl"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 text-[#766A77]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#F07878] hover:bg-[#e06565] text-white rounded-xl font-semibold shadow-xs"
                >
                  {editingService ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
