/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SalonProvider, useSalon } from './context/SalonContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { TrustAndAbout } from './components/home/TrustAndAbout';
import { ServiceDiscovery } from './components/home/ServiceDiscovery';
import { FeaturedServices } from './components/home/FeaturedServices';
import { CurrentOffers } from './components/home/CurrentOffers';
import { GalleryPreview } from './components/home/GalleryPreview';
import { ServicesCatalogue } from './components/services/ServicesCatalogue';
import { OffersPage } from './components/offers/OffersPage';
import { GalleryPage } from './components/gallery/GalleryPage';
import { CoursesPage } from './components/courses/CoursesPage';
import { ContactPage } from './components/contact/ContactPage';
import { BookingModal } from './components/booking/BookingModal';
import { BookingLookupModal } from './components/booking/BookingLookupModal';
import { CourseEnquiryModal } from './components/courses/CourseEnquiryModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { MessageCircle, Calendar } from 'lucide-react';

function SalonMain() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<string>('all');
  const { openBookingModal, settings } = useSalon();

  const handleSelectCategoryFromHome = (category: string) => {
    if (category === 'courses') {
      setCurrentTab('courses');
    } else {
      setServiceCategoryFilter(category);
      setCurrentTab('services');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9] text-[#483449]">
      {/* Top Navigation */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        openAdmin={() => setIsAdminOpen(true)} 
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <>
            <HeroSection 
              onExploreServices={() => {
                setServiceCategoryFilter('all');
                setCurrentTab('services');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
            />
            <TrustAndAbout />
            <ServiceDiscovery onSelectCategory={handleSelectCategoryFromHome} />
            <FeaturedServices 
              onViewAllServices={() => {
                setServiceCategoryFilter('all');
                setCurrentTab('services');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
            />
            <CurrentOffers 
              onExploreAllOffers={() => {
                setCurrentTab('offers');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
            />
            <GalleryPreview 
              onViewAllGallery={() => {
                setCurrentTab('gallery');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
            />
          </>
        )}

        {currentTab === 'services' && (
          <ServicesCatalogue initialCategory={serviceCategoryFilter} />
        )}

        {currentTab === 'offers' && (
          <OffersPage />
        )}

        {currentTab === 'gallery' && (
          <GalleryPage />
        )}

        {currentTab === 'courses' && (
          <CoursesPage />
        )}

        {currentTab === 'contact' && (
          <ContactPage />
        )}
      </main>

      {/* Footer with Business Transparency & Admin Portal Link */}
      <Footer 
        setCurrentTab={setCurrentTab} 
        openAdmin={() => setIsAdminOpen(true)} 
      />

      {/* Persistent Floating Quick Contact Widget for Mobile */}
      <aside aria-label="Quick contact actions" className="fixed bottom-4 right-4 z-30 flex items-center gap-2">
        <a
          href={`https://wa.me/${settings.whatsAppNumber}?text=${encodeURIComponent('Hello Glam Set Go! I would like to enquire about appointment availability.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
          aria-label="Direct WhatsApp Message"
        >
          <MessageCircle className="w-6 h-6" />
        </a>

        <button
          onClick={() => openBookingModal()}
          className="sm:hidden flex items-center gap-1.5 px-4 py-3 bg-[#F07878] text-white rounded-full text-xs font-bold shadow-lg hover:bg-[#e06565] transition-transform active:scale-95"
        >
          <Calendar className="w-4 h-4" />
          <span>Book (Pay at Salon)</span>
        </button>
      </aside>

      {/* Modals */}
      <BookingModal />
      <BookingLookupModal />
      <CourseEnquiryModal />

      {/* Protected Admin Console */}
      {isAdminOpen && (
        <AdminDashboard onClose={() => setIsAdminOpen(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <SalonProvider>
      <SalonMain />
    </SalonProvider>
  );
}
