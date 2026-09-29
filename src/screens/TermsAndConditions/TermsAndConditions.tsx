import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";

export const TermsAndConditions = (): JSX.Element => {
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
          Términos y Condiciones
        </h1>

        <div className="[font-family:'Inter_Tight',Helvetica] text-[#31250b] space-y-6 leading-relaxed">
          <section>
            <h2 className="font-bold text-2xl mb-4">1. Introducción</h2>
            <p>
              Bienvenido a Kiokum. Al acceder y utilizar nuestra plataforma, usted acepta cumplir con estos términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestra plataforma.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-2xl mb-4">2. Definiciones</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>"Plataforma"</strong>: Se refiere a Kiokum y todos sus servicios asociados.</li>
              <li><strong>"Usuario"</strong>: Cualquier persona que acceda o utilice la plataforma.</li>
              <li><strong>"Contenido"</strong>: Incluye fotos, videos, audios, textos y cualquier otro material cargado por los usuarios.</li>
              <li><strong>"Servicios"</strong>: Todas las funcionalidades ofrecidas por Kiokum.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-2xl mb-4">3. Uso de la Plataforma</h2>
            <p className="mb-2">Al utilizar Kiokum, usted se compromete a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Proporcionar información veraz y actualizada durante el registro.</li>
              <li>Mantener la confidencialidad de su cuenta y contraseña.</li>
              <li>No utilizar la plataforma para fines ilegales o no autorizados.</li>
              <li>Respetar los derechos de propiedad intelectual de terceros.</li>
              <li>No cargar contenido ofensivo, difamatorio o que viole los derechos de otros.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-2xl mb-4">4. Propiedad del Contenido</h2>
            <p>
              Usted retiene todos los derechos sobre el contenido que carga en la plataforma. Al cargar contenido, nos otorga una licencia mundial, no exclusiva y libre de regalías para almacenar, mostrar y procesar dicho contenido con el fin de proporcionar nuestros servicios.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-2xl mb-4">5. Privacidad y Protección de Carpetas</h2>
            <p>
              Kiokum ofrece funcionalidades para crear carpetas privadas y compartidas. Las carpetas privadas solo son accesibles para usted. Las carpetas compartidas son accesibles para los usuarios con los que usted decida compartirlas. Es su responsabilidad gestionar adecuadamente los permisos de acceso.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-2xl mb-4">6. Responsabilidades del Usuario</h2>
            <p className="mb-2">Usted es responsable de:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>El contenido que carga y comparte en la plataforma.</li>
              <li>Cualquier actividad que ocurra bajo su cuenta.</li>
              <li>Cumplir con todas las leyes y regulaciones aplicables.</li>
              <li>Realizar copias de seguridad de su contenido importante.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-2xl mb-4">7. Limitación de Responsabilidad</h2>
            <p>
              Kiokum no será responsable por daños indirectos, incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de usar la plataforma. Proporcionamos la plataforma "tal cual" sin garantías de ningún tipo.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-2xl mb-4">8. Modificaciones del Servicio</h2>
            <p>
              Nos reservamos el derecho de modificar, suspender o descontinuar cualquier aspecto de la plataforma en cualquier momento, con o sin previo aviso. No seremos responsables ante usted ni ante terceros por cualquier modificación, suspensión o interrupción de los servicios.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-2xl mb-4">9. Terminación de Cuenta</h2>
            <p>
              Podemos suspender o terminar su cuenta si consideramos que ha violado estos términos y condiciones. Usted puede eliminar su cuenta en cualquier momento desde la configuración de su perfil. La eliminación de su cuenta resultará en la eliminación permanente de su contenido.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-2xl mb-4">10. Propiedad Intelectual</h2>
            <p>
              Todos los derechos de propiedad intelectual relacionados con la plataforma, incluyendo el diseño, código, logotipos y marcas comerciales, son propiedad de Kiokum o de nuestros licenciantes. No se le otorga ningún derecho sobre estos elementos más allá del uso de la plataforma según estos términos.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-2xl mb-4">11. Indemnización</h2>
            <p>
              Usted acepta indemnizar y mantener indemne a Kiokum, sus directores, empleados y afiliados de cualquier reclamo, pérdida, responsabilidad, daño o gasto (incluyendo honorarios legales) que surjan de su uso de la plataforma o violación de estos términos.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-2xl mb-4">12. Ley Aplicable</h2>
            <p>
              Estos términos se rigen por las leyes aplicables en la jurisdicción donde opera Kiokum. Cualquier disputa relacionada con estos términos será resuelta en los tribunales competentes de dicha jurisdicción.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-2xl mb-4">13. Cambios a los Términos</h2>
            <p>
              Podemos actualizar estos términos y condiciones periódicamente. Le notificaremos sobre cambios significativos publicando los nuevos términos en nuestra plataforma. Su uso continuado de la plataforma después de dichos cambios constituye su aceptación de los nuevos términos.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-2xl mb-4">14. Contacto</h2>
            <p>
              Si tiene preguntas o inquietudes sobre estos términos y condiciones, contáctenos a través de nuestro correo electrónico de soporte.
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
