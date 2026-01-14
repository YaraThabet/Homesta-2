import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import { Store, Package, Users, DollarSign, TrendingUp, ArrowRight, ShoppingBag, ChevronRight } from 'lucide-react';

const AdminDashboard = () => {
    const [statsData, setStatsData] = React.useState({
        revenue: '0',
        stores: '0',
        products: '0',
        users: '0'
    });
    const [recentOrders, setRecentOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [storesRes, productsRes, usersRes, ordersRes] = await Promise.all([
                    api.get('/Store'),
                    api.get('/Product/GetAllProducts'),
                    api.get('/User'),
                    api.get('/Order/all')
                ]);

                // Calculate counts
                const storesCount = Array.isArray(storesRes.data) ? storesRes.data.length : 0;
                const productsCount = Array.isArray(productsRes.data) ? productsRes.data.length : 0;
                const usersCount = Array.isArray(usersRes.data) ? usersRes.data.length : 0;

                // Calculate Revenue from Delivered orders
                const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
                const revenue = orders.reduce((sum, order) => {
                    const isDelivered = order.status?.toLowerCase() === 'delivered';
                    if (isDelivered) {
                        return sum + (order.orderTotal ?? order.totalPrice ?? order.totalAmount ?? 0);
                    }
                    return sum;
                }, 0);

                setStatsData({
                    revenue: revenue.toLocaleString(),
                    stores: storesCount.toString(),
                    products: productsCount.toString(),
                    users: usersCount >= 1000 ? (usersCount / 1000).toFixed(1) + 'k' : usersCount.toString()
                });
                setRecentOrders(
                    orders
                        .sort((a, b) => new Date(b.orderDate || b.datePlaced || 0) - new Date(a.orderDate || a.datePlaced || 0))
                        .slice(0, 5)
                );
            } catch (err) {
                console.error("Dashboard fetch failed", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const stats = [
        { title: 'Total Revenue', value: `$${statsData.revenue}`, change: '+12.5%', icon: DollarSign, color: 'emerald' },
        { title: 'Active Stores', value: statsData.stores, change: '+4', icon: Store, color: 'blue' },
        { title: 'Total Products', value: statsData.products, change: '+124', icon: Package, color: 'purple' },
        { title: 'Total Users', value: statsData.users, change: '+8.2%', icon: Users, color: 'orange' },
    ];

    return (
        <div className="min-h-screen bg-[#FDFCFB] pt-[110px] px-6 md:px-12 xl:px-16 pb-24 font-outfit">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-[1440px] mx-auto"
            >
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                        Admin <span className="text-[#205457]">Overview</span>
                    </h1>
                    <p className="text-gray-400 mt-3 text-lg font-light">
                        Welcome back, Admin. Here's what's happening today.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-8 rounded-[30px] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-500 group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={24} />
                                </div>
                                <span className="bg-green-50 text-green-600 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                                    <TrendingUp size={12} />
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">{stat.title}</h3>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Recent Activity Section */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
                            <Link to="/admin/orders" className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-[#205457] hover:text-white transition-all">
                                <ArrowRight size={20} />
                            </Link>
                        </div>

                        <div className="space-y-4 relative z-10">
                            {loading ? (
                                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl">
                                    <div className="w-8 h-8 border-4 border-[#205457]/10 border-t-[#205457] rounded-full animate-spin" />
                                </div>
                            ) : recentOrders.length > 0 ? (
                                recentOrders.map((order, idx) => (
                                    <div key={order.orderId || order.id || idx} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-white transition-all group/item">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#205457] shadow-sm border border-gray-100">
                                                <ShoppingBag size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 line-clamp-1">
                                                    {order.firstName && order.lastName
                                                        ? `${order.firstName} ${order.lastName}`
                                                        : (order.firstName || order.userName || 'Guest User')}
                                                </p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Order ID: #{order.orderId || order.id}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-sm font-black text-[#205457]">${(order.orderTotal ?? order.totalPrice ?? order.totalAmount ?? 0).toLocaleString()}</p>
                                                <span className={`text-[9px] font-black uppercase tracking-tighter ${order.status === 'Delivered' ? 'text-green-500' :
                                                    order.status === 'Cancelled' ? 'text-red-500' :
                                                        order.status === 'Shipped' ? 'text-blue-600' :
                                                            'text-amber-500'
                                                    }`}>
                                                    {order.status || 'Processing'}
                                                </span>
                                            </div>
                                            <Link to="/admin/orders" className="p-2 bg-white rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity shadow-sm border border-gray-50">
                                                <ChevronRight size={16} className="text-gray-400" />
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-100 rounded-3xl text-gray-400 font-medium relative z-10">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                        <ShoppingBag size={24} className="text-gray-300" />
                                    </div>
                                    <p>No transactions recorded yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">System Notifications</h2>
                            <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
                                <ArrowRight size={20} className="text-gray-400" />
                            </button>
                        </div>
                        <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-100 rounded-3xl text-gray-300 font-medium">
                            Notifications Component Coming Soon
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminDashboard;
