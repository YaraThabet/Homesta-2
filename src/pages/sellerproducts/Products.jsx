import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    Edit3,
    Trash2,
    Plus,
    Search,
    Filter,
    MoreVertical,
    ExternalLink,
    AlertCircle,
    Check,
    X,
    LayoutGrid,
    List
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../lib/axios';

const Products = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);

    const storeId = localStorage.getItem('storeId');

    useEffect(() => {
        const resolveStoreAndFetch = async () => {
            try {
                setLoading(true);
                setError(null);
                const userEmail = localStorage.getItem('userEmail');

                if (!userEmail) {
                    console.warn("No user email found in storage.");
                    setError("Session expired. Please login again.");
                    navigate('/login');
                    return;
                }

                console.log("🔍 Resolving store for:", userEmail);

                // Fetch all stores to find the one belonging to this email
                const storesRes = await api.get('/Store');
                console.log("📊 All stores response:", storesRes.data);
                const stores = Array.isArray(storesRes.data) ? storesRes.data : [storesRes.data];
                console.log("📊 Stores array:", stores);

                const myStore = stores.find(s => s.email?.toLowerCase() === userEmail?.toLowerCase());
                console.log("🏪 My store:", myStore);

                if (myStore) {
                    const sid = myStore.storeId || myStore.id;
                    console.log("✅ Store ID found:", sid);
                    localStorage.setItem('storeId', sid.toString());

                    console.log(`🔄 Fetching products from: /Store/${sid}/products`);
                    const productsRes = await api.get(`/Store/${sid}/products`);
                    console.log("📦 Products response:", productsRes);
                    console.log("📦 Products data:", productsRes.data);
                    console.log("📦 Products count:", productsRes.data?.length || 0);

                    const productsList = Array.isArray(productsRes.data) ? productsRes.data : [];
                    console.log("📦 Final products list:", productsList);
                    setProducts(productsList);
                } else {
                    console.warn("❌ No store linked to this email.");
                    setError("No store found for your account. Please create a store first.");
                    navigate('/create-store');
                }
            } catch (err) {
                console.error("❌ Failed to resolve store or products:", err);
                console.error("❌ Error response:", err.response);
                console.error("❌ Error data:", err.response?.data);
                const backendMsg = err.response?.data?.message || err.response?.data || err.message;
                setError(`Failed to load inventory: ${typeof backendMsg === 'object' ? JSON.stringify(backendMsg) : backendMsg}`);
            } finally {
                setLoading(false);
            }
        };

        resolveStoreAndFetch();
    }, [navigate]);

    const fetchProducts = async () => {
        // Redundant now as it's handled in the effect, but kept for potential manual refreshes
        const sid = localStorage.getItem('storeId');
        if (!sid) return;
        try {
            setLoading(true);
            const response = await api.get(`/Store/${sid}/products`);
            setProducts(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("Failed to fetch products:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            setIsDeleting(true);
            // DELETE /api/Product/Delete?productId={productId}
            await api.delete(`/Product/Delete?productId=${deleteId}`);

            // Remove from local state
            setProducts(products.filter(p => (p.productId || p.id) !== deleteId));
            setDeleteId(null);
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete product. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] pt-[110px] px-6 lg:px-16 pb-24 font-outfit">
            <motion.div
                className="max-w-7xl mx-auto"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="h-[1px] w-8 bg-[#205457]"></span>
                            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#205457]/60">Inventory</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                            My <span className="text-[#205457]">Products</span>
                        </h1>
                        <p className="text-gray-400 mt-3 text-lg font-light">
                            Manage your showroom pieces and keep your inventory up to date.
                        </p>
                    </div>

                    <Link to="/addproduct" className="bg-[#205457] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:shadow-2xl hover:shadow-[#205457]/20 transition-all active:scale-95 shadow-xl">
                        <Plus className="w-5 h-5" />
                        <span>Add New Product</span>
                    </Link>
                </div>

                {/* Toolbar Section */}
                <motion.div variants={itemVariants} className="bg-white p-4 rounded-[30px] shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-gray-100 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-[#205457]" size={20} />
                        <input
                            type="text"
                            placeholder="Search your inventory..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#205457]/10 focus:bg-white outline-none transition-all font-medium text-gray-700"
                        />
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#205457]' : 'text-gray-400'}`}
                            >
                                <LayoutGrid size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#205457]' : 'text-gray-400'}`}
                            >
                                <List size={20} />
                            </button>
                        </div>

                        <button className="flex items-center gap-2 px-6 py-4 bg-gray-50 rounded-2xl text-gray-400 font-bold text-sm hover:bg-gray-100 transition-all border border-gray-100">
                            <Filter size={18} />
                            <span>Filter</span>
                        </button>
                    </div>
                </motion.div>

                {/* Products Content */}
                {error ? (
                    <motion.div variants={itemVariants} className="bg-red-50 rounded-[30px] lg:rounded-[45px] p-10 md:p-20 text-center border border-red-200">
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8 text-red-500">
                            <AlertCircle size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Products</h3>
                        <p className="text-red-600 max-w-2xl mx-auto mb-10 leading-relaxed font-mono text-sm bg-white p-4 rounded-xl">
                            {error}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center gap-3 bg-[#205457] text-white px-10 py-5 rounded-[22px] font-bold hover:shadow-2xl hover:shadow-[#205457]/20 transition-all active:scale-95 shadow-xl"
                        >
                            Retry
                        </button>
                    </motion.div>
                ) : loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="w-12 h-12 border-4 border-[#205457]/10 border-t-[#205457] rounded-full animate-spin"></div>
                        <p className="text-gray-400 font-medium">Curating your collection...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <motion.div variants={itemVariants} className="bg-white rounded-[30px] lg:rounded-[45px] p-10 md:p-20 text-center border border-dashed border-gray-200">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
                            <Package size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">No products found</h3>
                        <p className="text-gray-400 max-w-sm mx-auto mb-10 leading-relaxed">
                            {searchTerm ? "Try adjusting your search terms to find what you're looking for." : "Start by adding your first furniture masterpiece to your store."}
                        </p>
                        {!searchTerm && (
                            <Link to="/addproduct" className="inline-flex items-center gap-3 bg-[#205457] text-white px-10 py-5 rounded-[22px] font-bold hover:shadow-2xl hover:shadow-[#205457]/20 transition-all active:scale-95 shadow-xl">
                                <Plus size={20} />
                                <span>Create My First Product</span>
                            </Link>
                        )}
                    </motion.div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.productId || product.id}
                                product={product}
                                onEdit={() => navigate(`/edit-product/${product.productId || product.id}`)}
                                onDelete={() => setDeleteId(product.productId || product.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[30px] lg:rounded-[40px] shadow-[0_15px_50px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Product</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Price</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Stock</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredProducts.map((product) => (
                                    <ProductRow
                                        key={product.productId || product.id}
                                        product={product}
                                        onEdit={() => navigate(`/edit-product/${product.productId || product.id}`)}
                                        onDelete={() => setDeleteId(product.productId || product.id)}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl relative overflow-hidden"
                        >
                            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-8 mx-auto text-red-500">
                                <AlertCircle size={40} />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">Delete Product?</h3>
                            <p className="text-gray-500 text-center mb-10 font-light leading-relaxed">
                                This action cannot be undone. This piece will be permanently removed from your showroom.
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setDeleteId(null)}
                                    className="flex-1 py-4 bg-gray-50 text-gray-400 font-bold rounded-2xl hover:bg-gray-100 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex-1 py-4 bg-red-500 text-white font-bold rounded-2xl shadow-xl shadow-red-500/10 hover:bg-red-600 transition-all disabled:opacity-50"
                                >
                                    {isDeleting ? "Deleting..." : "Delete Piece"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const backendBase = 'http://homefinish.runasp.net';

const ProductCard = ({ product, onEdit, onDelete }) => {
    const imageUrl = product.image
        ? (product.image.startsWith('http') ? product.image : `${backendBase}${product.image}`)
        : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group bg-white rounded-[40px] overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.02)] border border-gray-100 hover:shadow-2xl hover:shadow-[#205457]/5 transition-all duration-500 flex flex-col h-full"
        >
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                    {product.quantity <= 5 && (
                        <span className="px-4 py-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg">
                            {product.quantity === 0 ? "Out of Stock" : `Low Stock: ${product.quantity}`}
                        </span>
                    )}
                </div>

                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-3">
                    <button
                        onClick={onEdit}
                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#205457] hover:bg-[#205457] hover:text-white transition-all transform -translate-y-4 group-hover:translate-y-0 duration-500"
                    >
                        <Edit3 size={20} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

            <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h4 className="font-bold text-gray-900 text-lg leading-tight mb-2 truncate max-w-[180px]">{product.name}</h4>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#B19470] bg-[#B19470]/10 px-3 py-1 rounded-lg">
                            {product.categoryName || 'Furniture'}
                        </span>
                    </div>
                    <p className="text-xl font-black text-[#205457] tabular-nums">${product.price}</p>
                </div>

                <p className="text-gray-400 text-sm font-light line-clamp-2 leading-relaxed h-[40px]">
                    {product.description || "No description available for this piece."}
                </p>
            </div>
        </motion.div>
    );
};

const ProductRow = ({ product, onEdit, onDelete }) => {
    const imageUrl = product.image
        ? (product.image.startsWith('http') ? product.image : `${backendBase}${product.image}`)
        : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80';

    return (
        <tr className="hover:bg-gray-50/50 transition-colors group">
            <td className="px-8 py-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-20 rounded-2xl overflow-hidden bg-gray-50 border-2 border-white shadow-sm flex-shrink-0">
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-base">{product.name}</p>
                        <p className="text-xs text-gray-400 font-light mt-1">{product.subCategoryName || 'Standard Edition'}</p>
                    </div>
                </div>
            </td>
            <td className="px-8 py-6">
                <p className="font-black text-gray-900 tabular-nums">${product.price}</p>
            </td>
            <td className="px-8 py-6">
                <div className="flex flex-col gap-1">
                    <p className="font-bold text-gray-900 tabular-nums">{product.quantity}</p>
                    <div className="w-20 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full ${product.quantity > 10 ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min((product.quantity / 50) * 100, 100)}%` }}
                        />
                    </div>
                </div>
            </td>
            <td className="px-8 py-6">
                {product.quantity > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-50 px-3 py-1 rounded-full">
                        <Check size={12} /> Active
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 px-3 py-1 rounded-full">
                        <X size={12} /> Sold Out
                    </span>
                )}
            </td>
            <td className="px-8 py-6 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={onEdit}
                        className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-[#205457] hover:bg-[#205457] hover:text-white transition-all"
                        title="Edit Product"
                    >
                        <Edit3 size={18} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                        title="Delete Product"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default Products;
