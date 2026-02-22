import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Grid2X2, Grid3X3, List, LayoutGrid } from 'lucide-react';
import { Product } from './types';

// Mock products for testing
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'T-Shirt Neon Vanguard',
    description: 'T-shirt premium avec logo brodé',
    price: 45000,
    category: 'Vêtements',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Noir', 'Blanc', 'Gris'],
    position: [0, 0, 0]
  },
  {
    id: '2',
    name: 'Pantalon Cargo',
    description: 'Pantalon cargo confortable et stylé',
    price: 65000,
    category: 'Pantalons',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=400&fit=crop',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Noir', 'Kaki', 'Bleu'],
    position: [0, 0, 0]
  },
  {
    id: '3',
    name: 'Casquette Édition Limitée',
    description: 'Casquette exclusive avec broderie',
    price: 25000,
    category: 'Accessoires',
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop',
    sizes: ['One Size'],
    colors: ['Noir', 'Blanc'],
    position: [0, 0, 0]
  },
  {
    id: '4',
    name: 'Sneakers Premium',
    description: 'Chaussures de sport haute performance',
    price: 120000,
    category: 'Chaussures',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
    colors: ['Noir', 'Blanc', 'Gris', 'Bleu'],
    position: [0, 0, 0]
  },
  {
    id: '5',
    name: 'Veste Bomber',
    description: 'Veste bomber tendance',
    price: 95000,
    category: 'Vêtements',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400&h=400&fit=crop',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Noir', 'Bleu', 'Rouge'],
    position: [0, 0, 0]
  },
  {
    id: '6',
    name: 'Sac à Dos',
    description: 'Sac à dos ergonomique et spacieux',
    price: 55000,
    category: 'Accessoires',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    sizes: ['One Size'],
    colors: ['Noir', 'Gris', 'Bleu'],
    position: [0, 0, 0]
  }
];

type LayoutType = 'grid-2' | 'grid-3' | 'grid-4' | 'list' | 'compact';

interface LayoutConfig {
  name: string;
  icon: React.ReactNode;
  gridClass: string;
  cardClass: string;
  showDescription: boolean;
  showColors: boolean;
  showSizes: boolean;
}

const LAYOUTS: Record<LayoutType, LayoutConfig> = {
  'grid-2': {
    name: 'Grille 2 colonnes',
    icon: <Grid2X2 size={18} />,
    gridClass: 'grid-cols-2',
    cardClass: 'p-2 sm:p-3',
    showDescription: false,
    showColors: false,
    showSizes: false
  },
  'grid-3': {
    name: 'Grille 3 colonnes',
    icon: <Grid3X3 size={18} />,
    gridClass: 'grid-cols-3',
    cardClass: 'p-3 sm:p-4',
    showDescription: true,
    showColors: true,
    showSizes: false
  },
  'grid-4': {
    name: 'Grille 4 colonnes',
    icon: <LayoutGrid size={18} />,
    gridClass: 'grid-cols-4',
    cardClass: 'p-2 sm:p-3',
    showDescription: false,
    showColors: false,
    showSizes: false
  },
  'list': {
    name: 'Liste détaillée',
    icon: <List size={18} />,
    gridClass: 'grid-cols-1',
    cardClass: 'p-4 sm:p-6 flex gap-4',
    showDescription: true,
    showColors: true,
    showSizes: true
  },
  'compact': {
    name: 'Compact',
    icon: <Grid2X2 size={18} />,
    gridClass: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
    cardClass: 'p-2',
    showDescription: false,
    showColors: false,
    showSizes: false
  }
};

export const ProductLayoutTest: React.FC = () => {
  const [layout, setLayout] = useState<LayoutType>('grid-2');
  const config = LAYOUTS[layout];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Test de Mise en Page Produits</h1>
          <p className="text-gray-400">Testez différentes mises en page pour l'affichage des produits</p>
        </div>

        {/* Layout Selector */}
        <div className="mb-8 flex flex-wrap gap-2">
          {(Object.entries(LAYOUTS) as [LayoutType, LayoutConfig][]).map(([key, layoutConfig]) => (
            <button
              key={key}
              onClick={() => setLayout(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                layout === key
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {layoutConfig.icon}
              {layoutConfig.name}
            </button>
          ))}
        </div>

        {/* Layout Info */}
        <div className="mb-6 bg-white/5 border border-white/10 rounded-lg p-4">
          <p className="text-sm text-gray-300">
            <strong>Configuration actuelle:</strong> {config.name}
            {config.showDescription && ' • Description visible'}
            {config.showColors && ' • Couleurs visibles'}
            {config.showSizes && ' • Tailles visibles'}
          </p>
        </div>

        {/* Products Grid */}
        <div className={`grid ${config.gridClass} gap-2 sm:gap-4`}>
          {MOCK_PRODUCTS.map(product => (
            <motion.div
              key={product.id}
              layout
              className={`bg-white/5 border border-white/10 rounded-lg hover:border-purple-500/50 transition ${config.cardClass}`}
            >
              {layout === 'list' ? (
                // List Layout
                <>
                  <div className="w-32 h-32 flex-shrink-0">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-400 mb-2">{product.category}</p>
                    {config.showDescription && (
                      <p className="text-sm text-gray-300 mb-3">{product.description}</p>
                    )}
                    <p className="text-lg font-mono font-bold text-purple-400 mb-3">
                      {product.price.toLocaleString()} GNF
                    </p>
                    {config.showColors && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-400 mb-1">Couleurs:</p>
                        <div className="flex flex-wrap gap-1">
                          {product.colors.slice(0, 3).map(color => (
                            <span key={color} className="text-xs bg-white/10 px-2 py-1 rounded">
                              {color}
                            </span>
                          ))}
                          {product.colors.length > 3 && (
                            <span className="text-xs text-gray-400">+{product.colors.length - 3}</span>
                          )}
                        </div>
                      </div>
                    )}
                    {config.showSizes && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-400 mb-1">Tailles:</p>
                        <div className="flex flex-wrap gap-1">
                          {product.sizes.slice(0, 4).map(size => (
                            <span key={size} className="text-xs bg-white/10 px-2 py-1 rounded">
                              {size}
                            </span>
                          ))}
                          {product.sizes.length > 4 && (
                            <span className="text-xs text-gray-400">+{product.sizes.length - 4}</span>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button className="flex-1 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 py-2 rounded text-xs font-medium transition flex items-center justify-center gap-1">
                        <Edit2 size={12} /> Modifier
                      </button>
                      <button className="flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-300 py-2 rounded text-xs font-medium transition flex items-center justify-center gap-1">
                        <Trash2 size={12} /> Supprimer
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // Grid Layouts
                <>
                  <div className="aspect-square bg-white/5 rounded-lg mb-2 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-gray-400 mb-2">{product.category}</p>
                  {config.showDescription && (
                    <p className="text-xs text-gray-300 mb-2 line-clamp-2">{product.description}</p>
                  )}
                  <p className="text-xs sm:text-sm font-mono font-bold text-purple-400 mb-2">
                    {product.price.toLocaleString()} GNF
                  </p>
                  {config.showColors && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-400 mb-1">Couleurs:</p>
                      <div className="flex flex-wrap gap-0.5">
                        {product.colors.slice(0, 2).map(color => (
                          <span key={color} className="text-xs bg-white/10 px-1.5 py-0.5 rounded">
                            {color}
                          </span>
                        ))}
                        {product.colors.length > 2 && (
                          <span className="text-xs text-gray-400">+{product.colors.length - 2}</span>
                        )}
                      </div>
                    </div>
                  )}
                  {config.showSizes && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-400 mb-1">Tailles:</p>
                      <div className="flex flex-wrap gap-0.5">
                        {product.sizes.slice(0, 2).map(size => (
                          <span key={size} className="text-xs bg-white/10 px-1.5 py-0.5 rounded">
                            {size}
                          </span>
                        ))}
                        {product.sizes.length > 2 && (
                          <span className="text-xs text-gray-400">+{product.sizes.length - 2}</span>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-1">
                    <button className="flex-1 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 py-1 rounded text-xs font-medium transition flex items-center justify-center gap-0.5">
                      <Edit2 size={10} /> Modifier
                    </button>
                    <button className="flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-300 py-1 rounded text-xs font-medium transition flex items-center justify-center gap-0.5">
                      <Trash2 size={10} /> Supprimer
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-8 bg-white/5 border border-white/10 rounded-lg p-4">
          <p className="text-sm text-gray-300">
            <strong>Total produits:</strong> {MOCK_PRODUCTS.length} • 
            <strong className="ml-4">Colonnes:</strong> {layout === 'grid-2' ? '2' : layout === 'grid-3' ? '3' : layout === 'grid-4' ? '4' : layout === 'list' ? '1 (liste)' : 'Responsive'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductLayoutTest;
