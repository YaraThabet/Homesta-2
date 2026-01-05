import { useState, useEffect } from 'react';
import { Star, Trash2, Edit3, MessageSquare, Package, ArrowRight, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/axios';
import AccountSidebar from './components/AccountSidebar';

const MyReviews = () => {
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
        } catch (err) {
            console.error("Delete failed", err);
            alert("Failed to delete review.");
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
            setEditingReview(null);
        } catch (err) {
            console.error("Update failed", err);
            alert("Failed to update review.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] pt-[120px] pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-1/4">
                        <AccountSidebar />
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 md:p-10">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h1 className="text-3xl font-black text-gray-900 mb-2">My Reviews</h1>
                                    <p className="text-gray-500">Manage all the reviews you've shared with the community.</p>
                                </div>
                                <div className="bg-[#205457]/5 p-4 rounded-3xl">
                                    <MessageSquare size={32} className="text-[#205457]" />
                                </div>
                            </div>

                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <div className="w-10 h-10 border-4 border-[#205457]/10 border-t-[#205457] rounded-full animate-spin"></div>
                                    <p className="text-gray-400 font-medium">Fetching your feedback...</p>
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100">
                                    <Star size={48} className="mx-auto text-gray-200 mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Reviews Yet</h3>
                                    <p className="text-gray-500 mb-8 max-w-xs mx-auto">You haven't shared any reviews yet. Your feedback helps others shop better!</p>
                                    <button className="bg-[#205457] text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
                                        Browse Products
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <AnimatePresence mode="popLayout">
                                        {reviews.map((review) => (
                                            <motion.div
                                                layout
                                                key={review.reviewId || review.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="group bg-white rounded-[35px] border border-gray-100 p-6 hover:shadow-xl hover:shadow-[#205457]/5 transition-all duration-500"
                                            >
                                                <div className="flex flex-col md:flex-row gap-6">
                                                    {/* Product Thumbnail (If available) */}
                                                    <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-gray-50">
                                                        <Package size={24} className="text-gray-300" />
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                                            <div>
                                                                <h4 className="font-bold text-gray-900 text-lg">{review.productName || "Product Review"}</h4>
                                                                <p className="text-xs text-gray-400 font-medium">{review.storeName || "Vendor Name"} • {new Date(review.reviewDate).toLocaleDateString()}</p>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => setEditingReview({ ...review })}
                                                                    className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#205457] hover:text-white transition-all shadow-sm"
                                                                >
                                                                    <Edit3 size={18} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(review.reviewId || review.id)}
                                                                    className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-1 mb-3">
                                                            {[1, 2, 3, 4, 5].map((s) => (
                                                                <Star key={s} size={14} className={s <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                                                            ))}
                                                        </div>
                                                        <p className="text-gray-600 italic font-light leading-relaxed">"{review.comment}"</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingReview && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="text-xl font-bold text-gray-900">Update Review</h3>
                                <button onClick={() => setEditingReview(null)} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleUpdate} className="p-8 space-y-6">
                                <div>
                                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Your Rating</label>
                                    <div className="flex gap-3">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setEditingReview({ ...editingReview, rating: s })}
                                                className="group transition-transform active:scale-95"
                                            >
                                                <Star
                                                    size={32}
                                                    className={`transition-all ${s <= editingReview.rating ? "fill-amber-400 text-amber-400 scale-110" : "text-gray-200 group-hover:text-amber-200"}`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest">Your Experience</label>
                                    <textarea
                                        className="w-full p-6 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:ring-4 focus:ring-[#205457]/5 min-h-[150px] transition-all italic text-gray-600"
                                        value={editingReview.comment}
                                        onChange={(e) => setEditingReview({ ...editingReview, comment: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setEditingReview(null)}
                                        className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 py-4 bg-[#205457] text-white rounded-2xl font-bold shadow-xl shadow-[#205457]/20 hover:-translate-y-1 transition-all disabled:opacity-50"
                                    >
                                        {saving ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Saving...
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2">
                                                <Check size={20} />
                                                Save Changes
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
