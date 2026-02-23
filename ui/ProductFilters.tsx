import React, { useState, useEffect } from 'react';

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  categories: string[];
}

export interface FilterState {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  sortBy: 'name' | 'price' | 'created_at';
  sortOrder: 'asc' | 'desc';
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({ onFilterChange, categories }) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleReset = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 mb-4 space-y-4">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Rechercher
        </label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          placeholder="Nom ou description..."
          className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Category and Price Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Catégorie
          </label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Toutes</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-gray-800">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Prix min (€)
          </label>
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            placeholder="0"
            min="0"
            step="0.01"
            className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Prix max (€)
          </label>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            placeholder="1000"
            min="0"
            step="0.01"
            className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Sort Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Trier par
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
            className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="created_at" className="bg-gray-800">Date d'ajout</option>
            <option value="name" className="bg-gray-800">Nom</option>
            <option value="price" className="bg-gray-800">Prix</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Ordre
          </label>
          <select
            value={filters.sortOrder}
            onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as any })}
            className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="desc" className="bg-gray-800">Décroissant</option>
            <option value="asc" className="bg-gray-800">Croissant</option>
          </select>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="w-full px-4 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-colors"
      >
        Réinitialiser les filtres
      </button>
    </div>
  );
};
