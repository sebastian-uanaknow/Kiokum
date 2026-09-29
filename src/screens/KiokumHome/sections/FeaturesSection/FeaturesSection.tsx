import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

const featureCards = [
  {
    image: "/img-6215-1.png",
    title: "✓ Gratis para empezar",
  },
  {
    image: "/icono-elegir.png",
    title: "✓ Tus recuerdos son privados y seguros",
  },
  {
    image: "/feeding-pigeons-1.png",
    title: "✓ Cancela cuando quieras",
  },
];

export const FeaturesSection = (): JSX.Element => {
  return (
    <section className="w-full px-4 sm:px-6 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6 sm:gap-8">
        <h2 className="w-full [font-family:'Inter_Tight',Helvetica] font-normal text-[#31250b] text-xl sm:text-2xl md:text-[27px] text-center tracking-[0] leading-tight">
          Nos sacamos miles de fotos, pero ¿cuáles realmente importan?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {featureCards.map((card, index) => (
            <Card
              key={index}
              className="w-full gap-4 p-4 bg-[#31250b] flex flex-col items-center justify-center rounded-2xl overflow-hidden border-0"
            >
              <CardContent className="p-0 flex flex-col items-center gap-4 w-full">
                <div className="w-full h-[180px] sm:h-[200px] rounded-2xl overflow-hidden bg-white flex items-center justify-center">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.png';
                    }}
                  />
                </div>
                <div className="flex flex-col items-start w-full">
                  <h3 className="w-full [font-family:'Inter_Tight',Helvetica] font-bold text-[#f1c1c6] text-sm sm:text-base text-center tracking-[0] leading-tight">
                    {card.title}
                  </h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 w-full max-w-4xl">
          <p className="w-full [font-family:'Inter_Tight',Helvetica] font-normal text-[#31250b] text-sm sm:text-base text-center tracking-[0] leading-relaxed">
            Kiokum permite crear y acceder de manera sencilla a un álbum de imágenes seleccionadas por la propia persona (o su entorno), con impacto emocional y vinculadas a experiencias personales significativas para evocarlas siempre que se desee.
          </p>

          <p className="w-full [font-family:'Inter_Tight',Helvetica] font-normal text-[#31250b] text-sm sm:text-base text-center tracking-[0] leading-relaxed">
            Porque la memoria es una necesidad y un privilegio.
          </p>
        </div>
      </div>
    </section>
  );
};
