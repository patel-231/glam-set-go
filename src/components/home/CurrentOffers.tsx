import React from 'react';
import { Tag, Calendar, Check, ArrowRight, Sparkles } from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { SalonOffer } from '../../types';

interface CurrentOffersProps {
  onExploreAllOffers: () => void;
}

export const CurrentOffers: React.FC<CurrentOffersProps> = ({ onExploreAllOffers }) => {
  const { offers, openBookingModal, services } = useSalon();

  const today = new Date().toISOString().split('T')[0];

  // Active offers that haven't expired
  const activeOffers = offers.filter(
    (o) => o.isActive && o.startDate <= today && o.endDate >= today
  );

  if (activeOffers.length === 0) {
    return null; // Prompt says: "If there are no active offers, show a useful service-discovery section instead" (handled by parent or empty state)
  }

  return (
    <section className="py-16 bg-[#FFFDF9] border-t border-[#F0E8EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8DCE5] text-[#483449] text-xs font-semibold">
              <Tag className="w-3.5 h-3.5 text-[#F07878]" />
              <span>Current Studio Promotions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#483449]">
              Special Makeover & Wellness Bundles
            </h2>
            <p className="text-sm sm:text-base text-[#766A77] max-w-xl">
              Limited-time seasonal packages designed by Chetana and our senior hair stylists. Pay at the salon when your appointment takes place.
            </p>
          </div>

          <button
            onClick={onExploreAllOffers}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#F07878] hover:text-[#d45b5b] transition-colors"
          >
            <span>All Studio Offers</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Offers Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {activeOffers.map((offer: SalonOffer) => {
            const eligibleNames = services
              .filter((s) => offer.eligibleServiceIds.includes(s.id))
              .map((s) => s.name);

            return (
              <div
                key={offer.id}
                className="bg-white rounded-2xl border border-[#F0E8EE] p-6 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all relative overflow-hidden"
              >
                {/* Top badge */}
                {offer.badge && (
                  <div className="absolute top-4 right-4 bg-[#E8E0FF] text-[#483449] text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-[#F0E8EE]">
                    {offer.badge}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Discount pill / title */}
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#F07878] uppercase tracking-wider block">
                      {offer.tagline}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#483449]">
                      {offer.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#766A77] leading-relaxed">
                    {offer.description}
                  </p>

                  {/* Included services */}
                  {eligibleNames.length > 0 && (
                    <div className="bg-[#FFFDF9] p-3 rounded-xl border border-[#F0E8EE] space-y-1">
                      <span className="text-[11px] font-semibold text-[#483449] block">
                        Eligible Services Included:
                      </span>
                      <ul className="text-xs text-[#766A77] space-y-0.5">
                        {eligibleNames.map((name, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-[#F07878]" />
                            <span>{name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Terms */}
                  <div className="space-y-1 text-[11px] text-[#766A77]">
                    <span className="font-semibold text-[#483449] block">Key Terms:</span>
                    {offer.termsAndConditions.slice(0, 2).map((term, i) => (
                      <p key={i} className="flex items-start gap-1">
                        <span className="text-[#F07878]">•</span>
                        <span>{term}</span>
                      </p>
                    ))}
                  </div>
                </div>

                {/* Footer with date & booking CTA */}
                <div className="pt-5 mt-4 border-t border-[#F0E8EE] flex items-center justify-between">
                  <div className="text-[11px] text-[#766A77] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#766A77]" />
                    <span>Valid until {offer.endDate}</span>
                  </div>

                  <button
                    onClick={() => {
                      const firstService = services.find((s) =>
                        offer.eligibleServiceIds.includes(s.id)
                      );
                      openBookingModal(firstService);
                    }}
                    className="px-4 py-2 bg-[#F07878] hover:bg-[#e06565] text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                  >
                    Claim & Book
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
