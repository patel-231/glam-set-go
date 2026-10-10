import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Search, 
  Phone, 
  MessageCircle, 
  Menu, 
  X,
  Compass,
  Tag,
  Image as ImageIcon,
  GraduationCap
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, openAdmin }) => {
  const { openBookingModal, openLookupModal, settings } = useSalon();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services', icon: Compass },
    { id: 'offers', label: 'Offers', icon: Tag },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'courses', label: 'Academy & Courses', icon: GraduationCap },
    { id: 'contact', label: 'Visit Studio', icon: Phone },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#F0E8EE]">
      {/* Top micro bar with location and instant contact */}
      <div className="bg-[#F8DCE5]/40 text-[#483449] text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-medium">📍 Naroda, Ahmedabad</span>
            <span className="hidden sm:inline text-[#766A77]">·</span>
            <span className="hidden sm:inline text-[#766A77]">Tue - Sun: 10:00 AM - 08:00 PM</span>
            <span className="hidden md:inline text-[#766A77]">·</span>
            <span className="hidden md:inline text-emerald-800 font-medium">In-Person Pay at Salon</span>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href={`tel:${settings.phone}`}
              className="flex items-center gap-1 hover:text-[#F07878] transition-colors"
              title="Call salon"
            >
              <Phone className="w-3.5 h-3.5 text-[#F07878]" />
              <span className="font-semibold">+91 {settings.phone}</span>
            </a>

            <a 
              href={`https://wa.me/${settings.whatsAppNumber}?text=${encodeURIComponent('Hello Glam Set Go! I would like to enquire about salon services.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#483449] hover:text-emerald-700 font-medium transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand identity */}
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F8DCE5] to-[#E8E0FF] border border-[#F0E8EE] flex items-center justify-center text-[#483449] group-hover:scale-105 transition-transform shadow-xs">
            <Sparkles className="w-5 h-5 text-[#F07878]" />
          </div>
          <div>
            <span className="block text-xl sm:text-2xl font-serif tracking-tight font-semibold text-[#483449]">
              Glam Set Go
            </span>
            <span className="block text-[11px] text-[#766A77] tracking-wider uppercase font-medium">
              Makeover Studio · Naroda
            </span>
          </div>
        </button>

        {/* Desktop Nav links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-medium transition-colors relative py-1 focus:outline-none ${
                  isActive ? 'text-[#F07878] font-semibold' : 'text-[#766A77] hover:text-[#483449]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F07878] rounded-full animate-fade-in" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Lookup booking */}
          <button
            onClick={openLookupModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#766A77] hover:text-[#483449] rounded-lg border border-[#F0E8EE] hover:bg-[#F8DCE5]/30 transition-colors"
            title="Check status of existing appointment"
          >
            <Search className="w-3.5 h-3.5" />
            <span>My Booking</span>
          </button>

          {/* Primary Book CTA */}
          <button
            onClick={() => openBookingModal()}
            className="flex items-center gap-2 px-4.5 py-2.5 text-sm font-medium text-white bg-[#F07878] hover:bg-[#e06565] active:scale-[0.98] rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => openBookingModal()}
            className="sm:hidden flex items-center gap-1 px-3 py-2 text-xs font-semibold text-white bg-[#F07878] rounded-lg shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#483449] hover:bg-[#F8DCE5]/30 rounded-lg transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFDF9] border-b border-[#F0E8EE] px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-md">
          <div className="grid grid-cols-2 gap-2 pb-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors ${
                    isActive 
                      ? 'bg-[#F8DCE5] text-[#483449] font-semibold' 
                      : 'text-[#766A77] hover:bg-[#F8DCE5]/20 hover:text-[#483449]'
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4 text-[#F07878]" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#F0E8EE] space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openLookupModal();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[#483449] bg-white border border-[#F0E8EE] rounded-xl"
            >
              <Search className="w-4 h-4 text-[#766A77]" />
              <span>Find Existing Appointment</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openBookingModal();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-[#F07878] rounded-xl shadow-xs"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Your Appointment (Pay at Salon)</span>
            </button>

            <div className="flex items-center justify-between pt-2 px-2 text-xs text-[#766A77]">
              <span>Direct Studio Contact:</span>
              <a href={`tel:${settings.phone}`} className="font-semibold text-[#F07878]">
                +91 {settings.phone}
              </a>
            </div>

            <div className="text-center pt-2">
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAdmin();
                }}
                className="text-xs text-[#766A77] hover:text-[#483449] underline"
              >
                Salon Owner & Staff Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
