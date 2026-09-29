import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { supabase } from '../lib/supabase';
import { X, Edit2, Save, Trash2, Users, Download, ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';

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

interface MemoryDetailModalProps {
  memory: Memory | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  onDelete: () => void;
}

type AccessRole = 'owner' | 'editor' | 'viewer';

export const MemoryDetailModal: React.FC<MemoryDetailModalProps> = ({
  memory,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState<AccessRole>('viewer');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (memory && isOpen) {
      setTitle(memory.title);
      setDescription(memory.description || '');
      setCurrentImageIndex(0);
      loadUserRole();
    }
  }, [memory, isOpen]);

  const loadUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !memory) return;

      setCurrentUserId(user.id);

      if (memory.owner_id === user.id) {
        setUserRole('owner');
        return;
      }

      const { data } = await supabase
        .from('shared_access')
        .select('access_role')
        .eq('memory_owner_id', memory.owner_id)
        .eq('shared_with_email', user.email)
        .maybeSingle();

      if (data) {
        setUserRole(data.access_role as AccessRole);
      } else {
        setUserRole('viewer');
      }
    } catch (err) {
      console.error('Error loading user role:', err);
    }
  };

  const handleSave = async () => {
    if (!memory) return;

    setLoading(true);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('memories')
        .update({
          title: title.trim(),
          description: description.trim() || null,
        })
        .eq('id', memory.id);

      if (updateError) throw updateError;

      setIsEditing(false);
      onUpdate();
    } catch (err: any) {
      console.error('Error updating memory:', err);
      setError(err.message || 'Error al actualizar el recuerdo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!memory) return;

    const confirmed = window.confirm(
      '¿Estás seguro de que deseas eliminar este recuerdo? Esta acción no se puede deshacer.'
    );

    if (!confirmed) return;

    setLoading(true);
    setError('');

    try {
      if (memory.file_url) {
        const filePath = memory.file_url.split('/').slice(-3).join('/');
        await supabase.storage.from('memories').remove([filePath]);
      }

      const { error: deleteError } = await supabase
        .from('memories')
        .delete()
        .eq('id', memory.id);

      if (deleteError) throw deleteError;

      onDelete();
      onClose();
    } catch (err: any) {
      console.error('Error deleting memory:', err);
      setError(err.message || 'Error al eliminar el recuerdo');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (memory?.file_url) {
      window.open(memory.file_url, '_blank');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('es-ES', options);
  };

  const canEdit = userRole === 'owner' || userRole === 'editor';
  const canDelete = userRole === 'owner';

  if (!isOpen || !memory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full my-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            {isEditing ? (
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                className="text-2xl font-semibold border-[#D4C4B0] rounded-lg mb-2"
              />
            ) : (
              <h2 className="text-2xl font-semibold text-[#2C1810] mb-2">{memory.title}</h2>
            )}
            <p className="text-sm text-[#6B5D54]">
              Creado el {formatDate(memory.created_at)}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs bg-[#F5EFE7] px-3 py-1 rounded-full text-[#31250b] font-medium">
                {memory.type === 'photo' && 'Foto'}
                {memory.type === 'audio' && 'Audio'}
                {memory.type === 'video' && 'Video'}
                {memory.type === 'diary' && 'Diario'}
              </span>
              <span className="text-xs bg-[#A8D5E2] px-3 py-1 rounded-full text-[#2C1810] font-medium">
                {userRole === 'owner' && 'Propietario'}
                {userRole === 'editor' && 'Editor'}
                {userRole === 'viewer' && 'Visualizador'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-[#6B5D54]" />
          </button>
        </div>

{memory.type === 'photo' && memory.images && memory.images.length > 0 ? (
          <div className="mb-6">
            <div className="rounded-xl overflow-hidden bg-gray-50 relative">
              <img
                src={memory.images[currentImageIndex].image_url}
                alt={`${memory.title} - Imagen ${currentImageIndex + 1}`}
                className="w-full h-auto max-h-96 object-contain"
              />

              {memory.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : memory.images!.length - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev < memory.images!.length - 1 ? prev + 1 : 0)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {memory.images.length}
                  </div>
                </>
              )}
            </div>

            {memory.images.length > 1 && (
              <div className="mt-4 grid grid-cols-6 gap-2">
                {memory.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex ? 'border-[#A8D5E2] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.image_url}
                      alt={`Miniatura ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : memory.file_url ? (
          <div className="mb-6 rounded-xl overflow-hidden bg-gray-50">
            {memory.type === 'photo' && (
              <img
                src={memory.file_url}
                alt={memory.title}
                className="w-full h-auto max-h-96 object-contain"
              />
            )}
            {memory.type === 'video' && (
              <video controls className="w-full h-auto max-h-96">
                <source src={memory.file_url} />
                Tu navegador no soporta la reproducción de video.
              </video>
            )}
            {memory.type === 'audio' && (
              <div className="p-8 flex items-center justify-center">
                <audio controls className="w-full max-w-md">
                  <source src={memory.file_url} />
                  Tu navegador no soporta la reproducción de audio.
                </audio>
              </div>
            )}
            {memory.type === 'diary' && (
              <div className="p-8 text-center">
                <p className="text-[#6B5D54] mb-4">Documento PDF</p>
                <Button
                  onClick={handleDownload}
                  className="bg-[#31250b] hover:bg-[#31250b]/80 text-white"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Descargar PDF
                </Button>
              </div>
            )}
          </div>
        ) : null}

<div className="mb-6">
          <label className="block text-sm font-medium text-[#2C1810] mb-2">
            Descripción
          </label>

          {memory.description_type === 'audio' && memory.description_audio_url ? (
            <div className="p-6 bg-[#F5EFE7] rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Volume2 className="w-5 h-5 text-[#2C1810]" />
                <span className="text-sm font-medium text-[#2C1810]">Descripción en audio</span>
              </div>
              <audio controls className="w-full">
                <source src={memory.description_audio_url} />
                Tu navegador no soporta la reproducción de audio.
              </audio>
            </div>
          ) : isEditing ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={6}
              className="w-full px-3 py-2 border border-[#D4C4B0] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#A8D5E2]"
            />
          ) : (
            <p className="text-[#6B5D54] whitespace-pre-wrap">
              {memory.description || 'Sin descripción'}
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          {!isEditing && canEdit && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="border-[#31250b] text-[#31250b] hover:bg-gray-50"
            >
              <Edit2 className="w-5 h-5 mr-2" />
              Editar
            </Button>
          )}

          {isEditing && (
            <>
              <Button
                onClick={handleSave}
                disabled={loading || !title.trim()}
                className="bg-[#A8D5E2] hover:bg-[#8FC3D4] text-[#2C1810] font-medium"
              >
                <Save className="w-5 h-5 mr-2" />
                Guardar
              </Button>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setTitle(memory.title);
                  setDescription(memory.description || '');
                }}
                disabled={loading}
                variant="outline"
                className="border-[#D4C4B0] text-[#31250b] hover:bg-gray-50"
              >
                Cancelar
              </Button>
            </>
          )}

          {!isEditing && canDelete && (
            <Button
              onClick={handleDelete}
              disabled={loading}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 ml-auto"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Eliminar
            </Button>
          )}

          {!isEditing && memory.file_url && memory.type !== 'diary' && (
            <Button
              onClick={handleDownload}
              variant="outline"
              className="border-[#31250b] text-[#31250b] hover:bg-gray-50 ml-auto"
            >
              <Download className="w-5 h-5 mr-2" />
              Descargar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
