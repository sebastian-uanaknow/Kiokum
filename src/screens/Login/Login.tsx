import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { supabase } from '../../lib/supabase';
import { Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.message.includes('Invalid login credentials')) {
        setError('Credenciales incorrectas. Verifica tu email y contraseña.');
      } else {
        setError(err.message || 'Error al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetSuccess(false);

    if (!resetEmail) {
      setError('Por favor ingresa tu email');
      return;
    }

    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;

      setResetSuccess(true);
      setResetEmail('');
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Error al enviar el correo de recuperación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/kiokum-login.png')`,
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
              <span className="italic font-serif">Bienvenido</span> de vuelta
            </h1>
            <p className="text-sm text-[#6B5D54]">
              Accede a tus recuerdos guardados
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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
              {loading ? 'Accediendo...' : 'Acceder'}
            </Button>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-[#6B5D54] hover:text-[#2C1810] hover:underline"
                disabled={loading}
              >
                ¿Olvidaste tu contraseña?
              </button>
              <p className="text-sm text-[#6B5D54]">
                No tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="font-semibold text-[#2C1810] hover:underline"
                  disabled={loading}
                >
                  Regístrate
                </button>
              </p>
            </div>
          </form>
        </div>

        {showForgotPassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#2C1810] mb-4">
                Recuperar contraseña
              </h2>

              {resetSuccess ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                    Se ha enviado un correo de recuperación a tu email. Revisa tu bandeja de entrada.
                  </div>
                  <Button
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetSuccess(false);
                    }}
                    className="w-full bg-[#A8D5E2] hover:bg-[#8FC3D4] text-[#2C1810]"
                  >
                    Cerrar
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <p className="text-sm text-[#6B5D54]">
                    Ingresa tu email y te enviaremos un enlace para recuperar tu contraseña.
                  </p>

                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    disabled={loading}
                    className="border-[#D4C4B0] rounded-lg"
                  />

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setError('');
                        setResetEmail('');
                      }}
                      disabled={loading}
                      variant="outline"
                      className="flex-1 border-[#D4C4B0]"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading || !resetEmail}
                      className="flex-1 bg-[#A8D5E2] hover:bg-[#8FC3D4] text-[#2C1810]"
                    >
                      {loading ? 'Enviando...' : 'Enviar'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        <div className="mt-8">
          <p className="text-xs text-white text-center drop-shadow-lg">
            2026 Kiokum. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};
