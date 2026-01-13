import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Package, MapPin, ArrowLeft, Search, Star, Filter, LayoutGrid, List } from 'lucide-react';
import api from '../../lib/axios';
import PageLoader from '../../components/PageLoader';

const StoreProducts = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [store, setStore] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [activeCategory, setActiveCategory] = useState('All');
    const [categoryMap, setCategoryMap] = useState({});

    useEffect(() => {
        const fetchStoreAndProducts = async () => {
            try {
                setLoading(true);
                // 1. Fetch all stores to find this specific one (backend lacks direct GET /Store/{id})
                const storeRes = await api.get('/Store');
                const allStores = Array.isArray(storeRes.data) ? storeRes.data : [storeRes.data];
                const foundStore = allStores.find(s => (s.storeId || s.id).toString() === id);

                if (foundStore) {
                    setStore(foundStore);
                }

                // 2. Fetch Category data for names
                const catRes = await api.get('/Category');
                const cats = Array.isArray(catRes.data) ? catRes.data : [];
                const cMap = {};
                cats.forEach(c => cMap[c.id || c.categoryId] = c.name);
                setCategoryMap(cMap);

                // 3. Fetch Products for this specific store and global catalog
                const [productsRes, globalRes] = await Promise.all([
                    api.get(`/Store/${id}/products`),
                    api.get('Product/GetAllProducts')
                ]);

                const productsList = productsRes.data?.products || (Array.isArray(productsRes.data) ? productsRes.data : []);
                const globalActive = Array.isArray(globalRes.data) ? globalRes.data : [];

                // Filter out products not in global active list
                const filteredActive = productsList.filter(p =>
                    globalActive.some(active => (active.productId || active.id) == (p.productId || p.id))
                );

                setProducts(filteredActive);

            } catch (err) {
                console.error("Failed to fetch store products:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchStoreAndProducts();
    }, [id]);

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const catName = categoryMap[p.categoryId] || 'Uncategorized';
        const matchesCategory = activeCategory === 'All' || catName === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', ...new Set(products.map(p => categoryMap[p.categoryId] || 'Uncategorized'))];

    const getImageUrl = (path) => {
        if (!path) return 'https://via.placeholder.com/300?text=No+Image';
        if (path.startsWith('http')) return path;
        return `http://homefinish.runasp.net${path.startsWith('/') ? '' : '/'}${path}`;
    };

    if (loading) return <PageLoader />;

    return (
        <div className="min-h-screen bg-background pt-[120px] pb-24">
            <div className="max-w-[1400px] mx-auto px-6">
                {/* Store Header */}
                <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100 mb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#205457]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row gap-10 items-center md:items-start relative z-10">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-[#205457] rounded-[30px] flex items-center justify-center text-white shadow-2xl shadow-[#205457]/20 flex-shrink-0">
                            <Store size={48} />
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">{store?.name || 'Showroom'}</h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-500">
                                <div className="flex items-center gap-2">
                                    <MapPin size={18} className="text-[#205457]" />
                                    <span>{store?.address || 'Showroom Address'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Package size={18} className="text-[#205457]" />
                                    <span>{products.length} Products</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star size={18} className="text-yellow-400 fill-yellow-400" />
                                    <span>4.8 Store Rating</span>
                                </div>
                            </div>
                        </div>
                        <div className="md:ml-auto flex items-center gap-3">
                            <button className="px-8 py-3 bg-[#205457] text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-[#205457]/20 transition-all">
                                Follow Store
                            </button>
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 w-full md:w-auto">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeCategory === cat
                                    ? 'bg-[#205457] text-white shadow-lg shadow-[#205457]/10'
                                    : 'bg-white text-gray-400 border border-gray-100 hover:border-[#205457]/20'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search in this store..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#205457]/10 outline-none transition-all"
                            />
                        </div>
                        <div className="flex items-center bg-white p-1.5 rounded-2xl border border-gray-100">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-[#205457]' : 'text-gray-400'}`}
                            >
                                <LayoutGrid size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-gray-100 text-[#205457]' : 'text-gray-400'}`}
                            >
                                <List size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className={viewMode === 'grid'
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    : "space-y-6"
                }>
                    <AnimatePresence mode='popLayout'>
                        {filteredProducts.map((p, idx) => (
                            <motion.div
                                key={p.productId || p.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2, delay: idx * 0.05 }}
                                onClick={() => navigate(`/product/${p.productId || p.id}`)}
                                className={`group bg-white rounded-[30px] overflow-hidden border border-gray-50 hover:shadow-2xl hover:shadow-gray-200/50 transition-all cursor-pointer ${viewMode === 'list' ? 'flex flex-row items-center p-6 gap-8' : ''
                                    }`}
                            >
                                <div className={`relative overflow-hidden bg-gray-50 flex items-center justify-center ${viewMode === 'list' ? 'w-48 h-48 rounded-2xl' : 'aspect-square'
                                    }`}>
                                    <img
                                        src={getImageUrl(p.imagePath)}
                                        alt={p.name}
                                        className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {p.discount > 0 && (
                                        <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">
                                            -{p.discount}%
                                        </div>
                                    )}
                                </div>
                                <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-xs font-bold text-[#B19470] tracking-widest uppercase mb-1">
                                            {categoryMap[p.categoryId] || 'Furniture'}
                                        </p>
                                        <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                                            <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                            <span>{p.rating || '5.0'}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#205457] transition-colors line-clamp-1 mb-2">
                                        {p.name}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <p className="text-xl font-black text-[#205457]">${p.price}</p>
                                        {p.oldPrice && (
                                            <p className="text-sm text-gray-300 line-through">${p.oldPrice}</p>
                                        )}
                                    </div>
                                    {viewMode === 'list' && (
                                        <p className="text-gray-400 text-sm mt-4 line-clamp-2">{p.description}</p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredProducts.length === 0 && (
                    <div className="py-32 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                        <Package size={48} className="mx-auto text-gray-200 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-1">No products found</h3>
                        <p className="text-gray-400">Try adjusting your filters or search terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoreProducts;
