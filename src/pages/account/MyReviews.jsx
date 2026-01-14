import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import SafeImage from '../../components/SafeImage';
import { Star, Trash2, Edit3, MessageSquare, Package, ArrowRight, X, Check, Calendar, Store, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '../../components/ConfirmModal';
import api from '../../lib/axios';

const MyReviews = () => {
    const { showAlert } = useAppContext();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingReview, setEditingReview] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
    const [saving, setSaving] = useState(false);
    const userId = localStorage.getItem('userId');

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/Review/user/${userId}`);
            console.log("Reviews Response:", res.data); // DEBUG: Check image field
            setReviews(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to fetch user reviews", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) fetchReviews();
    }, [userId]);

    const handleDelete = (id) => {
        setDeleteConfirm({ show: true, id });
    };

    const confirmDelete = async () => {
        const id = deleteConfirm.id;
        try {
            await api.delete(`/Review/${id}`);
            setReviews(prev => prev.filter(r => (r.reviewId || r.id) !== id));
            showAlert("Review deleted successfully", "success");
        } catch (err) {
            console.error("Delete failed", err);
            showAlert("Failed to delete review.", "error", "Error");
        } finally {
            setDeleteConfirm({ show: false, id: null });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const payload = {
                comment: editingReview.comment,
                rating: editingReview.rating
            };
            await api.put(`/Review/${editingReview.reviewId || editingReview.id}`, payload);
            setReviews(prev => prev.map(r =>
                (r.reviewId || r.id) === (editingReview.reviewId || editingReview.id)
                    ? { ...r, ...payload }
                    : r
            ));
            showAlert("Review updated successfully", "success");
            setEditingReview(null);
        } catch (err) {
            console.error("Update failed", err);
            showAlert("Failed to update review.", "error", "Error");
        } finally {
            setSaving(false);
        }
    };

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
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    return (
        <div className="font-outfit w-full">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="bg-gradient-to-br from-[#205457] to-[#1a4447] rounded-[24px] md:rounded-[40px] p-6 md:p-10 mb-6 md:mb-10 text-white shadow-2xl shadow-[#205457]/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-110" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-3xl md:text-5xl font-black mb-4"
                            >
                                My Feedbacks
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-white/80 text-base md:text-lg max-w-md leading-relaxed"
                            >
                                Your voice matters. Shared {reviews.length} reviews contributing to our growing community.
                            </motion.p>
                        </div>
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white/20 backdrop-blur-xl p-6 rounded-[30px] border border-white/30"
                        >
                            <MessageSquare size={48} className="text-white" />
                        </motion.div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6">
                        <div className="relative w-20 h-20">
                            <div className="absolute inset-0 border-4 border-[#205457]/10 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-[#205457] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="text-[#205457] font-bold text-xl animate-pulse">Loading your stories...</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12 md:py-24 bg-white/60 backdrop-blur-md rounded-[32px] md:rounded-[50px] border border-white shadow-xl shadow-gray-200/50"
                    >
                        <div className="w-24 h-24 bg-[#205457]/5 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Star size={48} className="text-[#205457]/20" />
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 mb-4">Silence is Golden, But Reviews are Better</h3>
                        <p className="text-gray-500 mb-10 max-w-sm mx-auto text-lg leading-relaxed">
                            Share your first experience and help our community discover the best home finishes.
                        </p>
                        <button className="bg-[#205457] text-white px-8 py-3 md:px-10 md:py-4 rounded-xl md:rounded-2xl font-black text-sm md:text-lg hover:shadow-2xl hover:shadow-[#205457]/30 transition-all hover:-translate-y-1">
                            Discover Products
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {reviews.map((review) => (
                                <motion.div
                                    key={review.reviewId || review.id}
                                    variants={itemVariants}
                                    layout
                                    className="group bg-white/70 backdrop-blur-lg rounded-[20px] md:rounded-[40px] border border-white p-4 md:p-8 hover:shadow-2xl hover:shadow-[#205457]/10 transition-all duration-500 relative overflow-hidden"
                                >
                                    <div className="flex gap-4 md:gap-8 items-start">
                                        {/* Product Identity - Left Side */}
                                        <div className="relative flex-shrink-0">
                                            <div className="w-16 h-16 md:w-[140px] md:h-[140px] bg-white rounded-[16px] md:rounded-[35px] shadow-lg border border-gray-100 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                                <SafeImage
                                                    src={
                                                        review.productImage ||
                                                        review.ProductImage ||
                                                        review.imageUrl ||
                                                        review.ImageUrl ||
                                                        review.image ||
                                                        review.Image ||
                                                        review.product?.image ||
                                                        review.product?.images?.[0]?.imageUrl
                                                    }
                                                    alt={review.productName}
                                                    type="product"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>

                                        {/* Review Content - Right Side */}
                                        <div className="flex-1 min-w-0">
                                            {/* Header */}
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                                                <div>
                                                    <h4 className="font-black text-gray-900 text-base md:text-2xl mb-1 group-hover:text-[#205457] transition-colors truncate">
                                                        {review.productName || "Product Review"}
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-[10px] md:text-sm font-bold text-gray-400 flex-wrap">
                                                        {review.storeName && (
                                                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 rounded-md">
                                                                <Store size={10} className="md:w-3.5 md:h-3.5 text-[#205457]" />
                                                                <span>{review.storeName}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 rounded-md">
                                                            <Calendar size={10} className="md:w-3.5 md:h-3.5" />
                                                            <span>{new Date(review.reviewDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Rating */}
                                                <div className="flex items-center self-start bg-amber-50 px-2 py-1 md:px-4 md:py-2 rounded-lg md:rounded-2xl border border-amber-100/50 flex-shrink-0">
                                                    <div className="flex gap-0.5 md:gap-1">
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <Star
                                                                key={s}
                                                                size={10}
                                                                className={`md:w-4 md:h-4 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "text-amber-100"} transition-all duration-300`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="ml-1.5 font-black text-amber-600 text-xs md:text-lg">{review.rating.toFixed(1)}</span>
                                                </div>
                                            </div>

                                            {/* Comment */}
                                            <div className="relative mb-3 mt-1 p-3 md:p-6 bg-[#205457]/5 rounded-[16px] md:rounded-[30px] border-l-2 md:border-l-4 border-[#205457]">
                                                <p className="text-gray-700 text-sm md:text-lg italic leading-relaxed font-medium relative z-10 line-clamp-3 md:line-clamp-none">
                                                    "{review.comment}"
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 justify-end items-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                                                <button
                                                    onClick={() => setEditingReview({ ...review })}
                                                    className="p-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl bg-white border border-gray-100 text-[#205457] hover:bg-[#205457] hover:text-white transition-all shadow-sm active:scale-95"
                                                    title="Edit"
                                                >
                                                    <Edit3 size={14} className="md:w-4 md:h-4" />
                                                    <span className="hidden md:inline md:ml-2 font-black text-sm">Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(review.reviewId || review.id)}
                                                    className="p-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl bg-white border border-gray-100 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95"
                                                    title="Remove"
                                                >
                                                    <Trash2 size={14} className="md:w-4 md:h-4" />
                                                    <span className="hidden md:inline md:ml-2 font-black text-sm">Remove</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>



                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>


            {/* Premium Overlay Modal */}
            <AnimatePresence>
                {editingReview && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setEditingReview(null)}
                            className="absolute inset-0 bg-[#205457]/40 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="bg-white w-full max-w-xl rounded-[50px] shadow-2xl overflow-hidden relative z-20 border border-white"
                        >
                            <div className="p-6 md:p-10 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">Update Feeling</h3>
                                    <p className="text-gray-400 font-medium text-sm md:text-base">Edit your review for {editingReview.productName}</p>
                                </div>
                                <button
                                    onClick={() => setEditingReview(null)}
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-95 flex-shrink-0"
                                >
                                    <X size={20} className="md:w-6 md:h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleUpdate} className="p-6 md:p-10 space-y-6 md:space-y-8">
                                <div>
                                    <label className="block text-xs md:text-sm font-black text-[#205457] uppercase tracking-widest mb-4 md:mb-6 px-1">How would you rate it now?</label>
                                    <div className="flex gap-2 md:gap-4 p-4 bg-gray-50 rounded-[30px] justify-center items-center">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setEditingReview({ ...editingReview, rating: s })}
                                                className="group relative"
                                            >
                                                <Star
                                                    size={32}
                                                    className={`md:w-[42px] md:h-[42px] transition-all duration-300 ${s <= editingReview.rating ? "fill-amber-400 text-amber-400 scale-110 drop-shadow-md" : "text-gray-200 group-hover:text-amber-200 scale-100"}`}
                                                />
                                                {s === editingReview.rating && (
                                                    <motion.div
                                                        layoutId="starGlow"
                                                        className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full"
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm font-black text-[#205457] uppercase tracking-widest px-1">Describe your experience</label>
                                    <textarea
                                        className="w-full p-6 md:p-8 bg-gray-50 border border-transparent rounded-[25px] md:rounded-[35px] outline-none focus:bg-white focus:border-[#205457]/10 focus:ring-4 focus:ring-[#205457]/5 min-h-[120px] md:min-h-[180px] transition-all italic text-gray-600 text-base md:text-lg leading-relaxed shadow-inner"
                                        value={editingReview.comment}
                                        onChange={(e) => setEditingReview({ ...editingReview, comment: e.target.value })}
                                        required
                                        placeholder="What did you think about the quality..."
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setEditingReview(null)}
                                        className="flex-1 py-5 bg-gray-50 text-gray-500 rounded-2xl font-black hover:bg-gray-100 transition-all active:scale-95"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-[2] py-5 bg-[#205457] text-white rounded-2xl font-black shadow-xl shadow-[#205457]/30 hover:shadow-2xl hover:shadow-[#205457]/40 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0"
                                    >
                                        {saving ? (
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Syncing Changes...
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2">
                                                <Check size={22} />
                                                Confirm Update
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteConfirm.show}
                onClose={() => setDeleteConfirm({ show: false, id: null })}
                onConfirm={confirmDelete}
                title="Delete Review?"
                message="Are you sure you want to delete this review? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
};

export default MyReviews;
