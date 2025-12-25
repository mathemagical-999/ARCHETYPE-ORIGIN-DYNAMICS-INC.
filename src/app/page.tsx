'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useLenis } from '@/hooks/useLenis';
import { useAppStore } from '@/store/useAppStore';
import HeroSection from '@/components/sections/HeroSection';
import ProductShowcase from '@/components/sections/ProductShowcase';
import ProjectGrid from '@/components/sections/ProjectGrid';
import Footer from '@/components/sections/Footer';
import Navigation from '@/components/ui/Navigation';
import ContactModal from '@/components/ui/ContactModal';
import AboutModal from '@/components/ui/AboutModal';

// Dynamically import the Terminal Boot to avoid SSR issues
const TerminalBoot = dynamic(() => import('@/components/ui/TerminalBoot'), {
  ssr: false,
});

export default function Home() {
  // Initialize smooth scrolling
  useLenis();

  const { isBooted } = useAppStore();

  // Modal states
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  // Prevent scroll when terminal is loading
  useEffect(() => {
    if (!isBooted) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isBooted]);

  return (
    <main className="relative min-h-screen bg-void">
      {/* Terminal Boot Pre-loader */}
      <TerminalBoot />

      {/* Navigation - Hidden until booted */}
      {isBooted && (
        <Navigation
          onContactClick={() => setIsContactModalOpen(true)}
          onAboutClick={() => setIsAboutModalOpen(true)}
        />
      )}

      {/* Main Content */}
      <div className={`transition-opacity duration-500 ${isBooted ? 'opacity-100' : 'opacity-0'}`}>
        {/* Hero Section with Black Hole */}
        <HeroSection />

        {/* Product Showcase - The Alchemist */}
        <ProductShowcase />

        {/* Skunkworks - R&D Pipeline */}
        <ProjectGrid />

        {/* Footer */}
        <Footer
          onContactClick={() => setIsContactModalOpen(true)}
          onAboutClick={() => setIsAboutModalOpen(true)}
        />
      </div>

      {/* Global Modals */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </main>
  );
}
