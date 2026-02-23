import React, { useEffect } from 'react';
import { ProductFilters, FilterState } from './ProductFilters';
import { useProductSearch } from '../hooks/useProductSearch';
import { LazyImage } from '../components/LazyImage';
import { generateSrcSet, generateSizes } from '../utils/imageOptimization';

export const ProductSearchPage: React.FC = () => {
  const { products, categories, loading, error, searchProducts } = useProductSearch();

  // Initial load
  useEffect(() => {
    searchProducts({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
    });
  }, [searchProducts]);

  const handleFilterChange = (filters: FilterState) => {
    searchProducts(filters);
  };

  return (
    <div className="min-h-screen bg-black p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 bg-black">
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-slate-500/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${8 + Math.random() * 12}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.6 + 0.1
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-slate-100 mb-2">Catalogue</h1>
          <p className="text-slate-500">Découvrez notre collection exclusive</p>
        </div>
        
        {/* Filters */}
        <ProductFilters 
          onFilterChange={handleFilterChange}
          categories={categories}
        />

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-700"></div>
            <p className="text-slate-300 mt-4">Chargement...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4 mb-4">
            <p className="text-red-300">Erreur: {error}</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-500 text-lg">Aucun produit trouvé</p>
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className="group relative bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 rounded-2xl overflow-hidden border border-slate-800/60 hover:border-slate-700/80 transition-all duration-300 hover:shadow-xl hover:shadow-slate-950/40 flex flex-col h-full"
                >
                  {/* Badge */}
                  <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <span className="px-3 py-1.5 bg-slate-800/70 text-slate-200 text-xs font-semibold rounded-full shadow-lg shadow-slate-950/50 border border-slate-700/50">
                      Nouveau
                    </span>
                  </div>

                  {/* Product Image Container */}
                  <div className="relative h-64 bg-gradient-to-br from-slate-800/30 to-slate-950 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/60 z-10"></div>
                    {product.imageUrl ? (
                      <LazyImage
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        srcSet={generateSrcSet(product.imageUrl, [320, 640, 960])}
                        sizes={generateSizes({
                          '640px': '100vw',
                          '1024px': '50vw',
                        })}
                      />
                    ) : (
                      <div className="text-slate-700/30 text-7xl group-hover:scale-125 transition-transform duration-500">📦</div>
                    )}
                    
                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center">
                      <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold rounded-xl shadow-lg shadow-slate-950/50 transition-all transform hover:scale-105 border border-slate-700/50">
                        Aperçu
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col">
                    {/* Category Badge */}
                    {product.category && (
                      <div className="flex items-center gap-2">
                        <span className="inline-block px-3 py-1 bg-slate-800/40 hover:bg-slate-800/60 text-slate-400 text-xs font-semibold rounded-full transition-colors border border-slate-700/40 uppercase tracking-wider">
                          {product.category}
                        </span>
                      </div>
                    )}
                    
                    {/* Title */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-100 leading-tight group-hover:text-slate-200 transition-colors duration-300">
                        {product.name}
                      </h3>
                    </div>
                    
                    {/* Description */}
                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed flex-1">
                      {product.description}
                    </p>
                    
                    {/* Sizes and Colors */}
                    {(product.sizes?.length > 0 || product.colors?.length > 0) && (
                      <div className="space-y-2 py-3 border-t border-slate-800/40">
                        {product.sizes && product.sizes.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-slate-600 font-semibold uppercase tracking-wider">Tailles:</span>
                            <div className="flex gap-1.5 flex-wrap">
                              {product.sizes.map((size, idx) => (
                                <span key={idx} className="px-2 py-1 bg-slate-800/30 text-slate-400 text-xs font-medium rounded-lg border border-slate-700/40 hover:border-slate-600/60 transition-colors">
                                  {size}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {product.colors && product.colors.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-600 font-semibold uppercase tracking-wider">Couleurs:</span>
                            <div className="flex gap-1.5">
                              {product.colors.slice(0, 3).map((color, idx) => (
                                <div 
                                  key={idx} 
                                  className="w-5 h-5 rounded-full border-2 border-slate-600/50 hover:border-slate-400/80 transition-all shadow-md"
                                  style={{ backgroundColor: color }}
                                  title={color}
                                />
                              ))}
                              {product.colors.length > 3 && (
                                <span className="text-xs text-slate-600 font-medium px-2 py-1">+{product.colors.length - 3}</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Price and Action */}
                    <div className="pt-4 border-t border-slate-800/40 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs text-slate-600 uppercase tracking-wider font-semibold mb-1">Prix</p>
                        <span className="text-2xl font-bold text-slate-200">
                          {product.price}€
                        </span>
                      </div>
                      <button className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-slate-950/30 hover:shadow-slate-950/50 uppercase tracking-wider text-sm border border-slate-700/50 hover:border-slate-600/70">
                        Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && products.length > 0 && (
          <div className="mt-6 text-center text-slate-500">
            {products.length} produit{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};
