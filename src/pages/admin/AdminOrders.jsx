import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Search, ChevronRight, Eye, Tag, Calendar, ShoppingBag, User, X, CreditCard, Truck } from 'lucide-react';
import api from '../../lib/axios';
import { createPortal } from "react-dom";
import PageLoader from '../../components/PageLoader';

// --- ORDER DETAILS MODAL ---
const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    const items = order.items || order.orderItems || [];
    const getImageUrl = (url) => {
        if (!url || typeof url !== 'string') return null;
        if (url.startsWith('http')) return url;
        return `http://homefinish.runasp.net${url.startsWith('/') ? '' : '/'}${url}`;
    };

    return createPortal(
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-8 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#205457] rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <ShoppingBag size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                            <p className="text-gray-500 text-sm font-medium">#{order.orderId || order.id}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all shadow-sm text-gray-400 group">
                        <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                <div className="overflow-y-auto p-8 custom-scrollbar">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
                            <div className="flex items-center gap-2 mb-2 text-gray-400">
                                <User size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Customer</span>
                            </div>
                            <p className="font-bold text-gray-900">{order.userName || 'Guest'}</p>
                        </div>
                        <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
                            <div className="flex items-center gap-2 mb-2 text-gray-400">
                                <CreditCard size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Payment</span>
                            </div>
                            <p className="font-bold text-gray-900">{order.paymentMethod || 'Cash'}</p>
                        </div>
                        <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
                            <div className="flex items-center gap-2 mb-2 text-gray-400">
                                <Truck size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Status</span>
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                {order.status || 'Pending'}
                            </span>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-8">
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Ordered Products</h3>
                        <div className="space-y-3">
                            {items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-shadow">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                                        <img
                                            src={getImageUrl(item.image || item.imagePath)}
                                            className="w-full h-full object-cover"
                                            alt={item.productName}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{item.productName}</h4>
                                        <p className="text-xs text-gray-400 font-medium">Qty: {item.quantity} × ${item.price || item.unitPrice}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-[#205457] text-sm">
                                            ${((item.price || item.unitPrice || 0) * (item.quantity || 0)).toLocaleString()}
                                        </p>
                                        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{item.storeName || 'Store Item'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="bg-[#205457] p-8 rounded-[35px] text-white flex justify-between items-center shadow-xl shadow-[#205457]/20">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1 text-white">Order Total</p>
                            <h3 className="text-3xl font-black">${(order.displayTotal || 0).toLocaleString()}</h3>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold opacity-60 italic whitespace-nowrap">Tax and shipping included</p>
                            <div className="flex items-center gap-2 mt-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                                <Calendar size={14} />
                                <span className="text-xs font-bold">{new Date(order.orderDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>,
        document.body
    );
};

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterStore, setFilterStore] = useState('All');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const [ordersRes, storesRes] = await Promise.all([
                    api.get('Order/all'),
                    api.get('Store')
                ]);

                const rawOrders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
                setStores(Array.isArray(storesRes.data) ? storesRes.data : []);

                const processed = rawOrders.map(order => {
                    const items = order.items || order.orderItems || [];
                    const itemsTotal = items.reduce((sum, item) => {
                        const price = item.price || item.unitPrice || 0;
                        return sum + (price * (item.quantity || 0));
                    }, 0);

                    return {
                        ...order,
                        displayTotal: order.totalPrice || itemsTotal
                    };
                });

                setOrders(processed);
            } catch (err) {
                console.error("Failed to fetch admin orders:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.id?.toString().includes(searchTerm) ||
            order.orderId?.toString().includes(searchTerm) ||
            order.userName?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'All' || order.status === filterStatus;

        const matchesStore = filterStore === 'All' ||
            (order.items || []).some(item => (item.storeName === filterStore || item.storeId?.toString() === filterStore));

        const total = order.displayTotal || 0;
        const matchesMinPrice = minPrice === '' || total >= parseFloat(minPrice);
        const matchesMaxPrice = maxPrice === '' || total <= parseFloat(maxPrice);

        return matchesSearch && matchesStatus && matchesStore && matchesMinPrice && matchesMaxPrice;
    });

    if (loading) return <PageLoader />;

    return (
        <div className="min-h-screen bg-[#FDFCFB] pt-[110px] px-6 md:px-12 xl:px-16 pb-24 font-outfit">
            <div className="max-w-[1440px] mx-auto">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                            Global <span className="text-[#205457]">Orders</span>
                        </h1>
                        <p className="text-gray-400 mt-2 text-lg font-light">
                            Monitor and manage transactions across all stores.
                        </p>
                    </div>
                </div>

                {/* Enhanced Filtering Suite */}
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm mb-10 space-y-6">
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#205457] transition-colors" size={22} />
                        <input
                            type="text"
                            placeholder="Quick search by ID or customer name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-16 pr-6 py-4 bg-gray-50/50 rounded-2xl border-none focus:ring-2 focus:ring-[#205457]/10 outline-none transition-all text-gray-700 font-medium"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                        {/* Status Tabs */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-gray-300 mr-2 tracking-widest">Status</span>
                            {['All', 'Pending', 'Accepted', 'Delivered', 'Cancelled'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${filterStatus === status ? 'bg-[#205457] text-white shadow-lg shadow-[#205457]/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>

                        <div className="h-8 w-[1px] bg-gray-100 hidden lg:block" />

                        {/* Store Selection */}
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Seller</span>
                            <select
                                value={filterStore}
                                onChange={(e) => setFilterStore(e.target.value)}
                                className="bg-gray-50 text-gray-600 text-xs font-bold py-2 px-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-[#205457]/10"
                            >
                                <option value="All">All Stores</option>
                                {stores.map(s => <option key={s.storeId || s.id} value={s.name}>{s.name}</option>)}
                            </select>
                        </div>

                        <div className="h-8 w-[1px] bg-gray-100 hidden lg:block" />

                        {/* Price Filter */}
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Budget</span>
                            <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-xl">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-16 bg-transparent text-[11px] font-bold text-center border-none outline-none focus:ring-0"
                                />
                                <span className="text-gray-300 mx-1">-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-16 bg-transparent text-[11px] font-bold text-center border-none outline-none focus:ring-0"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders Table-like Cards */}
                <div className="space-y-4">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order, idx) => (
                            <motion.div
                                key={order.orderId || order.id || idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white p-6 md:p-8 rounded-[35px] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all group"
                            >
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    {/* ID & Date */}
                                    <div className="flex items-center gap-5 md:min-w-[200px]">
                                        <div className="w-14 h-14 bg-[#205457]/10 rounded-2xl flex items-center justify-center text-[#205457]">
                                            <ShoppingBag size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                                            <p className="font-bold text-gray-900">#{order.orderId || order.id}</p>
                                        </div>
                                    </div>

                                    {/* Customer */}
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Customer</p>
                                            <p className="font-bold text-gray-700">{order.userName || 'Guest User'}</p>
                                        </div>
                                    </div>

                                    {/* Items Preview */}
                                    <div className="hidden lg:flex items-center gap-4 flex-1">
                                        <div className="flex -space-x-4">
                                            {(order.orderItems || order.items || []).slice(0, 3).map((item, i) => (
                                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm">
                                                    <img src={item.image || `http://homefinish.runasp.net${item.imagePath}`} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                            {(order.orderItems || order.items || []).length > 3 && (
                                                <div className="w-10 h-10 rounded-full border-2 border-white bg-[#B19470] text-white flex items-center justify-center text-[10px] font-black">
                                                    +{(order.orderItems || order.items || []).length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-xs font-bold text-gray-400">
                                            {(order.orderItems || order.items || []).length} items
                                        </span>
                                    </div>

                                    {/* Amount */}
                                    <div className="text-center md:text-right md:min-w-[120px]">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                                        <p className="text-xl font-black text-[#205457] tracking-tighter">
                                            ${(order.displayTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center gap-6">
                                        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-green-50 text-green-600' :
                                            order.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                                                order.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                                                    'bg-blue-50 text-blue-600'
                                            }`}>
                                            {order.status || 'Accepted'}
                                        </div>
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-[#205457] hover:text-white transition-all shadow-sm group/btn"
                                        >
                                            <ChevronRight size={20} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="bg-white rounded-[50px] border border-dashed border-gray-200 py-32 text-center">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                                <Package size={48} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Matches Found</h3>
                            <p className="text-gray-400 max-w-sm mx-auto">Try adjusting your search terms or filters to find what you're looking for.</p>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {selectedOrder && (
                    <OrderDetailsModal
                        order={selectedOrder}
                        onClose={() => setSelectedOrder(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminOrders;
