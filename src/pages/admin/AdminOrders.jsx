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
        return `${url.startsWith('/') ? '' : '/'}${url}`;
    };

    return createPortal(
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-md print:p-0 print:bg-white print:static">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white w-full max-w-3xl rounded-[20px] sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] print:max-h-none print:shadow-none print:w-full print:max-w-none print:rounded-none"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 sm:p-8 bg-gradient-to-r from-[#205457] to-[#1a4345] text-white print:bg-white print:text-black print:border-b print:border-gray-200">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 pr-2">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-inner border border-white/10 backdrop-blur-sm print:hidden flex-shrink-0">
                            <ShoppingBag size={20} className="sm:w-6 sm:h-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight print:text-black truncate">Order Details</h2>
                            <p className="text-white/60 text-xs sm:text-sm font-medium print:text-gray-500 truncate">#{order.orderId || order.id}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 print:hidden flex-shrink-0">
                        <button
                            onClick={() => window.print()}
                            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 text-white transition-all backdrop-blur-sm border border-white/10 group"
                            title="Print Invoice"
                        >
                            <Printer size={16} className="sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
                        </button>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 text-white transition-all backdrop-blur-sm border border-white/10 group"
                        >
                            <X size={16} className="sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto p-4 sm:p-8 custom-scrollbar bg-[#FDFCFB] print:overflow-visible print:bg-white print:p-8">

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 print:hidden">
                        <div className="bg-white p-4 sm:p-5 rounded-[20px] sm:rounded-[25px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0">
                                    <User size={12} className="sm:w-3.5 sm:h-3.5" />
                                </div>
                                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</span>
                            </div>
                            <div className="flex flex-col gap-1 pl-0 sm:pl-1">
                                <p className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1">{order.firstName ? `${order.firstName} ${order.lastName}` : (order.userName || 'Guest')}</p>
                                <p className="text-[11px] sm:text-xs text-gray-400 font-medium truncate" title={order.email}>{order.email}</p>
                                <p className="text-[11px] sm:text-xs text-gray-400 font-medium">{order.phone}</p>
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
                                    <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 p-3 sm:p-4 bg-white border border-gray-100/80 rounded-[20px] sm:rounded-[25px] hover:shadow-lg hover:shadow-gray-100/50 hover:border-gray-200 hover:-translate-y-0.5 transition-all duration-300 group">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 relative">
                                            <SafeImage
                                                src={item.image || item.imagePath}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                alt={item.productName}
                                                type="product"
                                            />
                                            {hasDiscount && (
                                                <div className="absolute top-0 right-0 z-20 bg-red-500 text-white text-[8px] sm:text-[9px] font-black px-1 sm:px-1.5 py-0.5 rounded-bl-lg">
                                                    SALE
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 w-full">
                                            <div className="flex items-start gap-2 mb-1">
                                                <h4 className="font-bold text-gray-900 text-sm sm:text-base flex-1 line-clamp-2" title={item.productName}>
                                                    {item.productName}
                                                    {item.isDeleted && (
                                                        <span className="ml-2 text-[7px] sm:text-[8px] bg-red-50 text-red-500 px-1 sm:px-1.5 py-0.5 rounded uppercase font-black tracking-widest leading-none align-middle border border-red-100">
                                                            Deleted
                                                        </span>
                                                    )}
                                                </h4>
                                                {item.productColor && (
                                                    <span className="hidden sm:inline-block w-3 h-3 rounded-full border border-gray-200 flex-shrink-0" style={{ backgroundColor: item.productColor }}></span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold">Qty: {item.quantity}</span>
                                                <span className="text-[10px] sm:text-xs text-gray-400 font-medium">@ ${finalPrice.toLocaleString()} / unit</span>
                                            </div>

                                            {hasDiscount && (
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-[9px] sm:text-[10px] bg-green-50 text-green-700 px-1.5 sm:px-2 py-0.5 rounded-md font-bold">
                                                        Saved: ${((unitPrice - finalPrice) * item.quantity).toLocaleString()}
                                                    </span>
                                                    <span className="text-[9px] sm:text-[10px] line-through text-gray-300">
                                                        Was: ${(unitPrice * item.quantity).toLocaleString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-left sm:text-right w-full sm:w-auto sm:pl-4 sm:border-l border-t sm:border-t-0 border-gray-50 pt-3 sm:pt-0">
                                            <p className="font-black text-[#205457] text-base sm:text-lg">
                                                ${(item.total ?? (finalPrice * (item.quantity || 0))).toLocaleString()}
                                            </p>
                                            <p className="text-[8px] sm:text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-1 truncate max-w-full sm:max-w-[100px]">{item.storeName || 'Store Item'}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="bg-[#205457] p-5 sm:p-8 rounded-[25px] sm:rounded-[35px] text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 shadow-2xl shadow-[#205457]/20 relative overflow-hidden print:hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        <div className="relative z-10 w-full sm:w-auto">
                            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] opacity-60 mb-2 text-white">Grand Total</p>
                            <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
                                ${(
                                    order.orderTotal ??
                                    order.totalPrice ??
                                    order.displayTotal ??
                                    items.reduce((sum, item) => {
                                        return sum + (item.total ?? ((item.finalUnitPrice ?? item.price ?? 0) * (item.quantity || 1)));
                                    }, 0)
                                ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h3>
                            <p className="text-[10px] sm:text-xs font-bold opacity-60 italic mt-2">Tax and shipping included</p>
                            <div className="flex items-center gap-2 mt-2 sm:mt-3 bg-white/10 px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl border border-white/10 w-fit">
                                <Calendar size={12} className="sm:w-3.5 sm:h-3.5" />
                                <span className="text-[10px] sm:text-xs font-bold">{new Date(order.orderDate).toLocaleDateString()}</span>
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
                                        imageUrl = imageUrl.startsWith('http') ? imageUrl : `${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
                                    }
                                } catch (err) {
                                    console.log(`Failed to load image for ${currentOrderName}`);
                                }
                            } else if (imageUrl && !imageUrl.startsWith('http')) {
                                imageUrl = `${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
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
        <div className="min-h-screen bg-[#FDFCFB] pt-[90px] sm:pt-[110px] px-4 sm:px-6 md:px-12 xl:px-16 pb-16 sm:pb-24 font-outfit">
            <div className="max-w-[1440px] mx-auto">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:gap-6 mb-8 sm:mb-12">
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                            Global <span className="text-[#205457]">Orders</span>
                        </h1>
                        <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base md:text-lg font-light">
                            Monitor and manage transactions across all stores.
                        </p>
                    </div>
                </div>

                {/* Enhanced Filtering Suite */}
                <div className="bg-white p-4 sm:p-6 md:p-8 rounded-[25px] sm:rounded-[40px] border border-gray-100 shadow-sm mb-6 sm:mb-10 space-y-4 sm:space-y-6">
                    <div className="relative group">
                        <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#205457] transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by ID or name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 sm:pl-16 pr-4 sm:pr-6 py-3 sm:py-4 bg-gray-50/50 rounded-xl sm:rounded-2xl border-none focus:ring-2 focus:ring-[#205457]/10 outline-none transition-all text-gray-700 font-medium text-sm sm:text-base"
                        />
                    </div>

                    <div className="flex flex-col gap-4 sm:gap-6">
                        {/* Status Tabs */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <span className="text-[9px] sm:text-[10px] font-black uppercase text-gray-300 tracking-widest">Status</span>
                            <div className="flex flex-wrap items-center gap-2">
                                {['All', 'Pending', 'Accepted', 'Delivered', 'Cancelled'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all ${filterStatus === status ? 'bg-[#205457] text-white shadow-lg shadow-[#205457]/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-[1px] w-full bg-gray-100 sm:hidden" />

                        {/* Store & Price Filters */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                            {/* Store Selection */}
                            <div className="flex items-center gap-3">
                                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-300 whitespace-nowrap">Seller</span>
                                <select
                                    value={filterStore}
                                    onChange={(e) => setFilterStore(e.target.value)}
                                    className="bg-gray-50 text-gray-600 text-[11px] sm:text-xs font-bold py-2 px-3 sm:px-4 rounded-lg sm:rounded-xl border-none outline-none focus:ring-2 focus:ring-[#205457]/10 flex-1 sm:flex-initial"
                                >
                                    <option value="All">All Stores</option>
                                    {stores.map(s => <option key={s.storeId || s.id} value={s.name}>{s.name}</option>)}
                                </select>
                            </div>

                            <div className="h-6 w-[1px] bg-gray-100 hidden lg:block" />

                            {/* Price Filter */}
                            <div className="flex items-center gap-3">
                                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-300 whitespace-nowrap">Budget</span>
                                <div className="flex items-center bg-gray-50 px-2 sm:px-3 py-1.5 rounded-lg sm:rounded-xl flex-1 sm:flex-initial">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-12 sm:w-16 bg-transparent text-[10px] sm:text-[11px] font-bold text-center border-none outline-none focus:ring-0"
                                    />
                                    <span className="text-gray-300 mx-1">-</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-12 sm:w-16 bg-transparent text-[10px] sm:text-[11px] font-bold text-center border-none outline-none focus:ring-0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders Content: Table for Desktop, Cards for Mobile */}
                <div className="bg-white rounded-[25px] sm:rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                    <th className="px-8 py-6">Order Info</th>
                                    <th className="px-8 py-6">Customer</th>
                                    <th className="px-8 py-6">Items</th>
                                    <th className="px-8 py-6 text-center">Status</th>
                                    <th className="px-8 py-6 text-right">Total</th>
                                    <th className="px-8 py-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredOrders.map((order, idx) => (
                                    <tr key={order.orderId || order.id || idx} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-7">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-[#205457]/10 rounded-xl flex items-center justify-center text-[#205457]">
                                                    <ShoppingBag size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">#{order.orderId || order.id}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                                        {new Date(order.orderDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-7">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                                    <User size={14} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-700 text-sm">
                                                        {order.firstName && order.lastName
                                                            ? `${order.firstName} ${order.lastName}`
                                                            : (order.firstName || order.userName || 'Guest')}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 font-medium truncate max-w-[120px]" title={order.email}>
                                                        {order.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-7">
                                            <div className="flex items-center gap-2">
                                                <div className="flex -space-x-2">
                                                    {(order.orderItems || order.items || []).slice(0, 3).map((item, i) => (
                                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-50 overflow-hidden shadow-sm">
                                                            <SafeImage src={item.image || item.imagePath} alt="" className="w-full h-full object-cover" type="product" />
                                                        </div>
                                                    ))}
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400 ml-2">
                                                    {(order.orderItems || order.items || []).length} items
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-7 text-center">
                                            <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest inline-block ${order.status === 'Delivered' ? 'bg-green-50 text-green-600' :
                                                order.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                                                    order.status === 'Shipped' ? 'bg-indigo-50 text-indigo-600' :
                                                        order.status === 'Processing' ? 'bg-blue-50 text-blue-600' :
                                                            'bg-amber-50 text-amber-600'
                                                }`}>
                                                {order.status || 'Accepted'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-7 text-right">
                                            <p className="text-base font-black text-[#205457]">
                                                ${(order.displayTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </p>
                                        </td>
                                        <td className="px-8 py-7 text-right">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-2 hover:bg-[#205457] hover:text-white transition-all rounded-lg inline-flex items-center justify-center text-gray-400"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden divide-y divide-gray-50">
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order, idx) => (
                                <motion.div
                                    key={order.orderId || order.id || idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 sm:p-6 group"
                                >
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3 sm:gap-5 flex-1 min-w-0">
                                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#205457]/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-[#205457] flex-shrink-0">
                                                    <ShoppingBag size={20} className="sm:w-6 sm:h-6" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 sm:mb-1">Order ID</p>
                                                    <p className="font-bold text-gray-900 text-sm sm:text-base truncate">#{order.orderId || order.id}</p>
                                                </div>
                                            </div>
                                            <div className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest whitespace-nowrap flex-shrink-0 ${order.status === 'Delivered' ? 'bg-green-50 text-green-600' :
                                                order.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                                                    order.status === 'Shipped' ? 'bg-indigo-50 text-indigo-600' :
                                                        order.status === 'Processing' ? 'bg-blue-50 text-blue-600' :
                                                            'bg-amber-50 text-amber-600'
                                                }`}>
                                                {order.status || 'Accepted'}
                                            </div>
                                        </div>

                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 flex-shrink-0">
                                                    <User size={16} className="sm:w-[18px] sm:h-[18px]" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Customer</p>
                                                    <p className="font-bold text-gray-700 text-sm sm:text-base truncate">
                                                        {order.firstName && order.lastName
                                                            ? `${order.firstName} ${order.lastName}`
                                                            : (order.firstName || order.userName || 'Guest')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 sm:mb-1">Total</p>
                                                <p className="text-base sm:text-xl font-black text-[#205457] tracking-tighter">
                                                    ${(order.displayTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 pt-3 border-t border-gray-50">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="flex -space-x-3">
                                                    {(order.orderItems || order.items || []).slice(0, 3).map((item, i) => (
                                                        <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm">
                                                            <SafeImage src={item.image || item.imagePath} alt="" className="w-full h-full object-cover" type="product" />
                                                        </div>
                                                    ))}
                                                    {(order.orderItems || order.items || []).length > 3 && (
                                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-[#B19470] text-white flex items-center justify-center text-[9px] sm:text-[10px] font-black">
                                                            +{(order.orderItems || order.items || []).length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-[10px] sm:text-xs font-bold text-gray-400">
                                                    {(order.orderItems || order.items || []).length} items
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-gray-400 hover:bg-[#205457] hover:text-white transition-all shadow-sm group/btn flex-shrink-0"
                                            >
                                                <ChevronRight size={18} className="sm:w-5 sm:h-5 group-hover/btn:translate-x-0.5 transition-transform" />
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
