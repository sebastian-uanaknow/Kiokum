import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

const cardsData = [
  {
    image: "/group.png",
    title: "Profesionales de la salud",
    description:
      "Para facilitar la estimulación cognitiva con materiales significativos de cada paciente.",
  },
  {
    image: "/group-1.png",
    title: "Familiares o acompañantes",
    description:
      "Que quieren crear un banco de recuerdos y estimular la memoria de sus seres queridos.",
  },
  {
    image: "/group-2.png",
    title: "Para ti y tu familia",
    description:
      "Guarda tus recuerdos más significativos de forma consciente y compártelos con quienes amas.",
  },
];

export const InfoSection = (): JSX.Element => {
  return (
    <section className="w-full px-4 sm:px-6 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6 sm:gap-8">
        <h2 className="w-full [font-family:'Inter_Tight',Helvetica] font-normal text-[#31250b] text-xl sm:text-2xl md:text-[27px] text-center tracking-[0] leading-tight">
          ¿Para quién es Kiokum?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {cardsData.map((card, index) => (
            <Card
              key={index}
              className="w-full bg-[#31250b] border-none rounded-2xl overflow-hidden flex flex-col"
            >
              <CardContent className="gap-6 sm:gap-8 px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center justify-between flex-1">
                <img
                  className="w-16 sm:w-20 h-auto"
                  alt={card.title}
                  src={card.image}
                />

                <div className="flex flex-col items-start w-full gap-2">
                  <h3 className="w-full [font-family:'Inter_Tight',Helvetica] font-bold text-[#f1c1c6] text-sm sm:text-base text-center tracking-[0] leading-tight">
                    {card.title}
                  </h3>

                  <p className="w-full [font-family:'Inter_Tight',Helvetica] font-normal text-[#f1c1c6] text-sm sm:text-base text-center tracking-[0] leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
