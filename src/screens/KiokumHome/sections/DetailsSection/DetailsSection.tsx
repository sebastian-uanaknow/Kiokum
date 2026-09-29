import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Separator } from "../../../../components/ui/separator";

const detailsData = [
  {
    image: "/elegir_contenido.png",
    title: "Sube tus recuerdos",
    description:
      "Guarda fotos, videos, audios y escritos. Organizalos como quieras.",
  },
  {
    image: "/carpetas_privadas.png",
    title: "Controla quién ve qué",
    description:
      "Crea carpetas privadas con clave para compartir solo con personas específicas.",
  },
  {
    image: "/bloque_3.png",
    title: "Suma colaboradores de confianza",
    description:
      "Autoriza a familiares para que complementen tu memoria o actualicen contenido.",
  },
];

export const DetailsSection = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <section className="w-full px-4 sm:px-6 py-2">
      <div className="max-w-7xl mx-auto bg-[#31250b] rounded-[20px] sm:rounded-[32px] overflow-hidden flex flex-col items-center gap-8 sm:gap-12 px-4 sm:px-8 md:px-16 py-12 sm:py-16">
        <h2 className="w-full [font-family:'Inter_Tight',Helvetica] font-normal text-[#f1c1c6] text-xl sm:text-2xl md:text-[27px] text-center tracking-[0] leading-tight">
          ¿Cómo funciona Kiokum?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {detailsData.map((item, index) => (
            <Card
              key={index}
              className="w-full bg-[#F5CCCB] border-0 rounded-2xl overflow-hidden"
            >
              <CardContent className="gap-4 px-4 sm:px-6 py-4 flex flex-col items-center justify-center">
                <img
                  className="h-[120px] sm:h-[145px] w-auto object-contain"
                  alt={item.title}
                  src={item.image}
                />

                <Separator className="w-full bg-[#31250b] h-px" />

                <div className="flex flex-col items-start w-full gap-1">
                  <h3 className="w-full [font-family:'Inter_Tight',Helvetica] font-bold text-[#31250b] text-sm sm:text-base text-center tracking-[0] leading-tight">
                    {item.title}
                  </h3>

                  <p className="w-full [font-family:'Inter_Tight',Helvetica] font-normal text-[#31250b] text-sm sm:text-base text-center tracking-[0] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          onClick={() => navigate('/register')}
          className="bg-[#f1c1c6] hover:bg-[#f1c1c6]/90 text-[#31250b] px-4 sm:px-6 py-2 sm:py-3 rounded-lg [font-family:'Inter_tight-Bold',Helvetica] font-bold text-[12px] sm:text-[13px]"
        >
          Empezar ahora
        </Button>
      </div>
    </section>
  );
};
