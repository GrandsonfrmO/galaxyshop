import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface IconCropperProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (croppedImage: string) => void;
  initialImage?: string;
}

export const IconCropper: React.FC<IconCropperProps> = ({ isOpen, onClose, onSave, initialImage }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Load image
  useEffect(() => {
    if (initialImage && isOpen) {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setZoom(1);
        setOffsetX(0);
        setOffsetY(0);
      };
      img.src = initialImage;
    }
  }, [initialImage, isOpen]);

  // Draw preview
  useEffect(() => {
    if (!canvasRef.current || !image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 256;
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, size, size);

    // Draw image with zoom and offset
    const scaledWidth = image.width * zoom;
    const scaledHeight = image.height * zoom;

    ctx.drawImage(
      image,
      offsetX,
      offsetY,
      scaledWidth,
      scaledHeight,
      0,
      0,
      size,
      size
    );

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i++) {
      const pos = (size / 3) * i;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, size);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(size, pos);
      ctx.stroke();
    }

    // Draw border
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, size, size);
  }, [image, zoom, offsetX, offsetY]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !image) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setOffsetX(prev => prev + deltaX);
    setOffsetY(prev => prev + deltaY);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
  };

  const handleSave = () => {
    if (canvasRef.current) {
      const croppedImage = canvasRef.current.toDataURL('image/png');
      onSave(croppedImage);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-gradient-to-br from-[#0a0a0a] to-[#0f0f0f] rounded-2xl border border-white/10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold">Rogner l'Icône</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {image ? (
                <>
                  {/* Preview Area */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Editor */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-gray-400 uppercase">Éditeur</h3>
                      <div
                        ref={containerRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        className="relative w-full aspect-square bg-gradient-to-br from-white/5 to-white/2 rounded-xl border border-white/10 overflow-hidden cursor-move"
                      >
                        <img
                          ref={imageRef}
                          src={image.src}
                          alt="Original"
                          style={{
                            width: `${image.width * zoom}px`,
                            height: `${image.height * zoom}px`,
                            transform: `translate(${offsetX}px, ${offsetY}px)`,
                            userSelect: 'none',
                          }}
                          className="absolute top-0 left-0 pointer-events-none"
                        />
                        {/* Grid overlay */}
                        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                          {[...Array(9)].map((_, i) => (
                            <div key={i} className="border border-white/10" />
                          ))}
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <button
                            onClick={handleZoomOut}
                            className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <ZoomOut size={18} />
                            <span className="text-sm">Zoom -</span>
                          </button>
                          <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 flex items-center justify-center">
                            <span className="text-sm font-mono">{(zoom * 100).toFixed(0)}%</span>
                          </div>
                          <button
                            onClick={handleZoomIn}
                            className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <ZoomIn size={18} />
                            <span className="text-sm">Zoom +</span>
                          </button>
                        </div>
                        <button
                          onClick={handleReset}
                          className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <RotateCcw size={18} />
                          <span className="text-sm">Réinitialiser</span>
                        </button>
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-gray-400 uppercase">Aperçu (256x256)</h3>
                      <div className="space-y-4">
                        {/* Canvas preview */}
                        <canvas
                          ref={canvasRef}
                          className="w-full aspect-square bg-gradient-to-br from-white/5 to-white/2 rounded-xl border border-white/10"
                        />

                        {/* Size preview */}
                        <div className="grid grid-cols-3 gap-2">
                          {/* 192x192 */}
                          <div className="space-y-2">
                            <p className="text-xs text-gray-400 text-center">192x192</p>
                            <canvas
                              ref={(canvas) => {
                                if (canvas && canvasRef.current) {
                                  const ctx = canvas.getContext('2d');
                                  if (ctx) {
                                    canvas.width = 192;
                                    canvas.height = 192;
                                    ctx.drawImage(canvasRef.current, 0, 0, 256, 256, 0, 0, 192, 192);
                                  }
                                }
                              }}
                              className="w-full aspect-square bg-gradient-to-br from-white/5 to-white/2 rounded-lg border border-white/10"
                            />
                          </div>

                          {/* 512x512 */}
                          <div className="space-y-2">
                            <p className="text-xs text-gray-400 text-center">512x512</p>
                            <canvas
                              ref={(canvas) => {
                                if (canvas && canvasRef.current) {
                                  const ctx = canvas.getContext('2d');
                                  if (ctx) {
                                    canvas.width = 512;
                                    canvas.height = 512;
                                    ctx.drawImage(canvasRef.current, 0, 0, 256, 256, 0, 0, 512, 512);
                                  }
                                }
                              }}
                              className="w-full aspect-square bg-gradient-to-br from-white/5 to-white/2 rounded-lg border border-white/10"
                            />
                          </div>

                          {/* Maskable */}
                          <div className="space-y-2">
                            <p className="text-xs text-gray-400 text-center">Maskable</p>
                            <div className="w-full aspect-square bg-gradient-to-br from-white/5 to-white/2 rounded-lg border border-white/10 flex items-center justify-center p-2">
                              <canvas
                                ref={(canvas) => {
                                  if (canvas && canvasRef.current) {
                                    const ctx = canvas.getContext('2d');
                                    if (ctx) {
                                      canvas.width = 192;
                                      canvas.height = 192;
                                      // Draw circle mask
                                      ctx.fillStyle = '#050505';
                                      ctx.fillRect(0, 0, 192, 192);
                                      ctx.save();
                                      ctx.beginPath();
                                      ctx.arc(96, 96, 96, 0, Math.PI * 2);
                                      ctx.clip();
                                      ctx.drawImage(canvasRef.current, 0, 0, 256, 256, 0, 0, 192, 192);
                                      ctx.restore();
                                    }
                                  }
                                }}
                                className="w-full aspect-square rounded-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                    <p className="text-xs sm:text-sm text-blue-300">
                      💡 Glissez pour déplacer l'image, utilisez les boutons zoom pour ajuster la taille. L'aperçu montre comment l'icône apparaîtra sur différents appareils.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-lg font-bold transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 rounded-lg font-bold transition-colors"
                    >
                      Appliquer
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-gray-400">Aucune image sélectionnée</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
