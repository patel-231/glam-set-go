import React, { useState } from 'react';
import { Sparkles, Eye, X, ArrowRight } from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { GalleryItem } from '../../types';

interface GalleryPreviewProps {
  onViewAllGallery: () => void;
}

export const GalleryPreview: React.FC<GalleryPreviewProps> = ({ onViewAllGallery }) => {
  const { gallery } = useSalon();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Portfolio' },
    { id: 'bridal', label: 'Bridal' },
    { id: 'makeup', label: 'Party Makeup' },
    { id: 'hair', label: 'Hair & Colour' },
    { id: 'nails', label: 'Nails' },
    { id: 'skin', label: 'Skin Care' },
  ];

  const filteredItems = gallery.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  }).slice(0, 6);

  return (
    <section className="py-16 bg-[#FFFDF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F07878]">
              Client Artistry & Transformations
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#483449]">
              Portfolio From Our Studio
            </h2>
            <p className="text-sm sm:text-base text-[#766A77] max-w-xl">
              Authentic bridal makeovers, vibrant hair balayage, keratin results, and artisan nail extensions created at Glam Set Go in Naroda.
            </p>
          </div>

          <button
            onClick={onViewAllGallery}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#F07878] hover:text-[#d45b5b] transition-colors"
          >
            <span>Open Full Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter Pills (Functional Buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#483449] text-white shadow-xs'
                  : 'bg-white text-[#766A77] border border-[#F0E8EE] hover:bg-[#F8DCE5]/30 hover:text-[#483449]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxImage(item)}
              className="group relative rounded-2xl overflow-hidden bg-white border border-[#F0E8EE] shadow-2xs hover:shadow-md transition-all cursor-pointer aspect-4/5"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#483449]/80 via-transparent to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-5 flex flex-col justify-end">
                <div className="text-white space-y-1">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#F8DCE5] block">
                    {item.category}
                  </span>
                  <h4 className="text-base font-serif font-bold text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-white/80 line-clamp-2">
                    {item.caption}
                  </p>
                </div>
              </div>

              {/* Top hover indicator */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#483449] opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxImage && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden border border-[#F0E8EE] shadow-2xl animate-scale-up">
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                aria-label="Close image preview"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[70vh] bg-[#FFFDF9] flex items-center justify-center">
                <img
                  src={lightboxImage.imageUrl}
                  alt={lightboxImage.title}
                  className="max-h-[70vh] w-auto object-contain mx-auto"
                />
              </div>

              <div className="p-6 bg-white space-y-2">
                <div className="flex items-center justify-between text-xs text-[#766A77]">
                  <span className="uppercase font-semibold tracking-wider text-[#F07878]">
                    {lightboxImage.category}
                  </span>
                  <span>{lightboxImage.dateAdded}</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-[#483449]">
                  {lightboxImage.title}
                </h3>
                <p className="text-sm text-[#766A77]">
                  {lightboxImage.caption}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
