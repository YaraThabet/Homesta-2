import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import SafeImage from '../../components/SafeImage';
import { Star, Trash2, Edit3, MessageSquare, Package, ArrowRight, X, Check, Calendar, Store, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/axios';

const MyReviews = () => {
    const { showAlert } = useAppContext();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingReview, setEditingReview] = useState(null);
    const [saving, setSaving] = useState(false);
    const userId = localStorage.getItem('userId');

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/Review/user/${userId}`);
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

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        try {
            await api.delete(`/Review/${id}`);
            setReviews(prev => prev.filter(r => (r.reviewId || r.id) !== id));
            showAlert("Review deleted successfully", "success");
        } catch (err) {
            console.error("Delete failed", err);
            showAlert("Failed to delete review.", "error", "Error");
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
        <div className="min-h-screen bg-[#FDFCFB]/50 pt-[120px] pb-20 font-outfit">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="bg-gradient-to-br from-[#205457] to-[#1a4447] rounded-[40px] p-10 mb-10 text-white shadow-2xl shadow-[#205457]/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-110" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-center md:text-left">
                                <motion.h1
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-4xl md:text-5xl font-black mb-4"
                                >
                                    My Feedbacks
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-white/80 text-lg max-w-md leading-relaxed"
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
                            className="text-center py-24 bg-white/60 backdrop-blur-md rounded-[50px] border border-white shadow-xl shadow-gray-200/50"
                        >
                            <div className="w-24 h-24 bg-[#205457]/5 rounded-full flex items-center justify-center mx-auto mb-8">
                                <Star size={48} className="text-[#205457]/20" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 mb-4">Silence is Golden, But Reviews are Better</h3>
                            <p className="text-gray-500 mb-10 max-w-sm mx-auto text-lg leading-relaxed">
                                Share your first experience and help our community discover the best home finishes.
                            </p>
                            <button className="bg-[#205457] text-white px-10 py-4 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-[#205457]/30 transition-all hover:-translate-y-1">
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
                                        className="group bg-white/70 backdrop-blur-lg rounded-[40px] border border-white p-8 hover:shadow-2xl hover:shadow-[#205457]/10 transition-all duration-500 relative overflow-hidden"
                                    >
                                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                                            {/* Product Identity */}
                                            <div className="relative flex-shrink-0">
                                                <div className="w-[140px] h-[140px] bg-white rounded-[35px] shadow-lg border border-gray-100 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                                    <SafeImage
                                                        src={review.productImage || review.imageUrl}
                                                        alt={review.productName}
                                                        type="product"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="absolute -bottom-3 -right-3 bg-[#205457] text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white">
                                                    <Package size={18} />
                                                </div>
                                            </div>

                                            {/* Review Content */}
                                            <div className="flex-1 w-full">
                                                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                                    <div>
                                                        <h4 className="font-black text-gray-900 text-2xl mb-1 group-hover:text-[#205457] transition-colors line-clamp-1">
                                                            {review.productName || "Product Review"}
                                                        </h4>
                                                        <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
                                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg">
                                                                <Store size={14} className="text-[#205457]" />
                                                                {review.storeName || "Veritas Studio"}
                                                            </div>
                                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg">
                                                                <Calendar size={14} />
                                                                {new Date(review.reviewDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Rating Display */}
                                                    <div className="flex items-center bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100/50">
                                                        <div className="flex gap-1">
                                                            {[1, 2, 3, 4, 5].map((s) => (
                                                                <Star
                                                                    key={s}
                                                                    size={16}
                                                                    className={`${s <= review.rating ? "fill-amber-400 text-amber-400" : "text-amber-100"} transition-all duration-300`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="ml-3 font-black text-amber-600 text-lg">{review.rating.toFixed(1)}</span>
                                                    </div>
                                                </div>

                                                <div className="relative mb-8 mt-2 p-6 bg-[#205457]/5 rounded-[30px] border-l-4 border-[#205457]">
                                                    <Quote className="absolute -top-4 -left-2 text-[#205457]/10 w-12 h-12 rotate-12" />
                                                    <p className="text-gray-700 text-lg italic leading-relaxed font-medium relative z-10">
                                                        "{review.comment}"
                                                    </p>
                                                </div>

                                                <div className="flex gap-3 justify-end items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <button
                                                        onClick={() => setEditingReview({ ...review })}
                                                        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-gray-100 text-[#205457] font-black text-sm hover:bg-[#205457] hover:text-white transition-all shadow-sm active:scale-95"
                                                    >
                                                        <Edit3 size={16} />
                                                        Edit Feedback
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(review.reviewId || review.id)}
                                                        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-gray-100 text-red-500 font-black text-sm hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95"
                                                    >
                                                        <Trash2 size={16} />
                                                        Remove
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
                            <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                                <div>
                                    <h3 className="text-3xl font-black text-gray-900 mb-1">Update Feeling</h3>
                                    <p className="text-gray-400 font-medium">Edit your review for {editingReview.productName}</p>
                                </div>
                                <button
                                    onClick={() => setEditingReview(null)}
                                    className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-95"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleUpdate} className="p-10 space-y-8">
                                <div>
                                    <label className="block text-sm font-black text-[#205457] uppercase tracking-widest mb-6 px-1">How would you rate it now?</label>
                                    <div className="flex gap-4 p-4 bg-gray-50 rounded-[30px] justify-center items-center">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setEditingReview({ ...editingReview, rating: s })}
                                                className="group relative"
                                            >
                                                <Star
                                                    size={42}
                                                    className={`transition-all duration-300 ${s <= editingReview.rating ? "fill-amber-400 text-amber-400 scale-110 drop-shadow-md" : "text-gray-200 group-hover:text-amber-200 scale-100"}`}
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
                                        className="w-full p-8 bg-gray-50 border border-transparent rounded-[35px] outline-none focus:bg-white focus:border-[#205457]/10 focus:ring-4 focus:ring-[#205457]/5 min-h-[180px] transition-all italic text-gray-600 text-lg leading-relaxed shadow-inner"
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
        </div>
    );
};

export default MyReviews;
