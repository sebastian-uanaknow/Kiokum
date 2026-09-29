import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";

export const HeaderSection = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-[#f1c1c6] py-4 sm:py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="hover:opacity-80 transition-opacity cursor-pointer"
          aria-label="Ir al inicio"
        >
          <img className="h-8 sm:h-10 md:h-12 w-auto" alt="Kiokum logo" src="/ki_logo_(1).png" />
        </button>

        <nav className="inline-flex items-center gap-2 sm:gap-4">
          <Button
            onClick={() => navigate('/login')}
            variant="ghost"
            className="font-bold text-[#31250b] text-[11px] sm:text-[13px] [font-family:'Inter_Tight',Helvetica] h-auto p-0 hover:bg-transparent"
          >
            Iniciar Sesión
          </Button>

          <Button
            onClick={() => navigate('/register')}
            className="bg-[#bfe4ff] text-[#31250b] font-bold text-[11px] sm:text-[13px] [font-family:'Inter_tight-Bold',Helvetica] px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-[#a8d4ef]"
          >
            Registrarse
          </Button>
        </nav>
      </div>
    </header>
  );
};
