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
        <div className="min-h-screen bg-[#FDFCFB] pt-[100px] md:pt-[120px] px-4 sm:px-6 md:px-8 lg:px-12 pb-24 font-outfit">
            <motion.div
                className="max-w-7xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Header */}
                <div className="mb-8 md:mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 md:gap-8">
                    <div className="w-full lg:w-auto">
                        <button
                            onClick={() => navigate('/seller-home')}
                            className="flex items-center gap-2 text-gray-400 hover:text-[#205457] transition-colors mb-4 group text-[11px] md:text-sm font-black uppercase tracking-widest"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            {localStorage.getItem('language') === 'ar' ? 'العودة للرئيسية' : 'Back to Dashboard'}
                        </button>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter">
                            Customer <span className="text-[#205457]">Reviews</span>
                        </h1>
                        <p className="text-gray-400 mt-2 md:mt-3 text-sm md:text-lg font-medium max-w-2xl">
                            Real-time satisfaction monitoring from your furniture collections.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto max-w-full no-scrollbar">
                        {['all', 'positive', 'negative'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 md:px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === f ? 'bg-[#205457] text-white shadow-xl shadow-[#205457]/20' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Performance Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
                    <div className="bg-white p-8 md:p-10 rounded-[35px] md:rounded-[45px] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center text-center group hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-700">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-6">Average Quality</p>
                        <div className="text-6xl md:text-7xl font-black text-[#205457] mb-4 tracking-tighter tabular-nums">{averageRating}</div>
                        <div className="flex gap-1.5 mb-3 scale-110">
                            {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} size={20} className={s <= Math.round(averageRating) ? "fill-[#B19470] text-[#B19470]" : "text-gray-100"} />
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Based on {reviews.length} reviews</p>
                    </div>

                    <div className="lg:col-span-2 bg-gray-900 p-8 md:p-12 rounded-[35px] md:rounded-[45px] text-white relative overflow-hidden flex items-center shadow-2xl shadow-gray-200/20 group">
                        <div className="absolute right-0 top-0 opacity-10 -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-1000">
                            <MessageCircle size={300} />
                        </div>
                        <div className="relative z-10 w-full">
                            <span className="text-[10px] font-black text-[#205457] bg-white px-3 py-1 rounded-full uppercase tracking-widest mb-6 inline-block">Sentiment Analysis</span>
                            <h3 className="text-2xl md:text-4xl font-black mb-4 tracking-tight">
                                {averageRating >= 4 ? 'Exceptional Craftsmanship' : 'Quality Furniture Pieces'}
                            </h3>
                            <p className="text-gray-400 text-base md:text-xl font-medium max-w-lg leading-relaxed">
                                {reviews.length > 0
                                    ? `Feedback suggests customers are ${averageRating >= 4 ? 'highly impressed' : 'generally satisfied'} with your collection's attention to detail.`
                                    : "No reviews generated yet. Use high-quality imagery to encourage customer engagement."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="w-12 h-12 border-4 border-[#205457]/10 border-t-[#205457] rounded-full animate-spin"></div>
                        <p className="text-xs font-black text-gray-300 uppercase tracking-widest">Scanning Archive...</p>
                    </div>
                ) : filteredReviews.length > 0 ? (
                    <div className="space-y-4 md:space-y-6">
                        {filteredReviews.map((review, idx) => (
                            <motion.div
                                key={review.reviewId || idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white p-6 sm:p-8 md:p-10 rounded-[30px] md:rounded-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-gray-50 group hover:shadow-2xl hover:shadow-gray-200/40 transition-all duration-700"
                            >
                                <div className="flex flex-col sm:flex-row gap-6 md:gap-10">
                                    <div className="flex-shrink-0 flex sm:block items-center justify-between">
                                        <div className="w-14 h-14 md:w-20 md:h-20 bg-gray-50 rounded-2xl md:rounded-[30px] flex items-center justify-center text-gray-200 relative group-hover:bg-[#205457]/5 transition-colors duration-500">
                                            <User size={32} className="md:w-10 md:h-10" />
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-[#205457] rounded-full border-4 border-white flex items-center justify-center text-white shadow-lg">
                                                <CheckCircle2 size={12} className="md:w-4 md:h-4" />
                                            </div>
                                        </div>
                                        <div className="sm:hidden text-right">
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-1">Posted On</span>
                                            <span className="text-xs font-bold text-gray-500">
                                                {new Date(review.reviewDate || review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h4 className="text-lg md:text-2xl font-black text-gray-900 mb-2 truncate">
                                                    {review.userName || review.fullName || 'Verified Buyer'}
                                                </h4>
                                                <div className="flex gap-1 bg-gray-50 px-3 py-1.5 rounded-full w-fit">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <Star key={s} size={14} className={s <= review.rating ? "fill-[#B19470] text-[#B19470]" : "text-gray-200"} />
                                                    ))}
                                                </div>
                                            </div>
                                            <span className="hidden sm:block text-[10px] font-black text-gray-300 uppercase tracking-widest mt-2">
                                                {new Date(review.reviewDate || review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <p className="text-gray-500 text-sm md:text-lg leading-relaxed font-light mb-8 italic border-l-4 border-gray-100 pl-6 py-1">
                                            "{review.comment || review.review || 'No comment provided.'}"
                                        </p>

                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="bg-[#205457]/5 text-[#205457] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-[#205457]/10">
                                                {review.productName ? `${review.productName}` : `PRODUCT #${review.productId}`}
                                            </span>
                                            {review.rating >= 4 && (
                                                <span className="bg-green-50 text-green-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-green-100">
                                                    Positive Experience
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[40px] md:rounded-[60px] p-12 md:p-32 text-center border-2 border-dashed border-gray-100 group hover:border-[#205457]/20 transition-colors">
                        <div className="w-20 h-20 md:w-32 md:h-32 bg-gray-50 rounded-[30px] md:rounded-[45px] flex items-center justify-center mx-auto mb-8 text-gray-200 group-hover:bg-[#205457]/5 group-hover:scale-110 transition-all duration-700">
                            <MessageCircle size={48} className="md:w-16 md:h-16" />
                        </div>
                        <h3 className="text-2xl md:text-4xl font-black text-gray-900 mb-4 tracking-tighter">Archive Empty</h3>
                        <p className="text-gray-400 font-medium max-w-sm mx-auto text-sm md:text-base leading-relaxed">
                            Your collection hasn't gathered feedback yet. High-quality descriptions often encourage customer interaction.
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Reviews;
