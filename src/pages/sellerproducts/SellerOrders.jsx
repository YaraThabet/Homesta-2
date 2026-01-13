import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, ChevronDown, Package, User, MapPin,
    Calendar, Filter, Eye, Phone, UserCircle,
    CheckCircle2, XCircle, FileText, Printer, Download, ChevronRight,
    Wallet, ShoppingBag
} from 'lucide-react';
import api from '../../lib/axios';
import PageLoader from '../../components/PageLoader';

/**
 * SELLER ORDERS MANAGEMENT
 * Design: High-contrast premium (Black tabs, bold typography)
 * Features: Inline status update, Detail Modal (Center), Invoice Generation, Raw JSON Debugging
 */

// HELPER: Image URL Fixer
const getImageUrl = (path) => {
    if (!path || path === 'null' || path === 'undefined') return null;
    if (path.startsWith('http')) return path;
    return `${path.startsWith('/') ? '' : '/'}${path}`;
};

// COMPONENT: Resolved Image for Product
const ResolvedImage = ({ src, productId, className = "" }) => {
    const [fetchedSrc, setFetchedSrc] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        setError(false);
        const needsFetch = !src || src === 'null' || src === 'undefined' || src === '';

        if (needsFetch && productId) {
            const fetchImg = async () => {
                try {
                    console.log(`[IMG RESOLVER] Fetching for product ${productId}...`);
                    const res = await api.get(`/ProductImages/product/${productId}`);
                    let foundUrl = null;

                    if (res.data) {
                        if (res.data.images && Array.isArray(res.data.images) && res.data.images.length > 0) {
                            foundUrl = res.data.images[0].imageUrl;
                        } else if (Array.isArray(res.data) && res.data.length > 0) {
                            foundUrl = res.data[0].imageUrl || res.data[0].imageUrls?.[0] || res.data[0].image;
                        }
                    }

                    if (foundUrl) {
                        console.log(`[IMG RESOLVER] Success! Found: ${foundUrl}`);
                        setFetchedSrc(foundUrl);
                    }
                } catch (e) {
                    console.warn(`[IMG RESOLVER] Failed for ${productId}`, e);
                }
            };
            fetchImg();
        }
    }, [src, productId]);

    // Priority: Prop src > Fetched src
    const displaySrc = (!src || src === 'null' || src === 'undefined') ? fetchedSrc : src;
    const finalPath = getImageUrl(displaySrc);

    if (error || !finalPath) {
        return (
            <div className={`w-full h-full flex items-center justify-center bg-gray-50 text-gray-300 ${className}`}>
                <ShoppingBag size={14} />
            </div>
        );
    }

    return (
        <img
            src={finalPath}
            className={className}
            alt=""
            onError={() => setError(true)}
        />
    );
};

// HELPER: Normalize Order Data - EXTREMELY DEFENSIVE
const normalizeOrder = (o) => {
    if (!o) return { items: [] };

    // Find any potential items array (Defensive Search)
    const rawItems = (o.items || o.orderItems || o.products || o.orderDetails || o.itemsList ||
        Object.values(o).find(val => Array.isArray(val)) || []).filter(i => i && typeof i === 'object');

    const items = rawItems.map(i => {
        const p = parseFloat(i.originalUnitPrice || i.unitPrice || i.price || i.finalPrice || 0) || 0;
        const q = parseInt(i.quantity || i.count || i.qty || 1) || 1;

        // Prioritize PRODUCT id over ORDER ITEM id
        const pid = i.productId || i.productID || i.product?.id || i.product?.productId || i.id;

        return {
            ...i, // KEEP ALL ENRICHED FIELDS LIKE isDeleted
            productId: pid,
            name: i.productName || i.name || i.product?.name || "Product",
            color: i.productColor || i.color || i.product?.color || 'Standard',
            price: p, // This is original price
            finalUnitPrice: parseFloat(i.finalUnitPrice) || p,
            quantity: q,
            subTotal: parseFloat(i.subtotal || i.subTotal) || (p * q) || 0,
            image: i.image || i.productImage || i.imageUrl || i.imagePath || i.product?.image || i.product?.imageUrl || i.product?.imagePath,
            discount: parseFloat(i.discountAmountPerUnit || i.discount) || 0,
            totalDiscount: parseFloat(i.totalDiscount) || 0
        };
    });

    // Swagger strictly uses these top-level fields for location
    const address = o.address || o.shippingAddress || "";
    const city = o.city || "";
    const country = o.country || "";

    return {
        ...o,
        id: o.orderId || o.id,
        orderDate: o.orderDate || o.createdAt,
        orderDateFormatted: o.orderDateFormatted || (o.orderDate ? new Date(o.orderDate).toLocaleString() : ""),
        customerName: o.customerName ||
            (o.firstName && o.lastName ? `${o.firstName} ${o.lastName}` : (o.firstName || o.lastName)) ||
            (o.user && o.user.userName) ||
            "Customer",
        email: o.email || (o.user && o.user.email) || "",
        phone: o.phone || o.phoneNumber || (o.user && o.user.phoneNumber) || "",
        address,
        city,
        country,
        items,
        status: o.status || 'Pending',
        paymentMethod: o.paymentMethod || 'CashOnDelivery',
        totalPrice: parseFloat(o.totalPrice || o.totalAmount || o.orderTotal || 0) || 0
    };
};

// HELPER: Generate Invoice (Professional Design)
const generateInvoice = (order) => {
    const win = window.open('', '_blank');
    const html = `
    <html>
        <head>
            <title>Invoice #${order.id}</title>
            <style>
                body { font-family: 'Inter', sans-serif; padding: 40px; color: #1a1a1a; max-width: 800px; margin: 0 auto; }
                .header { border-bottom: 3px solid #205457; padding-bottom: 20px; margin-bottom: 40px; display: flex; justify-content: space-between; align-items: flex-end; }
                .brand { color: #205457; font-size: 32px; font-weight: 900; letter-spacing: -1px; }
                .meta { text-align: right; color: #666; font-size: 14px; }
                .info-section { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
                .info-box h4 { margin: 0 0 8px 0; color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
                .info-box p { margin: 2px 0; font-size: 14px; font-weight: 600; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { text-align: left; background: #f9fafb; padding: 14px; font-size: 12px; text-transform: uppercase; color: #666; border-bottom: 1px solid #edf2f7; }
                td { padding: 14px; border-bottom: 1px solid #edf2f7; font-size: 14px; font-weight: 500; }
                .total-footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #edf1f7; display: flex; justify-content: flex-end; }
                .total-amount { font-size: 24px; font-weight: 900; color: #205457; }
            </style>
        </head>
        <body onload="window.print()">
            <div class="header">
                <div class="brand">HOMESTA</div>
                <div class="meta">
                    <p>Order ID: <strong>#${order.id}</strong></p>
                    <p>Date: ${order.orderDateFormatted}</p>
                </div>
            </div>
            <div class="info-section">
                <div class="info-box">
                    <h4>Billed To</h4>
                    <p>${order.customerName}</p>
                    <p>${order.email}</p>
                    <p>${order.phone}</p>
                </div>
                <div class="info-box">
                    <h4>Shipping Address</h4>
                    <p>${order.address || 'Standard Shipping'}</p>
                    <p>${order.city}, ${order.country}</p>
                    <p>Payment: ${order.paymentMethod}</p>
                </div>
            </div>
            <table>
                <thead>
                    <tr><th style="width: 60px;">Image</th><th>Description</th><th style="text-align:center">Qty</th><th style="text-align:right">Unit Price</th><th style="text-align:right">Total</th></tr>
                </thead>
                <tbody>
                    ${order.items.map(i => `
                        <tr>
                            <td>
                                <img src="${getImageUrl(i.image || i.imagePath)}" 
                                     style="width: 40px; height: 40px; object-fit: cover; border-radius: 6px; border: 1px solid #eee;" 
                                     alt="product">
                            </td>
                            <td>
                                <div style="font-weight: 700;">${i.name}</div>
                                <div style="color:#888; font-size:12px; margin-top:2px;">${i.color || ''}</div>
                            </td>
                            <td style="text-align:center">${i.quantity}</td>
                            <td style="text-align:right">$${(i.finalUnitPrice || i.price).toFixed(2)}</td>
                            <td style="text-align:right">$${((i.finalUnitPrice || i.price) * i.quantity).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="total-footer">
                <div>
                     <span style="font-size:12px; font-weight:700; color:#999; text-transform:uppercase; margin-right:15px">Grand Total</span>
                     <span class="total-amount">$${order.totalPrice.toFixed(2)}</span>
                </div>
            </div>
        </body>
    </html>
    `;
    win.document.write(html);
    win.document.close();
};

// COMPONENT: Details Modal (Centered)
const OrderDetailsModal = ({ orderId, initialData, onClose, onUpdateStatus, onInfoLoaded }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(!initialData);
    const [showRaw, setShowRaw] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                // Fetch order details and products in parallel
                const [orderRes, productsRes] = await Promise.all([
                    api.get(`Order/OrderDetails?orderId=${orderId}`, {
                        headers: { 'Accept': '*/*' }
                    }),
                    api.get('Product/GetAllProducts').catch(() => ({ data: [] }))
                ]);

                console.group(`%c[DATA SCAN] Order Detail Response #${orderId}`, "color: #3b82f6; font-weight: bold;");
                console.log("Response Type:", Array.isArray(orderRes.data) ? "ARRAY (Flat list)" : "OBJECT (Wrapped)");
                console.log("Raw Response Data:", orderRes.data);
                console.groupEnd();

                if (orderRes.data) {
                    const products = productsRes.data || [];
                    let orderData = Array.isArray(orderRes.data) ? { items: orderRes.data } : orderRes.data;
                    // Enrichment logic
                    if (orderData.items || orderData.orderItems) {
                        const itemsToEnrich = orderData.items || orderData.orderItems;
                        const enrichedItems = await Promise.all(
                            itemsToEnrich.map(async (item) => {
                                const currentOrderName = item.productName || item.name || item.product?.name || "";

                                // Priority 1: Match by ID
                                let matchingProduct = (item.productId || item.productID)
                                    ? products.find(p => (p.productId || p.id) == (item.productId || item.productID))
                                    : null;

                                // If ID matched but name is wildly different, it might be a reused ID.
                                // Don't trust catalog image/details if the names don't loosely match.
                                if (matchingProduct && currentOrderName) {
                                    const catName = (matchingProduct.name || "").toLowerCase().trim();
                                    const ordName = currentOrderName.toLowerCase().trim();
                                    // If names are completely different and not substrings of each other
                                    if (!catName.includes(ordName) && !ordName.includes(catName)) {
                                        matchingProduct = null;
                                    }
                                }

                                // Priority 2: Match by name if ID match failed or was untrusted
                                if (!matchingProduct && currentOrderName) {
                                    matchingProduct = products.find(p => p.name?.toLowerCase().trim() === currentOrderName.toLowerCase().trim());
                                }

                                const productId = item.productId || item.productID || matchingProduct?.productId || item.product?.id;
                                let imageUrl = item.image || item.imagePath || item.productImage || item.product?.image || item.product?.imageUrl || matchingProduct?.imagePath || matchingProduct?.image;

                                if (!imageUrl && productId) {
                                    try {
                                        const imgRes = await api.get(`/ProductImages/product/${productId}`);
                                        if (imgRes.data?.images?.length) {
                                            imageUrl = imgRes.data.images[0].imageUrl;
                                        } else if (imgRes.data?.imageUrls?.length) {
                                            imageUrl = imgRes.data.imageUrls[0];
                                        }

                                        if (imageUrl) {
                                            imageUrl = imageUrl.startsWith('http') ? imageUrl : `${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
                                        }
                                    } catch (err) {
                                        console.log(`Failed to load image for ${item.productName}`);
                                    }
                                } else if (imageUrl && !imageUrl.startsWith('http')) {
                                    imageUrl = `${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
                                }

                                const isDeleted = !matchingProduct; // Only not deleted if we found a valid catalog match

                                return {
                                    ...item,
                                    name: currentOrderName, // ALWAYS use order's snapshotted name
                                    color: item.color || item.productColor,
                                    productId,
                                    image: imageUrl,
                                    imagePath: imageUrl,
                                    isDeleted
                                };
                            })
                        );

                        orderData.items = enrichedItems;
                        orderData.orderItems = enrichedItems;
                    }
                    setDetails(orderData);
                    onInfoLoaded?.(orderData);
                }
            } catch (err) {
                console.error("OrderDetails fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        if (orderId) fetchDetails();
    }, [orderId]);

    const displayData = normalizeOrder({ ...initialData, ...(details || {}) });

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20"
            >
                {/* Header */}
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Order #{displayData.id}</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{displayData.orderDateFormatted}</p>
                            <button
                                onClick={() => setShowRaw(!showRaw)}
                                className="text-[9px] font-black text-[#205457] uppercase bg-[#205457]/5 px-2 py-0.5 rounded border border-[#205457]/10 hover:bg-[#205457]/10 transition-all active:scale-95"
                            >
                                {showRaw ? 'Hide Raw Details' : 'Debug Raw JSON'}
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => generateInvoice(displayData)}
                            className="p-3 bg-white text-[#205457] border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                        >
                            <Printer size={20} />
                        </button>
                        <button onClick={onClose} className="p-3 bg-white text-gray-400 rounded-2xl hover:text-red-500 hover:bg-red-50 transition-all border border-gray-200 active:scale-95">
                            <XCircle size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {showRaw && (
                        <div className="bg-gray-900 rounded-[20px] p-5 overflow-x-auto shadow-inner border border-gray-800">
                            <pre className="text-[10px] text-emerald-400 font-mono leading-relaxed">
                                {JSON.stringify(details || initialData, null, 2)}
                            </pre>
                        </div>
                    )}

                    {/* Status Update Quick Bar */}
                    <div className="bg-gray-900 p-6 rounded-[24px] shadow-xl shadow-gray-200">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Update Life Cycle</label>
                        <div className="flex flex-wrap gap-2">
                            {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => onUpdateStatus(displayData.id, s)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${displayData.status === s
                                        ? (
                                            s === 'Delivered' ? 'bg-green-500 text-white shadow-lg shadow-green-900/20' :
                                                s === 'Cancelled' ? 'bg-red-500 text-white shadow-lg shadow-red-900/20' :
                                                    s === 'Shipped' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-900/20' :
                                                        s === 'Processing' ? 'bg-blue-500 text-white shadow-lg shadow-blue-900/20' :
                                                            'bg-amber-500 text-white shadow-lg shadow-amber-900/20'
                                        )
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Information Columns */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <UserCircle size={14} className="text-[#205457]" /> Receiver Details
                                </h3>
                                <div>
                                    <p className="font-black text-xl text-gray-900">{displayData.customerName}</p>
                                    <p className="text-gray-500 text-sm font-bold mt-1">{displayData.email}</p>
                                    {displayData.phone && (
                                        <p className="text-gray-700 text-sm font-bold mt-2 flex items-center gap-2">
                                            <Phone size={12} /> {displayData.phone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <MapPin size={14} className="text-[#205457]" /> Shipping Destination
                                </h3>
                                <div className="space-y-2">
                                    <p className="text-gray-900 text-sm font-black leading-relaxed">
                                        {displayData.address || "No specific address provided"}
                                    </p>
                                    <div className="flex gap-2">
                                        {displayData.city && <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-1 rounded-md">{displayData.city}</span>}
                                        {displayData.country && <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-1 rounded-md">{displayData.country}</span>}
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <Wallet size={12} /> {displayData.paymentMethod}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items Section */}
                        <div className="bg-gray-50/50 p-6 rounded-[24px] border border-gray-100">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Package size={14} className="text-[#205457]" /> Products List
                            </h3>
                            <div className="space-y-3">
                                {displayData.items.map((item, idx) => {
                                    const hasDiscount = item.finalUnitPrice && item.finalUnitPrice < item.price;
                                    const displayPrice = hasDiscount ? item.finalUnitPrice : item.price;

                                    return (
                                        <div key={idx} className="flex gap-4 p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                                            <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                                                <ResolvedImage src={item.image} productId={item.productId} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-black text-gray-900 text-xs truncate">
                                                        {item.name}
                                                    </p>
                                                    {item.isDeleted && <span className="text-[8px] font-black text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">DELETED</span>}
                                                    {hasDiscount && !item.isDeleted && <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">SAVE</span>}
                                                </div>
                                                <p className="text-[10px] text-gray-400 font-bold mt-1">
                                                    {item.quantity}x @ ${displayPrice.toFixed(2)}
                                                    {hasDiscount && <span className="line-through opacity-50 ml-1.5">${item.price.toFixed(2)}</span>}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settlement Footer */}
                <div className="p-8 bg-gray-50 flex justify-between items-center border-t border-gray-100">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Net Settlement</span>
                    <span className="text-3xl font-black text-[#205457]">
                        ${(displayData.items.reduce((sum, item) => {
                            const effectivePrice = (item.finalUnitPrice && item.finalUnitPrice < item.price) ? item.finalUnitPrice : item.price;
                            return sum + (effectivePrice * (item.quantity || 1));
                        }, 0)).toFixed(2)}
                    </span>
                </div>
            </motion.div>
        </div>
    );
};

// MAIN DASHBOARD COMPONENT
const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const storeId = localStorage.getItem('storeId');

    console.log("SellerOrders loaded - Version 2.2 (JSON Debugging Enabled)");

    const fetchOrders = async () => {
        const token = localStorage.getItem('token');
        console.group("%c[AUTH DEBUGGER]", "color: #205457; font-weight: bold;");
        console.log("Token Present:", !!token);
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                console.log("Token Payload:", payload);
                console.log("Required Role: Seller | Current Role:", payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
            } catch (e) {
                console.log("Token is not a valid JWT or could not be decoded.");
            }
        }
        console.groupEnd();

        if (!storeId) {
            setLoading(false);
            console.warn("No storeId found in localStorage");
            return;
        }
        try {
            setLoading(true);

            // 0. Fetch products catalog for enrichment in parallel
            const [ordersRes, productsRes] = await Promise.all([
                api.get(`Order/by-store/${storeId}`),
                api.get('Product/GetAllProducts').catch(() => ({ data: [] }))
            ]);

            const rawList = Array.isArray(ordersRes.data) ? ordersRes.data : [];
            const products = productsRes.data || [];

            console.log(`%c[DEBUG] PROBING ${rawList.length} ORDERS WITH ${products.length} PRODUCTS...`, "color: #205457; font-weight: bold; font-size: 14px; border-bottom: 2px solid #205457;");

            // Utility for enrichment
            const enrichItems = async (items) => {
                if (!items || !Array.isArray(items)) return items;
                return await Promise.all(items.map(async (item) => {
                    const currentOrderName = item.productName || item.name || item.product?.name || "";
                    const productId = item.productId || item.productID || item.product?.id;

                    let matchingProduct = productId
                        ? products.find(p => (p.productId || p.id) == productId)
                        : null;

                    // Verify ID match with name
                    if (matchingProduct && currentOrderName) {
                        const catName = (matchingProduct.name || "").toLowerCase();
                        const ordName = currentOrderName.toLowerCase();
                        if (!catName.includes(ordName) && !ordName.includes(catName)) {
                            matchingProduct = null;
                        }
                    }

                    // Fallback to name match
                    if (!matchingProduct && currentOrderName) {
                        matchingProduct = products.find(p => p.name?.toLowerCase().trim() === currentOrderName.toLowerCase().trim());
                    }

                    const finalProductId = productId || matchingProduct?.productId || matchingProduct?.id;
                    let imageUrl = item.image || item.imagePath || item.productImage || item.product?.image || item.product?.imageUrl || matchingProduct?.imagePath || matchingProduct?.image;

                    if (!imageUrl && finalProductId) {
                        try {
                            const imgRes = await api.get(`/ProductImages/product/${finalProductId}`);
                            const foundUrl = imgRes.data?.images?.[0]?.imageUrl || imgRes.data?.[0]?.imageUrl || imgRes.data?.imageUrls?.[0];
                            if (foundUrl) imageUrl = foundUrl;
                        } catch (e) { }
                    }

                    const isDeleted = !matchingProduct;

                    return { ...item, name: currentOrderName, productId: finalProductId, image: imageUrl, imagePath: imageUrl, isDeleted };
                }));
            };

            // 1. Initial Processing
            const enrichedList = await Promise.all(rawList.map(async (order) => {
                const norm = normalizeOrder(order);
                const enrichedItems = await enrichItems(norm.items);
                return { ...norm, items: enrichedItems, orderItems: enrichedItems };
            }));

            setOrders(enrichedList);

            // 2. Background Hydration (for full details if needed)
            rawList.forEach(async (smallOrder) => {
                const id = (smallOrder.orderId || smallOrder.id);
                const endpoints = [
                    `Order/OrderDetails?orderId=${id}`,
                    `Order/GetOrderDetails?id=${id}`,
                    `Order/OrderDetails/${id}`,
                    `Order/${id}`
                ];

                for (const url of endpoints) {
                    try {
                        const dr = await api.get(url, { headers: { 'Accept': '*/*' } });
                        if (dr.data) {
                            const norm = normalizeOrder(dr.data);
                            const enriched = await enrichItems(norm.items);
                            const finalOrder = { ...norm, items: enriched, orderItems: enriched };
                            setOrders(prev => prev.map(o => o.id === finalOrder.id ? { ...o, ...finalOrder } : o));
                            console.log(`%c[HYDRATED] Order #${id} with images`, "color: #10b981; font-weight: bold;");
                        }
                        break;
                    } catch (err) { }
                }
            });

        } catch (err) {
            console.error("Fetch orders failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [storeId]);

    const updateOrderStatus = async (id, newStatus) => {
        try {
            await api.put('/Order/status', { orderId: parseInt(id), status: newStatus });
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));

            // Restock Inventory if Cancelled
            if (newStatus === 'Cancelled') {
                const targetOrder = orders.find(o => o.id === id);
                if (targetOrder) {
                    const items = targetOrder.items || targetOrder.orderItems || [];
                    for (const item of items) {
                        try {
                            const pid = item.productId || item.product?.id;
                            if (!pid) continue;

                            const prodRes = await api.get(`/Product/GetProductById/${pid}`);
                            const product = prodRes.data;

                            if (product) {
                                const newQuantity = (product.quantity || 0) + (item.quantity || 1);

                                // Payload must match EditProduct payload structure
                                const payload = {
                                    name: product.name,
                                    description: product.description,
                                    colors: product.colors,
                                    price: parseFloat(product.price),
                                    rating: parseFloat(product.rating || 0),
                                    quantity: parseInt(newQuantity),
                                    discount: parseFloat(product.discount || 0),
                                    deliveryTime: parseInt(product.deliveryTime || 0),
                                    subCategoryId: parseInt(product.subCategoryId),
                                    categoryId: parseInt(product.categoryId),
                                    storeId: parseInt(product.storeId)
                                };

                                await api.put(`/Product/Update/${pid}`, payload);
                                console.log(`Restocked product ${pid}. New Qty: ${newQuantity}`);
                            }
                        } catch (e) {
                            console.error(`Failed to restock item in order ${id}`, e);
                        }
                    }
                }
            }
        } catch (err) {
            console.error("Status update failed", err);
        }
    };

    const handleInfoLoaded = (fresh) => {
        const norm = normalizeOrder(fresh);
        setOrders(prev => prev.map(o => o.id === norm.id ? { ...o, ...norm } : o));
    };

    const filtered = orders.filter(o => {
        const sid = o.id?.toString() || "";
        const cname = o.customerName?.toLowerCase() || "";
        const matchesSearch = sid.includes(searchTerm) || cname.includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'All' || o.status === activeTab;
        return matchesSearch && matchesTab;
    });

    if (loading) return <PageLoader />;

    return (
        <div className="min-h-screen bg-[#FDFCFB] pt-[120px] pb-20 px-4 md:px-8 font-outfit">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-6xl font-black text-gray-900 tracking-tighter">Orders</h1>
                        <p className="text-gray-400 font-bold mt-2 uppercase tracking-[0.3em] text-[10px]">Merchant Fulfillment Hub</p>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#205457] transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find ID or Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-[#205457]/5 focus:border-[#205457]/20 transition-all font-bold text-sm min-w-[320px]"
                        />
                    </div>
                </div>

                {/* Status Tabs  */}
                <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
                    {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-4 rounded-2xl text-[10px] font-black transition-all border whitespace-nowrap uppercase tracking-[0.2em] ${activeTab === tab
                                ? 'bg-gray-900 text-white border-gray-900 shadow-2xl shadow-gray-400'
                                : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                    <th className="px-8 py-6">Reference</th>
                                    <th className="px-8 py-6">Buyer</th>
                                    <th className="px-8 py-6">Destination</th>
                                    <th className="px-8 py-6">Status Flow</th>
                                    <th className="px-8 py-6 text-right">Settlement</th>
                                    <th className="px-8 py-6 text-center">Manage</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-7">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-[#205457] group-hover:text-white transition-colors">
                                                    <Package size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 text-sm">#{order.id}</p>
                                                    {/* Premium Product Peek */}
                                                    {order.items && order.items.length > 0 ? (
                                                        <div className="flex -space-x-3 hover:space-x-1 mt-3 transition-all duration-500 ease-out group/peek">
                                                            {order.items.slice(0, 3).map((item, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    title={`${item.name} (${item.quantity} units)`}
                                                                    className="relative w-11 h-11 rounded-xl border-2 border-white shadow-xl bg-gray-50 overflow-hidden ring-1 ring-black/5 hover:z-30 hover:scale-110 transition-all cursor-help"
                                                                >
                                                                    <ResolvedImage src={item.image} productId={item.productId} className="w-full h-full object-cover" />
                                                                    {item.isDeleted && (
                                                                        <div className="absolute inset-0 bg-red-500/20 backdrop-blur-[1px] flex items-center justify-center">
                                                                            <span className="text-[7px] font-black text-white bg-red-600 px-1 rounded-sm uppercase tracking-tighter">DEL</span>
                                                                        </div>
                                                                    )}
                                                                    <div className="absolute top-0 right-0 bg-[#205457] text-white text-[8px] px-1.5 py-0.5 rounded-bl-lg font-black shadow-sm">
                                                                        ×{item.quantity}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {order.items.length > 3 && (
                                                                <div className="w-11 h-11 rounded-xl border-2 border-white bg-gray-900 text-white flex items-center justify-center text-[10px] font-black shadow-lg relative z-10 scale-90 group-hover/peek:translate-x-4 transition-transform">
                                                                    +{order.items.length - 3}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="mt-3 flex items-center gap-2 animate-pulse">
                                                            <div className="w-4 h-4 rounded-full border-2 border-gray-200 border-t-[#205457] animate-spin"></div>
                                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Scanning details...</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-7 font-black text-gray-800 text-sm">
                                            {order.customerName}
                                        </td>
                                        <td className="px-8 py-7">
                                            <div className="flex flex-col">
                                                <span className="font-black text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded w-fit mb-1 uppercase">
                                                    {order.city || order.country || 'In Transit'}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-bold truncate max-w-[150px]">{order.address || 'Address Hidden'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-7">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                className={`pl-3 pr-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer outline-none appearance-none bg-no-repeat bg-[right_0.5rem_center] ${order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-100' :
                                                    order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                                                        order.status === 'Shipped' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                                            order.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                                'bg-amber-50 text-amber-900 border-amber-100' // Pending/Default
                                                    }`}
                                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundSize: '1rem' }}
                                            >
                                                {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-8 py-7 text-right font-black text-[#205457] text-lg">
                                            ${order.totalPrice.toFixed(2)}
                                        </td>
                                        <td className="px-8 py-7 text-center">
                                            <button
                                                onClick={() => setSelectedOrderId(order.id)}
                                                className="p-3 bg-gray-900 text-white rounded-2xl hover:bg-[#205457] transition-all shadow-xl shadow-gray-200 active:scale-95"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center justify-center opacity-30">
                                                <Package size={64} className="mb-4 text-gray-400" />
                                                <p className="font-black uppercase tracking-[0.3em] text-sm">No orders found</p>
                                                <p className="text-[10px] font-bold mt-2">Adjust your filters or keep growing!</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {selectedOrderId && (
                    <OrderDetailsModal
                        orderId={selectedOrderId}
                        initialData={orders.find(o => o.id === selectedOrderId)}
                        onClose={() => setSelectedOrderId(null)}
                        onUpdateStatus={updateOrderStatus}
                        onInfoLoaded={handleInfoLoaded}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default SellerOrders;
