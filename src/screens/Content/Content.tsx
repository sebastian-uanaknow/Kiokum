import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { supabase } from '../../lib/supabase';
import { UploadModal } from '../../components/UploadModal';
import { MemoryDetailModal } from '../../components/MemoryDetailModal';
import {
  Image,
  Mic,
  Video,
  FileText,
  Heart,
  Copy,
  Users,
  Upload,
} from 'lucide-react';

interface Memory {
  id: string;
  title: string;
  description: string;
  description_type?: 'text' | 'audio';
  description_audio_url?: string;
  type: 'photo' | 'audio' | 'video' | 'diary';
  created_at: string;
  file_url?: string;
  tags?: string[];
  user_id: string;
  owner_id: string;
  images?: { id: string; image_url: string; order_index: number }[];
}

export const Content: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/login');
        return;
      }

      await loadContent(user.id);
    } catch (error) {
      console.error('Error checking auth:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const loadContent = async (userId: string) => {
    try {
      const { data: allMemories, error } = await supabase
        .from('memories')
        .select('*, memory_images(id, image_url, order_index)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading memories:', error);
        return;
      }

      if (allMemories) {
        const memoriesWithImages = allMemories.map((memory) => ({
          ...memory,
          images: (memory.memory_images || []).sort(
            (a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index
          ),
        }));
        setMemories(memoriesWithImages);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleUploadSuccess = () => {
    checkAuthAndLoad();
  };

  const handleViewMemory = (memory: Memory) => {
    setSelectedMemory(memory);
    setShowDetailModal(true);
  };

  const handleMemoryUpdate = () => {
    checkAuthAndLoad();
  };

  const handleMemoryDelete = () => {
    checkAuthAndLoad();
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

        <header className="relative flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 sm:py-6 z-10">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <img src="/ki_logo_(1).png" alt="Kiokum" className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          <nav className="flex items-center gap-3 sm:gap-4 md:gap-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-white font-medium text-xs sm:text-sm md:text-base hover:underline"
            >
              mi memoria
            </button>
            <button className="text-white font-medium text-xs sm:text-sm md:text-base underline">
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

        <div className="relative px-4 sm:px-6 md:px-8 pb-8 sm:pb-10 pt-3 sm:pt-4 z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl text-white font-normal leading-tight mb-2 sm:mb-3">
            Mi <span className="italic font-serif">contenido</span>
          </h1>
          <p className="text-white/90 text-base sm:text-lg leading-relaxed">
            Organiza y gestiona todos tus recuerdos
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
          {memories.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="text-[#6B5D54] text-lg leading-relaxed">
                No hay recuerdos todavía
              </p>
            </div>
          ) : (
            memories.map((memory) => (
              <Card key={memory.id} className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                {memory.type === 'photo' && memory.images && memory.images.length > 0 ? (
                  <div className="w-full h-48 bg-gray-100 relative">
                    <img
                      src={memory.images[0].image_url}
                      alt={memory.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-[#F5EFE7]"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9B8B7E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>`;
                        }
                      }}
                    />
                    {memory.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                        +{memory.images.length - 1}
                      </div>
                    )}
                  </div>
                ) : memory.file_url && memory.type === 'photo' ? (
                  <div className="w-full h-48 bg-gray-100 relative">
                    <img
                      src={memory.file_url}
                      alt={memory.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-[#F5EFE7]"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9B8B7E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>`;
                        }
                      }}
                    />
                  </div>
                ) : null}
                {memory.file_url && memory.type === 'video' && (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <Video className="w-12 h-12 text-[#9B8B7E]" />
                  </div>
                )}
                {memory.file_url && memory.type === 'audio' && (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <Mic className="w-12 h-12 text-[#9B8B7E]" />
                  </div>
                )}
                {memory.file_url && memory.type === 'diary' && (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-[#9B8B7E]" />
                  </div>
                )}

                <div className="p-4 sm:p-6 md:p-7">
                  <div className="flex items-start justify-between mb-4 sm:mb-5">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#2C1810] flex-1 leading-tight">
                      {memory.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Heart className="w-5 h-5 text-[#31250b]" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Copy className="w-5 h-5 text-[#31250b]" />
                      </button>
                    </div>
                  </div>

                <div className="flex items-center gap-2 text-sm text-[#6B5D54] mb-5">
                  <span className="inline-block w-4 h-4 bg-[#D4C4B0] rounded" />
                  <span className="leading-relaxed">{formatDate(memory.created_at)}</span>
                </div>

                {memory.tags && memory.tags.length > 0 && (
                  <div className="flex gap-2 mb-5 flex-wrap">
                    {memory.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-[#F5EFE7] text-[#31250b] text-xs rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-sm text-[#6B5D54] mb-6">
                  {memory.description_type === 'audio' ? (
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4" />
                      <span className="italic leading-relaxed">Descripción en audio</span>
                    </div>
                  ) : (
                    <p className="line-clamp-2 leading-relaxed">
                      {memory.description || 'Sin descripción'}
                    </p>
                  )}
                </div>

                  <div className="flex items-center justify-between">
                    <Button
                      onClick={() => handleViewMemory(memory)}
                      variant="outline"
                      className="border-[#31250b] text-[#31250b] hover:bg-[#31250b] hover:text-white transition-colors"
                    >
                      ver completo
                    </Button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group">
                      <Users className="w-5 h-5 text-[#31250b] group-hover:text-[#6B5D54]" />
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="w-full border-2 border-dashed border-[#D4C4B0] rounded-2xl p-8 sm:p-12 md:p-16 text-center hover:border-[#9B8B7E] transition-colors"
        >
          <Upload className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto mb-4 sm:mb-6 text-[#9B8B7E]" />
          <h3 className="text-xl sm:text-2xl font-semibold text-[#2C1810] mb-2 sm:mb-3 tracking-tight leading-tight">
            Añadir tus recuerdos
          </h3>
          <p className="text-sm sm:text-base text-[#6B5D54] leading-relaxed">
            Haz clic para subir fotos, videos, audios o PDFs
          </p>
        </button>
      </div>

      <footer className="text-center py-8 text-sm text-[#6B5D54] leading-relaxed">
        2026 Kiokum. Todos los derechos reservados.
      </footer>

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleUploadSuccess}
      />

      <MemoryDetailModal
        memory={selectedMemory}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedMemory(null);
        }}
        onUpdate={handleMemoryUpdate}
        onDelete={handleMemoryDelete}
      />
    </div>
  );
};
