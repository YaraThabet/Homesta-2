import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import SafeImage from '../../components/SafeImage';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Plus, Edit2, Trash2, Search, X, ChevronRight, Image as ImageIcon } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import api from '../../lib/axios';

// --- INTERNAL COMPONENTS FOR TAP TO REVEAL ---
const SubCategoryItem = ({ sub, catId, setModal, handleDelete, getImageUrl }) => {
    const [showActions, setShowActions] = useState(false);

    return (
        <div
            className="group flex flex-col items-center bg-gray-50 rounded-xl p-2 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 transition-all cursor-pointer relative"
            onClick={() => setShowActions(!showActions)}
        >
            <div className="w-full aspect-square bg-white rounded-lg overflow-hidden mb-2 relative shadow-sm border border-gray-100">
                <SafeImage
                    src={getImageUrl(sub)}
                    alt={sub.name}
                    type="subcategory"
                    className="w-full h-full object-cover"
                />

                {/* Actions Overlay */}
                <div className={`absolute inset-0 bg-black/40 ${showActions ? 'opacity-100' : 'opacity-0'} md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 backdrop-blur-[1px] z-10`}>
                    <button
                        onClick={(e) => { e.stopPropagation(); setModal({ show: true, type: 'subcategory', mode: 'edit', data: sub, parentId: catId }); }}
                        className="w-6 h-6 bg-white rounded-full text-blue-500 hover:scale-110 flex items-center justify-center shadow-sm"
                    >
                        <Edit2 size={10} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(sub.id || sub.subCategoryId, 'subcategory', catId); }}
                        className="w-6 h-6 bg-white rounded-full text-red-500 hover:scale-110 flex items-center justify-center shadow-sm"
                    >
                        <Trash2 size={10} />
                    </button>
                </div>
            </div>
            <span className="text-[10px] font-bold text-gray-700 text-center line-clamp-1 w-full leading-tight" title={sub.name}>{sub.name}</span>
            {sub.price && <span className="text-[9px] text-[#205457] font-bold mt-0.5">${sub.price}</span>}
        </div>
    );
};

const CategoryCard = ({ cat, subCategoriesMap, setModal, handleDelete, getImageUrl }) => {
    const [showActions, setShowActions] = useState(false);
    const catId = cat.id || cat.categoryId;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full cursor-pointer"
            onClick={() => setShowActions(!showActions)}
        >
            {/* Compact Header */}
            <div className="flex items-center gap-3 mb-5 border-b border-gray-50 pb-4">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm relative">
                    <SafeImage
                        src={getImageUrl(cat)}
                        alt={cat.name}
                        type="category"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-gray-900 leading-tight truncate" title={cat.name}>{cat.name}</h2>
                    <p className="text-gray-400 text-xs mt-1">
                        {(subCategoriesMap[catId] || []).length} Subcategories
                    </p>
                </div>
                <div className={`flex gap-1 flex-shrink-0 transition-opacity duration-300 ${showActions ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
                    <button
                        onClick={(e) => { e.stopPropagation(); setModal({ show: true, type: 'category', mode: 'edit', data: cat }); }}
                        className="p-2 bg-gray-50 rounded-xl hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(catId, 'category'); }}
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
                        onClick={(e) => { e.stopPropagation(); setModal({ show: true, type: 'subcategory', mode: 'add', data: null, parentId: catId }); }}
                        className="text-[10px] font-bold text-[#205457] hover:underline flex items-center gap-1 bg-[#205457]/5 px-2 py-1 rounded-lg hover:bg-[#205457]/10 transition-colors"
                    >
                        <Plus size={10} /> Add
                    </button>
                </div>

                {(subCategoriesMap[catId] || []).length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 content-start">
                        {(subCategoriesMap[catId] || []).map(sub => (
                            <SubCategoryItem
                                key={sub.id || sub.subCategoryId}
                                sub={sub}
                                catId={catId}
                                setModal={setModal}
                                handleDelete={handleDelete}
                                getImageUrl={getImageUrl}
                            />
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
};

const AdminCategories = () => {
    const { showAlert } = useAppContext();
    const [categories, setCategories] = useState([]);
    const [subCategoriesMap, setSubCategoriesMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({ show: false, type: '', mode: 'add', data: null, parentId: null });
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, type: '', parentId: null });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await api.get('Category');
            const cats = Array.isArray(res.data) ? res.data : [];
            setCategories(cats);

            const subsPromises = cats.map(c =>
                api.get(`/SubCategory/by-category/${c.id || c.categoryId}`).catch(() => ({ data: [] }))
            );
            const subsResults = await Promise.all(subsPromises);

            const sMap = {};
            subsResults.forEach((res, i) => {
                const catId = cats[i].id || cats[i].categoryId;
                sMap[catId] = Array.isArray(res.data) ? res.data : [];
            });
            setSubCategoriesMap(sMap);
        } catch (err) {
            showAlert("Failed to load categories", "error");
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (item) => {
        if (!item) return null;
        const path = item.imagePath || item.image || item.imagePath;
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${path.startsWith('/') ? '' : '/'}${path}`;
    };

    const handleDelete = (id, type, parentId = null) => {
        setDeleteConfirm({ show: true, id, type, parentId });
    };

    const confirmDelete = async () => {
        try {
            const { id, type } = deleteConfirm;
            const endpoint = type === 'category' ? `Category/${id}` : `SubCategory/${id}`;
            await api.delete(endpoint);
            showAlert(`${type === 'category' ? 'Category' : 'Subcategory'} deleted successfully`, "success");
            fetchData();
        } catch (err) {
            showAlert("Failed to delete item", "error");
        } finally {
            setDeleteConfirm({ show: false, id: null, type: '', parentId: null });
        }
    };

    const handleModalRefresh = () => {
        fetchData();
        setModal({ ...modal, show: false });
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] pt-[120px] pb-20 px-4 md:px-8 font-outfit">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                            Shop <span className="text-[#205457]">Architecture</span>
                        </h1>
                        <p className="text-gray-400 mt-2 font-medium">
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
                        {categories.map(cat => (
                            <CategoryCard
                                key={cat.id || cat.categoryId}
                                cat={cat}
                                subCategoriesMap={subCategoriesMap}
                                setModal={setModal}
                                handleDelete={handleDelete}
                                getImageUrl={getImageUrl}
                            />
                        ))}
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
                    showAlert={showAlert}
                />
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteConfirm.show}
                onClose={() => setDeleteConfirm({ show: false, id: null, type: '', parentId: null })}
                onConfirm={confirmDelete}
                title={`Delete ${deleteConfirm.type || 'Item'}?`}
                message={`Are you sure you want to delete this ${deleteConfirm.type || 'item'}? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
};

const CategoryModal = ({ isOpen, onClose, type, mode, initialData, parentId, refresh, showAlert }) => {
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
                // Try both field names to be safe if backend expectation is ambiguous
                data.append('Image', imageFile);
                data.append('ImageFile', imageFile);
            }

            const id = initialData?.id || initialData?.subCategoryId || initialData?.categoryId;

            if (type === 'subcategory') {
                data.append('CategoryId', parentId);
                if (formData.price) data.append('Price', formData.price);
            }

            if (mode === 'edit') {
                // Many .NET APIs with [FromForm] still require the ID in the body
                if (type === 'category') data.append('CategoryId', id);
                else data.append('SubCategoryId', id);
                data.append('Id', id);
            }

            const endpoint = type === 'category' ? '/Category' : '/SubCategory';

            if (mode === 'add') {
                await api.post(endpoint, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                // Some APIs prefer query params for IDs in PUT
                await api.put(`${endpoint}/${id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            refresh();
            onClose();
        } catch (err) {
            console.error("Operation failed", err);
            const msg = err.response?.data?.message || err.response?.data?.title || "Unknown error";
            showAlert(`Failed to save: ${JSON.stringify(msg)}`, "error", "Error");
        } finally {
            setLoading(false);
        }
    };

    const currentImageUrl = initialData ? (initialData.imageLink || initialData.imageUrl || initialData.image || initialData.Image) : null;
    const getFullImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('data:') || url.startsWith('http')) return url;
        return `${url.startsWith('/') ? '' : '/'}${url}`;
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
                        <label className="text-xs font-bold uppercase text-gray-400 tracking-wider text-center block mb-2">Image</label>
                        <div className="flex items-center gap-3">
                            {mode === 'edit' && !imageFile && currentImageUrl && (
                                <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                                    <SafeImage src={getFullImageUrl(currentImageUrl)} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="flex-1">
                                <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-all overflow-hidden">
                                    <div className="flex flex-col items-center justify-center py-2 px-1">
                                        {imageFile ? (
                                            <div className="text-center">
                                                <p className="text-[10px] font-bold text-[#205457] max-w-[150px] truncate">{imageFile.name}</p>
                                                <p className="text-[8px] text-gray-400">Click to change</p>
                                            </div>
                                        ) : (
                                            <>
                                                <ImageIcon className="w-5 h-5 text-gray-400 mb-1" />
                                                <p className="text-[8px] text-gray-500 font-medium text-center">{mode === 'edit' ? 'Replace Image' : 'Click to upload'}</p>
                                            </>
                                        )}
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            </div>
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
