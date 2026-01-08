import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PlusCircle,
    Upload,
    ArrowLeft,
    Info,
    Image as ImageIcon,
    Tag,
    Type,
    DollarSign,
    Palette,
    Check,
    X,
    ChevronDown,
    Save,
    Star,
    Bold,
    Italic,
    List
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../lib/axios';
import SafeImage from '../../components/SafeImage';

const EditProduct = () => {
    const { showAlert } = useAppContext();
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [subCategoryId, setSubCategoryId] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [discount, setDiscount] = useState('0');
    const [deliveryTime, setDeliveryTime] = useState('0');
    const [rating, setRating] = useState('0');
    const [currentColor, setCurrentColor] = useState('');
    const [colors, setColors] = useState([]);
    const [serverImages, setServerImages] = useState([]); // [{productImageId, imageUrl}]
    const [newFiles, setNewFiles] = useState([]);
    const [newPreviews, setNewPreviews] = useState([]);

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [storeId, setStoreId] = useState(null);
    const [errors, setErrors] = useState({});
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const descriptionRef = useRef(null);
    const [activeFormats, setActiveFormats] = useState({ bold: false, italic: false, list: false });

    const checkFormats = () => {
        setActiveFormats({
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            list: document.queryCommandState('insertUnorderedList')
        });
    };

    const formatText = (command) => {
        const cmd = command === 'list' ? 'insertUnorderedList' : command;
        document.execCommand(cmd, false, null);
        if (descriptionRef.current) {
            setDescription(descriptionRef.current.innerHTML);
            descriptionRef.current.focus();
            checkFormats();
        }
    };

    // Sync state to DOM
    useEffect(() => {
        if (descriptionRef.current && document.activeElement !== descriptionRef.current && descriptionRef.current.innerHTML !== description) {
            descriptionRef.current.innerHTML = description;
        }
    }, [description]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const userEmail = localStorage.getItem('userEmail');

                const [catRes, storeRes, prodRes, imgRes, revRes] = await Promise.all([
                    api.get('/Category'),
                    api.get('/Store'),
                    api.get(`/Product/GetProductById/${id}`),
                    api.get(`/ProductImages/product/${id}`).catch(() => ({ data: { images: [] } })),
                    api.get(`/Review/product/${id}`).catch(() => ({ data: [] }))
                ]);

                setCategories(catRes.data);
                setReviews(Array.isArray(revRes.data) ? revRes.data : []);

                const stores = Array.isArray(storeRes.data) ? storeRes.data : [storeRes.data];
                const myStore = stores.find(s => s.email?.toLowerCase() === userEmail?.toLowerCase());

                if (myStore) {
                    const sid = myStore.storeId || myStore.id;
                    setStoreId(sid);
                    localStorage.setItem('storeId', sid.toString());
                }

                // Populate form with product data
                const product = prodRes.data;
                setName(product.name || '');
                setCategory(product.categoryId?.toString() || '');
                setSubCategoryId(product.subCategoryId?.toString() || '');
                setDescription(product.description || '');
                setPrice(product.price?.toString() || '');
                setStock(product.quantity?.toString() || '');
                setDiscount(product.discount?.toString() || '0');
                setDeliveryTime(product.deliveryTime?.toString() || '0');
                setRating(product.rating?.toString() || '0');
                setColors(product.colors || []);

                // Handle images from the dedicated endpoint
                // Can be { images: [...] } or just [...]
                const fetchedImages = Array.isArray(imgRes.data)
                    ? imgRes.data
                    : (imgRes.data?.images || []);

                if (fetchedImages.length > 0) {
                    setServerImages(fetchedImages);
                } else {
                    // Fallback to the main product image (check both fields)
                    const mainImg = product.imagePath || product.image;
                    if (mainImg) {
                        setServerImages([{ productImageId: 0, imageUrl: mainImg }]);
                    } else {
                        setServerImages([]);
                    }
                }

                if (product.categoryId) {
                    const subRes = await api.get(`/SubCategory/by-category/${product.categoryId}`);
                    setSubCategories(subRes.data);
                }

            } catch (err) {
                console.error("Failed to fetch product data", err);
                showAlert("Could not load product details.", "error", "Load Error");
                navigate('/seller-products');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    // Fetch SubCategories when category changes
    useEffect(() => {
        if (!category) {
            setSubCategories([]);
            return;
        }

        const fetchSubCategories = async () => {
            try {
                const res = await api.get(`/SubCategory/by-category/${category}`);
                setSubCategories(res.data);
            } catch (err) {
                console.error("Failed to fetch subcategories", err);
            }
        };

        fetchSubCategories();
    }, [category]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + serverImages.length + newFiles.length > 5) {
            showAlert("Maximum 5 images allowed", "warning", "Image Limit");
            return;
        }

        const updatedFiles = [...newFiles, ...files];
        setNewFiles(updatedFiles);

        const updatedPreviews = [...newPreviews, ...files.map(file => URL.createObjectURL(file))];
        setNewPreviews(updatedPreviews);
    };

    const removeNewImage = (index) => {
        const updatedFiles = newFiles.filter((_, i) => i !== index);
        const updatedPreviews = newPreviews.filter((_, i) => i !== index);
        setNewFiles(updatedFiles);
        setNewPreviews(updatedPreviews);
    };

    const handleDeleteServerImage = async (imgId) => {
        if (imgId === 0) {
            setServerImages([]);
            return;
        }
        try {
            await api.delete(`/ProductImages/${imgId}`);
            setServerImages(prev => prev.filter(img => img.productImageId !== imgId));
            showAlert("Image removed from server", "success", "Deleted");
        } catch (err) {
            showAlert("Failed to delete image", "error", "Error");
        }
    };

    const handleUpdateServerImage = async (imgId, file) => {
        const formData = new FormData();
        formData.append('ProductImageId', parseInt(imgId));
        formData.append('Image', file);

        try {
            await api.put('/ProductImages/update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Refresh images
            const imgRes = await api.get(`/ProductImages/product/${id}`);
            const updatedImages = Array.isArray(imgRes.data)
                ? imgRes.data
                : (imgRes.data?.images || []);
            setServerImages(updatedImages);
            showAlert("Image updated on server", "success", "Updated");
        } catch (err) {
            showAlert("Failed to update image", "error", "Update Error");
        }
    };

    const addColor = (e) => {
        if (e.key === 'Enter' && currentColor.trim()) {
            e.preventDefault();
            if (!colors.includes(currentColor.trim())) {
                setColors([...colors, currentColor.trim()]);
            }
            setCurrentColor('');
        }
    };

    const removeColor = (colorToRemove) => {
        setColors(colors.filter(c => c !== colorToRemove));
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (parseFloat(price) <= 0) newErrors.price = "Price must be greater than zero";
        if (parseInt(stock) < 0) newErrors.stock = "Quantity cannot be negative";
        if (parseFloat(rating) < 0 || parseFloat(rating) > 5) newErrors.rating = "Rating must be between 0 and 5";
        if (!category) newErrors.category = "Category is required";
        if (!subCategoryId) newErrors.subCategoryId = "Subcategory is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setErrors({});
        setIsSaving(true);

        try {
            // Update Product Metadata (matching exact backend schema)
            const payload = {
                name: name,
                description: description,
                colors: colors,
                price: parseFloat(price),
                rating: Math.round(parseFloat(rating)) || 0,
                quantity: parseInt(stock),
                discount: parseFloat(discount) || 0,
                deliveryTime: parseInt(deliveryTime) || 0,
                subCategoryId: parseInt(subCategoryId),
                categoryId: parseInt(category),
                storeId: parseInt(storeId)
            };

            console.log("🚀 Updating Product Metadata...", payload);
            await api.put(`/Product/Update/${id}`, payload);

            // Handle image uploads if any new files
            if (newFiles.length > 0) {
                console.log(`📤 Uploading ${newFiles.length} new images...`);
                const formData = new FormData();
                formData.append('ProductId', parseInt(id));
                newFiles.forEach(file => {
                    formData.append('Images', file);
                });
                await api.post('/ProductImages/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            console.log("✅ Product Updated Successfully");
            showAlert('Product updated successfully!', 'success', 'Success');
            setShowSuccessPopup(true);
        } catch (err) {
            console.error("❌ Update Failed:", err);
            const errorData = err.response?.data;
            let errorMsg = "Failed to update product.";
            if (typeof errorData === 'string') {
                errorMsg = errorData;
            } else if (errorData?.message) {
                errorMsg = errorData.message;
            } else if (errorData?.errors) {
                errorMsg = Object.values(errorData.errors).flat().join(", ");
            }
            showAlert(`Backend Error: ${errorMsg}`, "error", "Error");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#205457]/10 border-t-[#205457] rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 font-medium">Loading product data...</p>
                </div>
            </div>
        );
    }

    const fadeInUp = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] pt-[90px] lg:pt-[110px] px-6 lg:px-12 pb-24 font-outfit">
            <motion.div
                className="max-w-[1600px] mx-auto"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
                {/* Header */}
                <motion.div variants={fadeInUp} className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                    <div>
                        <button
                            onClick={() => navigate('/seller-products')}
                            className="flex items-center gap-2 text-gray-400 hover:text-[#205457] transition-colors mb-4 group text-sm font-medium"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Inventory
                        </button>
                        <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
                            Edit <span className="text-[#205457]">Product</span>
                        </h1>
                        <p className="text-gray-400 mt-2 font-light">Update your furniture piece details to keep your store fresh.</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-2 rounded-3xl border border-gray-100 shadow-sm">
                        <button
                            type="button"
                            onClick={() => navigate('/seller-products')}
                            className="px-8 py-4 rounded-2xl font-bold text-gray-400 hover:text-gray-900 transition-all text-xs uppercase tracking-[0.2em]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="edit-product-form"
                            disabled={isSaving}
                            className="bg-[#205457] text-white px-10 py-5 rounded-[22px] font-bold flex items-center justify-center gap-4 hover:shadow-2xl hover:shadow-[#205457]/30 transition-all active:scale-95 disabled:opacity-50 text-sm shadow-xl"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                            {!isSaving && <Save size={18} />}
                        </button>
                    </div>
                </motion.div>

                <form id="edit-product-form" onSubmit={handleSave}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-8 space-y-10">
                            {/* Images */}
                            <motion.div variants={fadeInUp} className="bg-white p-6 md:p-10 rounded-[30px] lg:rounded-[50px] shadow-[0_20px_60px_rgba(0,0,0,0.02)] border border-gray-100">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-14 h-14 rounded-2xl bg-[#89917D]/10 text-[#89917D] flex items-center justify-center">
                                        <ImageIcon size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold text-gray-900">Product Images</h3>
                                        <p className="text-gray-400">Update your product visuals</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                    <AnimatePresence>
                                        {/* Server Images */}
                                        {serverImages.map((img, index) => (
                                            <motion.div
                                                key={`existing-${img.productImageId || index}-${img.imageUrl}`}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="relative aspect-square rounded-[30px] overflow-hidden shadow-xl border-4 border-white group"
                                            >
                                                <SafeImage src={img.imageUrl} className="w-full h-full object-cover" alt="Product" />
                                                <div className="absolute top-4 left-4">
                                                    <span className="bg-[#205457] text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest shadow-lg">Live</span>
                                                </div>
                                                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                                                    <label className="w-full py-2 bg-white/20 backdrop-blur-md text-white rounded-xl text-[9px] font-black tracking-widest uppercase border border-white/30 text-center cursor-pointer hover:bg-white/40 transition-all">
                                                        Change
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                                            if (e.target.files[0]) handleUpdateServerImage(img.productImageId, e.target.files[0]);
                                                        }} />
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteServerImage(img.productImageId)}
                                                        className="w-full py-2 bg-red-500/80 backdrop-blur-md text-white rounded-xl text-[9px] font-black tracking-widest uppercase border border-transparent hover:bg-red-600 transition-all"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}

                                        {/* Newly Added Local Previews */}
                                        {newPreviews.map((preview, index) => (
                                            <motion.div
                                                key={`new-${index}`}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="relative aspect-square rounded-[30px] overflow-hidden shadow-xl border-4 border-dashed border-[#205457]/20 group"
                                            >
                                                <img src={preview} className="w-full h-full object-cover" alt="New Preview" />
                                                <div className="absolute top-4 left-4">
                                                    <span className="bg-amber-500 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest shadow-lg">Pending</span>
                                                </div>
                                                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeNewImage(index)}
                                                        className="w-full py-2 bg-white/20 backdrop-blur-md text-white rounded-xl text-[9px] font-black tracking-widest uppercase border border-white/30 hover:bg-red-500 transition-all"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    {(serverImages.length + newFiles.length) < 5 && (
                                        <label className="aspect-square rounded-[30px] border-3 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:border-[#205457]/30 hover:bg-[#205457]/5 transition-all group">
                                            <input type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*" />
                                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-white transition-all shadow-sm">
                                                <Upload size={24} className="text-[#205457]" />
                                            </div>
                                            <span className="text-[9px] font-black text-gray-300 mt-4 tracking-[0.2em] uppercase">Add Media</span>
                                        </label>
                                    )}
                                </div>
                            </motion.div>

                            {/* Details */}
                            <motion.div variants={fadeInUp} className="bg-white p-6 md:p-10 rounded-[30px] lg:rounded-[50px] shadow-[0_20px_60px_rgba(0,0,0,0.02)] border border-gray-100">
                                <div className="flex items-center gap-4 mb-12">
                                    <div className="w-14 h-14 rounded-2xl bg-[#B19470]/10 flex items-center justify-center text-[#B19470]">
                                        <Type size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold text-gray-900">Product Info</h3>
                                        <p className="text-gray-400">Content and description</p>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <label className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-500 ml-2">Product Name</label>
                                        <input
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full rounded-[25px] px-8 py-6 bg-gray-50/80 border-2 border-transparent focus:border-[#205457]/20 focus:bg-white outline-none transition-all text-2xl font-bold text-gray-900"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center ml-2">
                                            <label className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-500">Description</label>
                                            <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mr-2">
                                                <button
                                                    type="button"
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onClick={() => formatText('bold')}
                                                    className={`p-1.5 rounded-md transition-all ${activeFormats.bold ? 'bg-white text-[#205457] shadow-sm ring-1 ring-[#205457]/10' : 'text-gray-500 hover:bg-white hover:shadow-sm'}`}
                                                    title="Bold"
                                                >
                                                    <Bold size={14} strokeWidth={activeFormats.bold ? 2.5 : 2} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onClick={() => formatText('italic')}
                                                    className={`p-1.5 rounded-md transition-all ${activeFormats.italic ? 'bg-white text-[#205457] shadow-sm ring-1 ring-[#205457]/10' : 'text-gray-500 hover:bg-white hover:shadow-sm'}`}
                                                    title="Italic"
                                                >
                                                    <Italic size={14} strokeWidth={activeFormats.italic ? 2.5 : 2} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onClick={() => formatText('list')}
                                                    className={`p-1.5 rounded-md transition-all ${activeFormats.list ? 'bg-white text-[#205457] shadow-sm ring-1 ring-[#205457]/10' : 'text-gray-500 hover:bg-white hover:shadow-sm'}`}
                                                    title="Bullet List"
                                                >
                                                    <List size={14} strokeWidth={activeFormats.list ? 2.5 : 2} />
                                                </button>
                                            </div>
                                        </div>
                                        <div
                                            ref={descriptionRef}
                                            contentEditable
                                            onInput={(e) => setDescription(e.currentTarget.innerHTML)}
                                            onKeyUp={checkFormats}
                                            onMouseUp={checkFormats}
                                            className="w-full rounded-[30px] px-8 py-8 bg-gray-50/80 border-2 border-transparent focus:border-[#205457]/20 focus:bg-white outline-none transition-all leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                                            style={{ minHeight: '200px' }}
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Product Reviews */}
                            <motion.div variants={fadeInUp} className="bg-white p-6 md:p-10 rounded-[30px] lg:rounded-[50px] shadow-[0_20px_60px_rgba(0,0,0,0.02)] border border-gray-100">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center">
                                            <Star size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-bold text-gray-900">Customer Feedback</h3>
                                            <p className="text-gray-400">What buyers are saying about this piece</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-black text-gray-900 leading-none mb-1">
                                            {reviews.length > 0
                                                ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                                                : rating}
                                        </div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-300">Avg Rating</div>
                                    </div>
                                </div>

                                {reviews.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {reviews.map((rev, idx) => (
                                            <div key={rev.reviewId || idx} className="bg-gray-50/50 p-6 rounded-[30px] border border-gray-100/50">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm mb-1">{rev.userName || 'Verified Buyer'}</p>
                                                        <div className="flex gap-0.5">
                                                            {[1, 2, 3, 4, 5].map(s => (
                                                                <Star key={s} size={10} className={s <= rev.rating ? "fill-[#F59E0B] text-[#F59E0B]" : "text-gray-200"} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                                                        {rev.reviewDate ? new Date(rev.reviewDate).toLocaleDateString() : 'Recent'}
                                                    </span>
                                                </div>
                                                <p className="text-gray-500 text-sm italic font-light leading-relaxed line-clamp-3">
                                                    "{rev.comment || 'No comment provided.'}"
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center border-2 border-dashed border-gray-50 rounded-[40px]">
                                        <p className="text-gray-400 font-medium italic">No reviews yet for this specific product.</p>
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="lg:col-span-4 space-y-10">
                            <div className="sticky top-32 space-y-10">
                                {/* Pricing */}
                                <motion.div variants={fadeInUp} className="bg-white p-6 md:p-10 rounded-[30px] lg:rounded-[45px] shadow-[0_15px_50px_rgba(0,0,0,0.02)] border border-gray-100">
                                    <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-[#B19470] mb-8 px-2 border-l-4 border-[#B19470]">Inventory & Value</h4>

                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Price</label>
                                            <div className="relative group">
                                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#B19470] font-bold text-lg pointer-events-none">$</span>
                                                <input
                                                    required
                                                    type="number"
                                                    value={price}
                                                    onChange={(e) => setPrice(e.target.value)}
                                                    className="w-full rounded-2xl pl-12 pr-6 py-4 bg-gray-50/50 border-2 border-transparent focus:border-[#205457]/10 focus:bg-white outline-none transition-all text-xl font-black tabular-nums"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Stock Level</label>
                                            <input
                                                required
                                                type="number"
                                                value={stock}
                                                onChange={(e) => setStock(e.target.value)}
                                                className="w-full rounded-2xl px-6 py-4 bg-gray-50/50 border-2 border-transparent focus:border-[#205457]/10 focus:bg-white outline-none transition-all font-bold"
                                            />
                                        </div>

                                        {/* Discount */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Discount (%)</label>
                                            <div className="relative group">
                                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[#B19470] font-bold text-lg pointer-events-none">%</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    step="0.01"
                                                    value={discount}
                                                    onChange={(e) => setDiscount(e.target.value)}
                                                    className="w-full rounded-2xl px-6 pr-12 py-4 bg-gray-50/50 border-2 border-transparent focus:border-[#205457]/10 focus:bg-white outline-none transition-all font-bold"
                                                />
                                            </div>
                                        </div>

                                        {discount > 0 && price > 0 && (
                                            <div className="p-4 bg-[#205457]/5 rounded-2xl border border-[#205457]/10">
                                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#205457]">
                                                    <span>Final Selling Price:</span>
                                                    <span className="text-xl font-black">${(price * (1 - discount / 100)).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Delivery Time */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Delivery Time (Days)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={deliveryTime}
                                                onChange={(e) => setDeliveryTime(e.target.value)}
                                                className="w-full rounded-2xl px-6 py-4 bg-gray-50/50 border-2 border-transparent focus:border-[#205457]/10 focus:bg-white outline-none transition-all font-bold"
                                            />
                                        </div>

                                        {/* Rating */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">
                                                Rating (0-5) {errors.rating && <span className="text-red-500 normal-case">• {errors.rating}</span>}
                                            </label>
                                            <div className="flex items-center gap-4 bg-gray-50/50 rounded-2xl p-4 border-2 border-transparent focus-within:border-[#205457]/10 transition-all">
                                                {/* Star Rating Visual */}
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => {
                                                        const ratingValue = parseFloat(rating) || 0;
                                                        const isFilled = star <= ratingValue;
                                                        const isPartial = star > ratingValue && star - 1 < ratingValue;
                                                        const fillPercentage = isPartial ? ((ratingValue - (star - 1)) * 100) : 0;

                                                        return (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => setRating(star.toString())}
                                                                className="transition-all hover:scale-110 active:scale-95 relative"
                                                            >
                                                                {isPartial ? (
                                                                    <div className="relative">
                                                                        {/* Background (empty) star */}
                                                                        <Star size={28} className="fill-gray-200 text-gray-300" />
                                                                        {/* Foreground (filled) star with gradient mask */}
                                                                        <div
                                                                            className="absolute inset-0 overflow-hidden"
                                                                            style={{ width: `${fillPercentage}%` }}
                                                                        >
                                                                            <Star size={28} className="fill-[#F59E0B] text-[#F59E0B]" />
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <Star
                                                                        size={28}
                                                                        className={`${isFilled
                                                                            ? 'fill-[#F59E0B] text-[#F59E0B]'
                                                                            : 'fill-gray-200 text-gray-300'
                                                                            } transition-colors`}
                                                                    />
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                {/* Numeric Input */}
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="5"
                                                    step="1"
                                                    value={rating}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value);
                                                        if (val >= 0 && val <= 5) {
                                                            setRating(e.target.value);
                                                        }
                                                    }}
                                                    placeholder="0.0"
                                                    className="w-20 text-center rounded-xl px-3 py-2 bg-white border border-gray-200 outline-none font-bold text-lg tabular-nums"
                                                />
                                                <span className="text-sm text-gray-400 font-medium">/ 5.0</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Categories */}
                                <motion.div variants={fadeInUp} className="bg-white p-6 md:p-10 rounded-[30px] lg:rounded-[45px] shadow-[0_15px_50px_rgba(0,0,0,0.02)] border border-gray-100">
                                    <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-[#205457] mb-8 px-2 border-l-4 border-[#205457]">Classification</h4>

                                    <div className="space-y-6">
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full rounded-2xl px-6 py-4 bg-gray-50/50 border-2 border-transparent outline-none font-bold appearance-none"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={subCategoryId}
                                            onChange={(e) => setSubCategoryId(e.target.value)}
                                            className="w-full rounded-2xl px-6 py-4 bg-gray-50/50 border-2 border-transparent outline-none font-bold"
                                        >
                                            <option value="">Select Subcategory</option>
                                            {subCategories.map(sub => (
                                                <option key={sub.subCategoryId} value={sub.subCategoryId}>{sub.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </motion.div>

                                {/* Colors */}
                                <motion.div variants={fadeInUp} className="bg-white p-10 rounded-[45px] shadow-[0_15px_50px_rgba(0,0,0,0.02)] border border-gray-100">
                                    <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-[#205457] mb-8 px-2 border-l-4 border-[#205457]">Variations</h4>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {colors.map(c => (
                                            <span key={c} className="px-4 py-2 bg-[#205457] text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                {c}
                                                <X size={12} className="cursor-pointer opacity-60 hover:opacity-100" onClick={() => removeColor(c)} />
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <input
                                                value={currentColor}
                                                onChange={(e) => setCurrentColor(e.target.value)}
                                                onKeyDown={addColor}
                                                placeholder="#000000"
                                                className="w-full bg-gray-50/50 rounded-2xl pl-12 pr-4 py-4 text-xs font-bold border-2 border-transparent focus:border-[#205457]/10 outline-none"
                                            />
                                            <input
                                                type="color"
                                                value={currentColor.startsWith('#') && currentColor.length === 7 ? currentColor : '#000000'}
                                                onChange={(e) => setCurrentColor(e.target.value)}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0 overflow-hidden"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                const event = { key: 'Enter', preventDefault: () => { } };
                                                addColor(event);
                                            }}
                                            className="bg-[#205457] text-white p-3 rounded-2xl hover:bg-[#1a4345] transition-colors"
                                        >
                                            <PlusCircle size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </form>
            </motion.div>

            {/* Success Popup */}
            <AnimatePresence>
                {showSuccessPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
                    >
                        <div className="bg-white rounded-[40px] p-8 lg:p-12 max-w-md w-full shadow-2xl text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#205457] to-[#89917D]" />
                            <div className="w-24 h-24 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                                <Check size={48} className="text-green-500" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">Changes Saved!</h3>
                            <p className="text-gray-500 mb-10 leading-relaxed font-light">Your product information has been successfully updated in your showroom.</p>
                            <button
                                onClick={() => navigate('/seller-products')}
                                className="w-full bg-[#205457] text-white py-4 rounded-2xl font-bold hover:shadow-xl transition-all"
                            >
                                Back to Inventory
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EditProduct;
