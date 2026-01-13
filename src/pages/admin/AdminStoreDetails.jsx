import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Package, Mail, Phone, MapPin, ArrowLeft, Trash2, Search, AlertCircle, Eye, Star, X, Image as ImageIcon } from 'lucide-react';
import api from '../../lib/axios';
import PageLoader from '../../components/PageLoader';
import SafeImage from '../../components/SafeImage';

const COLOR_MAP = {
    "brown": "#A67B5B",
    "grey": "#9E9E9E",
    "gray": "#9E9E9E",
    "green": "#5B8C5A",
    "red": "#D64545",
    "orange": "#E8915B",
    "blue": "#5B9BD5",
    "white": "#F5F5F5",
    "black": "#2D2D2D",
    "yellow": "#F59E0B",
    "purple": "#8B5CF6",
    "pink": "#EC4899",
    "beige": "#F5F5DC",
    "gold": "#FFD700",
    "silver": "#C0C0C0",
    "navy": "#000080",
    "teal": "#008080",
    "maroon": "#800000",
    "olive": "#808000"
};

const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

const getDistance = (rgb1, rgb2) => {
    return Math.sqrt(
        Math.pow(rgb1.r - rgb2.r, 2) +
        Math.pow(rgb1.g - rgb2.g, 2) +
        Math.pow(rgb1.b - rgb2.b, 2)
    );
};

const getColorName = (colorVal) => {
    if (!colorVal) return "";
    const val = colorVal.trim().toLowerCase();
    if (!val.startsWith('#')) return colorVal;

    // Try exact
    const exactFound = Object.entries(COLOR_MAP).find(([name, hex]) => hex.toLowerCase() === val);
    if (exactFound) return exactFound[0];

    // Try nearest
    const targetRgb = hexToRgb(val);
    if (!targetRgb) return colorVal;

    let minDistance = Infinity;
    let nearestName = colorVal;

    Object.entries(COLOR_MAP).forEach(([name, hex]) => {
        const mapRgb = hexToRgb(hex);
        if (mapRgb) {
            const distance = getDistance(targetRgb, mapRgb);
            if (distance < minDistance) {
                minDistance = distance;
                nearestName = name;
            }
        }
    });

    return nearestName;
};

// --- MODAL COMPONENT ---
const ProductDetailsModal = ({ product, onClose }) => {
    const [images, setImages] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loadingImages, setLoadingImages] = useState(true);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const id = product.productId || product.id;
                // 1. Fetch Images
                const imgRes = await api.get(`/ProductImages/product/${id}`);
                if (imgRes.data && Array.isArray(imgRes.data.images)) {
                    setImages(imgRes.data.images.map(img => img.imageUrl).filter(Boolean));
                }

                // 2. Fetch Product Reviews
                const revRes = await api.get(`/Review/product/${id}`);
                setReviews(Array.isArray(revRes.data) ? revRes.data : []);
            } catch (err) {
                console.error("Failed to fetch product details", err);
            } finally {
                setLoadingImages(false);
                setLoadingReviews(false);
            }
        };
        fetchDetails();
    }, [product]);

    const getImageUrl = (url) => {
        if (!url || typeof url !== 'string') return null;
        if (url.startsWith('http')) return url;
        return `http://homefinish.runasp.net${url.startsWith('/') ? '' : '/'}${url}`;
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="flex justify-between items-center p-8 border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                        <p className="text-gray-500 text-sm">Product ID: #{product.productId || product.id}</p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white rounded-2xl hover:bg-gray-100 transition-colors shadow-sm text-gray-400">
                        <X size={24} />
                    </button>
                </div>

                <div className="overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <div className="aspect-square bg-gray-50 rounded-[30px] overflow-hidden relative border border-gray-100 flex items-center justify-center">
                            {images.length > 0 ? (
                                <img
                                    src={getImageUrl(images[selectedImageIndex])}
                                    alt="Main"
                                    className="w-full h-full object-contain p-4"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-200">
                                    {loadingImages ? <div className="w-10 h-10 border-4 border-[#205457]/10 border-t-[#205457] rounded-full animate-spin" /> : <Package size={64} />}
                                </div>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="grid grid-cols-5 gap-2">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImageIndex(idx)}
                                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImageIndex === idx ? 'border-[#205457]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={getImageUrl(img)} className="w-full h-full object-cover" alt="" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-black text-[#B19470] bg-[#B19470]/10 px-3 py-1 rounded-lg uppercase tracking-widest">
                                    {product.category || 'Furniture'}
                                </span>
                                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                                    <Star size={12} className="fill-amber-400 text-amber-400" />
                                    <span className="text-xs font-bold text-amber-700">{product.rating || '0.0'}</span>
                                </div>
                            </div>
                            <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">Description</span>
                            <div
                                className="text-gray-500 leading-relaxed font-light italic prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{
                                    __html: (() => {
                                        let raw = product.description || "";
                                        const unescape = (str) => str
                                            .replace(/&amp;/g, '&')
                                            .replace(/&lt;/g, '<')
                                            .replace(/&gt;/g, '>')
                                            .replace(/&nbsp;/g, ' ')
                                            .replace(/&quot;/g, '"');
                                        return unescape(unescape(unescape(raw))) || 'No description provided.';
                                    })()
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Price</span>
                                <div className="text-3xl font-black text-[#205457]">${product.price}</div>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Stock</span>
                                <div className="text-3xl font-black text-gray-900">{product.quantity}</div>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Discount</span>
                                <div className="text-3xl font-black text-red-500">{product.discount || 0}%</div>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Status</span>
                                <div className={`text-sm font-bold mt-1 ${product.quantity > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {product.quantity > 0 ? 'Active' : 'Out of Stock'}
                                </div>
                            </div>
                        </div>

                        {product.colors && (
                            <div>
                                <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">Colors</span>
                                <div className="flex flex-wrap gap-3">
                                    {(Array.isArray(product.colors) ? product.colors : product.colors.split(',')).map((colorVal, i) => {
                                        const trimmed = colorVal.trim();
                                        const hex = trimmed.startsWith('#') ? trimmed : (COLOR_MAP[trimmed.toLowerCase()] || '#E5E7EB');
                                        return (
                                            <div key={i} className="group/color relative flex flex-col items-center">
                                                <div
                                                    className="w-8 h-8 rounded-full border-2 border-white shadow-md ring-1 ring-gray-100 transition-transform hover:scale-110 cursor-help"
                                                    style={{ backgroundColor: hex }}
                                                    title={getColorName(trimmed)}
                                                />
                                                <span className="text-[8px] font-black text-gray-400 mt-1 uppercase tracking-tighter opacity-0 group-hover/color:opacity-100 transition-opacity">
                                                    {getColorName(trimmed)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Recent Reviews Summary */}
                        <div className="pt-6 border-t border-gray-100">
                            <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Star size={16} className="text-[#B19470]" />
                                Product Reviews ({reviews.length})
                            </h4>
                            {loadingReviews ? (
                                <div className="h-20 flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-[#205457]/10 border-t-[#205457] rounded-full animate-spin" />
                                </div>
                            ) : reviews.length > 0 ? (
                                <div className="space-y-3">
                                    {reviews.slice(0, 2).map((rev, i) => (
                                        <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-bold text-gray-900">{rev.userName || 'Customer'}</span>
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={8} className={s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />)}
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-gray-500 italic line-clamp-2">"{rev.comment}"</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 italic">No reviews yet for this piece.</p>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Separate component for each product card to handle individual image fetching
const StoreProductCard = ({ product, onDeleteClick, onViewClick }) => {
    const [images, setImages] = useState([]);
    const [loadingImage, setLoadingImage] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const id = product.productId || product.id;
                if (!id) return;

                const res = await api.get(`/ProductImages/product/${id}`);
                // API returns: { productId: id, images: [{ productImageId: x, imageUrl: "..." }] }
                if (res.data && Array.isArray(res.data.images)) {
                    const urls = res.data.images.map(img => img.imageUrl).filter(Boolean);
                    setImages(urls);
                }
            } catch (err) {
                console.error("Failed to fetch product images:", err);
            } finally {
                setLoadingImage(false);
            }
        };

        fetchImages();
    }, [product]);

    // Helper to format image URL
    const getImageUrl = (url) => {
        if (!url || typeof url !== 'string') return null;
        if (url.startsWith('http')) return url;
        return `http://homefinish.runasp.net${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const displayImage = images.length > 0 ? images[0] : product.imagePath;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[35px] border border-gray-100 overflow-hidden group hover:shadow-2xl hover:shadow-[#205457]/5 transition-all duration-500 flex flex-col"
        >
            <div className="relative aspect-square bg-gray-50 overflow-hidden">
                {displayImage ? (
                    <img
                        src={getImageUrl(displayImage)}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"
                        onClick={() => onViewClick(product)}
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                        {loadingImage ? (
                            <div className="w-8 h-8 border-2 border-[#205457]/10 border-t-[#205457] rounded-full animate-spin" />
                        ) : (
                            <Package size={40} strokeWidth={1.5} />
                        )}
                    </div>
                )}

                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.quantity <= 10 && (
                        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${product.quantity === 0 ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                            }`}>
                            {product.quantity === 0 ? 'Out of Stock' : `Low Stock: ${product.quantity}`}
                        </span>
                    )}
                    {product.discount > 0 && (
                        <span className="px-3 py-1.5 bg-[#205457] text-white rounded-xl text-[9px] font-black uppercase tracking-widest">
                            -{product.discount}% OFF
                        </span>
                    )}
                </div>

                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <button
                        onClick={() => onViewClick(product)}
                        className="p-3 bg-white text-[#205457] rounded-full flex items-center justify-center shadow-xl hover:bg-[#205457] hover:text-white transition-all transform -translate-y-4 group-hover:translate-y-0 duration-500"
                        title="View Details"
                    >
                        <Eye size={22} />
                    </button>
                </div>

                {images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-bold text-[#205457] flex items-center gap-1 shadow-sm">
                        <ImageIcon size={10} />
                        {images.length}
                    </div>
                )}
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="mb-3">
                    <p className="text-[10px] font-black text-[#B19470] uppercase tracking-widest mb-1">
                        {product.category || 'Furniture piece'}
                    </p>
                    <h3 className="font-bold text-gray-900 line-clamp-1 text-lg leading-tight" title={product.name}>
                        {product.name}
                    </h3>
                </div>

                <div className="mt-auto flex items-end justify-between">
                    <div>
                        <span className="text-xs text-gray-400 block mb-1 font-medium">Market Price</span>
                        <p className="text-2xl font-black text-[#205457] tracking-tight leading-none">${product.price}</p>
                    </div>
                    <div className="text-right">
                        <span className="text-xs text-gray-400 block mb-1 font-medium">Available</span>
                        <p className="text-sm font-bold text-gray-900">{product.quantity} units</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const StoreOrdersList = ({ storeId }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                // Fetch orders and products in parallel
                const [ordersRes, productsRes] = await Promise.all([
                    api.get('Order/all'),
                    api.get('Product/GetAllProducts').catch(() => ({ data: [] }))
                ]);

                const rawOrders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
                const products = productsRes.data || [];

                console.log('📦 Store Orders Raw:', rawOrders.length);
                console.log('🏪 Products loaded:', products.length);

                // 2. Filter orders where at least one item belongs to this store
                const filteredOrders = rawOrders.filter(order =>
                    (order.items || order.orderItems || []).some(item => (item.storeId?.toString() === storeId?.toString()))
                );

                // 3. Process and enrich orders with images matching this store
                const processedOrders = await Promise.all(filteredOrders.map(async (order) => {
                    // Filter items to only show this store's items
                    const storeItems = (order.items || order.orderItems || []).filter(item => item.storeId?.toString() === storeId?.toString());

                    // Enrich items with images
                    const enrichedItems = await Promise.all(storeItems.map(async (item) => {
                        // Priority 1: Use productId from item response
                        // Priority 2: Match product catalog by productId (if item has it)
                        // Priority 3: Fallback match by name (if item lacks productId)
                        const currentOrderName = item.productName || item.name || "";

                        // Priority 1: Match by ID
                        let matchingProduct = item.productId
                            ? products.find(p => (p.productId || p.id) == item.productId)
                            : null;

                        // Verify ID match with name similarity to avoid reused IDs showing wrong products
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

                        if (!imageUrl && productId) {
                            try {
                                const imgRes = await api.get(`/ProductImages/product/${productId}`);
                                if (imgRes.data?.images?.length) {
                                    imageUrl = imgRes.data.images[0].imageUrl;
                                } else if (imgRes.data?.imageUrls?.length) {
                                    imageUrl = imgRes.data.imageUrls[0];
                                }

                                if (imageUrl) {
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

                    const itemsTotal = enrichedItems.reduce((sum, item) => {
                        return sum + (item.total ?? ((item.finalUnitPrice ?? item.price ?? 0) * (item.quantity || 1)));
                    }, 0);

                    return {
                        ...order,
                        items: enrichedItems,
                        orderItems: enrichedItems,
                        displayTotal: itemsTotal > 0 ? itemsTotal : (order.orderTotal ?? order.totalPrice ?? 0)
                    };
                }));

                setOrders(processedOrders);
            } catch (err) {
                console.error("Failed to fetch store orders:", err);
            } finally {
                setLoading(false);
            }
        };
        if (storeId) fetchOrders();
    }, [storeId]);

    if (loading) return <div className="py-10 text-center text-gray-400">Loading store orders...</div>;
    if (orders.length === 0) return (
        <div className="bg-white rounded-[30px] border border-dashed border-gray-200 py-20 text-center">
            <ShoppingBag size={40} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-gray-900 font-bold">No Orders Yet</h3>
            <p className="text-gray-400 text-sm">This store hasn't received any orders yet.</p>
        </div>
    );

    return (
        <div className="space-y-4">
            {orders.map((order, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[30px] border border-gray-100 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 min-w-[150px]">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                            <Package size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Order ID</p>
                            <p className="font-bold text-gray-900 leading-none pb-1">#{order.orderId || order.id}</p>
                        </div>
                    </div>
                    {/* Customer Info */}
                    <div className="flex-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Customer</p>
                        <p className="font-bold text-gray-700 text-sm">
                            {order.firstName && order.lastName
                                ? `${order.firstName} ${order.lastName}`
                                : (order.firstName || order.userName || 'Guest User')}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                            {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Items Preview */}
                    <div className="hidden lg:block flex-1">
                        <div className="flex -space-x-3">
                            {(order.items || []).slice(0, 5).map((item, i) => (
                                <div key={i} title={item.productName} className={`w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm relative ${item.isDeleted ? 'opacity-80' : ''}`}>
                                    <SafeImage src={item.image || item.imagePath} className="w-full h-full object-cover" alt={item.productName} type="product" />
                                    {item.isDeleted && (
                                        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                                            <span className="text-[6px] font-black text-white bg-red-600 px-0.5 rounded-sm uppercase tracking-tighter">DEL</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="text-right px-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Amount</p>
                        <p className="text-lg font-black text-[#205457]">${(order.displayTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-green-50 text-green-600' :
                        order.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                            order.status === 'Shipped' ? 'bg-indigo-50 text-indigo-600' :
                                order.status === 'Processing' ? 'bg-blue-50 text-blue-600' :
                                    'bg-amber-50 text-amber-600'
                        }`}>
                        {order.status || 'Accepted'}
                    </div>
                </div>
            ))}
        </div>
    );
};

const AdminStoreDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showAlert } = useAppContext();
    const [store, setStore] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('inventory');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [storeReviews, setStoreReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);

    useEffect(() => {
        if (activeTab === 'reviews' && id) {
            const fetchStoreReviews = async () => {
                try {
                    setLoadingReviews(true);
                    const res = await api.get(`/Review/store/${id}`);
                    setStoreReviews(Array.isArray(res.data) ? res.data : []);
                } catch (err) {
                    console.error("Failed to fetch store reviews", err);
                } finally {
                    setLoadingReviews(false);
                }
            };
            fetchStoreReviews();
        }
    }, [activeTab, id]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // 1. Fetch Store Details
                const storeRes = await api.get('/Store');
                const allStores = Array.isArray(storeRes.data) ? storeRes.data : [storeRes.data];
                const foundStore = allStores.find(s => (s.storeId || s.id).toString() === id);

                if (foundStore) {
                    setStore(foundStore);
                    // 2. Fetch Products and filter against global active list
                    console.log("Fetching products for store:", id);
                    const [prodRes, globalRes] = await Promise.all([
                        api.get(`/Store/${id}/products`),
                        api.get('Product/GetAllProducts')
                    ]);

                    const productsList = prodRes.data?.products || (Array.isArray(prodRes.data) ? prodRes.data : []);
                    const globalActive = Array.isArray(globalRes.data) ? globalRes.data : [];

                    // Only show products that exist in the global active catalog
                    const filteredActive = productsList.filter(p =>
                        globalActive.some(active => (active.productId || active.id) == (p.productId || p.id))
                    );

                    setProducts(filteredActive);
                } else {
                    console.error("Store not found");
                }
            } catch (err) {
                console.error("Failed to fetch store details:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    const handleViewProductById = (productId) => {
        const product = products.find(p => (p.productId || p.id).toString() === productId?.toString());
        if (product) {
            setSelectedProduct(product);
        } else {
            showAlert("Product details not found in this store's inventory.", "info", "Product Info");
        }
    };

    const filteredProducts = products.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <PageLoader />;
    if (!store) return <div className="pt-[120px] text-center">Store not found</div>;

    return (
        <div className="min-h-screen bg-[#FDFCFB] pt-[110px] px-6 md:px-12 xl:px-16 pb-24 font-outfit">
            <div className="max-w-[1440px] mx-auto">
                <button
                    onClick={() => navigate('/admin/stores')}
                    className="flex items-center gap-2 text-gray-400 hover:text-[#205457] mb-8 font-medium transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Stores
                </button>

                {/* Store Header Card */}
                <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-sm border border-gray-100 mb-10 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#205457]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                        <div className="w-24 h-24 bg-[#205457] rounded-3xl flex items-center justify-center text-white shadow-xl shadow-[#205457]/20">
                            <Store size={40} />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{store.name}</h1>
                            <div className="flex flex-wrap gap-6 text-gray-500 mt-4">
                                <div className="flex items-center gap-2">
                                    <Mail size={16} className="text-[#205457]" />
                                    <span>{store.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone size={16} className="text-[#205457]" />
                                    <span>{store.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-[#205457]" />
                                    <span>{store.address}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 min-w-[150px]">
                            <div className="bg-gray-50 p-4 rounded-2xl text-center">
                                <span className="block text-xs uppercase font-bold text-gray-400 mb-1">Total Products</span>
                                <span className="text-2xl font-bold text-[#205457]">{products.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex items-center gap-2 mb-8 border-b border-gray-100 overflow-x-auto no-scrollbar">
                    {['inventory', 'orders', 'reviews', 'sales'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-bold text-sm capitalize transition-all border-b-2 whitespace-nowrap ${activeTab === tab
                                ? 'text-[#205457] border-[#205457]'
                                : 'text-gray-400 border-transparent hover:text-gray-600'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'inventory' && (
                        <motion.div
                            key="inventory"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {/* Products Search & Grid */}
                            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Store Inventory</h2>
                                    <p className="text-gray-400 text-sm mt-1">Manage products listed by this store.</p>
                                </div>
                                <div className="relative w-full md:w-80">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#205457]/20 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                {filteredProducts.map((product) => (
                                    <StoreProductCard
                                        key={product.productId || product.id}
                                        product={product}
                                        onViewClick={setSelectedProduct}
                                    />
                                ))}
                            </div>
                            {filteredProducts.length === 0 && (
                                <div className="text-center py-20 bg-white rounded-[30px] border border-dashed border-gray-200">
                                    <Package size={40} className="mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-gray-900 font-bold">No Products Found</h3>
                                    <p className="text-gray-400 text-sm">This store hasn't listed anything yet or no matches found.</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'orders' && (
                        <motion.div
                            key="orders"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <StoreOrdersList storeId={id} />
                        </motion.div>
                    )}

                    {activeTab === 'reviews' && (
                        <motion.div
                            key="reviews"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Customer Feedback</h2>
                                    <p className="text-gray-400 text-sm mt-1">What buyers are saying about this store.</p>
                                </div>
                                <div className="bg-amber-50 px-4 py-2 rounded-2xl flex items-center gap-2 border border-amber-100">
                                    <Star className="fill-amber-400 text-amber-400" size={20} />
                                    <span className="text-xl font-bold text-amber-900">
                                        {storeReviews.length > 0
                                            ? (storeReviews.reduce((acc, r) => acc + r.rating, 0) / storeReviews.length).toFixed(1)
                                            : '0.0'}
                                    </span>
                                    <span className="text-amber-400 text-sm">/ 5.0</span>
                                </div>
                            </div>

                            {loadingReviews ? (
                                <div className="bg-white rounded-[30px] border border-gray-100 p-20 flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-10 h-10 border-4 border-[#205457]/10 border-t-[#205457] rounded-full animate-spin" />
                                        <p className="text-gray-400 font-medium">Loading reviews...</p>
                                    </div>
                                </div>
                            ) : storeReviews.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {storeReviews.map((rev, i) => (
                                        <div key={i} className="bg-white rounded-[35px] p-8 border border-gray-100 hover:shadow-xl transition-all group">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#205457] font-bold text-lg">
                                                        {rev.userName?.charAt(0) || 'C'}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">{rev.userName || 'Customer'}</h4>
                                                        <div className="flex gap-1 mt-1">
                                                            {[1, 2, 3, 4, 5].map(s => (
                                                                <Star key={s} size={12} className={s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">
                                                    Verified Purchase
                                                </span>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed italic mb-6">"{rev.comment}"</p>
                                            <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-[#FDFCFB] border border-gray-100 overflow-hidden">
                                                        {/* Product thumbnail could go here if rev has productId */}
                                                        <Package size={14} className="m-auto text-gray-300 mt-2" />
                                                    </div>
                                                    <span
                                                        onClick={() => handleViewProductById(rev.productId)}
                                                        className="text-xs font-bold text-[#205457] hover:underline cursor-pointer"
                                                    >
                                                        Review for Product #{rev.productId}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-[30px] border border-dashed border-gray-200 p-20 text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                        <AlertCircle size={32} />
                                    </div>
                                    <h3 className="text-gray-900 font-bold mb-1">No Reviews Yet</h3>
                                    <p className="text-gray-400 text-sm">Customers haven't shared their experience with this store yet.</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'sales' && (
                        <motion.div
                            key="sales"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-white rounded-[30px] border border-gray-100 p-8 min-h-[400px] flex items-center justify-center"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <AlertCircle size={24} />
                                </div>
                                <h3 className="text-gray-900 font-bold mb-2">Sales Analytics</h3>
                                <p className="text-gray-400 max-w-md mx-auto">
                                    Detailed insights into revenue, conversion rates, and top-selling products.
                                    <br /><span className="text-xs text-[#205457] mt-2 block">(Integration Coming Soon)</span>
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Content area end */}

            {/* Product Details Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <ProductDetailsModal
                        product={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminStoreDetails;
