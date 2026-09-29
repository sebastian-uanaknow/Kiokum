import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { supabase } from '../lib/supabase';
import { X, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { AudioRecorder } from './AudioRecorder';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type DescriptionType = 'text' | 'audio';

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [descriptionType, setDescriptionType] = useState<DescriptionType>('text');
  const [textDescription, setTextDescription] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen) return null;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validImages = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError('Solo se permiten archivos de imagen');
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError(`La imagen ${file.name} es muy grande. Máximo 10MB por imagen`);
        return false;
      }
      return true;
    });

    setImages(prev => [...prev, ...validImages]);
    setError('');
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAudioFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        setError('Solo se permiten archivos de audio');
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setError('El audio es muy grande. El tamaño máximo es 50MB');
        return;
      }
      setAudioFile(file);
      setError('');
    }
  };

  const removeAudioFile = () => {
    setAudioFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Por favor ingresa un título');
      return;
    }

    if (images.length === 0) {
      setError('Por favor selecciona al menos una imagen');
      return;
    }

    if (descriptionType === 'text' && !textDescription.trim()) {
      setError('Por favor ingresa una descripción en texto');
      return;
    }

    if (descriptionType === 'audio' && !audioBlob && !audioFile) {
      setError('Por favor graba o sube un audio de descripción');
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No estás autenticado');

      const memoryId = crypto.randomUUID();
      setUploadProgress(10);

      let descriptionAudioUrl: string | null = null;

      if (descriptionType === 'audio') {
        const audioToUpload = audioBlob || audioFile;
        if (audioToUpload) {
          const audioFileName = `${Date.now()}_description.webm`;
          const audioPath = `${user.id}/${memoryId}/audio/${audioFileName}`;

          const { error: audioUploadError } = await supabase.storage
            .from('memories')
            .upload(audioPath, audioToUpload, {
              cacheControl: '3600',
              upsert: false,
            });

          if (audioUploadError) throw audioUploadError;

          const { data: audioUrlData } = supabase.storage
            .from('memories')
            .getPublicUrl(audioPath);

          descriptionAudioUrl = audioUrlData.publicUrl;
        }
      }

      setUploadProgress(30);

      const memoryData = {
        id: memoryId,
        user_id: user.id,
        owner_id: user.id,
        title: title.trim(),
        description: descriptionType === 'text' ? textDescription.trim() : null,
        description_type: descriptionType,
        description_audio_url: descriptionAudioUrl,
        type: 'photo' as const,
      };

      const { error: insertError } = await supabase
        .from('memories')
        .insert([memoryData]);

      if (insertError) throw insertError;

      setUploadProgress(50);

      const imageUploadPromises = images.map(async (image, index) => {
        const imageFileName = `${Date.now()}_${index}_${image.name}`;
        const imagePath = `${user.id}/${memoryId}/images/${imageFileName}`;

        const { error: imageUploadError } = await supabase.storage
          .from('memories')
          .upload(imagePath, image, {
            cacheControl: '3600',
            upsert: false,
          });

        if (imageUploadError) throw imageUploadError;

        const { data: imageUrlData } = supabase.storage
          .from('memories')
          .getPublicUrl(imagePath);

        return {
          memory_id: memoryId,
          image_url: imageUrlData.publicUrl,
          order_index: index,
        };
      });

      const imageRecords = await Promise.all(imageUploadPromises);
      setUploadProgress(80);

      const { error: imagesInsertError } = await supabase
        .from('memory_images')
        .insert(imageRecords);

      if (imagesInsertError) throw imagesInsertError;

      setUploadProgress(100);

      setTitle('');
      setTextDescription('');
      setAudioBlob(null);
      setAudioFile(null);
      setImages([]);
      setDescriptionType('text');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Upload error:', err);
      let errorMessage = 'Error al subir el recuerdo';

      if (err.message) {
        errorMessage = err.message;
      }

      if (err.message?.includes('row-level security')) {
        errorMessage = 'No tienes permisos para subir archivos. Verifica tu sesión.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setTitle('');
      setTextDescription('');
      setAudioBlob(null);
      setAudioFile(null);
      setImages([]);
      setDescriptionType('text');
      setError('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#2C1810]">
            Añadir tus recuerdos
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#6B5D54]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#2C1810] mb-2">
              Título del recuerdo *
            </label>
            <Input
              type="text"
              placeholder="Ej: Cumpleaños de María"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              className="w-full border-[#D4C4B0] rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C1810] mb-3">
              Imágenes del recuerdo *
            </label>
            <div className="border-2 border-dashed border-[#D4C4B0] rounded-lg p-6 text-center hover:border-[#9B8B7E] transition-colors">
              <input
                type="file"
                onChange={handleImageSelect}
                disabled={loading}
                accept="image/*"
                multiple
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-10 h-10 text-[#9B8B7E] mb-2" />
                <p className="text-[#2C1810] font-medium mb-1">
                  Seleccionar imágenes
                </p>
                <p className="text-sm text-[#6B5D54]">
                  Puedes seleccionar múltiples imágenes (máx. 10MB cada una)
                </p>
              </label>
            </div>

            {images.length > 0 && (
              <div className="mt-3 sm:mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 sm:h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C1810] mb-3">
              Tipo de descripción *
            </label>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-3 sm:mb-4">
              <button
                type="button"
                onClick={() => setDescriptionType('text')}
                disabled={loading}
                className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border-2 transition-colors font-medium text-sm sm:text-base ${
                  descriptionType === 'text'
                    ? 'border-[#A8D5E2] bg-[#A8D5E2] text-[#2C1810]'
                    : 'border-[#D4C4B0] text-[#6B5D54] hover:border-[#9B8B7E]'
                }`}
              >
                Descripción en texto
              </button>
              <button
                type="button"
                onClick={() => setDescriptionType('audio')}
                disabled={loading}
                className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border-2 transition-colors font-medium text-sm sm:text-base ${
                  descriptionType === 'audio'
                    ? 'border-[#A8D5E2] bg-[#A8D5E2] text-[#2C1810]'
                    : 'border-[#D4C4B0] text-[#6B5D54] hover:border-[#9B8B7E]'
                }`}
              >
                Descripción en audio
              </button>
            </div>

            {descriptionType === 'text' ? (
              <div>
                <textarea
                  placeholder="Escribe la descripción de tu recuerdo..."
                  value={textDescription}
                  onChange={(e) => setTextDescription(e.target.value)}
                  disabled={loading}
                  rows={4}
                  className="w-full px-3 py-2 border border-[#D4C4B0] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#A8D5E2]"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <AudioRecorder
                  onAudioReady={setAudioBlob}
                  disabled={loading || !!audioFile}
                />

                {!audioBlob && (
                  <>
                    <div className="text-center text-[#6B5D54]">o</div>

                    {!audioFile ? (
                      <div className="border-2 border-dashed border-[#D4C4B0] rounded-lg p-6 text-center">
                        <input
                          type="file"
                          onChange={handleAudioFileSelect}
                          disabled={loading}
                          accept="audio/*"
                          className="hidden"
                          id="audio-file-upload"
                        />
                        <label
                          htmlFor="audio-file-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <Upload className="w-8 h-8 text-[#9B8B7E] mb-2" />
                          <p className="text-[#2C1810] font-medium">
                            Subir archivo de audio
                          </p>
                          <p className="text-sm text-[#6B5D54]">
                            Formatos: MP3, WAV, etc. (máx. 50MB)
                          </p>
                        </label>
                      </div>
                    ) : (
                      <div className="p-4 bg-[#F5EFE7] rounded-lg flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#2C1810]">{audioFile.name}</p>
                          <p className="text-xs text-[#6B5D54]">
                            {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          type="button"
                          onClick={removeAudioFile}
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B5D54]">Subiendo...</span>
                <span className="text-[#31250b] font-medium">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-[#F5EFE7] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#A8D5E2] h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              type="button"
              onClick={handleClose}
              disabled={loading}
              variant="outline"
              className="w-full sm:flex-1 border-[#D4C4B0] text-[#31250b] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !title.trim() || images.length === 0}
              className="w-full sm:flex-1 bg-[#A8D5E2] hover:bg-[#8FC3D4] text-[#2C1810] font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
            >
              {loading ? 'Subiendo...' : 'Subir recuerdo'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
