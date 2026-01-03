import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/axios';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Settings,
    TrendingUp,
    PlusCircle,
    Store,
    Bell,
    ArrowRight,
    PieChart,
    BarChart3
} from 'lucide-react';

const SellerHome = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName') || 'Seller';
    const storeId = localStorage.getItem('storeId');
    const [liveInventory, setLiveInventory] = useState('0');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyAndFetchStats = async () => {
            try {
                setLoading(true);
                let currentId = localStorage.getItem('storeId');
                const userEmail = localStorage.getItem('userEmail');

                // Always check stores to ensure we have the RIGHT one for this email
                const storesRes = await api.get('/Store');
                const stores = Array.isArray(storesRes.data) ? storesRes.data : [storesRes.data];

                const myStore = stores.find(s => s.email?.toLowerCase() === userEmail?.toLowerCase());

                if (myStore) {
                    currentId = (myStore.storeId || myStore.id).toString();
                    localStorage.setItem('storeId', currentId);
                }

                if (currentId) {
                    const productsRes = await api.get(`/Store/${currentId}/products`);
                    const products = Array.isArray(productsRes.data) ? productsRes.data : [];
                    setLiveInventory(products.length.toString());
                }
            } catch (err) {
                console.error("Failed to verify store or fetch stats:", err);
            } finally {
                setLoading(false);
            }
        };

        verifyAndFetchStats();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
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
                className="max-w-[1400px] mx-auto"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Minimalist Header */}
                <motion.div variants={fadeInUp} className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="h-[1px] w-8 bg-[#205457]"></span>
                            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#205457]/60">Seller Dashboard</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                            Hello, <span className="text-[#205457]">{userName}</span>
                        </h1>
                        <p className="text-gray-400 mt-3 text-lg font-light">
                            Manage your store and track your furniture sales in one place.
                        </p>
                    </div>
                    <div className="relative z-10 flex flex-wrap gap-4 justify-center md:justify-end">
                        <Link to="/addproduct" className="bg-[#205457] text-white px-7 py-4 rounded-2xl font-bold flex items-center gap-3 hover:shadow-2xl hover:shadow-[#205457]/20 transition-all active:scale-95 shadow-xl">
                            <PlusCircle className="w-5 h-5" />
                            <span>Add Product</span>
                        </Link>
                        <Link to="/store-settings" className="bg-white text-gray-900 px-7 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-gray-50 transition-all shadow-xl">
                            <Store className="w-5 h-5" />
                            View Store
                        </Link>
                    </div>
                </motion.div>

                {/* Modern Stat Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
                    variants={fadeInUp}
                >
                    {[
                        { label: 'Total Revenue', value: '$0.00', trend: 'Monthly', icon: ShoppingBag, color: '#205457' },
                        { label: 'Orders Received', value: '0', trend: 'Unfulfilled', icon: Package, color: '#89917D' },
                        { label: 'Store Visitors', value: '0', trend: 'Live Now', icon: Users, color: '#B19470' },
                        { label: 'Live Inventory', value: liveInventory, trend: 'Active Pieces', icon: Package, color: '#205457', to: '/seller-products' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -8 }}
                            onClick={() => stat.to && navigate(stat.to)}
                            className={`relative overflow-hidden bg-white p-6 md:p-8 rounded-[35px] shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-gray-100 group transition-all duration-500 ${stat.to ? 'cursor-pointer' : ''}`}
                        >
                            {/* Decorative accent */}
                            <div
                                className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-[0.03] active:opacity-[0.08] transition-opacity"
                                style={{ backgroundColor: stat.color }}
                            />

                            <div className="flex items-center gap-4 mb-6">
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500"
                                    style={{ backgroundColor: `${stat.color}10`, color: stat.color }}
                                >
                                    <stat.icon size={22} strokeWidth={2.5} />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-widest text-gray-300">
                                    {stat.trend}
                                </span>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-gray-400 mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900 tabular-nums tracking-tight">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Visual Call to Action - Only show if inventory is empty */}
                    {liveInventory === '0' && (
                        <motion.div
                            className="lg:col-span-8 relative overflow-hidden bg-white rounded-[30px] lg:rounded-[45px] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col justify-center min-h-[450px]"
                            variants={fadeInUp}
                        >
                            {/* Background Decoration */}
                            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#205457]/5 rounded-full blur-3xl shadow-inner" />
                            <div className="absolute top-10 right-10 opacity-5">
                                <Store size={200} strokeWidth={1} />
                            </div>

                            <div className="relative z-10 max-w-lg">
                                <div className="w-16 h-16 bg-[#89917D]/10 rounded-3xl flex items-center justify-center mb-8 text-[#89917D]">
                                    <TrendingUp size={32} />
                                </div>
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-5 leading-tight tracking-tight">
                                    Ready to share your <br />
                                    <span className="text-[#205457]">Furniture Masterpieces?</span>
                                </h2>
                                <p className="text-gray-400 text-lg mb-10 leading-relaxed font-light">
                                    Your shop is currently empty. Add your first furniture piece to start attracting customers and building your brand on Homesta.
                                </p>
                                <Link to="/addproduct" className="group w-fit bg-[#205457] text-white px-10 py-5 rounded-[22px] font-bold flex items-center gap-4 hover:pr-12 transition-all shadow-xl shadow-[#205457]/15">
                                    <span>Get Started</span>
                                    <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
                                </Link>
                            </div>
                        </motion.div>
                    )}

                    {/* Right Tools Card */}
                    <motion.div
                        className={liveInventory === '0' ? "lg:col-span-4 flex flex-col gap-8" : "lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8"}
                        variants={fadeInUp}
                    >
                        <div className="bg-white rounded-[40px] p-6 md:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-gray-100 flex-1">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-xl font-bold text-gray-900">Quick Access</h3>
                                <Settings className="text-gray-300 animate-spin-slow" size={20} />
                            </div>

                            <div className="space-y-4">
                                {[
                                    { name: 'Analytics Board', icon: BarChart3, desc: 'Sales & Data', to: '/analytics' },
                                    { name: 'Inventory Manager', icon: Package, desc: 'Track & Edit', to: '/seller-products' },
                                    { name: 'Showroom Settings', icon: Store, desc: 'Update details', to: '/store-settings' },
                                    { name: 'Customer Feed', icon: Bell, desc: 'Latest reviews', to: '/seller-reviews' }
                                ].map((item, i) => (
                                    <Link
                                        key={i}
                                        to={item.to}
                                        className="w-full flex items-center justify-between p-5 rounded-3xl bg-gray-50/50 hover:bg-[#205457] group transition-all duration-500 border border-transparent hover:border-[#205457]/10"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-90 transition-transform duration-500">
                                                <item.icon size={20} className="text-[#205457]" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-gray-800 group-hover:text-white transition-colors capitalize">{item.name}</p>
                                                <p className="text-[10px] text-gray-400 group-hover:text-white/60 transition-colors uppercase tracking-widest mt-1">{item.desc}</p>
                                            </div>
                                        </div>
                                        <ArrowRight size={16} className="text-gray-300 group-hover:text-white opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Motivational Card */}
                        <div className="bg-[#89917D] rounded-[40px] p-6 md:p-10 text-white relative overflow-hidden group shadow-xl shadow-[#89917D]/20">
                            <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12 transition-transform duration-700 group-hover:scale-125">
                                <ShoppingBag size={180} />
                            </div>
                            <div className="relative z-10">
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-white/60">Expert Insight</div>
                                <h4 className="text-xl font-bold mb-3 tracking-tight">Beautiful Photos Sell.</h4>
                                <p className="text-white/80 text-sm leading-relaxed font-light">
                                    Capture your furniture pieces in natural daylight to highlight textures and craftsmanship.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Global Styles for the Dashboard */}
            <style jsx>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 12s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default SellerHome;
