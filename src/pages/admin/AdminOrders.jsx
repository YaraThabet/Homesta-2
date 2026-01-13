import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Package, Search, ChevronRight, Eye, Tag, Calendar, ShoppingBag, User, X, CreditCard, Truck, Printer } from 'lucide-react';
import api from '../../lib/axios';
import { createPortal } from "react-dom";
import PageLoader from '../../components/PageLoader';
import SafeImage from '../../components/SafeImage';

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
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md print:p-0 print:bg-white print:static">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:w-full print:max-w-none print:rounded-none"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-8 bg-gradient-to-r from-[#205457] to-[#1a4345] text-white print:bg-white print:text-black print:border-b print:border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white shadow-inner border border-white/10 backdrop-blur-sm print:hidden">
                            <ShoppingBag size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight print:text-black">Order Details</h2>
                            <p className="text-white/60 text-sm font-medium print:text-gray-500">#{order.orderId || order.id}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 print:hidden">
                        <button
                            onClick={() => window.print()}
                            className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 text-white transition-all backdrop-blur-sm border border-white/10 group"
                            title="Print Invoice"
                        >
                            <Printer size={20} className="group-hover:scale-110 transition-transform duration-300" />
                        </button>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 text-white transition-all backdrop-blur-sm border border-white/10 group"
                        >
                            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto p-8 custom-scrollbar bg-[#FDFCFB] print:overflow-visible print:bg-white print:p-8">

                    {/* --- PRINT ONLY: INVOICE LAYOUT --- */}
                    <div className="hidden print:block space-y-8 font-sans text-gray-900">
                        {/* Print Header */}
                        <div className="flex justify-between items-start border-b-4 border-[#205457] pb-6 mb-8">
                            <div>
                                <h1 className="text-4xl font-black text-[#205457] tracking-tight">HOMESTA</h1>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.3em] mt-1">Order Invoice</p>
                            </div>
                            <div className="text-right text-sm">
                                <p className="font-bold text-gray-900 text-lg">#{order.orderId || order.id}</p>
                                <p className="text-gray-500 font-medium">{order.orderDateFormatted || new Date(order.orderDate).toLocaleDateString()}</p>
                                <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase mt-2 border ${order.status === 'Delivered' ? 'border-green-200 text-green-700' : 'border-gray-200 text-gray-500'}`}>
                                    {order.status}
                                </div>
                            </div>
                        </div>

                        {/* Print Info Grid */}
                        <div className="grid grid-cols-2 gap-12 mb-8">
                            <div>
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">Billed To</h3>
                                <div className="text-sm">
                                    <p className="font-bold text-lg text-gray-900">{order.firstName} {order.lastName}</p>
                                    <p className="text-gray-600 mt-1">{order.email}</p>
                                    <p className="text-gray-600">{order.phone}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">Ship To</h3>
                                <div className="text-sm">
                                    <p className="font-bold text-gray-900">{order.address}</p>
                                    <p className="text-gray-600 mt-1">{order.city}, {order.country} {order.zipCode}</p>
                                    <p className="text-gray-600 mt-2"><span className="font-bold text-xs uppercase text-gray-400">Payment:</span> {order.paymentMethod}</p>
                                </div>
                            </div>
                        </div>

                        {/* Print Items Table */}
                        <table className="w-full text-left text-sm mb-8">
                            <thead>
                                <tr className="border-b-2 border-gray-100">
                                    <th className="py-3 font-black text-xs uppercase text-gray-400 tracking-wider">Item</th>
                                    <th className="py-3 font-black text-xs uppercase text-gray-400 tracking-wider text-center">Qty</th>
                                    <th className="py-3 font-black text-xs uppercase text-gray-400 tracking-wider text-right">Price</th>
                                    <th className="py-3 font-black text-xs uppercase text-gray-400 tracking-wider text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.map((item, idx) => {
                                    const finalPrice = item.finalUnitPrice ?? item.unitPrice ?? item.price;
                                    return (
                                        <tr key={idx}>
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-md border border-gray-200 overflow-hidden flex-shrink-0 relative">
                                                        <SafeImage src={item.image || item.imagePath} productId={item.productId} className="w-full h-full object-cover" type="product" />
                                                        {item.isDeleted && (
                                                            <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center">
                                                                <span className="text-[6px] font-black text-white bg-red-600 px-0.5 rounded-sm uppercase tracking-tighter">DEL</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">
                                                            {item.productName || item.name}
                                                            {item.isDeleted && (
                                                                <span className="ml-2 text-[8px] border border-red-200 text-red-500 px-1 py-0.5 rounded-sm uppercase font-black">Deleted</span>
                                                            )}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{item.productColor}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 text-center font-bold text-gray-600">{item.quantity}</td>
                                            <td className="py-4 text-right font-medium text-gray-600">${finalPrice.toLocaleString()}</td>
                                            <td className="py-4 text-right font-bold text-gray-900">${(finalPrice * (item.quantity || 1)).toLocaleString()}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Print Totals */}
                        <div className="flex justify-end border-t-2 border-gray-100 pt-6">
                            <div className="w-64 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-bold text-gray-500">Subtotal</span>
                                    <span className="font-bold text-gray-900">${(order.orderSubtotal || order.subtotal || 0).toLocaleString()}</span>
                                </div>
                                {(order.orderDiscount > 0) && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span className="font-bold">Discount</span>
                                        <span className="font-bold">-${order.orderDiscount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-xl font-black text-[#205457] border-t border-dashed border-gray-200 pt-4 mt-2">
                                    <span>Total</span>
                                    <span>${(order.orderTotal || order.totalPrice || 0).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Print Footer */}
                        <div className="mt-16 pt-8 border-t border-gray-100 text-center">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Thank you for your business!</p>
                            <p className="text-[10px] text-gray-300 mt-2">Homesta Inc. • www.homesta.com</p>
                        </div>
                    </div>

                    {/* --- SCREEN ONLY: EXISTING LAYOUT --- */}
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 print:hidden">
                        <div className="bg-white p-5 rounded-[25px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                                    <User size={14} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</span>
                            </div>
                            <div className="flex flex-col gap-1 pl-1">
                                <p className="font-bold text-gray-900 line-clamp-1">{order.firstName ? `${order.firstName} ${order.lastName}` : (order.userName || 'Guest')}</p>
                                <p className="text-xs text-gray-400 font-medium truncate" title={order.email}>{order.email}</p>
                                <p className="text-xs text-gray-400 font-medium">{order.phone}</p>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-[25px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                    <MapPin size={14} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Shipping</span>
                            </div>
                            <div className="flex flex-col gap-1 pl-1">
                                <p className="font-bold text-gray-900 text-sm line-clamp-1" title={order.address}>{order.address}</p>
                                <p className="text-xs text-gray-400 font-medium">{order.city}, {order.country} {order.zipCode}</p>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-[25px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                                    <CreditCard size={14} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Payment</span>
                            </div>
                            <div className="pl-1">
                                <p className="font-bold text-gray-900">{order.paymentMethod || 'Cash'}</p>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-[25px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                                    <Truck size={14} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</span>
                            </div>
                            <div className="pl-1">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg inline-block ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                        order.status === 'Shipped' ? 'bg-indigo-100 text-indigo-700' :
                                            order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                                                'bg-amber-100 text-amber-700'
                                    }`}>
                                    {order.status || 'Pending'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-8 print:hidden">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Ordered Products</h3>
                            <span className="text-xs font-bold text-gray-300 bg-gray-100 px-2 py-1 rounded-md">{items.length} Items</span>
                        </div>
                        <div className="space-y-3">
                            {items.map((item, idx) => {
                                const unitPrice = item.originalUnitPrice || item.unitPrice || item.price || 0;
                                const finalPrice = item.finalUnitPrice ?? unitPrice;
                                const hasDiscount = finalPrice < unitPrice;

                                return (
                                    <div key={idx} className="flex items-center gap-5 p-4 bg-white border border-gray-100/80 rounded-[25px] hover:shadow-lg hover:shadow-gray-100/50 hover:border-gray-200 hover:-translate-y-0.5 transition-all duration-300 group">
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 relative">
                                            <SafeImage
                                                src={item.image || item.imagePath}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                alt={item.productName}
                                                type="product"
                                            />
                                            {hasDiscount && (
                                                <div className="absolute top-0 right-0 z-20 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-bl-lg">
                                                    SALE
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-gray-900 text-sm truncate" title={item.productName}>
                                                    {item.productName}
                                                    {item.isDeleted && (
                                                        <span className="ml-2 text-[8px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded uppercase font-black tracking-widest leading-none align-middle border border-red-100">
                                                            Product Deleted
                                                        </span>
                                                    )}
                                                </h4>
                                                {item.productColor && (
                                                    <span className="hidden sm:inline-block w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: item.productColor }}></span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-400 font-medium mb-2 flex items-center gap-2">
                                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold">Qty: {item.quantity}</span>
                                                <span>@ ${finalPrice.toLocaleString()} / unit</span>
                                            </p>

                                            {hasDiscount && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-md font-bold">
                                                        Saved: ${((unitPrice - finalPrice) * item.quantity).toLocaleString()}
                                                    </span>
                                                    <span className="text-[10px] line-through text-gray-300">
                                                        Original: ${(unitPrice * item.quantity).toLocaleString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right pl-4 border-l border-gray-50">
                                            <p className="font-black text-[#205457] text-lg">
                                                ${(item.total ?? (finalPrice * (item.quantity || 0))).toLocaleString()}
                                            </p>
                                            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-1 truncate max-w-[100px]">{item.storeName || 'Store Item'}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="bg-[#205457] p-8 rounded-[35px] text-white flex justify-between items-center shadow-2xl shadow-[#205457]/20 relative overflow-hidden print:hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2 text-white">Grand Total</p>
                            <h3 className="text-4xl font-black tracking-tight">
                                ${(
                                    order.orderTotal ??
                                    order.totalPrice ??
                                    order.displayTotal ??
                                    items.reduce((sum, item) => {
                                        return sum + (item.total ?? ((item.finalUnitPrice ?? item.price ?? 0) * (item.quantity || 1)));
                                    }, 0)
                                ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h3>
                            <p className="text-xs font-bold opacity-60 italic whitespace-nowrap mt-2">Tax and shipping included</p>
                            <div className="flex items-center gap-2 mt-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 w-fit">
                                <Calendar size={14} />
                                <span className="text-xs font-bold">{new Date(order.orderDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div >
        </div >,
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
                const [ordersRes, storesRes, productsRes] = await Promise.all([
                    api.get('Order/all'),
                    api.get('Store'),
                    api.get('Product/GetAllProducts').catch(() => ({ data: [] }))
                ]);

                const rawOrders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
                setStores(Array.isArray(storesRes.data) ? storesRes.data : []);
                const products = productsRes.data || [];

                console.log('🏪 Products loaded for admin:', products.length);

                // Process orders and enrich with product images
                const processed = await Promise.all(rawOrders.map(async (order) => {
                    const enrichedItems = await Promise.all(
                        (order.items || order.orderItems || []).map(async (item) => {
                            const currentOrderName = item.productName || item.name || "";

                            // Priority 1: Match by ID
                            let matchingProduct = item.productId
                                ? products.find(p => (p.productId || p.id) == item.productId)
                                : null;

                            // Verify ID match with name
                            if (matchingProduct && currentOrderName) {
                                const catName = (matchingProduct.name || "").toLowerCase();
                                const ordName = currentOrderName.toLowerCase();
                                if (!catName.includes(ordName) && !ordName.includes(catName)) {
                                    matchingProduct = null;
                                }
                            }

                            // Priority 2: Match by name if ID failed
                            if (!matchingProduct && currentOrderName) {
                                matchingProduct = products.find(p => p.name?.toLowerCase().trim() === currentOrderName.toLowerCase().trim());
                            }

                            const productId = item.productId || matchingProduct?.productId;
                            let imageUrl = item.image || item.imagePath || matchingProduct?.imagePath || matchingProduct?.image;

                            // Fetch image if we have productId but no image
                            if (!imageUrl && productId) {
                                try {
                                    const imgRes = await api.get(`/ProductImages/product/${productId}`);
                                    if (imgRes.data?.images?.length) {
                                        imageUrl = imgRes.data.images[0].imageUrl;
                                    } else if (imgRes.data?.imageUrls?.length) {
                                        imageUrl = imgRes.data.imageUrls[0];
                                    }

                                    if (imageUrl) {
                                        // Construct full URL
                                        imageUrl = imageUrl.startsWith('http') ? imageUrl : `http://homefinish.runasp.net${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
                                    }
                                } catch (err) {
                                    console.log(`Failed to load image for ${currentOrderName}`);
                                }
                            } else if (imageUrl && !imageUrl.startsWith('http')) {
                                imageUrl = `http://homefinish.runasp.net${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
                            }

                            const isDeleted = !matchingProduct;

                            return {
                                ...item,
                                name: currentOrderName,
                                productName: currentOrderName,
                                color: item.color || item.productColor,
                                productId,
                                image: imageUrl,
                                imagePath: imageUrl,
                                isDeleted
                            };
                        }));

                    return {
                        ...order,
                        items: enrichedItems,
                        orderItems: enrichedItems,
                        displayTotal: order.orderTotal ?? order.totalPrice ?? order.totalAmount ?? 0
                    };
                }));

                setOrders(processed);
                console.log('✅ Admin orders enriched with images');
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
                                            <p className="font-bold text-gray-700">
                                                {order.firstName && order.lastName
                                                    ? `${order.firstName} ${order.lastName}`
                                                    : (order.firstName || order.userName || 'Guest User')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Items Preview */}
                                    <div className="hidden lg:flex items-center gap-4 flex-1">
                                        <div className="flex -space-x-4">
                                            {(order.orderItems || order.items || []).slice(0, 3).map((item, i) => (
                                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm">
                                                    <SafeImage src={item.image || item.imagePath} alt="" className="w-full h-full object-cover" type="product" />
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
                                            order.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                                                order.status === 'Shipped' ? 'bg-indigo-50 text-indigo-600' :
                                                    order.status === 'Processing' ? 'bg-blue-50 text-blue-600' :
                                                        'bg-amber-50 text-amber-600' // Pending
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
