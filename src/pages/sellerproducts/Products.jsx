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
    List,
    Eye,
    Star,
    DollarSign,
    Image as ImageIcon
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../lib/axios';
import PageLoader from '../../components/PageLoader';
import { useAppContext } from '../../context/AppContext';
import ConfirmModal from '../../components/ConfirmModal';

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
const Products = () => {
    const navigate = useNavigate();
    const { showAlert } = useAppContext();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [deleteId, setDeleteId] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);

    // Data Maps for Filters & Display
    const [categoryMap, setCategoryMap] = useState({});
    const [subCategoryMap, setSubCategoryMap] = useState({});
    const [allSubCategories, setAllSubCategories] = useState([]); // List of objects for logic

    // Filters State
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedSubCategory, setSelectedSubCategory] = useState('All');

    const storeId = localStorage.getItem('storeId');

    useEffect(() => {
        const resolveStoreAndFetch = async () => {
            try {
                setLoading(true);
                setError(null);
                const userEmail = localStorage.getItem('userEmail');

                if (!userEmail) {
                    setError("Session expired. Please login again.");
                    navigate('/login');
                    return;
                }

                // 1. Fetch Global Data (Categories) & Stores
                const [catRes, storesRes] = await Promise.all([
                    api.get('/Category'),
                    api.get('/Store')
                ]);

                // Process Categories
                const cats = Array.isArray(catRes.data) ? catRes.data : [];
                const cMap = {};
                cats.forEach(c => cMap[c.id || c.categoryId] = c.name);
                setCategoryMap(cMap);

                // Fetch Subcategories (for all cats)
                // In production, we'd want a generic "GetAll" endpoint, but we loop here
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
                            sList.push({ ...s, categoryId: s.categoryId }); // ensure sub objects have categoryId
                        });
                    }
                });
                setSubCategoryMap(sMap);
                setAllSubCategories(sList);

                // 2. Resolve Owner Store
                const stores = Array.isArray(storesRes.data) ? storesRes.data : [storesRes.data];
                const myStore = stores.find(s => s.email?.toLowerCase() === userEmail?.toLowerCase());

                if (myStore) {
                    const sid = myStore.storeId || myStore.id;
                    localStorage.setItem('storeId', sid.toString());

                    // 3. Fetch Products
                    const productsRes = await api.get(`/Store/${sid}/products`);
                    const productsList = productsRes.data?.products || (Array.isArray(productsRes.data) ? productsRes.data : []);
                    setProducts(productsList);
                } else {
                    setError("No store found for your account. Please create a store first.");
                    navigate('/create-store');
                }
            } catch (err) {
                console.error("Failed to load inventory:", err);
                const backendMsg = err.response?.data?.message || err.response?.data || err.message;
                setError(`Failed to load inventory: ${typeof backendMsg === 'object' ? JSON.stringify(backendMsg) : backendMsg}`);
            } finally {
                setLoading(false);
            }
        };

        resolveStoreAndFetch();
    }, [navigate]);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            setIsDeleting(true);
            await api.delete(`/Product/Delete/${deleteId}`);
            setProducts(products.filter(p => (p.productId || p.id) !== deleteId));
            setDeleteId(null);
        } catch (err) {
            console.error("Delete failed:", err);
            showAlert("Failed to delete product. Please try again.", "error", "Delete Failed");
        } finally {
            setIsDeleting(false);
        }
    };

    // --- Filter Logic ---
    const categoryNames = ['All', ...new Set(Object.values(categoryMap))];
    const selectedCategoryId = Object.keys(categoryMap).find(key => categoryMap[key] === selectedCategory);

    const availableSubCategories = selectedCategory === 'All'
        ? []
        : allSubCategories
            .filter(sub => sub.categoryId == selectedCategoryId)
            .map(sub => sub.name);

    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase());

        // Category Filter
        const catName = categoryMap[product.categoryId] || 'Uncategorized';
        // Fallback: checks if product has categoryName string from backend
        const productCatName = product.categoryName || catName;
        const matchesCategory = selectedCategory === 'All' || productCatName === selectedCategory || catName === selectedCategory;

        // SubCategory Filter
        let matchesSubCategory = true;
        if (selectedCategory !== 'All' && selectedSubCategory !== 'All') {
            const subName = subCategoryMap[product.subCategoryId];
            matchesSubCategory = subName === selectedSubCategory;
        }

        return matchesSearch && matchesCategory && matchesSubCategory;
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
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
                <motion.div variants={itemVariants} className="flex flex-col gap-6 mb-10">
                    <div className="bg-white p-4 rounded-[30px] shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
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
                        </div>
                    </div>

                    {/* Filters Row */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Category List */}
                        <div className="flex gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto max-w-full md:max-w-2xl no-scrollbar">
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

                        {/* SubCategory List - Only if Category Selected */}
                        {selectedCategory !== 'All' && availableSubCategories.length > 0 && (
                            <div className="flex gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto max-w-full md:max-w-xl no-scrollbar items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 px-2 flex-shrink-0">Subcategory:</span>
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
                            {selectedCategory !== 'All'
                                ? `Try changing filters or add a new piece to ${selectedCategory}.`
                                : "Start by adding your first furniture masterpiece to your store."}
                        </p>
                        <Link to="/addproduct" className="inline-flex items-center gap-3 bg-[#205457] text-white px-10 py-5 rounded-[22px] font-bold hover:shadow-2xl hover:shadow-[#205457]/20 transition-all active:scale-95 shadow-xl">
                            <Plus size={20} />
                            <span>Create Product</span>
                        </Link>
                    </motion.div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.productId || product.id}
                                product={product}
                                categoryMap={categoryMap} // Pass map for proper name display
                                subCategoryMap={subCategoryMap}
                                onEdit={() => navigate(`/edit-product/${product.productId || product.id}`)}
                                onDelete={() => setDeleteId(product.productId || product.id)}
                                onViewDetails={setSelectedProduct}
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
                                        categoryMap={categoryMap}
                                        subCategoryMap={subCategoryMap}
                                        onEdit={() => navigate(`/edit-product/${product.productId || product.id}`)}
                                        onDelete={() => setDeleteId(product.productId || product.id)}
                                        onViewDetails={setSelectedProduct}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>

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

            {/* Standardized Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Product?"
                message="This action cannot be undone. This piece will be permanently removed from your showroom."
                confirmText={isDeleting ? "Deleting..." : "Delete Piece"}
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
};

// --- MODAL COMPONENT ---
const ProductDetailsModal = ({ product, onClose, categoryMap, subCategoryMap }) => {
    const [images, setImages] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loadingImages, setLoadingImages] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const getImageUrl = (url) => {
        if (!url || typeof url !== 'string') return null;
        if (url.startsWith('http')) return url;
        return `http://homefinish.runasp.net${url.startsWith('/') ? '' : '/'}${url}`;
    };

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const id = product.productId || product.id;
                const [imgRes, revRes] = await Promise.all([
                    api.get(`/ProductImages/product/${id}`),
                    api.get(`/Review/product/${id}`).catch(() => ({ data: [] }))
                ]);

                if (imgRes.data && Array.isArray(imgRes.data.images)) {
                    const urls = imgRes.data.images.map(img => img.imageUrl).filter(Boolean);
                    setImages(urls);
                } else if (product.imagePath || product.image) {
                    setImages([product.imagePath || product.image]);
                }

                setReviews(Array.isArray(revRes.data) ? revRes.data : []);
            } catch (err) {
                console.error("Failed to fetch details", err);
            } finally {
                setLoadingImages(false);
            }
        };
        fetchDetails();
    }, [product]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="flex justify-between items-center p-8 border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Product Analysis</h2>
                        <p className="text-gray-500 text-sm">Reviewing your showroom piece: #{product.productId || product.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-sm text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <div className="overflow-y-auto p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                        {/* Left: Images */}
                        <div className="space-y-4">
                            <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden relative shadow-inner border border-gray-100 flex items-center justify-center">
                                {images.length > 0 ? (
                                    <img
                                        src={getImageUrl(images[selectedImageIndex])}
                                        alt="Main"
                                        className="w-full h-full object-contain p-4"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <Package size={64} />
                                    </div>
                                )}
                            </div>
                            {images.length > 1 && (
                                <div className="grid grid-cols-5 gap-2">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImageIndex(idx)}
                                            className={`aspect-square bg-gray-50 rounded-xl overflow-hidden border transition-all ${selectedImageIndex === idx
                                                ? 'border-[#205457] ring-2 ring-[#205457]/20'
                                                : 'border-gray-100 hover:border-gray-300'
                                                }`}
                                        >
                                            <img src={getImageUrl(img)} className="w-full h-full object-contain p-1" alt={`Thumb ${idx}`} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Detailed Info */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-4xl font-black text-gray-900 leading-tight mb-4">{product.name}</h3>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <span className="px-4 py-1.5 bg-[#205457]/10 text-[#205457] rounded-xl text-xs font-black uppercase tracking-widest border border-[#205457]/10">
                                        {categoryMap[product.categoryId] || 'Unknown Category'}
                                    </span>
                                    {product.subCategoryId && (
                                        <span className="px-4 py-1.5 bg-gray-50 text-gray-400 rounded-xl text-xs font-bold uppercase tracking-wider border border-gray-100">
                                            {subCategoryMap[product.subCategoryId] || 'Standard Edition'}
                                        </span>
                                    )}
                                </div>
                                <div
                                    className="text-gray-500 leading-relaxed text-sm bg-gray-50/50 p-6 rounded-3xl border border-gray-100/50 font-light italic prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: (() => {
                                            let raw = product.description || "";
                                            const unescape = (str) => str
                                                .replace(/&amp;/g, '&')
                                                .replace(/&lt;/g, '<')
                                                .replace(/&gt;/g, '>')
                                                .replace(/&nbsp;/g, ' ')
                                                .replace(/&quot;/g, '"');
                                            return unescape(unescape(unescape(raw))) || "No description provided for this piece.";
                                        })()
                                    }}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-1">Market Price</span>
                                    <div className="flex items-center gap-2">
                                        <div className="text-3xl font-black text-[#205457] tabular-nums">
                                            ${product.discount > 0 ? (product.price * (1 - product.discount / 100)).toFixed(2) : product.price}
                                        </div>
                                        {product.discount > 0 && (
                                            <span className="text-sm text-gray-400 line-through font-bold">${product.price}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-1">Stock Available</span>
                                    <div className="text-3xl font-black text-gray-900 tabular-nums">{product.quantity || 0}</div>
                                </div>
                                <div className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-1">Rating</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Star size={24} className="fill-[#F59E0B] text-[#F59E0B]" />
                                        <span className="text-2xl font-black text-gray-900">{product.rating || 0}</span>
                                    </div>
                                </div>
                                <div className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-1">Active Discount</span>
                                    <div className="text-3xl font-black text-red-500 tabular-nums">{product.discount || 0}%</div>
                                </div>
                            </div>

                            {product.colors && (
                                <div>
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3 block">Color Variations</span>
                                    <div className="flex flex-wrap gap-2">
                                        {(Array.isArray(product.colors) ? product.colors : product.colors.split(',')).map((c, i) => (
                                            <span key={i} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-gray-700 uppercase tracking-widest">{getColorName(c.trim())}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom: Reviews Summary */}
                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-[#B19470]/10 flex items-center justify-center text-[#B19470]">
                                <Eye size={20} />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900">Customer Feedback ({reviews.length})</h4>
                        </div>

                        {reviews.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {reviews.map((rev, idx) => (
                                    <div key={rev.reviewId || idx} className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100/50">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="font-bold text-gray-900 text-sm">{rev.userName || 'Customer'}</span>
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} className={s <= rev.rating ? "fill-[#F59E0B] text-[#F59E0B]" : "text-gray-200"} />)}
                                            </div>
                                        </div>
                                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">"{rev.comment}"</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-gray-50/30 rounded-3xl border-2 border-dashed border-gray-100">
                                <p className="text-gray-400 font-medium italic text-sm">No customer reviews yet for this piece.</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const backendBase = 'http://homefinish.runasp.net';

const ProductCard = ({ product, onEdit, onDelete, onViewDetails, categoryMap }) => {
    const [images, setImages] = useState([]);
    const [loadingImage, setLoadingImage] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const id = product.productId || product.id;
                if (!id) return;
                const res = await api.get(`/ProductImages/product/${id}`);
                if (res.data && Array.isArray(res.data.images)) {
                    setImages(res.data.images.map(img => img.imageUrl).filter(Boolean));
                }
            } catch (err) {
                // Silent fail
            } finally {
                setLoadingImage(false);
            }
        };
        fetchImages();
    }, [product]);

    const getImageUrl = (url) => {
        if (!url || typeof url !== 'string') return null;
        if (url.startsWith('http')) return url;
        return `http://homefinish.runasp.net${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const displayImage = images.length > 0 ? images[0] : product.imagePath || product.image;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group bg-white rounded-[45px] overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.02)] border border-gray-100 hover:shadow-2xl hover:shadow-[#205457]/5 transition-all duration-700 flex flex-col h-full"
        >
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                {displayImage ? (
                    <img
                        src={getImageUrl(displayImage)}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80'; }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                        {loadingImage ? (
                            <div className="w-8 h-8 border-2 border-[#205457]/10 border-t-[#205457] rounded-full animate-spin" />
                        ) : (
                            <Package size={48} strokeWidth={1} />
                        )}
                    </div>
                )}

                <div className="absolute top-6 left-6 flex flex-col gap-2">
                    {product.quantity <= 5 && (
                        <span className={`px-4 py-2 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg ${product.quantity === 0 ? 'bg-red-500' : 'bg-amber-500'
                            }`}>
                            {product.quantity === 0 ? "Out of Stock" : `Low Stock: ${product.quantity}`}
                        </span>
                    )}
                    {product.discount > 0 && (
                        <span className="px-4 py-2 bg-[#205457] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg">
                            -{product.discount}% OFF
                        </span>
                    )}
                </div>

                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-3">
                    <button
                        onClick={() => onViewDetails(product)}
                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#205457] hover:bg-[#205457] hover:text-white transition-all transform -translate-y-4 group-hover:translate-y-0 duration-500"
                        title="View Details"
                    >
                        <Eye size={20} />
                    </button>
                    <button
                        onClick={onEdit}
                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#205457] hover:bg-[#205457] hover:text-white transition-all transform -translate-y-4 group-hover:translate-y-0 duration-500 delay-75"
                        title="Edit Product"
                    >
                        <Edit3 size={20} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-100"
                        title="Delete Product"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>

                {images.length > 1 && (
                    <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-[#205457] flex items-center gap-2 shadow-sm">
                        <ImageIcon size={12} />
                        {images.length}
                    </div>
                )}
            </div>

            <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#B19470] bg-[#B19470]/10 px-3 py-1 rounded-lg">
                                {categoryMap[product.categoryId] || product.categoryName || 'Furniture'}
                            </span>
                            <div className="flex items-center gap-1">
                                <Star size={12} className="fill-amber-400 text-amber-400" />
                                <span className="text-xs font-bold text-gray-900">{product.rating || '0.0'}</span>
                            </div>
                        </div>
                        <h4 className="font-bold text-gray-900 text-xl leading-tight truncate" title={product.name}>{product.name}</h4>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-1">Price</span>
                        <div className="flex items-center gap-2">
                            <p className="text-2xl font-black text-[#205457] tabular-nums">
                                ${product.discount > 0 ? (product.price * (1 - product.discount / 100)).toFixed(2) : product.price}
                            </p>
                            {product.discount > 0 && (
                                <span className="text-sm text-gray-400 line-through font-medium">${product.price}</span>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-1">Stock</span>
                        <p className="text-lg font-bold text-gray-900 tabular-nums">{product.quantity}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ProductRow = ({ product, onEdit, onDelete, onViewDetails, subCategoryMap }) => {
    const imageUrl = (product.imagePath || product.image)
        ? ((product.imagePath || product.image).startsWith('http') ? (product.imagePath || product.image) : `${backendBase}${product.imagePath || product.image}`)
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
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80'; }}
                        />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-base">{product.name}</p>
                        <p className="text-xs text-gray-400 font-light mt-1">{subCategoryMap[product.subCategoryId] || product.subCategoryName || 'Standard Edition'}</p>
                    </div>
                </div>
            </td>
            <td className="px-8 py-6">
                <div className="flex flex-col">
                    <p className="font-black text-gray-900 tabular-nums">
                        ${product.discount > 0 ? (product.price * (1 - product.discount / 100)).toFixed(2) : product.price}
                    </p>
                    {product.discount > 0 && (
                        <span className="text-[10px] text-gray-400 line-through font-bold">${product.price}</span>
                    )}
                </div>
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
                        onClick={() => onViewDetails(product)}
                        className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-[#205457] hover:bg-[#205457] hover:text-white transition-all"
                        title="View Details"
                    >
                        <Eye size={18} />
                    </button>
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
