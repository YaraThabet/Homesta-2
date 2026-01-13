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
  const [monthlyData, setMonthlyData] = React.useState(new Array(12).fill(0));
  const [loading, setLoading] = React.useState(true);

  const storeId = localStorage.getItem('storeId');

  const [chartData, setChartData] = React.useState([]);

  React.useEffect(() => {
    if (!storeId) {
      setLoading(false);
      return;
    }

    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Reviews & Rating
        const revRes = await api.get(`/Review/store/${storeId}`);
        const revData = Array.isArray(revRes.data) ? revRes.data : [];
        setReviews(revData);
        if (revData.length > 0) {
          const avg = revData.reduce((acc, curr) => acc + (curr.rating || 0), 0) / revData.length;
          setAvgRating(avg.toFixed(1));
        }

        // 2. Fetch Orders for Real Data Aggregation
        try {
          const ordersRes = await api.get(`Order/by-store/${storeId}`);
          const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];

          // Total Revenue - strictly from DELIVERED
          const deliveredRev = orders.reduce((sum, o) => {
            if (o.status?.toLowerCase() !== 'delivered') return sum;
            const price = parseFloat(o.totalPrice || o.totalAmount || o.orderTotal || o.totalPayment || 0);
            return sum + price;
          }, 0);
          setRevenue(`$${deliveredRev.toLocaleString()}`);

          // Sold Items - strictly DELIVERED
          let totalSold = 0;
          orders.forEach(o => {
            const status = o.status?.toLowerCase() || '';
            if (status === 'delivered') {
              const orderItems = o.items || o.orderItems || [];
              if (orderItems.length > 0) {
                totalSold += orderItems.reduce((acc, item) => acc + (parseInt(item.quantity) || 1), 0);
              } else {
                totalSold += 1;
              }
            }
          });
          setSoldItems(totalSold.toLocaleString());

          // 3. BEST SELLERS calculation
          let itemMap = {};
          const months = new Array(12).fill(0);

          orders.forEach(o => {
            // Aggregate Revenue by Month
            const date = new Date(o.orderDate || o.createdAt);
            if (!isNaN(date.getTime())) {
              const m = date.getMonth();
              const val = parseFloat(o.totalPrice || o.totalAmount || 0);
              months[m] += val;
            }

            const items = o.items || o.orderItems || [];
            items.forEach(i => {
              const id = i.productId || i.id || Math.random().toString();
              const name = i.productName || i.name || 'Furniture Piece';
              if (!itemMap[id]) itemMap[id] = { id, title: name, sales: 0, revenue: 0, status: 'Popular' };
              const q = parseInt(i.quantity) || 1;
              itemMap[id].sales += q;
              itemMap[id].revenue += (parseFloat(i.unitPrice || i.price) || 0) * q;
            });
          });

          setMonthlyData(months);

          // Fallback Best Sellers
          if (Object.keys(itemMap).length === 0) {
            const prodRes = await api.get(`/Store/${storeId}/products`).catch(() => ({ data: [] }));
            const products = prodRes.data?.products || (Array.isArray(prodRes.data) ? prodRes.data : []);
            products.forEach(p => {
              itemMap[p.productId || p.id] = { id: p.productId || p.id, title: p.name, sales: 0, revenue: 0, status: 'Active' };
            });
          }

          const sortedSellers = Object.values(itemMap)
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 3)
            .map(s => ({
              ...s,
              revenue: `$${s.revenue.toLocaleString()}`,
              status: s.sales > 5 ? 'Best Seller' : 'Popular'
            }));
          setBestSellers(sortedSellers);

          const chartArr = Object.values(itemMap)
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 12)
            .map(s => ({
              label: s.title ? s.title.substring(0, 3).toUpperCase() : '???',
              fullName: s.title,
              value: s.sales
            }));
          setChartData(chartArr);

        } catch (e) {
          console.error("Analytics aggregation failed", e);
        }

        try {
          const statsRes = await api.get(`/Analytics/store/${storeId}`);
          if (statsRes.data?.conversionRate) setConversionRate(`${statsRes.data.conversionRate}%`);
        } catch (e) { }

      } catch (err) {
        console.error("Global analytics sync failed:", err);
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

  // Generate SVG Path for the Line Chart
  const generatePath = (data) => {
    const max = Math.max(...data, 100);
    const width = 800;
    const height = 300;
    const points = data.map((val, i) => ({
      x: (i / (data.length - 1)) * width,
      y: height - (val / max) * height
    }));

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 2;
      path += ` C ${cp1x} ${curr.y}, ${cp1x} ${next.y}, ${next.x} ${next.y}`;
    }
    return path;
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
            <div key={stat.id} className="bg-white p-8 rounded-[35px] shadow-[0_15px_40px_rgba(0,0,0,0.02)] border border-gray-50 hover:shadow-xl transition-all duration-500">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gray-50 group-hover:bg-white">
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
          {/* Revenue Trends Line Chart */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-[40px] p-10 shadow-[0_15px_40px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col overflow-hidden relative"
            variants={fadeInUp}
          >
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="flex items-center gap-3">
                <BarChart3 className="text-[#205457]" size={24} />
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Revenue Trends</h3>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-[#205457]" /> Actual Sales
                </span>
              </div>
            </div>

            {/* Premium SVG Line Chart */}
            <div className="flex-1 min-h-[300px] relative mt-10">
              <svg viewBox="0 0 800 300" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#205457" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#205457" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                  <line key={i} x1="0" y1={300 * p} x2="800" y2={300 * p} stroke="#F3F4F6" strokeWidth="1" />
                ))}

                {/* Area Fill */}
                <path
                  d={`${generatePath(monthlyData)} L 800 300 L 0 300 Z`}
                  fill="url(#chartGradient)"
                  className="transition-all duration-1000"
                />

                {/* The Line */}
                <path
                  d={generatePath(monthlyData)}
                  fill="none"
                  stroke="#205457"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />

                {/* Data Points */}
                {monthlyData.map((val, i) => {
                  const max = Math.max(...monthlyData, 100);
                  const x = (i / (monthlyData.length - 1)) * 800;
                  const y = 300 - (val / max) * 300;
                  return (
                    <g key={i} className="group/point cursor-pointer">
                      <circle cx={x} cy={y} r="6" fill="#205457" className="scale-0 group-hover/point:scale-125 transition-transform duration-300" />
                      <circle cx={x} cy={y} r="4" fill="white" stroke="#205457" strokeWidth="2" />
                      <text x={x} y={y - 15} textAnchor="middle" className="text-[10px] font-black fill-gray-900 opacity-0 group-hover/point:opacity-100 transition-opacity">
                        ${val.toLocaleString()}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* X-Axis Labels */}
              <div className="flex justify-between mt-6 px-1">
                {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map((m) => (
                  <span key={m} className="text-[10px] font-black text-gray-300 tracking-tighter">{m}</span>
                ))}
              </div>
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

            <button
              onClick={() => {
                const csvRows = [
                  ["Metric", "Value"],
                  ["Store Earnings", revenue],
                  ["Sold Items", soldItems],
                  ["Avg Rating", avgRating],
                  ["Conversion Rate", conversionRate],
                  [""],
                  ["Top Selling Products", "Sales", "Revenue"],
                  ...bestSellers.map(b => [b.title, b.sales, b.revenue]),
                  [""],
                  ["Monthly Revenue Trend"],
                  ...monthlyData.map((val, i) => [
                    ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][i],
                    val
                  ])
                ];
                const csvString = csvRows.map(row => row.join(",")).join("\n");
                const blob = new Blob([csvString], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.setAttribute('href', url);
                a.setAttribute('download', `Homesta_Report_${storeId}_${new Date().toISOString().split('T')[0]}.csv`);
                a.click();
              }}
              className="w-full mt-10 py-4 rounded-2xl border border-dashed border-gray-100 text-gray-400 font-bold text-xs uppercase tracking-widest hover:border-[#205457] hover:text-[#205457] transition-all"
            >
              Download Full Report
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
