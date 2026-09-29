import React from "react";
import { CallToActionSection } from "./sections/CallToActionSection";
import { DetailsSection } from "./sections/DetailsSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { HeaderSection } from "./sections/HeaderSection";
import { HeroSection } from "./sections/HeroSection";
import { InfoSection } from "./sections/InfoSection";
import { MessageCircle } from 'lucide-react';

export const KiokumHome = (): JSX.Element => {
  const whatsappMessage = "Hola, me gustaría obtener más información sobre Kiokum";
  const whatsappUrl = `https://wa.me/5491130067591?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="flex flex-col w-full relative bg-[#f1c1c6] overflow-x-hidden">
      <div className="flex flex-col min-h-svh">
        <HeaderSection />
        <HeroSection />
      </div>
      <FeaturesSection />
      <DetailsSection />
      <InfoSection />
      <CallToActionSection />

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-[#31250B] hover:bg-[#221a08] text-white rounded-full p-3 sm:p-4 shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={24} className="sm:w-7 sm:h-7" />
      </a>
    </div>
  );
};
