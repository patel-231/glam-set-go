import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpDown,
  Tag
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { Service, ServiceCategory } from '../../types';

interface ServicesCatalogueProps {
  initialCategory?: string;
}

export const ServicesCatalogue: React.FC<ServicesCatalogueProps> = ({ initialCategory = 'all' }) => {
  const { services, offers, openBookingModal } = useSalon();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'duration'>('default');

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Services' },
    { id: 'hair', label: 'Hair & Styling' },
    { id: 'treatments', label: 'Hair Treatments' },
    { id: 'bridal', label: 'Bridal Makeovers' },
    { id: 'makeup', label: 'Party Makeup' },
    { id: 'skin', label: 'Skincare & Facials' },
    { id: 'nails', label: 'Nail Art & Extensions' },
    { id: 'groom_draping', label: 'Draping & Grooming' },
  ];

  // Filtering and sorting
  const filteredServices = useMemo(() => {
    return services
      .filter((service) => {
        if (!service.isActive) return false;
        
        // Category filter
        if (selectedCategory !== 'all' && service.category !== selectedCategory) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = service.name.toLowerCase().includes(q);
          const matchesDesc = service.description.toLowerCase().includes(q) || 
                              service.shortDescription.toLowerCase().includes(q);
          const matchesCategory = service.category.toLowerCase().includes(q);
          if (!matchesName && !matchesDesc && !matchesCategory) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'duration') return a.durationMinutes - b.durationMinutes;
        return 0;
      });
  }, [services, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="py-12 bg-[#FFFDF9] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Page Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F8DCE5] text-[#483449] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#F07878]" />
            <span>Salon Menu & Official Rates</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#483449]">
            Salon Services & Treatment Menu
          </h1>

          <p className="text-sm sm:text-base text-[#766A77]">
            Complete pricing transparency with zero pre-payment required online. All services are performed with hospital-grade sanitization and paid in-person at the salon counter.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#F0E8EE] shadow-2xs mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#766A77]" />
              <input
                type="text"
                placeholder="Search services (e.g. Keratin, Bridal, Haircut, Facial, Nails)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F0E8EE] bg-[#FFFDF9] text-sm text-[#483449] placeholder:text-[#766A77]/70 focus:outline-none focus:ring-2 focus:ring-[#F8DCE5] focus:border-[#F07878]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#766A77] hover:text-[#483449]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="md:col-span-4 flex items-center gap-2 justify-end">
              <span className="text-xs text-[#766A77] whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-2.5 px-3 rounded-xl border border-[#F0E8EE] bg-[#FFFDF9] text-xs font-medium text-[#483449] focus:outline-none focus:ring-2 focus:ring-[#F8DCE5]"
              >
                <option value="default">Default Order</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="duration">Duration: Shortest First</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 no-scrollbar border-t border-[#F0E8EE]/70">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#483449] text-white shadow-xs font-semibold'
                    : 'bg-[#FFFDF9] text-[#766A77] border border-[#F0E8EE] hover:bg-[#F8DCE5]/30 hover:text-[#483449]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count & In-Salon Pay Reminder */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#766A77]">
          <span>Showing <strong>{filteredServices.length}</strong> available services</span>
          <span className="text-emerald-700 font-medium">✓ No upfront payment needed</span>
        </div>

        {/* Services List / Cards */}
        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#F0E8EE] p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#F8DCE5] mx-auto flex items-center justify-center text-[#F07878]">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#483449]">
              No services found
            </h3>
            <p className="text-xs text-[#766A77]">
              We couldn't find any services matching "{searchQuery}". Try searching for another treatment or clear the filters.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-4 py-2 bg-[#F8DCE5] text-[#483449] rounded-xl text-xs font-semibold hover:bg-[#f2cad6] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              // Check if service is eligible for any active offer
              const activeOffer = offers.find(
                (o) => o.isActive && o.eligibleServiceIds.includes(service.id)
              );

              return (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl border border-[#F0E8EE] overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
                >
                  {/* Image header if available */}
                  {service.imageUrl && (
                    <div className="relative h-48 overflow-hidden bg-[#FFFDF9]">
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                      
                      <div className="absolute bottom-3 left-3 text-white text-xs font-medium tracking-wide">
                        <span className="capitalize">{service.category.replace('_', ' & ')}</span>
                      </div>

                      {activeOffer && (
                        <div className="absolute top-3 left-3 bg-[#F07878] text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                          <Tag className="w-3 h-3" />
                          <span>Special Promo Available</span>
                        </div>
                      )}

                      {service.requiresConsultation && (
                        <div className="absolute top-3 right-3 bg-white/90 text-[#483449] text-[10px] font-semibold px-2 py-0.5 rounded-md border border-[#F0E8EE]">
                          Consultation Needed
                        </div>
                      )}
                    </div>
                  )}

                  {/* Body Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-[#766A77]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#F07878]" />
                          <span>{service.durationMinutes} mins</span>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{service.category.replace('_', ' ')}</span>
                      </div>

                      <h3 className="text-lg font-serif font-bold text-[#483449] group-hover:text-[#F07878] transition-colors">
                        {service.name}
                      </h3>

                      <p className="text-xs text-[#766A77] leading-relaxed">
                        {service.description}
                      </p>

                      {service.preparationNotes && (
                        <div className="bg-[#FFFDF9] p-2.5 rounded-lg border border-[#F0E8EE] flex items-start gap-2 text-[11px] text-[#766A77]">
                          <AlertCircle className="w-3.5 h-3.5 text-[#F07878] shrink-0 mt-0.5" />
                          <span>{service.preparationNotes}</span>
                        </div>
                      )}

                      {service.recommendedFor && (
                        <div className="text-[11px] text-[#766A77]">
                          <strong className="text-[#483449]">Recommended for:</strong> {service.recommendedFor}
                        </div>
                      )}
                    </div>

                    {/* Price and CTA */}
                    <div className="pt-4 border-t border-[#F0E8EE] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#766A77] block font-medium uppercase tracking-wider">
                          {service.isStartingPrice ? 'Starts from' : 'Confirmed Price'}
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl font-serif font-bold text-[#483449]">
                            ₹{service.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-semibold">
                            (Pay at Salon)
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => openBookingModal(service)}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-[#F07878] hover:bg-[#e06565] text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book Slot</span>
                      </button>
                    </div>
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
