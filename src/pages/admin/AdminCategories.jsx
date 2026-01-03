import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Plus, Edit2, Trash2, Search, X, ChevronRight, Image as ImageIcon } from 'lucide-react';
import api from '../../lib/axios';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [subCategoriesMap, setSubCategoriesMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({ show: false, type: '', mode: 'add', data: null, parentId: null });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const catRes = await api.get('/Category');
            const cats = Array.isArray(catRes.data) ? catRes.data : [catRes.data];
            setCategories(cats);

            // Fetch subcategories for all categories in parallel
            const subCatPromises = cats.map(cat => {
                const catId = cat.id || cat.categoryId;
                if (!catId) return { id: null, data: [] };

                return api.get(`/SubCategory/by-category/${catId}`)
                    .then(res => ({ id: catId, data: Array.isArray(res.data) ? res.data : [] }))
                    .catch(err => {
                        console.error(`Failed subcat for ${catId}`, err);
                        return { id: catId, data: [] };
                    });
            });

            const subCatResults = await Promise.all(subCatPromises);
            const newSubMap = {};
            subCatResults.forEach(result => {
                if (result.id) newSubMap[result.id] = result.data;
            });
            setSubCategoriesMap(newSubMap);

        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (item) => {
        if (!item) return null;
        // Check various possible property names
        const url = item.imageLink || item.imageUrl || item.image || item.url || item.Image;
        if (!url) return null;

        // Return as is if data URI or absolute URL
        if (url.startsWith('data:') || url.startsWith('http')) return url;

        // Use HTTP to avoid SSL mismatch with unconfigured backend or proxy issues
        return `http://homefinish.runasp.net${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const handleDelete = async (id, type, parentId = null) => {
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
        try {
            const endpoint = type === 'category' ? '/Category' : '/SubCategory';
            await api.delete(`${endpoint}/${id}`);
            fetchData();
        } catch (err) {
            alert("Failed to delete. It might be in use.");
        }
    };

    const handleModalRefresh = () => {
        fetchData();
        setModal({ ...modal, show: false });
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] pt-[100px] px-4 md:px-8 pb-12 font-outfit">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Category <span className="text-[#205457]">Management</span>
                        </h1>
                        <p className="text-gray-400 mt-1">
                            {categories.length} Categories & {Object.values(subCategoriesMap).reduce((a, b) => a + b.length, 0)} Subcategories
                        </p>
                    </div>
                    <button
                        onClick={() => setModal({ show: true, type: 'category', mode: 'add', data: null })}
                        className="px-5 py-2.5 bg-[#205457] text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg hover:shadow-xl hover:shadow-[#205457]/20 transition-all active:scale-95"
                    >
                        <Plus size={18} />
                        Add Category
                    </button>
                </div>

                {loading ? <div className="text-center py-20 text-gray-400 font-medium">Loading Categories...</div> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {categories.map(cat => {
                            const catId = cat.id || cat.categoryId;
                            return (
                                <motion.div
                                    key={catId}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full"
                                >
                                    {/* Compact Header */}
                                    <div className="flex items-center gap-3 mb-5 border-b border-gray-50 pb-4">
                                        <div className="w-14 h-14 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm relative">
                                            {getImageUrl(cat) ? (
                                                <img
                                                    src={getImageUrl(cat)}
                                                    alt={cat.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        // Fallback to placeholder if image fails
                                                        e.target.style.display = 'none';
                                                        e.target.nextElementSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            {/* Fallback Icon (initially hidden if image exists, shown on error) */}
                                            <div className={`w-full h-full flex items-center justify-center bg-gray-50 absolute top-0 left-0 ${getImageUrl(cat) ? 'hidden' : 'flex'}`}>
                                                <Layers size={24} className="text-gray-300" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-lg font-bold text-gray-900 leading-tight truncate" title={cat.name}>{cat.name}</h2>
                                            <p className="text-gray-400 text-xs mt-1">
                                                {(subCategoriesMap[catId] || []).length} Subcategories
                                            </p>
                                        </div>
                                        <div className="flex gap-1 flex-shrink-0">
                                            <button
                                                onClick={() => setModal({ show: true, type: 'category', mode: 'edit', data: cat })}
                                                className="p-2 bg-gray-50 rounded-xl hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(catId, 'category')}
                                                className="p-2 bg-gray-50 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Compact Subcategories Grid */}
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex items-center justify-between mb-3 px-1">
                                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Subcategories</h3>
                                            <button
                                                onClick={() => setModal({ show: true, type: 'subcategory', mode: 'add', data: null, parentId: catId })}
                                                className="text-[10px] font-bold text-[#205457] hover:underline flex items-center gap-1 bg-[#205457]/5 px-2 py-1 rounded-lg hover:bg-[#205457]/10 transition-colors"
                                            >
                                                <Plus size={10} /> Add
                                            </button>
                                        </div>

                                        {(subCategoriesMap[catId] || []).length > 0 ? (
                                            <div className="grid grid-cols-3 gap-2 content-start">
                                                {(subCategoriesMap[catId] || []).map(sub => (
                                                    <div key={sub.id || sub.subCategoryId} className="group flex flex-col items-center bg-gray-50 rounded-xl p-2 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 transition-all cursor-pointer relative">
                                                        <div className="w-full aspect-square bg-white rounded-lg overflow-hidden mb-2 relative shadow-sm border border-gray-100">
                                                            {getImageUrl(sub) ? (
                                                                <img
                                                                    src={getImageUrl(sub)}
                                                                    alt={sub.name}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                        e.target.nextElementSibling.style.display = 'flex';
                                                                    }}
                                                                />
                                                            ) : null}
                                                            <div className={`w-full h-full flex items-center justify-center bg-gray-100 absolute top-0 left-0 ${getImageUrl(sub) ? 'hidden' : 'flex'}`}>
                                                                <ImageIcon size={14} className="text-gray-300" />
                                                            </div>

                                                            {/* Hover Actions */}
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 backdrop-blur-[1px] z-10">
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); setModal({ show: true, type: 'subcategory', mode: 'edit', data: sub, parentId: catId }) }}
                                                                    className="w-6 h-6 bg-white rounded-full text-blue-500 hover:scale-110 flex items-center justify-center shadow-sm"
                                                                >
                                                                    <Edit2 size={10} />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleDelete(sub.id || sub.subCategoryId, 'subcategory', catId) }}
                                                                    className="w-6 h-6 bg-white rounded-full text-red-500 hover:scale-110 flex items-center justify-center shadow-sm"
                                                                >
                                                                    <Trash2 size={10} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-gray-700 text-center line-clamp-1 w-full leading-tight" title={sub.name}>{sub.name}</span>
                                                        {sub.price && <span className="text-[9px] text-[#205457] font-bold mt-0.5">${sub.price}</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex-1 flex items-center justify-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-100 text-gray-400 text-xs py-8">
                                                No subcategories
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal */}
            {modal.show && (
                <CategoryModal
                    isOpen={modal.show}
                    onClose={() => setModal({ ...modal, show: false })}
                    type={modal.type}
                    mode={modal.mode}
                    initialData={modal.data}
                    parentId={modal.parentId}
                    refresh={handleModalRefresh}
                />
            )}
        </div>
    );
};

const CategoryModal = ({ isOpen, onClose, type, mode, initialData, parentId, refresh }) => {
    const [formData, setFormData] = useState({ name: '', price: '' });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                price: initialData.price || ''
            });
        } else {
            setFormData({ name: '', price: '' });
        }
        setImageFile(null);
    }, [initialData, isOpen]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append('Name', formData.name);

            if (imageFile) {
                data.append('Image', imageFile);
            }

            if (type === 'subcategory') {
                data.append('CategoryId', parentId);
                if (formData.price) data.append('Price', formData.price);
            }

            const endpoint = type === 'category' ? '/Category' : '/SubCategory';

            if (mode === 'add') {
                await api.post(endpoint, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                const id = initialData.id || initialData.subCategoryId || initialData.categoryId;
                await api.put(`${endpoint}/${id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            refresh();
            onClose();
        } catch (err) {
            console.error("Operation failed", err);
            const msg = err.response?.data?.message || err.response?.data?.title || "Unknown error";
            alert(`Failed to save: ${JSON.stringify(msg)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 capitalize">{mode} {type}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-2 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-[#205457]/20 outline-none font-bold mt-1 text-sm"
                        />
                    </div>

                    {type === 'subcategory' && (
                        <div>
                            <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Base Price</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full p-2 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-[#205457]/20 outline-none font-bold mt-1 text-sm"
                                placeholder="0.00"
                            />
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-bold uppercase text-gray-400 tracking-wider text-center block mb-2">Upload Image</label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                                <div className="flex flex-col items-center justify-center pt-2 pb-3">
                                    {imageFile ? (
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-[#205457] max-w-[200px] truncate">{imageFile.name}</p>
                                            <p className="text-[10px] text-gray-400">Click to change</p>
                                        </div>
                                    ) : (
                                        <>
                                            <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                                            <p className="text-[10px] text-gray-500 font-medium">Click to upload</p>
                                        </>
                                    )}
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[#205457] text-white rounded-xl font-bold mt-2 hover:shadow-lg hover:shadow-[#205457]/20 transition-all active:scale-95 disabled:opacity-50 text-sm"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminCategories;
