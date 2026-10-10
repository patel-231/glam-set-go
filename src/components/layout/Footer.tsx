import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Instagram, 
  Clock, 
  CheckCircle2, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  openAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab, openAdmin }) => {
  const { settings, openBookingModal } = useSalon();

  return (
    <footer className="bg-[#FFFFFF] border-t border-[#F0E8EE] pt-16 pb-12 text-[#483449]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* In-Salon Payment Banner */}
        <div className="mb-14 p-6 sm:p-8 rounded-2xl bg-[#FFFDF9] border border-[#F0E8EE] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F07878]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Transparent & Frictionless Booking</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[#483449]">
              Zero Advance Required · Pay Seamlessly at the Salon
            </h3>
            <p className="text-sm text-[#766A77]">
              Book your appointment online without hassle. Savor your hair, makeup, or beauty pampering, then settle payment in-person at our studio counter via UPI (GPay/PhonePe), Cash, or Card machine.
            </p>
          </div>

          <button
            onClick={() => openBookingModal()}
            className="shrink-0 flex items-center gap-2 px-6 py-3.5 bg-[#F07878] hover:bg-[#e06565] text-white rounded-xl font-medium shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>Book Your Slot</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#F0E8EE]">
          {/* Col 1: About Studio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#F8DCE5] border border-[#F0E8EE] flex items-center justify-center text-[#F07878]">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-serif font-bold text-[#483449]">
                Glam Set Go
              </span>
            </div>

            <p className="text-sm text-[#766A77] leading-relaxed">
              Premier beauty makeover studio in Naroda, Ahmedabad. Dedicated to authentic styling, personalized bridal artistry, premium hair therapies, and certified professional beauty education.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a 
                href={`https://instagram.com/${settings.instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#FFFDF9] border border-[#F0E8EE] flex items-center justify-center text-[#483449] hover:text-[#F07878] hover:border-[#F8DCE5] transition-colors"
                title={`Follow @${settings.instagramHandle} on Instagram`}
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href={`https://wa.me/${settings.whatsAppNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#FFFDF9] border border-[#F0E8EE] flex items-center justify-center text-emerald-700 hover:border-emerald-200 transition-colors"
                title="Direct WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a 
                href={`tel:${settings.phone}`}
                className="w-9 h-9 rounded-full bg-[#FFFDF9] border border-[#F0E8EE] flex items-center justify-center text-[#483449] hover:text-[#F07878] transition-colors"
                title="Call Studio"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Studio Location & Timings */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#483449]">
              Studio Location
            </h4>

            <div className="space-y-3 text-sm text-[#766A77]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F07878] shrink-0 mt-0.5" />
                <span>
                  {settings.address}, {settings.city}, {settings.state} - {settings.pincode}
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#766A77] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[#483449]">Business Hours:</p>
                  <p>{settings.openingHours.weekdays}</p>
                  <p>{settings.openingHours.weekends}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#766A77] shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-[#483449] font-medium">
                  +91 {settings.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Services & Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#483449]">
              Services & Studio
            </h4>

            <ul className="space-y-2 text-sm text-[#766A77]">
              <li>
                <button 
                  onClick={() => { setCurrentTab('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F07878] transition-colors"
                >
                  Precision Haircuts & Blow-dry
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentTab('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F07878] transition-colors"
                >
                  Keratin & Moroccan Hair Repair
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentTab('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F07878] transition-colors"
                >
                  Signature Bridal Makeover
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentTab('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F07878] transition-colors"
                >
                  Hydra Facials & Skin Glowing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentTab('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F07878] transition-colors"
                >
                  Gel Nail Extensions & Art
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentTab('courses'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F07878] transition-colors font-medium text-[#483449]"
                >
                  Beauty & Makeup Academy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Booking Policies */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#483449]">
              Booking Transparency
            </h4>

            <div className="space-y-2.5 text-xs text-[#766A77] leading-relaxed">
              <p>
                <strong className="text-[#483449]">No Prepayment:</strong> You pay only after you are completely satisfied with your hair or beauty service.
              </p>
              <p>
                <strong className="text-[#483449]">Flexible Rescheduling:</strong> Change your appointment date or time up to 3 hours prior with zero fees.
              </p>
              <p>
                <strong className="text-[#483449]">Hygiene Protocol:</strong> Sterilized equipment, disposable sheets, and skin-tested professional formulas.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#766A77]">
          <p>© {new Date().getFullYear()} Glam Set Go · All Rights Reserved · Naroda, Ahmedabad, Gujarat.</p>

          <div className="flex items-center gap-6">
            <span className="hidden md:inline">Instagram: @{settings.instagramHandle}</span>
            <button
              onClick={openAdmin}
              className="flex items-center gap-1.5 text-[#766A77] hover:text-[#483449] font-medium py-1 px-2 rounded-md hover:bg-[#F8DCE5]/30 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-[#F07878]" />
              <span>Salon Owner & Staff Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
