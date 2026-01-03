import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Package, Mail, Phone, MapPin, ArrowLeft, Trash2, Search, AlertCircle, Image as ImageIcon } from 'lucide-react';
import api from '../../lib/axios';
import PageLoader from '../../components/PageLoader';

// Separate component for each product card to handle individual image fetching
const StoreProductCard = ({ product, onDeleteClick }) => {
    const [images, setImages] = useState([]);
    const [loadingImage, setLoadingImage] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                // Determine ID (fallback for safety)
                const id = product.productId || product.id;
                if (!id) return;

                const res = await api.get(`/ProductImages/product/${id}`);
                // API returns array: [{ productId: x, imageUrls: [...] }]
                if (Array.isArray(res.data) && res.data.length > 0 && res.data[0].imageUrls) {
                    setImages(res.data[0].imageUrls);
                }
            } catch (err) {
                // Silent fail
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

    const displayImage = images.length > 0 ? images[0] : null;

    return (
        <div className="bg-white p-4 rounded-[25px] border border-gray-100 group hover:shadow-lg transition-all h-full flex flex-col">
            <div className="h-48 bg-gray-50 rounded-2xl mb-4 overflow-hidden relative flex-shrink-0">
                {displayImage ? (
                    <img
                        src={getImageUrl(displayImage)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        {loadingImage ? <div className="animate-pulse w-full h-full bg-gray-200" /> : <Package size={32} />}
                    </div>
                )}

                {/* Fallback for onError */}
                <div className="hidden absolute inset-0 w-full h-full items-center justify-center bg-gray-50 text-gray-300">
                    <Package size={32} />
                </div>

                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onDeleteClick(product.productId || product.id)}
                        className="p-2 bg-white/90 text-red-500 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                {/* Image Counter Badge if multiple images */}
                {images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 pointer-events-none">
                        <ImageIcon size={9} />
                        {images.length}
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 line-clamp-1" title={product.name}>{product.name}</h3>
                <p className="text-[#205457] font-bold text-lg mt-1">${product.price}</p>
                <div className="flex justify-between items-center mt-auto pt-3 text-xs text-gray-400">
                    <span>Qty: {product.quantity}</span>
                    <span>{product.category || 'N/A'}</span>
                </div>
            </div>
        </div>
    );
};

const AdminStoreDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [store, setStore] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('inventory');
    const [deleteModal, setDeleteModal] = useState({ show: false, productId: null });

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
                    // 2. Fetch Products
                    console.log("Fetching products for store:", id);
                    const prodRes = await api.get(`/Store/${id}/products`);
                    setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
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

    const handleDeleteProduct = async () => {
        if (!deleteModal.productId) return;
        try {
            await api.delete(`/Product/${deleteModal.productId}`);
            setProducts(prev => prev.filter(p => (p.productId || p.id) !== deleteModal.productId));
            setDeleteModal({ show: false, productId: null });
        } catch (err) {
            console.error("Failed to delete product:", err);
            alert("Failed to delete product. Please try again.");
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
                                        onDeleteClick={(id) => setDeleteModal({ show: true, productId: id })}
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
                            className="bg-white rounded-[30px] border border-gray-100 p-8 min-h-[400px] flex items-center justify-center"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <Package size={24} />
                                </div>
                                <h3 className="text-gray-900 font-bold mb-2">Orders History</h3>
                                <p className="text-gray-400 max-w-md mx-auto">
                                    View all orders placed for this store's items. Track status, fulfillment, and customer details.
                                    <br /><span className="text-xs text-[#205457] mt-2 block">(Integration Coming Soon)</span>
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'reviews' && (
                        <motion.div
                            key="reviews"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-white rounded-[30px] border border-gray-100 p-8 min-h-[400px] flex items-center justify-center"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <AlertCircle size={24} />
                                </div>
                                <h3 className="text-gray-900 font-bold mb-2">Customer Reviews</h3>
                                <p className="text-gray-400 max-w-md mx-auto">
                                    See what customers are saying about this store's products.
                                    <br /><span className="text-xs text-[#205457] mt-2 block">(Integration Coming Soon)</span>
                                </p>
                            </div>
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

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Product?</h3>
                        <p className="text-gray-500 mb-6 text-sm">
                            Are you sure you want to remove this product from the store? This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setDeleteModal({ show: false, productId: null })}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteProduct}
                                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStoreDetails;
