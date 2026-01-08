import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Store, Search, Trash2, Eye, MoreVertical, Filter, ArrowRight } from 'lucide-react';
import api from '../../lib/axios';

const AdminStores = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            setLoading(true);
            const response = await api.get('Store');
            setStores(Array.isArray(response.data) ? response.data : [response.data]);
        } catch (err) {
            console.error("Failed to fetch stores:", err);
            setError("Failed to load stores.");
        } finally {
            setLoading(false);
        }
    };

    const filteredStores = stores.filter(store =>
        store.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#FDFCFB] pt-[110px] px-6 md:px-12 xl:px-16 pb-24 font-outfit">
            <div className="max-w-[1440px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                            Registered <span className="text-[#205457]">Stores</span>
                        </h1>
                        <p className="text-gray-400 mt-2 text-lg">
                            Manage all subscribed stores and view their details.
                        </p>
                    </div>
                </div>

                {/* Search & Stats Bar */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by store name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#205457]/20 outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-medium px-4">
                        <Store size={18} />
                        <span>{filteredStores.length} Stores Found</span>
                    </div>
                </div>

                {/* Stores Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white h-64 rounded-3xl animate-pulse bg-gray-100"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-red-100">
                        <p className="text-red-500 font-bold">{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredStores.map((store) => (
                                <motion.div
                                    key={store.storeId || store.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all group relative overflow-hidden"
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-16 h-16 bg-[#205457]/5 rounded-2xl flex items-center justify-center text-[#205457]">
                                            <Store size={32} />
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-full transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">{store.name}</h3>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-1">{store.email}</p>

                                    <div className="space-y-2 mb-6 text-sm text-gray-500">
                                        <p className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                            {store.phone || "No Phone"}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                            {store.address || "No Address"}
                                        </p>
                                    </div>

                                    <Link to={`/admin/store/${store.storeId || store.id}`} className="w-full py-3 bg-gray-50 hover:bg-[#205457] hover:text-white text-gray-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group-hover:translate-y-0">
                                        View Details
                                        <ArrowRight size={16} />
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminStores;
