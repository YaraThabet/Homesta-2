import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star,
    MessageCircle,
    User,
    ArrowLeft,
    Filter,
    MoreHorizontal,
    CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';

const Reviews = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [filter, setFilter] = useState('all'); // all, positive, negative
    const storeId = localStorage.getItem('storeId');

    useEffect(() => {
        if (!storeId) return;

        const fetchReviews = async () => {
            try {
                setLoading(true);
                // GET /api/Review/store/{storeId}
                const response = await api.get(`/Review/store/${storeId}`);
                setReviews(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error("Failed to fetch reviews:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [storeId]);

    const filteredReviews = reviews.filter(rev => {
        if (filter === 'positive') return rev.rating >= 4;
        if (filter === 'negative') return rev.rating <= 2;
        return true;
    });

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div className="min-h-screen bg-[#FDFCFB] pt-[110px] px-6 lg:px-16 pb-24 font-outfit">
            <motion.div
                className="max-w-6xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Header */}
                <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <button
                            onClick={() => navigate('/seller-home')}
                            className="flex items-center gap-2 text-gray-400 hover:text-[#205457] transition-colors mb-4 group text-sm font-medium"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </button>
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                            Customer <span className="text-[#205457]">Reviews</span>
                        </h1>
                        <p className="text-gray-400 mt-3 text-lg font-light">
                            See what customers are saying about your furniture pieces.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                        {['all', 'positive', 'negative'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-[#205457] text-white shadow-lg shadow-[#205457]/20' : 'text-gray-400 hover:text-gray-900'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Performance Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-[40px] shadow-[0_15px_40px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center text-center">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Average Quality</p>
                        <div className="text-6xl font-black text-gray-900 mb-4">{averageRating}</div>
                        <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} size={20} className={s <= Math.round(averageRating) ? "fill-[#B19470] text-[#B19470]" : "text-gray-200"} />
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 font-medium">Based on {reviews.length} reviews</p>
                    </div>

                    <div className="md:col-span-2 bg-[#205457] p-8 lg:p-12 rounded-[45px] text-white relative overflow-hidden flex items-center shadow-2xl shadow-[#205457]/20">
                        <div className="absolute right-0 top-0 opacity-10 -mr-10 -mt-10">
                            <MessageCircle size={240} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-4">Customer Sentiment</h3>
                            <p className="text-white/70 text-lg font-light max-w-md leading-relaxed">
                                {reviews.length > 0
                                    ? `Most customers are ${averageRating >= 4 ? 'thrilled' : 'satisfied'} with the craftsmanship and delivery of your items.`
                                    : "You haven't received any reviews yet. Great products deserve great feedback!"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-[#205457]/10 border-t-[#205457] rounded-full animate-spin"></div>
                    </div>
                ) : filteredReviews.length > 0 ? (
                    <div className="space-y-6">
                        {filteredReviews.map((review, idx) => (
                            <motion.div
                                key={review.reviewId || idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white p-8 lg:p-10 rounded-[40px] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-50 group hover:shadow-xl transition-all duration-500"
                            >
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 relative">
                                            <User size={32} />
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center text-white">
                                                <CheckCircle2 size={12} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                            <div>
                                                <h4 className="text-xl font-bold text-gray-900 mb-1">{review.userName || review.fullName || 'Verified Buyer'}</h4>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <Star key={s} size={14} className={s <= review.rating ? "fill-[#B19470] text-[#B19470]" : "text-gray-200"} />
                                                    ))}
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                                                {(review.reviewDate || review.createdAt) ? new Date(review.reviewDate || review.createdAt).toLocaleDateString() : 'Recent'}
                                            </span>
                                        </div>
                                        <p className="text-gray-500 text-lg leading-relaxed font-light mb-6 italic">
                                            "{review.comment || review.review || 'No comment provided.'}"
                                        </p>
                                        <div className="flex items-center gap-4 text-sm font-bold text-[#205457]">
                                            <span className="bg-[#205457]/5 px-4 py-2 rounded-xl">
                                                {review.productName ? `Product: ${review.productName}` : `Product ID: ${review.productId}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[45px] p-20 text-center border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <MessageCircle size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Reviews Yet</h3>
                        <p className="text-gray-400">Your products haven't been reviewed by customers yet.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Reviews;
