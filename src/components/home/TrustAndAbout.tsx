import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  Instagram,
  Heart
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

export const TrustAndAbout: React.FC = () => {
  const { settings } = useSalon();

  return (
    <section className="py-16 bg-[#FFFFFF] border-y border-[#F0E8EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#F0E8EE] shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800"
                alt="Glam Set Go studio interior in Naroda, Ahmedabad"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#483449]/70 via-transparent to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <span className="text-xs font-semibold tracking-wider uppercase text-[#F8DCE5]">
                    Ahmedabad Makeover Studio
                  </span>
                  <h3 className="text-xl font-serif font-bold">
                    Chetana Makeover Studio & Salon
                  </h3>
                  <p className="text-xs text-white/90">
                    Near Galaxy Cinema & Dehgam Road, Naroda, Ahmedabad
                  </p>
                </div>
              </div>
            </div>

            {/* Corner Badge */}
            <div className="absolute -bottom-5 -right-5 bg-[#FFFDF9] border border-[#F0E8EE] p-4 rounded-2xl shadow-md max-w-xs space-y-1 hidden sm:block">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#F07878]">
                <Heart className="w-4 h-4 fill-current" />
                <span>Dedicated Care</span>
              </div>
              <p className="text-xs text-[#766A77]">
                Personalized consultations for every bride, guest, and student.
              </p>
            </div>
          </div>

          {/* Right Column: Verified Story & Salon Values */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F07878]">
                About Our Studio
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#483449]">
                Authentic Craft. Personalised Attention. Welcoming Space.
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#766A77] leading-relaxed">
              Situated in Naroda, Ahmedabad, <strong>Glam Set Go</strong> was founded by lead artist Chetana Patel with a singular vision: to deliver bespoke bridal artistry, cutting-edge hair styling, and rejuvenating skin rituals in a relaxed, hygienic environment.
            </p>

            <p className="text-sm text-[#766A77] leading-relaxed">
              We believe in honest beauty without exaggerated marketing. We test and curate only genuine professional brands — including L'Oréal Professionnel, Olaplex, MAC, and Kryolan — customized specifically to your skin tone, hair texture, and ceremony schedule.
            </p>

            {/* Core commitments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#FFFDF9] border border-[#F0E8EE] space-y-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#483449]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Clinical-Grade Sanitation</span>
                </div>
                <p className="text-xs text-[#766A77]">
                  All scissors, brushes, and metal tools undergo autoclaving and UV sterilization between every client.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FFFDF9] border border-[#F0E8EE] space-y-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#483449]">
                  <CheckCircle2 className="w-4 h-4 text-[#F07878]" />
                  <span>In-Person Pay at Salon</span>
                </div>
                <p className="text-xs text-[#766A77]">
                  No compulsory digital pre-payments. Seamlessly settle at the studio desk via UPI, Cash, or POS card.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FFFDF9] border border-[#F0E8EE] space-y-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#483449]">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span>Bridal & Makeover Artistry</span>
                </div>
                <p className="text-xs text-[#766A77]">
                  Specializing in traditional Gujarati bridal, reception soft glam, sangeet looks, and saree draping.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FFFDF9] border border-[#F0E8EE] space-y-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#483449]">
                  <Instagram className="w-4 h-4 text-pink-600" />
                  <span>Verified Community Work</span>
                </div>
                <p className="text-xs text-[#766A77]">
                  Explore genuine client transformations on our official Instagram @{settings.instagramHandle}.
                </p>
              </div>
            </div>

            {/* Quick contact strip */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#766A77]">
              <span className="flex items-center gap-1.5 font-medium text-[#483449]">
                <MapPin className="w-3.5 h-3.5 text-[#F07878]" />
                <span>{settings.address}, {settings.city}</span>
              </span>
              <span>·</span>
              <a 
                href={`tel:${settings.phone}`}
                className="flex items-center gap-1.5 font-semibold text-[#483449] hover:text-[#F07878] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#F07878]" />
                <span>+91 {settings.phone}</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
