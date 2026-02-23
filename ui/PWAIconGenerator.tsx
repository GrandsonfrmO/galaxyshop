import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Palette, Type, Sparkles, Check, X, RefreshCw, Upload, Image as ImageIcon } from 'lucide-react';

interface PWAIconGeneratorProps {
  currentIcon?: string;
  onIconsGenerated: (icons: GeneratedIcons) => void;
}

export interface GeneratedIcons {
  icon16: string;
  icon32: string;
  icon72: string;
  icon96: string;
  icon120: string;
  icon128: string;
  icon144: string;
  icon152: string;
  icon167: string;
  icon180: string;
  icon192: string;
  icon384: string;
  icon512: string;
  icon192Maskable: string;
  icon512Maskable: string;
}

const ICON_SIZES = [
  { name: 'icon-16', size: 16 },
  { name: 'icon-32', size: 32 },
  { name: 'icon-72', size: 72 },
  { name: 'icon-96', size: 96 },
  { name: 'icon-120', size: 120 },
  { name: 'icon-128', size: 128 },
  { name: 'icon-144', size: 144 },
  { name: 'icon-152', size: 152 },
  { name: 'icon-167', size: 167 },
  { name: 'icon-180', size: 180 },
  { name: 'icon-192', size: 192 },
  { name: 'icon-384', size: 384 },
  { name: 'icon-512', size: 512 }
];

const STYLES = [
  { id: 'modern', name: 'Moderne', description: 'Bordure subtile, élégant' },
  { id: 'gradient', name: 'Dégradé', description: 'Dynamique et coloré' },
  { id: 'minimal', name: 'Minimal', description: 'Épuré et simple' },
  { id: 'bold', name: 'Gras', description: 'Texte épais, impactant' }
];

export const PWAIconGenerator: React.FC<PWAIconGeneratorProps> = ({ currentIcon, onIconsGenerated }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bgColor, setBgColor] = useState('#a855f7');
  const [textColor, setTextColor] = useState('#ffffff');
  const [text, setText] = useState('TB');
  const [style, setStyle] = useState('modern');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadedLogo, setUploadedLogo] = useState<HTMLImageElement | null>(null);
  const [useCustomLogo, setUseCustomLogo] = useState(false);

  useEffect(() => {
    updateCanvas();
  }, [bgColor, textColor, text, style, uploadedLogo, useCustomLogo]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setUploadedLogo(img);
        setUseCustomLogo(true);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setUploadedLogo(null);
    setUseCustomLogo(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const updateCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 512;
    canvas.height = 512;

    ctx.clearRect(0, 0, 512, 512);

    // Background
    if (style === 'gradient') {
      const gradient = ctx.createLinearGradient(0, 0, 512, 512);
      gradient.addColorStop(0, bgColor);
      gradient.addColorStop(1, adjustColor(bgColor, -30));
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = bgColor;
    }

    // Rounded rectangle
    const radius = style === 'minimal' ? 80 : 120;
    roundRect(ctx, 0, 0, 512, 512, radius);
    ctx.fill();

    // Draw logo or text
    if (useCustomLogo && uploadedLogo) {
      // Calculate logo size (70% of canvas with padding)
      const maxSize = 512 * 0.7;
      const logoAspect = uploadedLogo.width / uploadedLogo.height;
      let logoWidth = maxSize;
      let logoHeight = maxSize;

      if (logoAspect > 1) {
        logoHeight = maxSize / logoAspect;
      } else {
        logoWidth = maxSize * logoAspect;
      }

      const x = (512 - logoWidth) / 2;
      const y = (512 - logoHeight) / 2;

      ctx.drawImage(uploadedLogo, x, y, logoWidth, logoHeight);
    } else {
      // Text
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (style === 'bold') {
        ctx.font = 'bold 280px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
      } else {
        ctx.font = '240px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
      }

      ctx.fillText(text.toUpperCase(), 256, 256);
    }

    // Optional decoration
    if (style === 'modern' && !useCustomLogo) {
      ctx.strokeStyle = textColor;
      ctx.lineWidth = 8;
      ctx.globalAlpha = 0.3;
      roundRect(ctx, 40, 40, 432, 432, 80);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  };

  const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  const adjustColor = (color: string, amount: number): string => {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  };

  const generateIcon = (size: number): string => {
    const canvas = canvasRef.current;
    if (!canvas) return '';

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = size;
    tempCanvas.height = size;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return '';

    tempCtx.drawImage(canvas, 0, 0, 512, 512, 0, 0, size, size);
    return tempCanvas.toDataURL('image/png');
  };

  const generateMaskableIcon = (size: number): string => {
    const canvas = canvasRef.current;
    if (!canvas) return '';

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = size;
    tempCanvas.height = size;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return '';

    // Maskable icons need more padding (safe zone)
    const padding = size * 0.2;
    const contentSize = size * 0.6;

    tempCtx.drawImage(
      canvas,
      0, 0, 512, 512,
      padding, padding, contentSize, contentSize
    );

    return tempCanvas.toDataURL('image/png');
  };

  const handleGenerateAll = async () => {
    setIsGenerating(true);
    setGeneratedCount(0);
    setShowSuccess(false);

    // Update canvas one last time
    updateCanvas();

    // Wait a bit for canvas to render
    await new Promise(resolve => setTimeout(resolve, 100));

    const icons: any = {};

    // Generate all standard icons
    for (let i = 0; i < ICON_SIZES.length; i++) {
      const { name, size } = ICON_SIZES[i];
      const key = name.replace(/-/g, '');
      icons[key] = generateIcon(size);
      setGeneratedCount(i + 1);
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Generate maskable icons
    icons.icon192Maskable = generateMaskableIcon(192);
    setGeneratedCount(prev => prev + 1);
    await new Promise(resolve => setTimeout(resolve, 50));

    icons.icon512Maskable = generateMaskableIcon(512);
    setGeneratedCount(prev => prev + 1);

    setIsGenerating(false);
    setShowSuccess(true);
    onIconsGenerated(icons);

    setTimeout(() => setShowSuccess(false), 3000);
  };

  const downloadIcon = (dataUrl: string, name: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${name}.png`;
    link.click();
  };

  const handleDownloadAll = async () => {
    updateCanvas();
    await new Promise(resolve => setTimeout(resolve, 100));

    for (const { name, size } of ICON_SIZES) {
      const dataUrl = generateIcon(size);
      downloadIcon(dataUrl, name);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Download maskable icons
    downloadIcon(generateMaskableIcon(192), 'icon-192-maskable');
    await new Promise(resolve => setTimeout(resolve, 100));
    downloadIcon(generateMaskableIcon(512), 'icon-512-maskable');
  };

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Sparkles size={20} className="text-purple-400" />
          Aperçu de l'Icône
        </h3>
        <div className="flex flex-col items-center gap-4">
          <canvas
            ref={canvasRef}
            className="w-64 h-64 rounded-2xl shadow-2xl border-2 border-white/20"
          />
          <div className="flex gap-2">
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/20 mb-1">
                <canvas
                  width="64"
                  height="64"
                  ref={(canvas) => {
                    if (canvas && canvasRef.current) {
                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        ctx.drawImage(canvasRef.current, 0, 0, 512, 512, 0, 0, 64, 64);
                      }
                    }
                  }}
                />
              </div>
              <p className="text-xs text-gray-400">64px</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/20 mb-1">
                <canvas
                  width="48"
                  height="48"
                  ref={(canvas) => {
                    if (canvas && canvasRef.current) {
                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        ctx.drawImage(canvasRef.current, 0, 0, 512, 512, 0, 0, 48, 48);
                      }
                    }
                  }}
                />
              </div>
              <p className="text-xs text-gray-400">48px</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/20 mb-1">
                <canvas
                  width="32"
                  height="32"
                  ref={(canvas) => {
                    if (canvas && canvasRef.current) {
                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        ctx.drawImage(canvasRef.current, 0, 0, 512, 512, 0, 0, 32, 32);
                      }
                    }
                  }}
                />
              </div>
              <p className="text-xs text-gray-400">32px</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customization */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Palette size={20} className="text-purple-400" />
          Personnalisation
        </h3>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <ImageIcon size={16} />
            Logo personnalisé
          </label>
          
          {!useCustomLogo ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="flex items-center justify-center gap-2 w-full bg-white/5 border-2 border-dashed border-white/20 hover:border-purple-500/50 hover:bg-white/10 rounded-lg px-4 py-8 cursor-pointer transition"
              >
                <Upload size={20} />
                <span>Cliquez pour importer votre logo</span>
              </label>
              <p className="text-xs text-gray-400 mt-2">
                Formats acceptés: PNG, JPG, SVG. Recommandé: image carrée, fond transparent
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden">
                {uploadedLogo && (
                  <img
                    src={uploadedLogo.src}
                    alt="Logo"
                    className="max-w-full max-h-full object-contain"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Logo importé</p>
                <p className="text-xs text-gray-400">
                  {uploadedLogo?.width} × {uploadedLogo?.height} px
                </p>
              </div>
              <button
                onClick={removeLogo}
                className="p-2 hover:bg-red-500/20 rounded-lg transition"
                title="Supprimer le logo"
              >
                <X size={18} className="text-red-400" />
              </button>
            </div>
          )}
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Couleur de fond</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer border border-white/20"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono"
                placeholder="#a855f7"
              />
            </div>
          </div>

          {!useCustomLogo && (
            <div>
              <label className="block text-sm font-medium mb-2">Couleur du texte</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer border border-white/20"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono"
                  placeholder="#ffffff"
                />
              </div>
            </div>
          )}
        </div>

        {/* Text (only if no custom logo) */}
        {!useCustomLogo && (
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Type size={16} />
              Texte (2 lettres max)
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 2))}
              maxLength={2}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-lg font-bold text-center uppercase"
              placeholder="TB"
            />
          </div>
        )}

        {/* Style */}
        <div>
          <label className="block text-sm font-medium mb-2">Style</label>
          <div className="grid grid-cols-2 gap-2">
            {STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`p-3 rounded-lg border-2 transition text-left ${
                  style === s.id
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="font-bold text-sm mb-1">{s.name}</div>
                <div className="text-xs text-gray-400">{s.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={handleGenerateAll}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 text-lg"
        >
          {isGenerating ? (
            <>
              <RefreshCw size={20} className="animate-spin" />
              Génération... {generatedCount}/15
            </>
          ) : showSuccess ? (
            <>
              <Check size={20} />
              Icônes générées !
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Générer toutes les icônes PWA
            </>
          )}
        </button>

        <button
          onClick={handleDownloadAll}
          className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
        >
          <Download size={18} />
          Télécharger toutes les icônes
        </button>
      </div>

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-sm text-blue-300">
          💡 <strong>15 icônes</strong> seront générées automatiquement pour iOS et Android. Elles seront appliquées immédiatement à votre PWA.
        </p>
      </div>
    </div>
  );
};
