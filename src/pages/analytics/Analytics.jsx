import React from 'react';
import { motion } from 'framer-motion';
import api from '../../lib/axios';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  Package,
  Users,
  PieChart,
  BarChart3,
  Calendar,
  ArrowLeft,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const sellingPerformance = [
  { id: 1, title: 'Nordic Oak Dining Table', category: 'Tables', sales: 45, revenue: '$4,500', growth: '+15%', status: 'Best Seller' },
  { id: 2, title: 'Velvet Emerald Armchair', category: 'Chairs', sales: 32, revenue: '$3,840', growth: '+10%', status: 'Rising' },
  { id: 3, title: 'Minimalist Floor Lamp', category: 'Lighting', sales: 12, revenue: '$1,200', growth: '-5%', status: 'Low Stock' },
];

const Analytics = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = React.useState([]);
  const [avgRating, setAvgRating] = React.useState(0);
  const [revenue, setRevenue] = React.useState('$0.00');
  const [soldItems, setSoldItems] = React.useState('0');
  const [conversionRate, setConversionRate] = React.useState('0.0%');
  const [bestSellers, setBestSellers] = React.useState(sellingPerformance);
  const [loading, setLoading] = React.useState(true);

  const storeId = localStorage.getItem('storeId');

  React.useEffect(() => {
    if (!storeId) return;

    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Reviews & Rating
        const revRes = await api.get(`/Review/store/${storeId}`);
        const revData = Array.isArray(revRes.data) ? revRes.data : [];
        setReviews(revData);
        if (revData.length > 0) {
          const avg = revData.reduce((acc, curr) => acc + curr.rating, 0) / revData.length;
          setAvgRating(avg.toFixed(1));
        }

        // 2. Fetch Orders for Revenue & Sold Items fallback
        try {
          const ordersRes = await api.get(`/Order/store/${storeId}`);
          const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
          const totalRev = orders.reduce((sum, o) => sum + (Number(o.totalAmount || o.totalPayment || 0)), 0);
          setRevenue(`$${totalRev.toLocaleString()}`);

          // Assuming each order has products/items
          let totalSold = 0;
          orders.forEach(o => {
            if (o.items && Array.isArray(o.items)) totalSold += o.items.length;
            else totalSold += 1; // Fallback: count order as 1 item
          });
          setSoldItems(totalSold.toLocaleString());
        } catch (e) {
          console.log("Revenue/Orders API fallback failed");
        }

        // 3. Fetch Products for Best Sellers
        try {
          const prodRes = await api.get(`/Store/${storeId}/products`);
          const products = Array.isArray(prodRes.data) ? prodRes.data : [];

          // Derivate best sellers (top 3 by rating)
          if (products.length > 0) {
            const sorted = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);
            const sellers = sorted.map((p, i) => ({
              id: p.productId || p.id || i,
              title: p.name,
              category: p.categoryName || 'Furniture',
              sales: Math.floor(Math.random() * 20) + 10, // Mock sales as we don't have per-product sales count
              revenue: `$${(p.price * 10).toLocaleString()}`,
              growth: '+5%',
              status: p.rating > 4.5 ? 'Best Seller' : 'Popular'
            }));
            setBestSellers(sellers);
          }
        } catch (e) {
          console.log("Products API for best sellers failed");
        }

        // 4. Try dedicated Analytics endpoint
        try {
          const statsRes = await api.get(`/Analytics/store/${storeId}`);
          if (statsRes.data) {
            if (statsRes.data.revenue) setRevenue(`$${Number(statsRes.data.revenue).toLocaleString()}`);
            if (statsRes.data.soldItems) setSoldItems(statsRes.data.soldItems.toString());
            if (statsRes.data.conversionRate) setConversionRate(`${statsRes.data.conversionRate}%`);
          }
        } catch (e) {
          // Silent fail
        }

      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [storeId]);

  const stats = [
    { id: 1, label: 'Store Earnings', value: revenue, trend: '+12.5%', isUp: true, icon: ShoppingBag, color: '#205457' },
    { id: 2, label: 'Sold Items', value: soldItems, trend: '+3.2%', isUp: true, icon: Package, color: '#89917D' },
    { id: 3, label: 'Avg Rating', value: avgRating > 0 ? avgRating : 'N/A', trend: reviews.length > 0 ? `${reviews.length} reviews` : 'No reviews', isUp: true, icon: Star, color: '#B19470' },
    { id: 4, label: 'Conversion Rate', value: conversionRate, trend: '+0.5%', isUp: true, icon: TrendingUp, color: '#205457' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const fadeInUp = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-[90px] lg:pt-[110px] px-6 lg:px-16 pb-24 font-outfit">
      <motion.div
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <button
              onClick={() => navigate('/seller-home')}
              className="flex items-center gap-2 text-gray-400 hover:text-[#205457] transition-colors mb-4 group text-sm font-medium"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Success <span className="text-[#205457]">Analytics</span>
            </h1>
            <p className="text-gray-400 mt-2 font-light">
              Detailed insights into your store performance and sales trends.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
            <button className="px-5 py-2 rounded-xl text-sm font-bold bg-[#205457] text-white">Monthly</button>
            <button className="px-5 py-2 rounded-xl text-sm font-bold text-gray-400 hover:bg-gray-50 transition-all">Yearly</button>
          </div>
        </motion.div>

        {/* Growth Overview Stats */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={fadeInUp}
        >
          {stats.map((stat) => (
            <div key={stat.id} className="bg-white p-8 rounded-[35px] shadow-[0_15px_40px_rgba(0,0,0,0.02)] border border-gray-50">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gray-50">
                  <stat.icon size={22} style={{ color: stat.color }} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-black ${stat.isUp ? 'text-green-500' : 'text-red-500'} bg-gray-50 px-2 py-1 rounded-lg`}>
                  {stat.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.trend}
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-400 mb-1 uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 tracking-tight tabular-nums">{stat.value}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Performance Chart Placeholder */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-[40px] p-10 shadow-[0_15px_40px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col"
            variants={fadeInUp}
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <BarChart3 className="text-[#205457]" size={24} />
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Revenue Trends</h3>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-[#205457]" /> This Month
                </span>
                <span className="flex items-center gap-2 text-xs font-bold text-gray-400 ml-4">
                  <div className="w-2 h-2 rounded-full bg-[#89917D]/30" /> Last Month
                </span>
              </div>
            </div>

            {/* Abstract Chart Representation */}
            <div className="flex-1 min-h-[300px] flex items-end justify-between gap-4 pb-4">
              {[40, 70, 45, 90, 65, 80, 50, 85, 95, 60, 75, 100].map((h, i) => (
                <div key={i} className="flex-1 group relative">
                  <div
                    className="w-full bg-[#205457]/10 rounded-t-xl transition-all duration-500 group-hover:bg-[#205457] cursor-pointer"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ${(h * 150).toLocaleString()}
                    </div>
                  </div>
                  <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                    {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][i]}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Side Distribution */}
          <motion.div
            className="bg-white rounded-[40px] p-10 shadow-[0_15px_40px_rgba(0,0,0,0.02)] border border-gray-50"
            variants={fadeInUp}
          >
            <div className="flex items-center gap-3 mb-10">
              <PieChart className="text-[#B19470]" size={22} />
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">Best Sellers</h3>
            </div>

            <div className="space-y-8">
              {loading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 w-full animate-pulse bg-gray-50 rounded-2xl" />
                  ))}
                </div>
              ) : bestSellers.map((item) => (
                <div key={item.id} className="relative">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="font-bold text-gray-900 text-sm leading-tight mb-1 truncate max-w-[150px]">{item.title}</p>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#89917D] bg-[#89917D]/10 px-2 py-1 rounded">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-400">{item.revenue}</p>
                  </div>
                  <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#205457] rounded-full"
                      style={{ width: `${(item.sales / 50) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-10 py-4 rounded-2xl border border-dashed border-gray-100 text-gray-400 font-bold text-xs uppercase tracking-widest hover:border-[#205457] hover:text-[#205457] transition-all">
              Download Full Report
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
