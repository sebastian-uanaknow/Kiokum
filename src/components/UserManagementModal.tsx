import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { supabase } from '../lib/supabase';
import { X, UserPlus, Trash2, Mail } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface SharedUser {
  id: string;
  shared_with_email: string;
  access_role: 'owner' | 'editor' | 'viewer';
  created_at: string;
}

type AccessRole = 'owner' | 'editor' | 'viewer';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<AccessRole>('viewer');
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSharedUsers();
    }
  }, [isOpen]);

  const loadSharedUsers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('shared_access')
        .select('*')
        .eq('memory_owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSharedUsers(data || []);
    } catch (err: any) {
      console.error('Error loading shared users:', err);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Por favor ingresa un email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No estás autenticado');

      if (email.toLowerCase() === user.email?.toLowerCase()) {
        setError('No puedes agregarte a ti mismo');
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase
        .from('shared_access')
        .insert([
          {
            memory_owner_id: user.id,
            shared_with_email: email.toLowerCase().trim(),
            access_role: selectedRole,
            shared_by_id: user.id,
          },
        ]);

      if (insertError) {
        if (insertError.code === '23505') {
          setError('Este usuario ya tiene acceso');
        } else {
          throw insertError;
        }
      } else {
        await sendInvitationEmail(email.toLowerCase().trim(), selectedRole);
        setEmail('');
        setSelectedRole('viewer');
        await loadSharedUsers();
        setSuccess(`Invitación enviada a ${email}`);
      }
    } catch (err: any) {
      console.error('Error adding user:', err);
      setError(err.message || 'Error al agregar usuario');
    } finally {
      setLoading(false);
    }
  };

  const sendInvitationEmail = async (recipientEmail: string, role: AccessRole) => {
    try {
      setSendingEmail(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('No hay usuario autenticado');
      }

      const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        console.warn('EmailJS no está configurado. Los permisos se crearon correctamente pero el email no se enviará.');
        return;
      }

      const roleNames = {
        owner: 'Propietario',
        editor: 'Editor',
        viewer: 'Visualizador'
      };

      const roleDescriptions = {
        owner: 'Tendrás control total sobre los recuerdos: podrás visualizar, editar, eliminar y gestionar usuarios.',
        editor: 'Podrás visualizar y editar los recuerdos compartidos contigo.',
        viewer: 'Podrás visualizar los recuerdos compartidos contigo.'
      };

      const roleIcons = {
        owner: '👑',
        editor: '✏️',
        viewer: '👁️'
      };

      const appUrl = window.location.origin;
      const loginUrl = `${appUrl}/login`;

      const templateParams = {
        to_email: recipientEmail,
        sender_email: user.email || 'Un usuario de Kiokum',
        role_name: roleNames[role],
        role_icon: roleIcons[role],
        role_description: roleDescriptions[role],
        login_url: loginUrl,
        recipient_email: recipientEmail,
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log('Email enviado exitosamente vía EmailJS');
    } catch (err: any) {
      console.error('Error enviando email de invitación:', err);
    } finally {
      setSendingEmail(false);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('shared_access')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      await loadSharedUsers();
    } catch (err: any) {
      console.error('Error removing user:', err);
      setError(err.message || 'Error al eliminar usuario');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#2C1810]">
            Gestionar usuarios autorizados
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#6B5D54]" />
          </button>
        </div>

        <form onSubmit={handleAddUser} className="mb-6">
          <label className="block text-sm font-medium text-[#2C1810] mb-2">
            Agregar nuevo usuario
          </label>
          <div className="space-y-3">
            <Input
              type="email"
              placeholder="email@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full border-[#D4C4B0] rounded-lg"
            />

            <div>
              <label className="block text-sm font-medium text-[#2C1810] mb-2">
                Rol de acceso
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="viewer"
                    checked={selectedRole === 'viewer'}
                    onChange={(e) => setSelectedRole(e.target.value as AccessRole)}
                    disabled={loading}
                    className="sr-only peer"
                  />
                  <div className="p-2.5 sm:p-3 border-2 border-[#D4C4B0] rounded-lg peer-checked:border-[#A8D5E2] peer-checked:bg-[#A8D5E2]/10 transition-colors">
                    <p className="font-medium text-[#2C1810] text-xs sm:text-sm">Visualizador</p>
                    <p className="text-xs text-[#6B5D54]">Solo puede ver</p>
                  </div>
                </label>

                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="editor"
                    checked={selectedRole === 'editor'}
                    onChange={(e) => setSelectedRole(e.target.value as AccessRole)}
                    disabled={loading}
                    className="sr-only peer"
                  />
                  <div className="p-2.5 sm:p-3 border-2 border-[#D4C4B0] rounded-lg peer-checked:border-[#A8D5E2] peer-checked:bg-[#A8D5E2]/10 transition-colors">
                    <p className="font-medium text-[#2C1810] text-xs sm:text-sm">Editor</p>
                    <p className="text-xs text-[#6B5D54]">Puede editar</p>
                  </div>
                </label>

                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="owner"
                    checked={selectedRole === 'owner'}
                    onChange={(e) => setSelectedRole(e.target.value as AccessRole)}
                    disabled={loading}
                    className="sr-only peer"
                  />
                  <div className="p-2.5 sm:p-3 border-2 border-[#D4C4B0] rounded-lg peer-checked:border-[#A8D5E2] peer-checked:bg-[#A8D5E2]/10 transition-colors">
                    <p className="font-medium text-[#2C1810] text-xs sm:text-sm">Propietario</p>
                    <p className="text-xs text-[#6B5D54]">Control total</p>
                  </div>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full bg-[#31250b] hover:bg-[#31250b]/80 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
            >
              <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Agregar usuario
            </Button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            {success}
          </div>
        )}

        {sendingEmail && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm mb-4">
            Enviando invitación por email...
          </div>
        )}

        <div>
          <h3 className="text-base sm:text-lg font-semibold text-[#2C1810] mb-3 sm:mb-4">
            Usuarios con acceso ({sharedUsers.length})
          </h3>

          {sharedUsers.length === 0 ? (
            <p className="text-[#6B5D54] text-center py-8">
              No hay usuarios autorizados todavía
            </p>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {sharedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-[#F5EFE7] rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#2C1810] text-sm sm:text-base truncate">{user.shared_with_email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          user.access_role === 'owner'
                            ? 'bg-purple-100 text-purple-700'
                            : user.access_role === 'editor'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {user.access_role === 'owner' && 'Propietario'}
                        {user.access_role === 'editor' && 'Editor'}
                        {user.access_role === 'viewer' && 'Visualizador'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveUser(user.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                  >
                    <Trash2 className="w-5 h-5 text-[#6B5D54] group-hover:text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-[#D4C4B0] text-[#31250b] hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};
