import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { DollarSign, ShoppingCart, Box, Users, TrendingUp } from 'lucide-react';
import { useStore } from '../store/useStore';

interface DashboardProps {
  products: any[];
}

export const AdminDashboard: React.FC<DashboardProps> = ({ products }) => {
  const cart = useStore(state => state.cart);

  // Calculate real statistics from products and cart
  const stats = useMemo(() => {
    const totalRevenue = products.reduce((sum, p) => sum + p.price, 0);
    const totalOrders = cart.length;
    const totalProducts = products.length;
    const totalCartValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return [
      { 
        label: 'Revenu Potentiel', 
        value: (totalRevenue / 1000000).toFixed(1) + 'M', 
        prefix: 'GNF', 
        change: `${totalProducts} produits`, 
        icon: DollarSign, 
        color: 'text-green-400', 
        bg: 'bg-green-500/10' 
      },
      { 
        label: 'Articles en Panier', 
        value: cart.length.toString(), 
        change: `${totalCartValue.toLocaleString('fr-GN')} GNF`, 
        icon: ShoppingCart, 
        color: 'text-blue-400', 
        bg: 'bg-blue-500/10' 
      },
      { 
        label: 'Produits Actifs', 
        value: totalProducts.toString(), 
        change: `${products.length} en stock`, 
        icon: Box, 
        color: 'text-purple-400', 
        bg: 'bg-purple-500/10' 
      },
      { 
        label: 'Catégories', 
        value: [...new Set(products.map(p => p.category))].length.toString(), 
        change: 'Uniques', 
        icon: Users, 
        color: 'text-red-400', 
        bg: 'bg-red-500/10' 
      },
    ];
  }, [products, cart]);

  // Real product data for charts
  const productChartData = useMemo(() => {
    return products.map(p => ({
      name: p.name.substring(0, 15),
      price: p.price,
      category: p.category,
    }));
  }, [products]);

  // Category distribution from real products
  const categoryData = useMemo(() => {
    const categories = {};
    products.forEach(p => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });

    const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
    return Object.entries(categories).map(([name, count], idx) => ({
      name,
      value: count as number,
      fill: colors[idx % colors.length],
    }));
  }, [products]);

  // Cart items by product
  const cartByProduct = useMemo(() => {
    const cartData = {};
    cart.forEach(item => {
      if (!cartData[item.name]) {
        cartData[item.name] = { name: item.name, quantity: 0, revenue: 0 };
      }
      cartData[item.name].quantity += item.quantity;
      cartData[item.name].revenue += item.price * item.quantity;
    });
    return Object.values(cartData).sort((a: any, b: any) => b.revenue - a.revenue).slice(0, 5);
  }, [cart]);

  // Price distribution chart
  const priceDistribution = useMemo(() => {
    const ranges = [
      { range: '0-100k', min: 0, max: 100000, count: 0 },
      { range: '100k-200k', min: 100000, max: 200000, count: 0 },
      { range: '200k-300k', min: 200000, max: 300000, count: 0 },
      { range: '300k+', min: 300000, max: Infinity, count: 0 },
    ];

    products.forEach(p => {
      ranges.forEach(r => {
        if (p.price >= r.min && p.price < r.max) {
          r.count++;
        }
      });
    });

    return ranges.filter(r => r.count > 0);
  }, [products]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className={`${stat.bg} border border-gray-700 rounded-lg p-6 backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                <p className="text-sm mt-2 text-gray-400">
                  {stat.change}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg bg-gray-800/50`}>
                <stat.icon size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Price Distribution */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-gray-900/50 border border-gray-700 rounded-lg p-6 backdrop-blur-sm"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-purple-400" />
            Distribution des Prix
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priceDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="range" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #4b5563',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="count" fill="#8b5cf6" name="Nombre de Produits" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 backdrop-blur-sm"
        >
          <h3 className="text-lg font-bold text-white mb-4">Catégories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} (${value})`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #4b5563',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Products & Cart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* All Products */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 backdrop-blur-sm"
        >
          <h3 className="text-lg font-bold text-white mb-4">Tous les Produits</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #4b5563',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value) => `${(value / 1000).toFixed(0)}k GNF`}
              />
              <Bar dataKey="price" fill="#10b981" name="Prix" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Cart Items */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 backdrop-blur-sm"
        >
          <h3 className="text-lg font-bold text-white mb-4">Articles en Panier</h3>
          {cartByProduct.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cartByProduct}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #4b5563',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value) => `${(value / 1000).toFixed(0)}k GNF`}
                />
                <Bar dataKey="revenue" fill="#06b6d4" name="Revenu" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Aucun article en panier
            </div>
          )}
        </motion.div>
      </div>

      {/* Products Table */}
      <motion.div
        variants={itemVariants}
        className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 backdrop-blur-sm"
      >
        <h3 className="text-lg font-bold text-white mb-4">Détail des Produits</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Produit</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Catégorie</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Prix</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Tailles</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Couleurs</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => (
                <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                  <td className="py-3 px-4 text-white font-medium">{product.name}</td>
                  <td className="py-3 px-4 text-gray-300">{product.category}</td>
                  <td className="text-right py-3 px-4 text-green-400 font-medium">{product.price.toLocaleString('fr-GN')} GNF</td>
                  <td className="text-right py-3 px-4 text-blue-400">{product.sizes.length}</td>
                  <td className="text-right py-3 px-4 text-purple-400">{product.colors.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Cart Items Table */}
      {cart.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 backdrop-blur-sm"
        >
          <h3 className="text-lg font-bold text-white mb-4">Détail du Panier</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Produit</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Taille</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Couleur</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Quantité</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Prix Unitaire</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                    <td className="py-3 px-4 text-white font-medium">{item.name}</td>
                    <td className="py-3 px-4 text-gray-300">{item.selectedSize}</td>
                    <td className="py-3 px-4 text-gray-300">{item.selectedColor}</td>
                    <td className="text-right py-3 px-4 text-blue-400">{item.quantity}</td>
                    <td className="text-right py-3 px-4 text-green-400">{item.price.toLocaleString('fr-GN')} GNF</td>
                    <td className="text-right py-3 px-4 text-purple-400 font-medium">{(item.price * item.quantity).toLocaleString('fr-GN')} GNF</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
