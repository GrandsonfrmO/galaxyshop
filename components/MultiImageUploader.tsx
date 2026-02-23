import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductImage } from '../types';

interface MultiImageUploaderProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  maxImages?: number;
}

export const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 5,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const remainingSlots = maxImages - images.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage: ProductImage = {
          url: reader.result as string,
          alt: file.name,
          order: images.length + index,
        };
        onChange([...images, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // Reorder remaining images
    const reorderedImages = newImages.map((img, i) => ({ ...img, order: i }));
    onChange(reorderedImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    
    // Update order
    const reorderedImages = newImages.map((img, i) => ({ ...img, order: i }));
    onChange(reorderedImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition ${
            dragOver
              ? 'border-purple-500 bg-purple-500/10'
              : 'border-purple-500/50 hover:border-purple-500'
          }`}
        >
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            <Upload size={32} className="mx-auto mb-3 text-purple-400" />
            <p className="text-sm font-medium mb-1">
              Cliquez ou glissez-déposez des images
            </p>
            <p className="text-xs text-gray-400">
              {images.length} / {maxImages} images • PNG, JPG jusqu'à 10MB
            </p>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-400">
              Images du produit ({images.length}/{maxImages})
            </p>
            {images.length > 0 && (
              <p className="text-xs text-gray-500">
                La première image sera l'image principale
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <AnimatePresence>
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  {/* Image Preview */}
                  <div className="aspect-square bg-white/5 rounded-lg overflow-hidden border border-white/10">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Badge for main image */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                      Principale
                    </div>
                  )}

                  {/* Order badge */}
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>

                  {/* Controls */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {/* Move Left */}
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => moveImage(index, index - 1)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
                        title="Déplacer à gauche"
                      >
                        <ChevronLeft size={16} />
                      </button>
                    )}

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-2 bg-red-600/80 hover:bg-red-600 rounded-lg transition"
                      title="Supprimer"
                    >
                      <X size={16} />
                    </button>

                    {/* Move Right */}
                    {index < images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveImage(index, index + 1)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
                        title="Déplacer à droite"
                      >
                        <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <ImageIcon size={48} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm">Aucune image ajoutée</p>
        </div>
      )}
    </div>
  );
};
