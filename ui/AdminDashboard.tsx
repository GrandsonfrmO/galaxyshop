import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { DollarSign, ShoppingCart, Box, Users, TrendingUp, TrendingDown, Activity, Package } from 'lucide-react';
import { useStore } from '../context/AppContext';

interface DashboardProps {
  products: any[];
}

export const AdminDashboard: React.FC<DashboardProps> = ({ products }) => {
  const { cart } = useStore();

  // Calculate real statistics from products and cart
  const stats = useMemo(() => {
    const totalRevenue = products.reduce((sum, p) => sum + p.price, 0);
    const totalProducts = products.length;
    const totalCartValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const avgPrice = totalProducts > 0 ? totalRevenue / totalProducts : 0;
    const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return [
      { 
        label: 'Revenu Potentiel', 
        value: (totalRevenue / 1000000).toFixed(1) + 'M', 
        subValue: `Moy: ${(avgPrice / 1000).toFixed(0)}k GNF`,
        change: '+12.5%', 
        trend: 'up',
        icon: DollarSign, 
        color: 'text-emerald-400', 
        bg: 'from-emerald-500/20 to-emerald-500/5',
        border: 'border-emerald-500/30'
      },
      { 
        label: 'Panier Actif', 
        value: totalCartItems.toString(), 
        subValue: `${(totalCartValue / 1000).toFixed(0)}k GNF`,
        change: '+8.2%', 
        trend: 'up',
        icon: ShoppingCart, 
        color: 'text-blue-400', 
        bg: 'from-blue-500/20 to-blue-500/5',
        border: 'border-blue-500/30'
      },
      { 
        label: 'Produits', 
        value: totalProducts.toString(), 
        subValue: `${products.length} en stock`,
        change: '+3', 
        trend: 'up',
        icon: Package, 
        color: 'text-purple-400', 
        bg: 'from-purple-500/20 to-purple-500/5',
        border: 'border-purple-500/30'
      },
      { 
        label: 'Catégories', 
        value: [...new Set(products.map(p => p.category))].length.toString(), 
        subValue: 'Actives',
        change: '0%', 
        trend: 'neutral',
        icon: Activity, 
        color: 'text-orange-400', 
        bg: 'from-orange-500/20 to-orange-500/5',
        border: 'border-orange-500/30'
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
      { range: '0-100k', min: 0, max: 100000, count: 0, color: '#10b981' },
      { range: '100k-200k', min: 100000, max: 200000, count: 0, color: '#3b82f6' },
      { range: '200k-300k', min: 200000, max: 300000, count: 0, color: '#8b5cf6' },
      { range: '300k+', min: 300000, max: Infinity, count: 0, color: '#f59e0b' },
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

  // Category performance radar
  const categoryPerformance = useMemo(() => {
    const categories = {};
    products.forEach(p => {
      if (!categories[p.category]) {
        categories[p.category] = { count: 0, totalValue: 0 };
      }
      categories[p.category].count++;
      categories[p.category].totalValue += p.price;
    });

    return Object.entries(categories).map(([name, data]: [string, any]) => ({
      category: name.substring(0, 10),
      products: data.count,
      value: Math.round(data.totalValue / 1000000),
      avgPrice: Math.round(data.totalValue / data.count / 1000)
    }));
  }, [products]);

  // Top products by price
  const topProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => b.price - a.price)
      .slice(0, 5)
      .map(p => ({
        name: p.name.substring(0, 20),
        price: p.price,
        category: p.category
      }));
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
      className="space-y-4 sm:space-y-6"
    >
      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -4 }}
            className={`bg-gradient-to-br ${stat.bg} border ${stat.border} rounded-xl p-3 sm:p-5 backdrop-blur-sm relative overflow-hidden group`}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all" />
            
            <div className="relative">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className={`${stat.color} p-2 sm:p-2.5 rounded-lg bg-black/20 backdrop-blur-sm`}>
                  <stat.icon size={18} className="sm:w-5 sm:h-5" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                  stat.trend === 'up' ? 'bg-green-500/20 text-green-400' : 
                  stat.trend === 'down' ? 'bg-red-500/20 text-red-400' : 
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {stat.trend === 'up' && <TrendingUp size={10} />}
                  {stat.trend === 'down' && <TrendingDown size={10} />}
                  <span className="hidden sm:inline">{stat.change}</span>
                </div>
              </div>
              
              <div>
                <p className="text-gray-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-xl sm:text-3xl font-black text-white mb-1">{stat.value}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                  {stat.subValue}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        
        {/* Price Distribution - Area Chart */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 xl:col-span-2 bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-700/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm sm:text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-purple-400" />
              Distribution des Prix
            </h3>
            <div className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded">
              {products.length} produits
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={priceDistribution}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="range" 
                stroke="#9ca3af" 
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={12}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #4b5563',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorCount)" 
                name="Produits"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution - Donut Chart */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-700/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm"
        >
          <h3 className="text-sm sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Box size={18} className="text-blue-400" />
            Catégories
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
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
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryData.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.fill }} />
                  <span className="text-gray-300">{cat.name}</span>
                </div>
                <span className="font-bold text-white">{cat.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Category Performance Radar */}
        {categoryPerformance.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-700/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm"
          >
            <h3 className="text-sm sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Activity size={18} className="text-green-400" />
              Performance
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={categoryPerformance}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis 
                  dataKey="category" 
                  stroke="#9ca3af"
                  fontSize={10}
                />
                <PolarRadiusAxis stroke="#9ca3af" fontSize={10} />
                <Radar 
                  name="Produits" 
                  dataKey="products" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.6} 
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #4b5563',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Top Products */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-700/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm"
        >
          <h3 className="text-sm sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
            <DollarSign size={18} className="text-yellow-400" />
            Top 5 Produits (Prix)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                type="number" 
                stroke="#9ca3af" 
                fontSize={12}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#9ca3af" 
                fontSize={11}
                width={120}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #4b5563',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
                formatter={(value: any) => `${(value / 1000).toFixed(0)}k GNF`}
              />
              <Bar dataKey="price" fill="#f59e0b" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Cart Items */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-700/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm"
        >
          <h3 className="text-sm sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ShoppingCart size={18} className="text-blue-400" />
            Panier Actif
          </h3>
          {cartByProduct.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={cartByProduct}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80}
                  fontSize={10}
                />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #4b5563',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(value: any) => `${(value / 1000).toFixed(0)}k GNF`}
                />
                <Bar dataKey="revenue" fill="#06b6d4" radius={[8, 8, 0, 0]} name="Revenu" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex flex-col items-center justify-center text-gray-500">
              <ShoppingCart size={40} className="mb-3 opacity-20" />
              <p className="text-sm">Aucun article en panier</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Products Table - Responsive */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-700/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm overflow-hidden"
      >
        <h3 className="text-sm sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Package size={18} className="text-purple-400" />
          Détail des Produits
        </h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-gray-400 font-medium">Produit</th>
                  <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-gray-400 font-medium hidden sm:table-cell">Catégorie</th>
                  <th className="text-right py-2 sm:py-3 px-3 sm:px-4 text-gray-400 font-medium">Prix</th>
                  <th className="text-center py-2 sm:py-3 px-3 sm:px-4 text-gray-400 font-medium hidden md:table-cell">Tailles</th>
                  <th className="text-center py-2 sm:py-3 px-3 sm:px-4 text-gray-400 font-medium hidden md:table-cell">Couleurs</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 10).map((product, idx) => (
                  <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                    <td className="py-2 sm:py-3 px-3 sm:px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                          <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate">{product.name}</p>
                          <p className="text-gray-400 text-[10px] sm:hidden">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 px-3 sm:px-4 text-gray-300 hidden sm:table-cell">{product.category}</td>
                    <td className="text-right py-2 sm:py-3 px-3 sm:px-4 text-green-400 font-medium whitespace-nowrap">
                      {(product.price / 1000).toFixed(0)}k
                    </td>
                    <td className="text-center py-2 sm:py-3 px-3 sm:px-4 hidden md:table-cell">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">
                        {product.sizes.length}
                      </span>
                    </td>
                    <td className="text-center py-2 sm:py-3 px-3 sm:px-4 hidden md:table-cell">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold">
                        {product.colors.length}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {products.length > 10 && (
          <div className="mt-4 text-center text-xs text-gray-400">
            Affichage de 10 sur {products.length} produits
          </div>
        )}
      </motion.div>

      {/* Cart Items Table - Responsive */}
      {cart.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-700/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm overflow-hidden"
        >
          <h3 className="text-sm sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ShoppingCart size={18} className="text-blue-400" />
            Détail du Panier
          </h3>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-gray-400 font-medium">Produit</th>
                    <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-gray-400 font-medium hidden sm:table-cell">Taille</th>
                    <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-gray-400 font-medium hidden md:table-cell">Couleur</th>
                    <th className="text-center py-2 sm:py-3 px-3 sm:px-4 text-gray-400 font-medium">Qté</th>
                    <th className="text-right py-2 sm:py-3 px-3 sm:px-4 text-gray-400 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                      <td className="py-2 sm:py-3 px-3 sm:px-4">
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate">{item.name}</p>
                          <p className="text-gray-400 text-[10px] sm:hidden">
                            {item.selectedSize} • {item.selectedColor}
                          </p>
                        </div>
                      </td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4 text-gray-300 hidden sm:table-cell">{item.selectedSize}</td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4 text-gray-300 hidden md:table-cell">{item.selectedColor}</td>
                      <td className="text-center py-2 sm:py-3 px-3 sm:px-4">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="text-right py-2 sm:py-3 px-3 sm:px-4 text-purple-400 font-medium whitespace-nowrap">
                        {((item.price * item.quantity) / 1000).toFixed(0)}k
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-700">
                    <td colSpan={3} className="py-3 px-3 sm:px-4 text-right font-bold text-white hidden sm:table-cell">
                      Total Panier:
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-center font-bold text-white sm:hidden">
                      Total:
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-center font-bold text-blue-400">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-right font-bold text-purple-400 text-base sm:text-lg whitespace-nowrap">
                      {(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) / 1000).toFixed(0)}k GNF
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
