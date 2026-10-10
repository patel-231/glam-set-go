import React from 'react';
import { Clock, Plus, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { Service } from '../../types';

interface FeaturedServicesProps {
  onViewAllServices: () => void;
}

export const FeaturedServices: React.FC<FeaturedServicesProps> = ({ onViewAllServices }) => {
  const { services, openBookingModal } = useSalon();

  // Select 6 active standout services
  const featured = services.filter(s => s.isActive).slice(0, 6);

  return (
    <section className="py-16 bg-[#FFFDF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F07878]">
              Most Requested in Naroda
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#483449]">
              Featured Salon & Studio Experiences
            </h2>
            <p className="text-sm sm:text-base text-[#766A77] max-w-xl">
              Transparent upfront pricing with zero online booking charges. Settle at the studio once your service is completed.
            </p>
          </div>

          <button
            onClick={onViewAllServices}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#483449] hover:text-[#F07878] transition-colors"
          >
            <span>See all {services.length} services</span>
            <ArrowRight className="w-4 h-4 text-[#F07878]" />
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((service: Service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-[#F0E8EE] overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
            >
              {/* Image banner */}
              {service.imageUrl && (
                <div className="relative h-48 overflow-hidden bg-[#FFFDF9]">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Category tag */}
                  <div className="absolute bottom-3 left-3 text-white text-xs font-medium tracking-wide">
                    <span className="capitalize">{service.category.replace('_', ' & ')}</span>
                  </div>

                  {service.requiresConsultation && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[#483449] text-[11px] font-semibold px-2 py-0.5 rounded-md border border-[#F0E8EE]">
                      Consultation Included
                    </div>
                  )}
                </div>
              )}

              {/* Service content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#766A77]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#F07878]" />
                      <span>{service.durationMinutes} mins</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-700 font-medium">Available for booking</span>
                  </div>

                  <h3 className="text-lg font-serif font-semibold text-[#483449] group-hover:text-[#F07878] transition-colors">
                    {service.name}
                  </h3>

                  <p className="text-xs text-[#766A77] line-clamp-2 leading-relaxed">
                    {service.shortDescription}
                  </p>
                </div>

                {/* Price and CTA row */}
                <div className="pt-3 border-t border-[#F0E8EE] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#766A77] block font-medium">
                      {service.isStartingPrice ? 'Starts at' : 'Fixed Price'}
                    </span>
                    <span className="text-xl font-serif font-bold text-[#483449]">
                      ₹{service.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() => openBookingModal(service)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#F8DCE5] hover:bg-[#F07878] text-[#483449] hover:text-white rounded-xl text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Book Slot</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
