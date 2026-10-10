import React, { useState } from 'react';
import { Sparkles, Eye, X, Filter } from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { GalleryItem } from '../../types';

export const GalleryPage: React.FC = () => {
  const { gallery } = useSalon();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Portfolio' },
    { id: 'bridal', label: 'Bridal Makeovers' },
    { id: 'makeup', label: 'Party Makeup' },
    { id: 'hair', label: 'Hair & Colour' },
    { id: 'nails', label: 'Nails & Art' },
    { id: 'skin', label: 'Skin Care' },
    { id: 'studio', label: 'Studio Interior' },
  ];

  const filteredItems = gallery.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  return (
    <div className="py-12 bg-[#FFFDF9] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8DCE5] text-[#483449] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#F07878]" />
            <span>Studio Portfolio & Real Work</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#483449]">
            Client Transformations & Studio Artistry
          </h1>

          <p className="text-sm sm:text-base text-[#766A77]">
            Visual gallery highlighting real bridal clients, hair color transitions, and precision nail creations at Glam Set Go in Naroda, Ahmedabad.
          </p>
        </div>

        {/* Filter categories */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#483449] text-white shadow-xs'
                  : 'bg-white text-[#766A77] border border-[#F0E8EE] hover:bg-[#F8DCE5]/30 hover:text-[#483449]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative rounded-2xl overflow-hidden bg-white border border-[#F0E8EE] shadow-2xs hover:shadow-md transition-all cursor-pointer aspect-4/5"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#483449]/80 via-transparent to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#F8DCE5]">
                  {item.category}
                </span>
                <h4 className="text-sm font-serif font-bold text-white leading-tight">
                  {item.title}
                </h4>
                <p className="text-[11px] text-white/80 line-clamp-2 mt-1">
                  {item.caption}
                </p>
              </div>

              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#483449] opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Fullscreen Lightbox Modal */}
        {activeItem && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden border border-[#F0E8EE] shadow-2xl animate-scale-up">
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                aria-label="Close image preview"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[70vh] bg-[#FFFDF9] flex items-center justify-center">
                <img
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  className="max-h-[70vh] w-auto object-contain mx-auto"
                />
              </div>

              <div className="p-6 bg-white space-y-2">
                <div className="flex items-center justify-between text-xs text-[#766A77]">
                  <span className="uppercase font-semibold tracking-wider text-[#F07878]">
                    {activeItem.category}
                  </span>
                  <span>{activeItem.dateAdded}</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-[#483449]">
                  {activeItem.title}
                </h3>
                <p className="text-sm text-[#766A77]">
                  {activeItem.caption}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
