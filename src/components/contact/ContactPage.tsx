import React from 'react';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Instagram, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  HeartHandshake 
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

export const ContactPage: React.FC = () => {
  const { settings, openBookingModal } = useSalon();

  return (
    <div className="py-12 bg-[#FFFDF9] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8DCE5] text-[#483449] text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5 text-[#F07878]" />
            <span>Studio Location & Timings</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#483449]">
            Visit Glam Set Go in Naroda
          </h1>

          <p className="text-sm sm:text-base text-[#766A77]">
            Conveniently accessible for clients and students from Naroda, Nikol, Bapunagar, Krishnanagar, and Dehgam road, Ahmedabad.
          </p>
        </div>

        {/* Studio Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Left Cards */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Address & Timings */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#F0E8EE] space-y-6 shadow-2xs">
              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#F8DCE5] text-[#F07878] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-bold text-[#483449]">
                      Studio Address
                    </h3>
                    <p className="text-sm text-[#766A77] mt-1 leading-relaxed">
                      <strong>Glam Set Go (Chetana Makeover Studio)</strong><br />
                      {settings.address},<br />
                      {settings.city}, {settings.state} - {settings.pincode}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-4 border-t border-[#F0E8EE]">
                  <div className="w-10 h-10 rounded-xl bg-[#E8E0FF] text-[#483449] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-[#F07878]" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-bold text-[#483449]">
                      Opening Timings
                    </h3>
                    <div className="text-sm text-[#766A77] mt-1 space-y-1">
                      <p><strong>Tuesday to Friday:</strong> 10:00 AM – 08:00 PM</p>
                      <p><strong>Saturday & Sunday:</strong> 09:30 AM – 08:30 PM</p>
                      <p className="text-xs text-amber-700">Closed on Mondays for deep sanitization</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Action Buttons */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-[#483449] hover:bg-[#342435] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#F8DCE5]" />
                  <span>Call +91 {settings.phone}</span>
                </a>

                <a
                  href={`https://wa.me/${settings.whatsAppNumber}?text=${encodeURIComponent('Hello Glam Set Go! I would like to enquire about visiting your studio.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* In-Salon Payment Policy Box */}
            <div className="p-6 rounded-3xl bg-[#FFFDF9] border border-[#F0E8EE] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F07878]">
                <HeartHandshake className="w-4 h-4" />
                <span>Zero Risk Booking</span>
              </div>
              <h4 className="text-base font-serif font-bold text-[#483449]">
                Seamless In-Person Payment at Counter
              </h4>
              <p className="text-xs text-[#766A77] leading-relaxed">
                We do not ask for card details or upfront fees on our website. All client payments are completed smoothly in-person at our front desk upon service satisfaction via UPI QR, Cash, or POS Card Machine.
              </p>
            </div>

          </div>

          {/* Right Column: Visual Studio & Map Guide */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl overflow-hidden border border-[#F0E8EE] bg-white shadow-2xs">
              <img
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=900"
                alt="Glam Set Go studio interior styling stations"
                className="w-full h-64 object-cover"
              />

              <div className="p-6 space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F07878] block">
                    How To Reach Us
                  </span>
                  <h4 className="text-lg font-serif font-bold text-[#483449] mt-1">
                    Landmarks & Accessibility
                  </h4>
                  <p className="text-xs text-[#766A77] mt-1.5 leading-relaxed">
                    Our studio is located close to Galaxy Cinema near Dehgam Road crossroads in Naroda. Ample 2-wheeler and 4-wheeler parking space is available right outside the studio complex.
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F0E8EE] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-[#766A77]">
                    <Instagram className="w-4 h-4 text-pink-600" />
                    <span>Instagram: <strong>@{settings.instagramHandle}</strong></span>
                  </div>

                  <button
                    onClick={() => openBookingModal()}
                    className="px-5 py-2.5 bg-[#F07878] hover:bg-[#e06565] text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    Book An Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
