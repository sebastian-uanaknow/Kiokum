import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";

export const PrivacyPolicy = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[#f7ecd8]">
      <header className="flex items-center justify-between px-[140px] py-6 w-full bg-[#f7ecd8]">
        <button
          onClick={() => navigate('/')}
          className="hover:opacity-80 transition-opacity cursor-pointer"
          aria-label="Ir al inicio"
        >
          <img className="h-12 w-auto" alt="Kiokum logo" src="/ki_logo_(1).png" />
        </button>

        <nav className="inline-flex items-center gap-4">
          <Button
            onClick={() => navigate('/login')}
            variant="ghost"
            className="font-bold text-[#31250b] text-[13px] [font-family:'Inter_Tight',Helvetica] h-auto p-0 hover:bg-transparent"
          >
            Iniciar Sesión
          </Button>

          <Button
            onClick={() => navigate('/register')}
            className="bg-[#bfe4ff] text-[#31250b] font-bold text-[13px] [font-family:'Inter_tight-Bold',Helvetica] px-4 py-2 rounded-lg hover:bg-[#a8d4ef]"
          >
            Registrarse
          </Button>
        </nav>
      </header>

      <main className="flex-1 max-w-[900px] w-full mx-auto px-8 py-12">
        <h1 className="[font-family:'Inter_Tight',Helvetica] font-bold text-[#31250b] text-4xl mb-8">
          Política de Privacidad
        </h1>

        <div className="[font-family:'Inter_Tight',Helvetica] text-[#31250b] space-y-6 leading-relaxed">
          <section>
            <h2 className="font-bold text-2xl mb-4">1. Introducción</h2>
            <p>
              En Kiokum, estamos comprometidos con la protección de la privacidad de nuestros usuarios. Esta política describe cómo recopilamos, usamos y protegemos la información personal que usted proporciona al utilizar nuestra plataforma.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-2xl mb-4">2. Información que Recopilamos</h2>
            <p className="mb-2">Recopilamos la siguiente información:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Información de registro: nombre, correo electrónico, contraseña.</li>
              <li>Contenido que usted carga: fotos, videos, audios y descripciones de recuerdos.</li>
              <li>Información de uso: cómo interactúa con nuestra plataforma.</li>
              <li>Datos técnicos: dirección IP, tipo de navegador, sistema operativo.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-2xl mb-4">3. Uso de la Información</h2>
            <p className="mb-2">Utilizamos su información para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Proporcionar y mantener nuestros servicios.</li>
              <li>Personalizar su experiencia en la plataforma.</li>
              <li>Comunicarnos con usted sobre actualizaciones y novedades.</li>
              <li>Mejorar la seguridad y funcionalidad de nuestra plataforma.</li>
              <li>Cumplir con obligaciones legales.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-2xl mb-4">4. Compartir Información</h2>
            <p>
              No vendemos ni compartimos su información personal con terceros, excepto cuando sea necesario para proporcionar nuestros servicios (por ejemplo, proveedores de almacenamiento en la nube) o cuando la ley lo requiera.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-2xl mb-4">5. Seguridad de los Datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal contra el acceso no autorizado, la divulgación, alteración o destrucción. Sin embargo, ningún sistema de transmisión por Internet es completamente seguro.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-2xl mb-4">6. Derechos del Usuario</h2>
            <p className="mb-2">Usted tiene derecho a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Acceder a su información personal.</li>
              <li>Corregir información inexacta o incompleta.</li>
              <li>Solicitar la eliminación de su información.</li>
              <li>Oponerse al procesamiento de su información.</li>
              <li>Solicitar la portabilidad de sus datos.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-2xl mb-4">7. Retención de Datos</h2>
            <p>
              Conservamos su información personal solo durante el tiempo necesario para cumplir con los propósitos descritos en esta política, a menos que la ley requiera un período de retención más largo.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-2xl mb-4">8. Cookies y Tecnologías Similares</h2>
            <p>
              Utilizamos cookies y tecnologías similares para mejorar su experiencia, analizar el uso de nuestra plataforma y personalizar el contenido. Puede configurar su navegador para rechazar las cookies, aunque esto puede afectar la funcionalidad de nuestra plataforma.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-2xl mb-4">9. Cambios a esta Política</h2>
            <p>
              Podemos actualizar esta política de privacidad periódicamente. Le notificaremos sobre cambios significativos publicando la nueva política en nuestra plataforma y actualizando la fecha de "última actualización".
            </p>
          </section>

          <section>
            <h2 className="font-bold text-2xl mb-4">10. Contacto</h2>
            <p>
              Si tiene preguntas o inquietudes sobre esta política de privacidad, contáctenos a través de nuestro correo electrónico de soporte.
            </p>
          </section>

          <p className="text-sm text-[#31250b]/70 mt-8">
            Última actualización: Febrero 2026
          </p>
        </div>
      </main>

      <footer className="w-full bg-[#31250b] py-8 px-8 mt-12">
        <div className="max-w-[900px] mx-auto flex flex-col items-center gap-4">
          <img
            className="w-[120px] h-[80px]"
            alt="Full logo"
            src="/full_logo_(1).png"
          />
          <p className="[font-family:'Inter_Tight',Helvetica] font-normal text-[#f1c1c6] text-[13px] text-center">
            2026 Kiokum. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};
