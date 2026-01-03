import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Search, Plus, Filter, MoreVertical, Edit2, Trash2, Eye, Star, DollarSign, Tag, Image as ImageIcon, X } from 'lucide-react';
import api from '../../lib/axios';

// Helper to format image URL
const getImageUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    if (url.startsWith('http')) return url;
    return `http://homefinish.runasp.net${url.startsWith('/') ? '' : '/'}${url}`;
};

// --- MODAL COMPONENT ---
const ProductDetailsModal = ({ product, onClose, categoryMap, subCategoryMap }) => {
    const [images, setImages] = useState([]);
    const [loadingImages, setLoadingImages] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const id = product.productId || product.id;
                const res = await api.get(`/ProductImages/product/${id}`);
                if (Array.isArray(res.data) && res.data.length > 0 && res.data[0].imageUrls) {
                    setImages(res.data[0].imageUrls);
                    setSelectedImageIndex(0);
                }
            } catch (err) {
                console.error("Failed to fetch modal images", err);
            } finally {
                setLoadingImages(false);
            }
        };
        fetchImages();
    }, [product]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="flex justify-between items-center p-8 border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
                        <p className="text-gray-500 text-sm">ID: #{product.productId || product.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-sm text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <div className="overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left: Images Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden relative shadow-inner border border-gray-100">
                            {images.length > 0 ? (
                                <motion.img
                                    key={selectedImageIndex} // Key change triggers animation
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    src={getImageUrl(images[selectedImageIndex])}
                                    alt="Main"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextElementSibling.style.display = 'flex';
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    {loadingImages ? <div className="animate-pulse w-full h-full bg-gray-200" /> : <Package size={64} />}
                                </div>
                            )}
                            <div className="hidden absolute inset-0 w-full h-full items-center justify-center bg-gray-100 text-gray-300">
                                <ImageIcon size={48} />
                            </div>
                        </div>
                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImageIndex(idx)}
                                        className={`aspect-square bg-gray-50 rounded-xl overflow-hidden border transition-all ${selectedImageIndex === idx
                                            ? 'border-[#205457] ring-2 ring-[#205457]/20 scale-95'
                                            : 'border-gray-100 hover:border-gray-300'
                                            }`}
                                    >
                                        <img
                                            src={getImageUrl(img)}
                                            className="w-full h-full object-cover"
                                            alt={`Thumb ${idx}`}
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Info */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-3xl font-black text-gray-900 leading-tight mb-2">{product.name}</h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 bg-[#205457]/10 text-[#205457] rounded-lg text-xs font-bold uppercase tracking-wider">
                                    {categoryMap[product.categoryId] || 'Unknown Category'}
                                </span>
                                {product.subCategoryId && (
                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                                        {subCategoryMap[product.subCategoryId] || 'Unknown Subcategory'}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-500 leading-relaxed text-sm bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                {product.description || "No description provided."}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Price</span>
                                <div className="text-2xl font-black text-[#205457] mt-1">${product.price}</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Stock</span>
                                <div className="text-2xl font-black text-gray-900 mt-1">{product.quantity || product.stock || 0}</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rating</span>
                                <div className="flex items-center gap-1 mt-1">
                                    <Star size={18} className="fill-yellow-400 text-yellow-400" />
                                    <span className="text-xl font-bold text-gray-900">{product.rating || 0}</span>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Discount</span>
                                <div className="text-2xl font-black text-gray-900 mt-1">{product.discount || 0}%</div>
                            </div>
                        </div>

                        {product.colors && (
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Colors</span>
                                <div className="flex flex-wrap gap-2">
                                    {Array.isArray(product.colors)
                                        ? product.colors.map((c, i) => (
                                            <span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 shadow-sm">{c}</span>
                                        ))
                                        : product.colors.split(',').map((c, i) => (
                                            <span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 shadow-sm">{c}</span>
                                        ))
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// --- PRODUCT CARD COMPONENT ---
const ProductCard = ({ product, handleDelete, onViewDetails, categoryMap }) => {
    const [images, setImages] = useState([]);
    const [loadingImage, setLoadingImage] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const id = product.productId || product.id;
                if (!id) return;
                const res = await api.get(`/ProductImages/product/${id}`);
                if (Array.isArray(res.data) && res.data.length > 0 && res.data[0].imageUrls) {
                    const validImages = res.data[0].imageUrls.filter(img => typeof img === 'string');
                    setImages(validImages);
                }
            } catch (err) { } finally { setLoadingImage(false); }
        };
        fetchImages();
    }, [product]);

    const displayImage = images.length > 0 ? images[0] : null;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-5 rounded-[30px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group hover:-translate-y-1 duration-300 flex flex-col h-full"
        >
            <div className="relative h-56 bg-gray-100 rounded-[22px] mb-4 overflow-hidden flex-shrink-0">
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
                <div className="hidden absolute inset-0 w-full h-full items-center justify-center bg-gray-100 text-gray-300">
                    <Package size={40} />
                </div>
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#205457] shadow-sm">
                    {categoryMap[product.categoryId] || 'Uncategorized'}
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
                {images.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                        <ImageIcon size={10} />
                        {images.length}
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 line-clamp-1 text-lg group-hover:text-[#205457] transition-colors" title={product.name}>
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-lg border border-yellow-100 flex-shrink-0">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-bold text-yellow-700">{product.rating || 0}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-auto">
                    <span>{product.quantity || 0} in stock</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-3">
                    <div className="flex items-center gap-1.5">
                        <DollarSign size={16} className="text-[#205457]" />
                        <span className="text-xl font-black text-gray-900">{product.price}</span>
                    </div>
                    <button
                        onClick={() => onViewDetails(product)}
                        className="px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold hover:bg-[#205457] hover:text-white transition-all hover:shadow-lg hover:shadow-[#205457]/20"
                    >
                        View Details
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// --- MAIN PAGE COMPONENT ---
const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categoryMap, setCategoryMap] = useState({});
    const [subCategoryMap, setSubCategoryMap] = useState({}); // ID -> Name
    const [allSubCategories, setAllSubCategories] = useState([]); // List of objects
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Filters
    const [selectedCategory, setSelectedCategory] = useState('All'); // Stores Name
    const [selectedSubCategory, setSelectedSubCategory] = useState('All'); // Stores Name

    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const [prodRes, catRes] = await Promise.all([
                    api.get('/Product/GetAllProducts'),
                    api.get('/Category')
                ]);

                setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);

                const cats = Array.isArray(catRes.data) ? catRes.data : [];
                const cMap = {};
                cats.forEach(c => cMap[c.id || c.categoryId] = c.name);
                setCategoryMap(cMap);

                const subsPromises = cats.map(c =>
                    api.get(`/SubCategory/by-category/${c.id || c.categoryId}`).catch(e => ({ data: [] }))
                );
                const subsResults = await Promise.all(subsPromises);

                const sMap = {};
                const sList = [];

                subsResults.forEach(res => {
                    if (Array.isArray(res.data)) {
                        res.data.forEach(s => {
                            sMap[s.id || s.subCategoryId] = s.name;
                            sList.push(s);
                        });
                    }
                });
                setSubCategoryMap(sMap);
                setAllSubCategories(sList);

            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/Product/${id}`);
            setProducts(products.filter(p => (p.productId || p.id) !== id));
        } catch (err) {
            alert("Failed to delete product");
        }
    };

    // --- DERIVED STATE FOR FILTERS ---
    const categoryNames = ['All', ...new Set(Object.values(categoryMap))];

    // Determine ID of currently selected category name
    const selectedCategoryId = Object.keys(categoryMap).find(key => categoryMap[key] === selectedCategory);

    // Get valid subcategories for this category
    const availableSubCategories = selectedCategory === 'All'
        ? []
        : allSubCategories
            .filter(sub => sub.categoryId == selectedCategoryId) // Use == just in case of string/number mismatch
            .map(sub => sub.name);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase());

        // Category Filter
        const catName = categoryMap[product.categoryId] || 'Uncategorized';
        const matchesCategory = selectedCategory === 'All' || catName === selectedCategory;

        // SubCategory Filter
        let matchesSubCategory = true;
        if (selectedCategory !== 'All' && selectedSubCategory !== 'All') {
            const subName = subCategoryMap[product.subCategoryId];
            matchesSubCategory = subName === selectedSubCategory;
        }

        return matchesSearch && matchesCategory && matchesSubCategory;
    });

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
                    {/* Category List */}
                    <div className="flex gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto max-w-full md:max-w-md no-scrollbar">
                        {categoryNames.map(cat => (
                            <button
                                key={cat}
                                onClick={() => { setSelectedCategory(cat); setSelectedSubCategory('All'); }}
                                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${selectedCategory === cat
                                    ? 'bg-[#205457] text-white shadow-lg shadow-[#205457]/20 dashed-border'
                                    : 'text-gray-400 hover:bg-gray-50'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* SubCategory List (Visible only if Category is selected) */}
                {selectedCategory !== 'All' && availableSubCategories.length > 0 && (
                    <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 mr-2 flex-shrink-0">Subcategory:</span>
                        <button
                            onClick={() => setSelectedSubCategory('All')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${selectedSubCategory === 'All'
                                ? 'bg-[#205457]/10 text-[#205457] border-[#205457]/20'
                                : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            All
                        </button>
                        {availableSubCategories.map(sub => (
                            <button
                                key={sub}
                                onClick={() => setSelectedSubCategory(sub)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${selectedSubCategory === sub
                                    ? 'bg-[#205457]/10 text-[#205457] border-[#205457]/20'
                                    : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-20 text-gray-400 font-medium animate-pulse">Loading Inventory...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {filteredProducts.map(product => (
                                <ProductCard
                                    key={product.productId || product.id}
                                    product={product}
                                    categoryMap={categoryMap}
                                    handleDelete={handleDelete}
                                    onViewDetails={setSelectedProduct}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* PRODUCT DETAILS MODAL */}
            <AnimatePresence>
                {selectedProduct && (
                    <ProductDetailsModal
                        product={selectedProduct}
                        categoryMap={categoryMap}
                        subCategoryMap={subCategoryMap}
                        onClose={() => setSelectedProduct(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminProducts;
