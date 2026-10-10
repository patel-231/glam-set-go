import React from 'react';
import { Tag, Calendar, Check, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

export const OffersPage: React.FC = () => {
  const { offers, services, openBookingModal } = useSalon();
  const today = new Date().toISOString().split('T')[0];

  const activeOffers = offers.filter((o) => o.isActive && o.endDate >= today);

  return (
    <div className="py-12 bg-[#FFFDF9] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8DCE5] text-[#483449] text-xs font-semibold">
            <Tag className="w-3.5 h-3.5 text-[#F07878]" />
            <span>Seasonal Studio Promotions</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#483449]">
            Active Salon Offers & Combos
          </h1>

          <p className="text-sm sm:text-base text-[#766A77]">
            Enjoy curated makeover and haircare packages in Naroda, Ahmedabad. All offers can be reserved with zero advance online; payment is completed at the studio counter post-service.
          </p>
        </div>

        {/* Offers Grid */}
        {activeOffers.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#F0E8EE] max-w-md mx-auto space-y-3">
            <Sparkles className="w-8 h-8 text-[#766A77] mx-auto" />
            <h3 className="text-lg font-serif font-bold text-[#483449]">No Active Seasonal Promos Today</h3>
            <p className="text-xs text-[#766A77]">
              Check out our standard menu with competitive everyday salon pricing.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeOffers.map((offer) => {
              const eligibleNames = services
                .filter((s) => offer.eligibleServiceIds.includes(s.id))
                .map((s) => s.name);

              return (
                <div
                  key={offer.id}
                  className="bg-white rounded-3xl border border-[#F0E8EE] p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all relative overflow-hidden"
                >
                  {offer.badge && (
                    <div className="absolute top-4 right-4 bg-[#E8E0FF] text-[#483449] text-[11px] font-bold px-3 py-0.5 rounded-full border border-[#F0E8EE]">
                      {offer.badge}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold text-[#F07878] uppercase tracking-wider block">
                        {offer.tagline}
                      </span>
                      <h3 className="text-xl font-serif font-bold text-[#483449] mt-1">
                        {offer.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-[#766A77] leading-relaxed">
                      {offer.description}
                    </p>

                    {/* Eligible services */}
                    <div className="bg-[#FFFDF9] p-3.5 rounded-2xl border border-[#F0E8EE] space-y-1.5">
                      <span className="text-[11px] font-semibold text-[#483449] block">
                        Included Treatments:
                      </span>
                      <ul className="text-xs text-[#766A77] space-y-1">
                        {eligibleNames.map((name, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-[#F07878]" />
                            <span>{name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Terms */}
                    <div className="space-y-1 text-[11px] text-[#766A77] border-t border-[#F0E8EE] pt-3">
                      <span className="font-semibold text-[#483449] block">Terms & Conditions:</span>
                      {offer.termsAndConditions.map((term, i) => (
                        <p key={i} className="flex items-start gap-1">
                          <span className="text-[#F07878]">•</span>
                          <span>{term}</span>
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Booking footer */}
                  <div className="pt-5 mt-4 border-t border-[#F0E8EE] flex items-center justify-between">
                    <div className="text-[11px] text-[#766A77] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#766A77]" />
                      <span>Valid until {offer.endDate}</span>
                    </div>

                    <button
                      onClick={() => {
                        const first = services.find(s => offer.eligibleServiceIds.includes(s.id));
                        openBookingModal(first);
                      }}
                      className="flex items-center gap-1.5 px-4.5 py-2.5 bg-[#F07878] hover:bg-[#e06565] text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <span>Claim & Book</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
