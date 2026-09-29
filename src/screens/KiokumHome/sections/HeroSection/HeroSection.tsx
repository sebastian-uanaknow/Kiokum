import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";

export const HeroSection = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <section
      className="flex-1 w-full flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 px-4 sm:px-8 py-12 sm:py-16 bg-cover bg-center"
      style={{ backgroundImage: 'url(/main-banner.png)' }}
    >
      <h1 className="w-full max-w-[90%] sm:max-w-[500px] md:max-w-[600px] font-normal text-[#f7ecd8] text-2xl sm:text-3xl md:text-4xl leading-[1.2] [font-family:'Inter_Tight',Helvetica] text-center tracking-[0]">
        Elegir los recuerdos que importan para cuidar la memoria.
      </h1>
      <h2 className="text-[#f7ecd8] text-center text-base sm:text-lg md:text-xl leading-relaxed max-w-[90%] sm:max-w-[500px] md:max-w-[600px] [font-family:'Inter_Tight',Helvetica]">
        Una plataforma para preservar y compartir tu memoria a través de fotos y audios significativos.
      </h2>
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
        <Button
          onClick={() => navigate('/register')}
          className="bg-[#bfe4ff] hover:bg-[#a8d5f0] text-[#31250b] px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg [font-family:'Inter_tight-Bold',Helvetica] font-bold text-[12px] sm:text-[13px] w-full sm:w-auto"
        >
          Empezar mi memoria
        </Button>

        <Button
          onClick={() => navigate('/how-it-works')}
          variant="outline"
          className="bg-[#bfe4ff] hover:bg-[#a8d5f0] text-[#31250b] px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg [font-family:'Inter_tight-Bold',Helvetica] font-bold text-[12px] sm:text-[13px] w-full sm:w-auto"
        >
          Ver cómo funciona
        </Button>
      </div>
    </section>
  );
};
