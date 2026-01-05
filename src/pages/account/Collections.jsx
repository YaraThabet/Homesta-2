import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layers, ArrowRight, Heart, Bookmark, Search, Plus, Filter, Grid, Layout } from 'lucide-react';
import api from '../../lib/axios';
import SafeImage from '../../components/SafeImage';
import { useAppContext } from '../../context/AppContext';

const Collections = () => {
  const navigate = useNavigate();
  const { showAlert } = useAppContext();
  const [categories, setCategories] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, wishRes] = await Promise.all([
        api.get('/Category'),
        userId ? api.get(`/Wishlist/user/${userId}`) : Promise.resolve({ data: [] })
      ]);

      setCategories(Array.isArray(catRes.data) ? catRes.data : []);
      setWishlist(Array.isArray(wishRes.data) ? wishRes.data : []);
    } catch (err) {
      console.error("Failed to fetch collections data", err);
      showAlert("Failed to load collections", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const getItemsCount = (categoryId) => {
    return wishlist.filter(item => item.product?.categoryId === categoryId).length;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 80, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-[120px] pb-20 font-outfit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 px-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-black text-gray-900 mb-4 tracking-tight"
            >
              My <span className="text-[#205457]">Collections</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 text-xl font-medium max-w-xl"
            >
              Your personalized design catalog. Items are automatically grouped by category for your convenience.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 bg-white p-2 rounded-3xl shadow-sm border border-gray-100"
          >
            <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-white hover:text-[#205457] transition-all">
              <Grid size={20} />
            </button>
            <button className="p-3 bg-[#205457] text-white rounded-2xl shadow-lg shadow-[#205457]/20">
              <Layout size={20} />
            </button>
            <div className="w-px h-6 bg-gray-100 mx-1" />
            <button
              onClick={() => navigate('/wishlist')}
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-bold rounded-2xl hover:bg-gray-50 transition-all border border-gray-100"
            >
              <Heart size={18} className="text-red-500" />
              All Favorites
            </button>
          </motion.div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-gray-200 rounded-[40px] mb-6 shadow-inner" />
                <div className="h-8 bg-gray-200 rounded-xl w-3/4 mb-4" />
                <div className="h-5 bg-gray-100 rounded-lg w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 px-4"
          >
            {categories.map((category) => {
              const count = getItemsCount(category.id || category.categoryId);
              return (
                <motion.div
                  key={category.id || category.categoryId}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  onClick={() => navigate(`/wishlist?category=${category.id || category.categoryId}`)}
                  className="group cursor-pointer"
                >
                  {/* Card Visual */}
                  <div className="relative aspect-[4/5] rounded-[50px] overflow-hidden bg-white shadow-xl shadow-gray-200/50 border border-white mb-6">
                    <SafeImage
                      src={category.imageLink || category.imageUrl}
                      alt={category.name}
                      type="category"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Overlay Info */}
                    <div className="absolute inset-x-4 bottom-4 p-6 bg-white/40 backdrop-blur-3xl rounded-[35px] border border-white/40 flex items-center justify-between group-hover:bg-white group-hover:scale-[1.02] transition-all duration-500">
                      <div className="flex-1">
                        <h3 className="text-xl font-black text-gray-900 mb-1 line-clamp-1">{category.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#205457]" />
                          <p className="text-gray-900/60 font-black text-xs uppercase tracking-wider">
                            {count} Saved Items
                          </p>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-[#205457] text-white rounded-2xl flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-transform duration-500 shadow-lg shadow-[#205457]/20">
                        <ArrowRight size={20} />
                      </div>
                    </div>

                    {/* Hover Badge */}
                    <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-[#205457] text-white px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl">
                        <Bookmark size={14} />
                        View Collection
                      </div>
                    </div>

                    {/* Activity Indicator (if items saved) */}
                    {count > 0 && (
                      <div className="absolute top-6 right-6">
                        <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                      </div>
                    )}
                  </div>

                  {/* Subtitle */}
                  <div className="px-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <p className="text-gray-400 text-sm font-medium leading-relaxed italic">
                      "Explore curated {category.name.toLowerCase()} pieces you've fallen in love with."
                    </p>
                  </div>
                </motion.div>
              );
            })}

            {/* Special "All Items" Card if it doesn't already exist as a category */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10 }}
              onClick={() => navigate('/wishlist')}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] rounded-[50px] overflow-hidden bg-gradient-to-br from-[#205457] to-[#143436] shadow-2xl shadow-[#205457]/30 border border-white/10 mb-6 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[40px] flex items-center justify-center mb-8 border border-white/20 group-hover:scale-110 transition-transform duration-500">
                  <Heart size={48} className="text-white fill-white" />
                </div>
                <h3 className="text-3xl font-black text-white mb-3">All Favorites</h3>
                <p className="text-white/60 font-medium mb-8">Browse every item you've saved across all categories.</p>
                <div className="mt-auto w-full py-4 bg-white rounded-2xl text-[#205457] font-black text-lg group-hover:bg-gray-100 transition-colors">
                  Browse Hub
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Collections;
