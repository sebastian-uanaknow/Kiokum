import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { supabase } from '../../lib/supabase';
import { User, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!fullName || !email || !password || !contactName || !contactEmail) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        const { error: contactError } = await supabase
          .from('emergency_contacts')
          .insert([
            {
              user_id: authData.user.id,
              contact_name: contactName,
              contact_email: contactEmail,
            },
          ]);

        if (contactError) throw contactError;

        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/main-banner.png')`,
          filter: 'blur(8px)',
          transform: 'scale(1.1)',
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <button
          onClick={() => navigate('/')}
          className="mb-6 sm:mb-8 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
          aria-label="Volver al inicio"
        >
          <img src="/ki_logo_(1).png" alt="Kiokum" className="w-8 h-8 sm:w-10 sm:h-10" />
        </button>

        <div className="w-full max-w-md bg-[#F5EFE7] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-normal text-[#2C1810] mb-2">
              Crea tu <span className="italic font-serif">memoria</span>
            </h1>
            <p className="text-sm text-[#6B5D54]">
              Comienza a curar tus recuerdos más preciados
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#2C1810] mb-2">
                Nombre completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9B8B7E]" />
                <Input
                  type="text"
                  placeholder="Nombre completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10 bg-white border-[#D4C4B0] rounded-full h-12 text-[#2C1810] placeholder:text-[#B8A89A]"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C1810] mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9B8B7E]" />
                <Input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white border-[#D4C4B0] rounded-full h-12 text-[#2C1810] placeholder:text-[#B8A89A]"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C1810] mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9B8B7E]" />
                <Input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white border-[#D4C4B0] rounded-full h-12 text-[#2C1810] placeholder:text-[#B8A89A]"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C1810] mb-2">
                Repetir tu contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9B8B7E]" />
                <Input
                  type="password"
                  placeholder="Repetir tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-white border-[#D4C4B0] rounded-full h-12 text-[#2C1810] placeholder:text-[#B8A89A]"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="bg-[#F4D4D4] rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4">
              <h3 className="text-base font-medium text-[#2C1810]">
                Contacto responsable
              </h3>

              <div>
                <label className="block text-sm font-medium text-[#2C1810] mb-2">
                  Nombre contacto
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#C89B9B]" />
                  <Input
                    type="text"
                    placeholder="Nombre contacto"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="pl-10 bg-[#FCEAEA] border-[#E8B8B8] rounded-full h-12 text-[#2C1810] placeholder:text-[#D4A8A8]"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C1810] mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#C89B9B]" />
                  <Input
                    type="email"
                    placeholder="E-mail"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="pl-10 bg-[#FCEAEA] border-[#E8B8B8] rounded-full h-12 text-[#2C1810] placeholder:text-[#D4A8A8]"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#A8D5E2] hover:bg-[#8FC3D4] text-[#2C1810] font-medium rounded-full h-11 sm:h-12 text-sm sm:text-base transition-colors shadow-md"
            >
              {loading ? 'Creando cuenta...' : 'Crear mi memoria'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-[#6B5D54]">
                Ya tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="font-semibold text-[#2C1810] hover:underline"
                  disabled={loading}
                >
                  Inicia Sesion
                </button>
              </p>
            </div>
          </form>
        </div>

        <div className="mt-8">
          <p className="text-xs text-white text-center drop-shadow-lg">
            2026 Kiokum. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};
