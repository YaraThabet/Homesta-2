import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Search, Plus, Filter, MoreVertical, Edit2, Trash2, Eye, Star, DollarSign, Tag, Image as ImageIcon } from 'lucide-react';
import api from '../../lib/axios';

// Separate component for each product card to handle individual image fetching
const ProductCard = ({ product, handleDelete }) => {
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
                // Silent fail for images, show placeholder
            } finally {
                setLoadingImage(false);
            }
        };

        fetchImages();
    }, [product]);

    // Helper to format image URL
    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        // Use http based on previous fixes
        return `http://homefinish.runasp.net${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const displayImage = images.length > 0 ? images[0] : null;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white p-5 rounded-[30px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group hover:-translate-y-1 duration-300"
        >
            <div className="relative h-56 bg-gray-100 rounded-[22px] mb-4 overflow-hidden">
                {displayImage ? (
                    <img
                        src={getImageUrl(displayImage)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        {loadingImage ? <div className="animate-pulse w-full h-full bg-gray-200" /> : <Package size={40} />}
                    </div>
                )}

                {/* Fallback for onError */}
                <div className="hidden absolute inset-0 w-full h-full items-center justify-center bg-gray-100 text-gray-300">
                    <Package size={40} />
                </div>

                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#205457] shadow-sm">
                    {product.category || 'Uncategorized'}
                </div>

                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                    <button className="p-2 bg-white/90 backdrop-blur-md rounded-full text-[#205457] hover:bg-[#205457] hover:text-white transition-colors shadow-sm">
                        <Edit2 size={14} />
                    </button>
                    <button
                        onClick={() => handleDelete(product.productId || product.id)}
                        className="p-2 bg-white/90 backdrop-blur-md rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>

                {/* Image Counter Badge if multiple images */}
                {images.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                        <ImageIcon size={10} />
                        {images.length}
                    </div>
                )}
            </div>

            <div className="mb-3">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 line-clamp-1 text-lg group-hover:text-[#205457] transition-colors" title={product.name}>
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-lg border border-yellow-100">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-bold text-yellow-700">{product.rating || 0}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                    <span>{product.brand || 'Generic'}</span>
                    <span>•</span>
                    <span>{product.stock || product.quantity || 0} in stock</span>
                </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <div className="flex items-center gap-1.5">
                    <DollarSign size={16} className="text-[#205457]" />
                    <span className="text-xl font-black text-gray-900">{product.price}</span>
                </div>
                <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold hover:bg-[#205457] hover:text-white transition-all">
                    View Details
                </button>
            </div>
        </motion.div>
    );
};

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        // Fetch ALL products. 
        try {
            const res = await api.get('/Product/GetAllProducts');
            setProducts(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to fetch products", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/Product/${id}`);
            // Remove from local state
            setProducts(products.filter(p => (p.productId || p.id) !== id));
        } catch (err) {
            alert("Failed to delete product");
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

    return (
        <div className="min-h-screen bg-[#FDFCFB] pt-[100px] px-4 md:px-8 pb-12 font-outfit">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                            Global <span className="text-[#205457]">Inventory</span>
                        </h1>
                        <p className="text-gray-400 mt-2 font-medium">Manage and monitor all products across the platform</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-100 focus:ring-2 focus:ring-[#205457]/20 outline-none shadow-sm text-gray-700 font-medium placeholder-gray-300"
                        />
                    </div>
                    <div className="flex gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto max-w-full md:max-w-md">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat
                                        ? 'bg-[#205457] text-white shadow-lg shadow-[#205457]/20 dashed-border'
                                        : 'text-gray-400 hover:bg-gray-50'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-400 font-medium animate-pulse">Loading Inventory...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {filteredProducts.map(product => (
                                <ProductCard
                                    key={product.productId || product.id}
                                    product={product}
                                    handleDelete={handleDelete}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProducts;
