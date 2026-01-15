import { useState, useEffect } from "react";
import { X, ShoppingCart, Trash2, Share2, ArrowRight, Heart, Package, Calendar, Tag, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import FooterBenefits from "../shop/components/FooterBenefits";
import SafeImage from "../../components/SafeImage";
import ConfirmModal from "../../components/ConfirmModal";
import { useAppContext } from "../../context/AppContext";
import api from "../../lib/axios";

const COLOR_MAP = {
  "brown": "#A67B5B",
  "grey": "#9E9E9E",
  "gray": "#9E9E9E",
  "green": "#5B8C5A",
  "red": "#D64545",
  "orange": "#E8915B",
  "blue": "#5B9BD5",
  "white": "#F5F5F5",
  "black": "#2D2D2D",
  "yellow": "#F59E0B",
  "purple": "#8B5CF6",
  "pink": "#EC4899",
  "beige": "#F5F5DC",
  "gold": "#FFD700",
  "silver": "#C0C0C0",
  "navy": "#000080",
  "teal": "#008080",
  "maroon": "#800000",
  "olive": "#808000"
};

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
};

const getDistance = (rgb1, rgb2) => {
  return Math.sqrt(Math.pow(rgb1.r - rgb2.r, 2) + Math.pow(rgb1.g - rgb2.g, 2) + Math.pow(rgb1.b - rgb2.b, 2));
};

const getColorName = (colorVal) => {
  if (!colorVal || colorVal.toLowerCase() === 'default') return "";
  const val = colorVal.trim().toLowerCase();
  if (!val.startsWith('#')) return colorVal;
  const exactFound = Object.entries(COLOR_MAP).find(([name, hex]) => hex.toLowerCase() === val);
  if (exactFound) return exactFound[0];
  const targetRgb = hexToRgb(val);
  if (!targetRgb) return colorVal;
  let minDistance = Infinity;
  let nearestName = colorVal;
  Object.entries(COLOR_MAP).forEach(([name, hex]) => {
    const mapRgb = hexToRgb(hex);
    if (mapRgb) {
      const distance = getDistance(targetRgb, mapRgb);
      if (distance < minDistance) { minDistance = distance; nearestName = name; }
    }
  });
  return nearestName;
};

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const { showAlert, formatPrice } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryFilter = searchParams.get('category');

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setLoading(true);
        const raw = localStorage.getItem('wishlist');
        const parsed = raw ? JSON.parse(raw) : [];

        // Enhance items with real-time stock and color from API
        const enhancedItems = await Promise.all(parsed.map(async (item) => {
          try {
            const res = await api.get(`/Product/GetProductById/${item.id}`);
            const prodData = res.data;

            // If product is missing or deleted status (if any)
            if (!prodData || res.status === 404) {
              console.warn(`Product ${item.id} seems to be deleted. Removing from wishlist.`);
              return null;
            }

            // Extract first color if current color is default/missing
            let autoColor = item.color;
            if (!autoColor || autoColor.toLowerCase() === 'default') {
              if (prodData.colors) {
                const colorsArr = typeof prodData.colors === 'string'
                  ? prodData.colors.split(',').map(c => c.trim()).filter(Boolean)
                  : prodData.colors;
                if (colorsArr.length > 0) autoColor = colorsArr[0];
              }
            }

            return {
              ...item,
              quantity: prodData.quantity ?? item.quantity,
              price: prodData.price ?? item.price,
              name: prodData.name ?? item.name,
              categoryId: prodData.categoryId,
              color: autoColor
            };
          } catch (e) {
            console.warn(`Could not sync item ${item.id}`, e);
            // If it's a 404, we definitely want to remove it
            if (e.response?.status === 404) return null;
            return item;
          }
        }));

        const filteredItems = enhancedItems.filter(i => i !== null);

        // Update localStorage if some were removed
        if (filteredItems.length !== parsed.length) {
          localStorage.setItem('wishlist', JSON.stringify(filteredItems));
        }

        if (categoryFilter) {
          try {
            const catRes = await api.get(`/Category/${categoryFilter}`);
            setCategoryName(catRes.data.name);
          } catch (e) {
            console.warn("Could not fetch category name", e);
          }
        } else {
          setCategoryName("");
        }

        setItems(filteredItems);
      } catch (err) {
        console.error('Failed to load wishlist', err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    loadWishlist();
  }, [categoryFilter]);

  const removeItem = (id, name) => {
    const next = items.filter(item => item.id !== id);
    setItems(next);
    localStorage.setItem('wishlist', JSON.stringify(next));
    showAlert(`${name} removed from wishlist`, 'info', 'Removed');
  };

  const clearWishlist = () => {
    setItems([]);
    localStorage.removeItem('wishlist');
    showAlert("Wishlist cleared", 'success', 'Cleared');
    setShowClearConfirm(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showAlert("Wishlist link copied to clipboard", 'success', 'Success');
  };

  const addToCart = async (item) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showAlert("Please login to add items to cart", 'warning', 'Login Required');
        return;
      }
      await api.post('Cart/add', {
        productId: parseInt(item.id),
        quantity: 1,
        colorName: item.color || null
      });
      showAlert(`${item.name} added to cart!`, 'success', 'Added to Cart');

      // Remove from wishlist
      setItems(prevItems => {
        const newItems = prevItems.filter(i => i.id !== item.id);
        localStorage.setItem('wishlist', JSON.stringify(newItems));
        window.dispatchEvent(new Event('storage'));
        return newItems;
      });
    } catch (err) {
      console.error(err);
      showAlert("Failed to add to cart", 'error', 'Error');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-[120px] flex flex-col">
      <div className="flex-grow pb-20">
        {/* Premium Header Section */}
        <div className="relative h-[250px] bg-[#205457] overflow-hidden flex items-center justify-center mb-12">
          {/* ... existing header content ... */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#7DDCC9]/20 rounded-full blur-3xl"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-white/80 text-xs font-bold uppercase tracking-widest border border-white/20 mb-4"
            >
              <Heart className="w-3 h-3 fill-[#7DDCC9] text-[#7DDCC9]" /> My Collection
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight"
            >
              {categoryName ? `${categoryName} Collection` : "Your Wishlist"}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-2 text-white/60 text-sm"
            >
              <span>Home</span> <ChevronRight className="w-4 h-4" /> <span className="text-[#7DDCC9] font-medium">Wishlist</span>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-[#205457]/10 border-t-[#205457] rounded-full animate-spin"></div>
              <p className="text-[#205457] font-medium animate-pulse uppercase tracking-widest text-xs">Syncing your products...</p>
            </div>
          ) : items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[40px] p-12 text-center border border-gray-100 shadow-xl shadow-[#205457]/5 flex flex-col items-center max-w-2xl mx-auto"
            >
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Package className="w-10 h-10 text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't added anything yet. Explore our curated collections and find something you love!</p>
              <button
                onClick={() => navigate('/shop')}
                className="bg-[#205457] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#1a4346] transition-all flex items-center gap-2 group shadow-lg shadow-[#205457]/20"
              >
                Start Shopping <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-[#205457]/5 p-2.5 rounded-2xl">
                    <Tag className="w-5 h-5 text-[#205457]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 leading-tight">{items.length} Items</h3>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Saved in your list</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {categoryFilter && (
                    <button
                      onClick={() => navigate('/wishlist')}
                      className="flex items-center gap-2 text-xs font-black bg-[#205457] text-white px-4 py-2 rounded-xl shadow-lg shadow-[#205457]/20 hover:scale-105 transition-transform"
                    >
                      Collection: {categoryName || categoryFilter} <X size={14} />
                    </button>
                  )}
                  <button
                    onClick={copyLink}
                    className="p-3 text-gray-400 hover:text-[#205457] hover:bg-[#205457]/5 rounded-2xl transition-all"
                    title="Share List"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="flex items-center gap-2 text-sm font-bold text-red-400 hover:text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-2xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Clear All</span>
                  </button>
                </div>
              </div>

              {/* Table Headers for Desktop */}
              <div className="hidden md:grid grid-cols-12 gap-6 px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                <div className="col-span-6">Product Details</div>
                <div className="col-span-2 text-center border-l border-gray-100">Price</div>
                <div className="col-span-2 text-center border-l border-gray-100">Availability</div>
                <div className="col-span-2 text-right border-l border-gray-100">Manage</div>
              </div>

              {/* Items Column */}
              <div className="space-y-4">
                <AnimatePresence mode='popLayout'>
                  {items
                    .filter(item => !categoryFilter || String(item.categoryId) === String(categoryFilter))
                    .map((item, idx) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group bg-white rounded-[32px] p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-[#205457]/10 transition-all duration-500 relative overflow-hidden"
                      >
                        {/* Hover Decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#205457]/[0.02] rounded-full -mr-16 -mt-16 transition-all group-hover:scale-150 duration-700"></div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative">
                          {/* Product Base Info */}
                          <div className="col-span-12 md:col-span-6 flex items-start md:items-center gap-4 md:gap-6">
                            <div className="relative group/img cursor-pointer shrink-0" onClick={() => navigate(`/product/${item.id}`)}>
                              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-[20px] md:rounded-[24px] overflow-hidden bg-gray-50 border border-gray-100 p-2">
                                <SafeImage
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover/img:scale-110 duration-500"
                                />
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); removeItem(item.id, item.name); }}
                                className="absolute -top-2 -left-2 w-7 h-7 bg-white border border-gray-100 text-red-500 rounded-full flex items-center justify-center shadow-lg md:scale-0 group-hover:scale-100 transition-all hover:bg-red-50"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex-1 min-w-0 py-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="bg-[#205457]/10 text-[#205457] text-[8px] md:text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Homesta Premium</span>
                              </div>
                              <h3 className="text-sm sm:text-base md:text-xl font-bold text-gray-900 truncate group-hover:text-[#205457] transition-colors cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                                {item.name}
                              </h3>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 mt-1.5 md:mt-2">
                                <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-gray-400">
                                  <Calendar className="w-3 md:w-3.5 h-3 md:h-3.5" />
                                  Added {item.dateAdded}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold">
                                  <span className="text-gray-400">Color:</span>
                                  <div className="flex items-center gap-1.5" title={item.color}>
                                    <div
                                      className="w-3 h-3 md:w-4 md:h-4 rounded-full border border-gray-100 shadow-sm"
                                      style={{ backgroundColor: COLOR_MAP[item.color?.toLowerCase()] || item.color || '#ccc' }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Price & Status Group (Mobile Friendly) */}
                          <div className="col-span-12 md:col-span-4 grid grid-cols-2 md:grid-cols-2 gap-4 items-center">
                            {/* Price */}
                            <div className="text-left md:text-center md:border-l md:border-gray-50">
                              <span className="block md:hidden text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Price</span>
                              <span className="text-base sm:text-lg md:text-2xl font-black text-[#205457]">{formatPrice(item.price)}</span>
                            </div>

                            {/* Status */}
                            <div className="flex flex-col items-end md:items-center justify-center md:border-l md:border-gray-50">
                              <span className="block md:hidden text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Stock Status</span>
                              {item.quantity > 0 ? (
                                <div className="flex flex-col items-end md:items-center">
                                  <span className="px-2 md:px-4 py-1 md:py-1.5 bg-green-50 text-green-600 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-1 md:gap-1.5">
                                    <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                    In Stock
                                  </span>
                                  <span className="text-[8px] md:text-[10px] text-gray-400 mt-0.5 md:mt-1 font-medium italic">{item.quantity} available</span>
                                </div>
                              ) : (
                                <span className="px-3 md:px-4 py-1 md:py-1.5 bg-red-50 text-red-400 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                                  Out of Stock
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Final Action */}
                          <div className="col-span-12 md:col-span-2 flex justify-end">
                            <button
                              onClick={() => addToCart(item)}
                              disabled={item.quantity <= 0}
                              className="w-full md:w-auto bg-[#205457] hover:bg-[#1a4346] disabled:opacity-30 disabled:cursor-not-allowed text-white py-3 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm transition-all flex items-center justify-center gap-2 md:gap-3 shadow-lg shadow-[#205457]/10 active:scale-95 group/btn"
                            >
                              <ShoppingCart className="w-3.5 md:w-4 h-3.5 md:h-4 group-hover/btn:rotate-12 transition-transform" />
                              <span>Move to Cart</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>

              {/* Bulk Actions */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12">
                <button
                  onClick={() => navigate('/shop')}
                  className="group flex items-center gap-3 text-[#205457] font-bold text-sm"
                >
                  <div className="bg-[#205457]/5 p-2 rounded-full group-hover:bg-[#205457] group-hover:text-white transition-all">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </div>
                  Continue Shopping
                </button>

                <div className="flex gap-4 w-full md:w-auto">
                  <button
                    onClick={() => items.length > 0 && items.forEach(it => it.quantity > 0 && addToCart(it))}
                    className="flex-1 md:flex-none border-2 border-[#205457] text-[#205457] px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#205457] hover:text-white transition-all"
                  >
                    Add All to Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <FooterBenefits />

      <ConfirmModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={clearWishlist}
        title="Clear Wishlist?"
        message="Are you sure you want to remove all items from your wishlist? This action cannot be undone."
        confirmText="Clear All"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Wishlist;

