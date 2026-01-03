import React from 'react';
import { motion } from 'framer-motion';
import { Store, Package, Users, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';

const AdminDashboard = () => {
    const stats = [
        { title: 'Total Revenue', value: '$124,592', change: '+12.5%', icon: DollarSign, color: 'emerald' },
        { title: 'Active Stores', value: '48', change: '+4', icon: Store, color: 'blue' },
        { title: 'Total Products', value: '2,845', change: '+124', icon: Package, color: 'purple' },
        { title: 'Total Users', value: '15.2k', change: '+8.2%', icon: Users, color: 'orange' },
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

                {/* Recent Activity Section (Placeholder) */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Recent Stores</h2>
                            <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
                                <ArrowRight size={20} className="text-gray-400" />
                            </button>
                        </div>
                        <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-100 rounded-3xl text-gray-300 font-medium">
                            Store List Component Coming Soon
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
