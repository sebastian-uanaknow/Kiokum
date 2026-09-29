import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { supabase } from '../lib/supabase';
import { X, FolderPlus, Folder, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

interface FolderType {
  id: string;
  name: string;
  created_at: string;
  memory_count?: number;
}

interface Memory {
  id: string;
  title: string;
  type: string;
}

interface FolderManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FolderManagementModal: React.FC<FolderManagementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [folderName, setFolderName] = useState('');
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null);
  const [selectedMemories, setSelectedMemories] = useState<string[]>([]);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadFolders();
      loadMemories();
    }
  }, [isOpen]);

  const loadFolders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFolders(data || []);
    } catch (err: any) {
      console.error('Error loading folders:', err);
    }
  };

  const loadMemories = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('memories')
        .select('id, title, type')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMemories(data || []);
    } catch (err: any) {
      console.error('Error loading memories:', err);
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!folderName.trim()) {
      setError('Por favor ingresa un nombre para la carpeta');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No estás autenticado');

      const { error: insertError } = await supabase
        .from('folders')
        .insert([
          {
            user_id: user.id,
            name: folderName.trim(),
          },
        ]);

      if (insertError) throw insertError;

      setFolderName('');
      await loadFolders();
    } catch (err: any) {
      console.error('Error creating folder:', err);
      setError(err.message || 'Error al crear la carpeta');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', folderId);

      if (error) throw error;
      await loadFolders();
    } catch (err: any) {
      console.error('Error deleting folder:', err);
      setError(err.message || 'Error al eliminar la carpeta');
    }
  };

  const handleToggleFolder = (folderId: string) => {
    if (expandedFolder === folderId) {
      setExpandedFolder(null);
      setActiveFolderId(null);
      setSelectedMemories([]);
    } else {
      setExpandedFolder(folderId);
      setActiveFolderId(folderId);
      setSelectedMemories([]);
    }
  };

  const handleToggleMemory = (memoryId: string) => {
    setSelectedMemories((prev) =>
      prev.includes(memoryId)
        ? prev.filter((id) => id !== memoryId)
        : [...prev, memoryId]
    );
  };

  const handleAddMemoriesToFolder = async () => {
    if (!activeFolderId || selectedMemories.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const inserts = selectedMemories.map((memoryId) => ({
        folder_id: activeFolderId,
        memory_id: memoryId,
      }));

      const { error } = await supabase.from('folder_memories').insert(inserts);

      if (error) {
        if (error.code === '23505') {
          setError('Algunos recuerdos ya están en esta carpeta');
        } else {
          throw error;
        }
      } else {
        setSelectedMemories([]);
        setExpandedFolder(null);
        setActiveFolderId(null);
      }
    } catch (err: any) {
      console.error('Error adding memories to folder:', err);
      setError(err.message || 'Error al agregar recuerdos a la carpeta');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-[#2C1810]">Gestionar carpetas</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-[#6B5D54]" />
          </button>
        </div>

        <form onSubmit={handleCreateFolder} className="mb-6">
          <label className="block text-sm font-medium text-[#2C1810] mb-2">
            Crear nueva carpeta
          </label>
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Nombre de la carpeta"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              disabled={loading}
              className="flex-1 border-[#D4C4B0] rounded-lg"
            />
            <Button
              type="submit"
              disabled={loading || !folderName.trim()}
              className="bg-[#31250b] hover:bg-[#31250b]/80 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              <FolderPlus className="w-5 h-5 mr-2" />
              Crear
            </Button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-[#2C1810] mb-4">
            Mis carpetas ({folders.length})
          </h3>

          {folders.length === 0 ? (
            <p className="text-[#6B5D54] text-center py-8">No hay carpetas todavía</p>
          ) : (
            <div className="space-y-2">
              {folders.map((folder) => (
                <div key={folder.id} className="border border-[#D4C4B0] rounded-lg">
                  <div className="flex items-center justify-between p-4 bg-[#F5EFE7]">
                    <button
                      onClick={() => handleToggleFolder(folder.id)}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      {expandedFolder === folder.id ? (
                        <ChevronDown className="w-5 h-5 text-[#6B5D54]" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-[#6B5D54]" />
                      )}
                      <Folder className="w-5 h-5 text-[#31250b]" />
                      <span className="font-medium text-[#2C1810]">{folder.name}</span>
                    </button>
                    <button
                      onClick={() => handleDeleteFolder(folder.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                    >
                      <Trash2 className="w-5 h-5 text-[#6B5D54] group-hover:text-red-600" />
                    </button>
                  </div>

                  {expandedFolder === folder.id && (
                    <div className="p-4 bg-white">
                      <p className="text-sm text-[#6B5D54] mb-3">
                        Selecciona los recuerdos que deseas agregar a esta carpeta:
                      </p>

                      {memories.length === 0 ? (
                        <p className="text-sm text-[#6B5D54] text-center py-4">
                          No hay recuerdos disponibles
                        </p>
                      ) : (
                        <>
                          <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                            {memories.map((memory) => (
                              <label
                                key={memory.id}
                                className="flex items-center gap-3 p-3 hover:bg-[#F5EFE7] rounded-lg cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedMemories.includes(memory.id)}
                                  onChange={() => handleToggleMemory(memory.id)}
                                  className="w-4 h-4 text-[#A8D5E2] rounded border-[#D4C4B0] focus:ring-[#A8D5E2]"
                                />
                                <span className="text-sm text-[#2C1810]">{memory.title}</span>
                                <span className="text-xs text-[#6B5D54] ml-auto">
                                  {memory.type}
                                </span>
                              </label>
                            ))}
                          </div>

                          {selectedMemories.length > 0 && (
                            <Button
                              onClick={handleAddMemoriesToFolder}
                              disabled={loading}
                              className="w-full bg-[#A8D5E2] hover:bg-[#8FC3D4] text-[#2C1810] font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Agregar {selectedMemories.length} recuerdo
                              {selectedMemories.length !== 1 ? 's' : ''} a la carpeta
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  )}
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
