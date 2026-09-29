import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { HeaderSection } from "../KiokumHome/sections/HeaderSection";

export const HowItWorks = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full relative min-h-screen bg-[#f1c1c6]">
      {/* Header */}
      <HeaderSection />

      {/* Title Section - Dark Background */}
      <section className="flex flex-col items-center justify-center gap-6 sm:gap-8 px-4 sm:px-8 md:px-16 lg:px-[140px] py-12 sm:py-16 w-full bg-[#31250b] rounded-2xl sm:rounded-3xl">
        <div className="flex flex-col items-center gap-6 sm:gap-8 w-full max-w-[1232px]">
          <h1 className="[font-family:'Inter_Tight',Helvetica] font-normal text-transparent text-2xl sm:text-3xl md:text-4xl text-center tracking-[0] leading-tight">
            <span className="text-[#f1c1c6]">¿Cómo funciona </span>
            <span className="[font-family:'Luxurious_Script',Helvetica] text-[#f1c1c6] text-4xl sm:text-5xl md:text-6xl">
              Kiokum
            </span>
            <span className="text-[#f1c1c6]">?</span>
          </h1>

          <p className="[font-family:'Inter_Tight',Helvetica] font-normal text-[#f1c1c6] text-base sm:text-lg md:text-xl text-center tracking-[0] leading-relaxed max-w-[90%] sm:max-w-[800px]">
            Kiokum te acompaña en el proceso de crear y preservar tus recuerdos más significativos.
            Es simple, intuitivo y pensado para que cualquier persona pueda usarlo.
          </p>
        </div>
      </section>

      {/* Main Content - Light Background */}
      <section className="flex flex-col items-center justify-center gap-8 sm:gap-12 px-4 sm:px-8 md:px-16 lg:px-[140px] py-12 sm:py-16 w-full bg-[#f1c1c6]">
        {/* Steps */}
        <div className="flex flex-col gap-8 sm:gap-12 md:gap-16 w-full max-w-[1000px] mt-4 sm:mt-8">
          {/* Step 1 */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#31250b] flex items-center justify-center flex-shrink-0">
                <span className="[font-family:'Inter_Tight',Helvetica] font-bold text-[#f1c1c6] text-lg sm:text-xl">1</span>
              </div>
              <h2 className="[font-family:'Inter_Tight',Helvetica] font-bold text-[#31250b] text-lg sm:text-xl md:text-2xl tracking-[0] leading-tight">
                Crea tu cuenta
              </h2>
            </div>
            <p className="[font-family:'Inter_Tight',Helvetica] font-normal text-[#31250b] text-base sm:text-lg tracking-[0] leading-relaxed ml-0 sm:ml-16">
              Registrarte es el primer paso. Solo necesitas tu correo electrónico y crear una contraseña.
              Así de simple. En segundos ya estás listo para comenzar a construir tu memoria.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#31250b] flex items-center justify-center flex-shrink-0">
                <span className="[font-family:'Inter_Tight',Helvetica] font-bold text-[#f1c1c6] text-lg sm:text-xl">2</span>
              </div>
              <h2 className="[font-family:'Inter_Tight',Helvetica] font-bold text-[#31250b] text-lg sm:text-xl md:text-2xl tracking-[0] leading-tight">
                Organiza tus recuerdos en carpetas
              </h2>
            </div>
            <p className="[font-family:'Inter_Tight',Helvetica] font-normal text-[#31250b] text-base sm:text-lg tracking-[0] leading-relaxed ml-0 sm:ml-16">
              Puedes crear carpetas temáticas para organizar tus memorias: vacaciones familiares, momentos especiales,
              personas queridas, lugares significativos. Tú decides cómo estructurar tu historia.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#31250b] flex items-center justify-center flex-shrink-0">
                <span className="[font-family:'Inter_Tight',Helvetica] font-bold text-[#f1c1c6] text-lg sm:text-xl">3</span>
              </div>
              <h2 className="[font-family:'Inter_Tight',Helvetica] font-bold text-[#31250b] text-lg sm:text-xl md:text-2xl tracking-[0] leading-tight">
                Sube tus fotos y audios
              </h2>
            </div>
            <p className="[font-family:'Inter_Tight',Helvetica] font-normal text-[#31250b] text-base sm:text-lg tracking-[0] leading-relaxed ml-0 sm:ml-16">
              Cada memoria puede tener varias imágenes que captures ese momento. Además, puedes agregar una
              descripción en audio para darle contexto y emoción. Tu voz contando la historia hace que el recuerdo
              sea aún más poderoso.
            </p>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#31250b] flex items-center justify-center flex-shrink-0">
                <span className="[font-family:'Inter_Tight',Helvetica] font-bold text-[#f1c1c6] text-lg sm:text-xl">4</span>
              </div>
              <h2 className="[font-family:'Inter_Tight',Helvetica] font-bold text-[#31250b] text-lg sm:text-xl md:text-2xl tracking-[0] leading-tight">
                Comparte con quienes amas
              </h2>
            </div>
            <p className="[font-family:'Inter_Tight',Helvetica] font-normal text-[#31250b] text-base sm:text-lg tracking-[0] leading-relaxed ml-0 sm:ml-16">
              Invita a familiares, cuidadores o amigos para que puedan ver y compartir estas memorias contigo.
              Puedes decidir qué carpetas son privadas y cuáles quieres compartir. El control siempre es tuyo.
            </p>
          </div>

          {/* Step 5 */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#31250b] flex items-center justify-center flex-shrink-0">
                <span className="[font-family:'Inter_Tight',Helvetica] font-bold text-[#f1c1c6] text-lg sm:text-xl">5</span>
              </div>
              <h2 className="[font-family:'Inter_Tight',Helvetica] font-bold text-[#31250b] text-lg sm:text-xl md:text-2xl tracking-[0] leading-tight">
                Revive tus momentos cuando quieras
              </h2>
            </div>
            <p className="[font-family:'Inter_Tight',Helvetica] font-normal text-[#31250b] text-base sm:text-lg tracking-[0] leading-relaxed ml-0 sm:ml-16">
              Accede a tu colección de recuerdos en cualquier momento, desde cualquier dispositivo.
              Ver esas imágenes y escuchar esas historias ayuda a mantener viva tu memoria y tu identidad.
            </p>
          </div>
        </div>

        {/* Closing section */}
        <div className="flex flex-col items-center gap-6 sm:gap-8 w-full max-w-[90%] sm:max-w-[800px] mt-8 sm:mt-12">
          <p className="[font-family:'Inter_Tight',Helvetica] font-normal text-[#31250b] text-base sm:text-lg md:text-xl text-center tracking-[0] leading-relaxed px-4">
            <span className="font-normal">Kiokum es más que un álbum digital. Es una </span>
            <span className="[font-family:'Luxurious_Script',Helvetica] text-2xl sm:text-3xl">herramienta</span>
            <span className="font-normal"> de </span>
            <span className="[font-family:'Luxurious_Script',Helvetica] text-2xl sm:text-3xl">acompañamiento</span>
            <span className="font-normal"> que te ayuda a elegir qué memorias conservar y cómo compartirlas con quienes más importan.</span>
          </p>

          <Button
            onClick={() => navigate('/register')}
            className="bg-[#bfe4ff] hover:bg-[#a8d5f0] text-[#31250b] [font-family:'Inter_tight-Bold',Helvetica] font-bold text-[12px] sm:text-[13px] px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg"
          >
            Comenzar ahora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <section className="flex flex-col items-center justify-center gap-8 sm:gap-12 pt-12 sm:pt-16 md:pt-[88px] pb-8 sm:pb-10 px-4 w-full bg-[#31250b]">
        <Separator className="w-full max-w-[90%] sm:max-w-[1232px] bg-[#f1c1c6] h-px" />

        <footer className="flex flex-col justify-center gap-6 sm:gap-8 px-4 sm:px-8 md:px-[140px] py-0 bg-[#31250b] items-center w-full">
          <img
            className="w-[120px] sm:w-[150px] h-auto"
            alt="Full logo"
            src="/full_logo_(1).png"
          />

          <div className="flex flex-col gap-1 items-start w-full">
            <p className="w-full font-bold text-[#f1c1c6] text-sm sm:text-base leading-tight [font-family:'Inter_Tight',Helvetica] text-center tracking-[0]">
              Elegir nuestros
            </p>

            <p className="w-full [font-family:'Inter_Tight',Helvetica] font-normal text-[#f1c1c6] text-xs sm:text-[13px] text-center tracking-[0] leading-relaxed">
              2026 Kiokum. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </section>
    </div>
  );
};
