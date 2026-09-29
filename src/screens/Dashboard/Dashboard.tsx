import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { supabase } from '../../lib/supabase';
import { UserManagementModal } from '../../components/UserManagementModal';
import {
  Shield,
  Users,
  Clock,
  UserPlus,
  Sprout,
  Image
} from 'lucide-react';

interface SharedUser {
  id: string;
  email: string;
  role: string;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [memoriesCount, setMemoriesCount] = useState(0);
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);
  const [memorySettings, setMemorySettings] = useState({
    privacyStatus: 'private',
    sharedUsers: 0,
    nextReview: '2029',
    treesPlanted: 3,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/login');
        return;
      }

      const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario';
      setUserName(fullName);

      await loadDashboardData(user.id);
    } catch (error) {
      console.error('Error checking auth:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async (userId: string) => {
    try {
      const { data: memoriesData, count } = await supabase
        .from('memories')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      setMemoriesCount(count || 0);

      const { data: sharedAccessData } = await supabase
        .from('shared_access')
        .select('*')
        .eq('memory_owner_id', userId);

      const sharedUsersCount = sharedAccessData?.length || 0;

      const usersData: SharedUser[] = sharedAccessData?.map(access => ({
        id: access.id,
        email: access.shared_with_email,
        role: access.access_role
      })) || [];

      setSharedUsers(usersData);

      const { data: settings } = await supabase
        .from('memory_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      setMemorySettings({
        privacyStatus: settings?.privacy_status || (sharedUsersCount > 0 ? 'shared' : 'private'),
        sharedUsers: sharedUsersCount,
        nextReview: settings?.next_review_year?.toString() || '2029',
        treesPlanted: settings?.trees_planted || 3,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5EFE7] flex items-center justify-center">
        <p className="text-[#2C1810]">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFE7]">
      <div className="relative bg-[#31250b] overflow-hidden">

        <header className="relative flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 sm:py-6 z-10 max-w-7xl mx-auto w-full">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <img src="/ki_logo_(1).png" alt="Kiokum" className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          <nav className="flex items-center gap-3 sm:gap-4 md:gap-6">
            <button className="text-white font-medium text-xs sm:text-sm md:text-base underline">
              mi memoria
            </button>
            <button
              onClick={() => navigate('/content')}
              className="text-white font-medium text-xs sm:text-sm md:text-base hover:underline"
            >
              contenido
            </button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="font-bold text-[#31250b] text-[11px] sm:text-[13px] font-['Inter_Tight',Helvetica] px-3 sm:px-4 py-1.5 sm:py-2 hover:text-[#31250b]"
            >
              Log out
            </Button>
          </nav>
        </header>

        <div className="relative px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-8 sm:pb-10 pt-3 sm:pt-4 z-10 max-w-7xl mx-auto w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl text-white font-normal leading-tight mb-2 sm:mb-3">
            Mi <span className="italic font-serif">memoria</span>
          </h1>
          <p className="text-white/90 text-base sm:text-lg leading-relaxed">
            Gestiona y cuida de tus recuerdos
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
            <div className="bg-[#F4D4D4] rounded-2xl p-4 sm:p-6 md:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#2C1810] mb-6 sm:mb-8 tracking-tight">
                Estado de tu memoria
              </h2>

              <div className="space-y-4">
                <div className="bg-[#31250b] text-white rounded-xl p-4 sm:p-6 flex items-start gap-3 sm:gap-4">
                  <Image className="w-5 h-5 sm:w-6 sm:h-6 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-base sm:text-lg mb-1 leading-tight">
                      {memoriesCount} recuerdos subidos
                    </p>
                    <p className="text-xs sm:text-sm opacity-90 leading-relaxed">
                      Total de recuerdos almacenados
                    </p>
                  </div>
                </div>

                <div className="bg-[#31250b] text-white rounded-xl p-6 flex items-start gap-4">
                  <Shield className="w-6 h-6 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-lg mb-1 leading-tight">
                      {memorySettings.privacyStatus === 'private' ? 'Privado' : 'Compartido'}
                    </p>
                    <p className="text-sm opacity-90 leading-relaxed">
                      {memorySettings.privacyStatus === 'private'
                        ? 'Sólo tú podes ver este contenido'
                        : 'Compartido con otros usuarios'}
                    </p>
                  </div>
                </div>

                <div className="bg-[#31250b] text-white rounded-xl p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Users className="w-6 h-6 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-lg mb-1 leading-tight">
                        {memorySettings.sharedUsers} usuarios autorizados
                      </p>
                      <p className="text-sm opacity-90 leading-relaxed">
                        Pueden acceder cuando sea necesario
                      </p>
                    </div>
                  </div>
                  {sharedUsers.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/20 space-y-2">
                      {sharedUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between text-sm">
                          <span className="opacity-90">{user.email}</span>
                          <span className="px-2 py-1 bg-white/10 rounded text-xs capitalize">
                            {user.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-[#31250b] text-white rounded-xl p-6 flex items-start gap-4">
                  <Clock className="w-6 h-6 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-lg mb-1 leading-tight">
                      Próxima revisión
                    </p>
                    <p className="text-sm opacity-90 leading-relaxed">
                      {memorySettings.nextReview}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#F4D4D4] rounded-2xl p-4 sm:p-6 md:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#2C1810] mb-6 sm:mb-8 tracking-tight">
                Gestión
              </h2>

              <button
                onClick={() => setShowUserModal(true)}
                className="w-full bg-[#31250b] text-white rounded-xl p-4 sm:p-6 flex items-center justify-start gap-3 sm:gap-4 hover:bg-[#31250b]/90 transition-colors shadow-sm"
              >
                <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="font-semibold text-base sm:text-lg">Gestionar usuarios</span>
              </button>
            </div>

            <div className="bg-[#31250b] text-white rounded-2xl p-4 sm:p-6 md:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 tracking-tight">
                Impacto ambiental
              </h2>
              <p className="text-sm sm:text-base opacity-90 mb-6 sm:mb-8 leading-relaxed">
                Tu memoria contribuye a un mundo mejor. Cada cambio de estado ayuda a plantar
                árboles.
              </p>
              <div className="flex items-center justify-between pt-2 sm:pt-4">
                <Sprout className="w-12 h-12 sm:w-16 sm:h-16" />
                <div className="text-4xl sm:text-5xl md:text-6xl font-bold">{memorySettings.treesPlanted}</div>
              </div>
            </div>
        </div>
      </div>

      <footer className="text-center py-8 text-sm text-[#6B5D54] leading-relaxed">
        2026 Kiokum. Todos los derechos reservados.
      </footer>

      <UserManagementModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
      />
    </div>
  );
};
