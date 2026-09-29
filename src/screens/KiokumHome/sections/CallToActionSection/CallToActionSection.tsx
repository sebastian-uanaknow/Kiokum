import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { Separator } from "../../../../components/ui/separator";

export const CallToActionSection = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-[#31250b] px-4 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-10 flex flex-col items-center gap-8 sm:gap-12">
      <div className="max-w-7xl mx-auto w-full">
        <div
          className="w-full flex flex-col items-center justify-center gap-6 sm:gap-8 px-4 sm:px-8 py-12 sm:py-16 md:py-24 rounded-[20px] sm:rounded-[30px] md:rounded-[40px] overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: 'url(/main-banner-1.png)' }}
        >
          <div className="w-full max-w-[90%] sm:max-w-[700px] flex flex-col items-center gap-3 sm:gap-4">
            <p className="[font-family:'Inter_Tight',Helvetica] font-normal text-[#f7ecd8] text-base sm:text-lg md:text-xl text-center tracking-[0] leading-relaxed">
              "La identidad se sostiene en la medida en que podemos recordar nuestra propia historia."
            </p>
            <p className="[font-family:'Inter_Tight',Helvetica] font-normal text-[#f7ecd8] text-sm sm:text-base text-center tracking-[0] leading-relaxed italic">
              — John Locke, filósofo.
            </p>
          </div>

          <Button
            onClick={() => navigate('/register')}
            className="bg-[#bfe4ff] hover:bg-[#a8d5f0] text-[#31250b] [font-family:'Inter_tight-Bold',Helvetica] font-bold text-[12px] sm:text-[13px] px-4 sm:px-6 py-2 sm:py-3 rounded-lg"
          >
            Empezar ahora
          </Button>
        </div>
      </div>

      <Separator className="w-full max-w-7xl bg-[#f1c1c6] h-px" />

      <footer className="max-w-7xl w-full mx-auto flex flex-col items-center gap-6 sm:gap-8 px-4">
        <img
          className="w-[120px] sm:w-[150px] h-auto"
          alt="Full logo"
          src="/full_logo_(1).png"
        />

        <div className="flex flex-col gap-4 items-center w-full">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-center justify-center">
            <button
              onClick={() => navigate('/privacy-policy')}
              className="[font-family:'Inter_Tight',Helvetica] font-normal text-[#f1c1c6] text-xs sm:text-[13px] underline hover:text-[#bfe4ff] transition-colors"
            >
              Políticas de Privacidad
            </button>
            <button
              onClick={() => navigate('/terms-and-conditions')}
              className="[font-family:'Inter_Tight',Helvetica] font-normal text-[#f1c1c6] text-xs sm:text-[13px] underline hover:text-[#bfe4ff] transition-colors"
            >
              Términos y Condiciones
            </button>
          </div>

          <p className="w-full [font-family:'Inter_Tight',Helvetica] font-normal text-[#f1c1c6] text-xs sm:text-[13px] text-center tracking-[0] leading-relaxed">
            2026 Kiokum. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </section>
  );
};
