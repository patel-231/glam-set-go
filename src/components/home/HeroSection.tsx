import React from 'react';
import { 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  MessageCircle, 
  ShieldCheck, 
  HeartHandshake,
  Clock
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

interface HeroSectionProps {
  onExploreServices: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreServices }) => {
  const { openBookingModal, settings } = useSalon();

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-[#FFFDF9]">
      {/* Subtle organic ambient blush backdrop - light & vibrant */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#F8DCE5]/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#E8E0FF]/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Location & Studio Kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#F0E8EE] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#F07878] animate-pulse" />
              <span className="text-xs font-semibold text-[#483449] tracking-wide">
                Naroda · Ahmedabad · Makeover Studio
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#483449] leading-[1.15] tracking-tight">
                Your Beauty. <br className="hidden sm:inline" />
                <span className="italic font-normal text-[#F07878]">Your Style.</span> <br />
                Your Moment.
              </h1>

              <p className="text-base sm:text-lg text-[#766A77] max-w-xl leading-relaxed">
                Discover hair, skin, makeup, and beauty treatments designed around your personal style. Experiential makeover studio serving Naroda, Ahmedabad with skilled artisans, sanitized tools, and seamless in-person payment.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={() => openBookingModal()}
                className="flex items-center justify-center gap-2.5 px-7 py-4 text-base font-medium text-white bg-[#F07878] hover:bg-[#e06565] rounded-xl shadow-xs hover:shadow-md active:scale-[0.99] transition-all cursor-pointer"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Your Appointment</span>
              </button>

              <button
                onClick={onExploreServices}
                className="flex items-center justify-center gap-2 px-6 py-4 text-base font-medium text-[#483449] bg-white hover:bg-[#F8DCE5]/20 border border-[#F0E8EE] rounded-xl transition-all cursor-pointer"
              >
                <span>Explore Services</span>
                <ArrowRight className="w-4 h-4 text-[#766A77]" />
              </button>

              <a
                href={`https://wa.me/${settings.whatsAppNumber}?text=${encodeURIComponent('Hello Glam Set Go! I would like to enquire about your services and availability.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium text-emerald-800 bg-[#DDF3E7] hover:bg-[#cdeedc] rounded-xl transition-colors"
                title="Chat with our studio desk on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span className="sm:hidden lg:inline">WhatsApp</span>
              </a>
            </div>

            {/* Trust Highlights - No fake stats, real facts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-[#F0E8EE]/80">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#DDF3E7] text-emerald-800 mt-0.5">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#483449]">Pay at Salon</h4>
                  <p className="text-[11px] text-[#766A77]">No advance fee required. Settle in person post-service.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#E8E0FF] text-[#483449] mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#483449]">Sanitized Standards</h4>
                  <p className="text-[11px] text-[#766A77]">Fresh disposables & medical-grade tool sterilization.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#F8DCE5] text-[#F07878] mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#483449]">Zero Overbooking</h4>
                  <p className="text-[11px] text-[#766A77]">Dedicated specialist time reserved solely for you.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Editorial Visual Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Portrait Card */}
              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-white">
                <img
                  src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=900"
                  alt="Bridal and makeover styling at Glam Set Go studio"
                  className="w-full h-[430px] sm:h-[480px] object-cover object-center"
                />

                {/* Quiet Floating Corner Tag */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#F0E8EE] shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#F07878] font-bold block">
                      Lead Makeover Artist
                    </span>
                    <span className="text-sm font-semibold text-[#483449]">
                      Chetana Makeover Studio
                    </span>
                    <span className="text-xs text-[#766A77] block">
                      Bridal · HD Makeup · Hair Couture
                    </span>
                  </div>

                  <button
                    onClick={() => openBookingModal()}
                    className="px-3.5 py-2 bg-[#F8DCE5] hover:bg-[#f2cad6] text-[#483449] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Book Look
                  </button>
                </div>
              </div>

              {/* Secondary Accent Card - Hair & Skin */}
              <div className="hidden sm:block absolute -top-6 -left-8 w-44 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white rotate-[-3deg] hover:rotate-0 transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=400"
                  alt="Precision haircut and hair spa styling"
                  className="w-full h-32 object-cover"
                />
                <div className="p-2 text-center bg-white">
                  <span className="text-[11px] font-medium text-[#483449]">Bespoke Hair & Spa</span>
                </div>
              </div>

              {/* Accent Floating Badge */}
              <div className="absolute -bottom-4 -right-4 p-3 rounded-2xl bg-[#E8E0FF] border-2 border-white shadow-md text-center max-w-[140px]">
                <Sparkles className="w-4 h-4 text-[#483449] mx-auto mb-1" />
                <span className="text-xs font-bold text-[#483449] block">100% Verified</span>
                <span className="text-[10px] text-[#766A77] block">Naroda Studio</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
