import React from 'react';
import { 
  Scissors, 
  Sparkles, 
  Crown, 
  Flame, 
  Paintbrush, 
  Smile, 
  GraduationCap, 
  ArrowRight 
} from 'lucide-react';

interface ServiceDiscoveryProps {
  onSelectCategory: (category: string) => void;
}

export const ServiceDiscovery: React.FC<ServiceDiscoveryProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      id: 'hair',
      title: 'Hair & Styling',
      description: 'Precision haircuts, blow-dry styling, global coloring, and balayage.',
      icon: Scissors,
      bg: 'bg-[#FFFDF9]',
      accent: 'border-[#F8DCE5]',
      itemsCount: '6 services',
    },
    {
      id: 'treatments',
      title: 'Hair Treatments',
      description: 'Advanced Keratin smoothing, Moroccan argan deep repair, and scalp spa.',
      icon: Flame,
      bg: 'bg-[#FFFDF9]',
      accent: 'border-[#E8E0FF]',
      itemsCount: '4 treatments',
    },
    {
      id: 'bridal',
      title: 'Bridal Makeovers',
      description: 'Signature bridal couture, traditional Gujarati panetar, HD & Airbrush.',
      icon: Crown,
      bg: 'bg-[#FFFDF9]',
      accent: 'border-[#F8DCE5]',
      itemsCount: 'Chetana Artistry',
    },
    {
      id: 'makeup',
      title: 'Party & Engagement',
      description: 'Radiant soft-glam, reception looks, sangeet makeup, and styling.',
      icon: Sparkles,
      bg: 'bg-[#FFFDF9]',
      accent: 'border-[#E8E0FF]',
      itemsCount: 'Celebration looks',
    },
    {
      id: 'skin',
      title: 'Skincare & Facials',
      description: 'Hydra-infusion glow, fruit facials with shiner, waxing, and threading.',
      icon: Smile,
      bg: 'bg-[#FFFDF9]',
      accent: 'border-[#DDF3E7]',
      itemsCount: 'Rejuvenating',
    },
    {
      id: 'nails',
      title: 'Nail Extensions & Art',
      description: 'Gel & acrylic extensions, chrome art, french tips, and spa pedicure.',
      icon: Paintbrush,
      bg: 'bg-[#FFFDF9]',
      accent: 'border-[#F8DCE5]',
      itemsCount: 'Manicure & Pedicure',
    },
    {
      id: 'groom_draping',
      title: 'Draping & Groom Styling',
      description: 'Gujarati saree pleating, lehenga dupatta setting, and groom grooming.',
      icon: Sparkles,
      bg: 'bg-[#FFFDF9]',
      accent: 'border-[#E8E0FF]',
      itemsCount: 'Precision pleats',
    },
    {
      id: 'courses',
      title: 'Beauty Academy',
      description: 'Professional bridal makeup masterclasses and salon diploma courses.',
      icon: GraduationCap,
      bg: 'bg-[#FFFDF9]',
      accent: 'border-[#DDF3E7]',
      itemsCount: 'Certification',
    },
  ];

  return (
    <section className="py-16 bg-[#FFFFFF] border-y border-[#F0E8EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F07878]">
              Curated Studio Offerings
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#483449]">
              Explore Our Signature Categories
            </h2>
            <p className="text-sm sm:text-base text-[#766A77] max-w-xl">
              From routine salon care to royal wedding day transformations, every service is executed with certified hygiene and personal care.
            </p>
          </div>

          <button
            onClick={() => onSelectCategory('all')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#F07878] hover:text-[#d45b5b] transition-colors"
          >
            <span>View Full Price Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`p-6 rounded-2xl bg-white border ${cat.accent} hover:shadow-md hover:border-[#F07878]/50 transition-all text-left group flex flex-col justify-between cursor-pointer`}
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#FFFDF9] border border-[#F0E8EE] flex items-center justify-center text-[#483449] group-hover:scale-105 group-hover:text-[#F07878] transition-all mb-4">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-serif font-semibold text-[#483449] group-hover:text-[#F07878] transition-colors mb-1.5">
                    {cat.title}
                  </h3>

                  <p className="text-xs text-[#766A77] leading-relaxed mb-4">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F0E8EE] flex items-center justify-between text-xs">
                  <span className="text-[#766A77] font-medium">{cat.itemsCount}</span>
                  <span className="text-[#F07878] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
