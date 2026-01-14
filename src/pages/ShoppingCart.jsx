import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CheckoutStepper from "./summaryOrder/components/CheckoutStepper";
import { useAppContext } from "../context/AppContext";
import ConfirmModal from "../components/ConfirmModal";
import api from "../lib/axios";

const ShoppingCart = () => {
  const { formatPrice, t, showAlert } = useAppContext();
  const [cartItems, setCartItems] = useState([]);
  const [cartSummary, setCartSummary] = useState({ subTotal: 0, shipping: 0, tax: 0, total: 0 });
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null); // To track which item is being updated
  const [showClearCartConfirm, setShowClearCartConfirm] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get('Cart');
      if (res.data && res.data.cartItems) {
        // Map API items to UI items
        const mappedItems = res.data.cartItems.map(item => ({
          id: item.cartItemId,
          productId: item.productId,
          name: item.productName || "Product",
          color: item.colorName || (item.productColors ? item.productColors[0] : null),
          price: (item.finalPrice !== undefined && item.finalPrice !== null) ? item.finalPrice : (item.unitPrice || 0),
          quantity: item.quantity || 1,
          image: null,
          originalPrice: item.unitPrice || 0
        }));
        setCartItems(mappedItems);
        setCartSummary({
          subTotal: res.data.subTotal || 0,
          shipping: res.data.shipping || 0,
          tax: res.data.tax || 0,
          total: res.data.totalPrice || 0
        });

        // Efficiently fetch all required product details and filter deleted ones
        const enrichmentPromises = mappedItems.map(async (item) => {
          try {
            const [imgRes, prodRes] = await Promise.all([
              api.get(`/ProductImages/product/${item.productId}`).catch(() => ({ data: null })),
              api.get(`/Product/GetProductById/${item.productId}`).catch(() => ({ data: null }))
            ]);

            // If product is not found (deleted), return null so we can filter it
            if (!prodRes || !prodRes.data || (prodRes.status === 404)) {
              console.warn(`Product ${item.productId} seems to be deleted. Removing from cart view.`);
              return null;
            }

            let url = null;
            if (imgRes.data && Array.isArray(imgRes.data.images) && imgRes.data.images.length > 0) {
              url = imgRes.data.images[0].imageUrl;
            } else if (imgRes.data && Array.isArray(imgRes.data.imageUrls) && imgRes.data.imageUrls.length > 0) {
              url = imgRes.data.imageUrls[0];
            }

            let fullUrl = null;
            if (url && typeof url === 'string') {
              fullUrl = url.startsWith('http') ? url : `${url.startsWith('/') ? '' : '/'}${url}`;
            }

            const stock = prodRes.data.quantity !== undefined ? prodRes.data.quantity : 100;

            return {
              ...item,
              image: fullUrl || item.image,
              maxQuantity: stock
            };
          } catch (e) {
            console.log('Failed to load details for cart item', item.id);
            return item; // Keep it if we just had a network error on images
          }
        });

        const results = await Promise.all(enrichmentPromises);
        const filteredItems = results.filter(item => item !== null);
        setCartItems(filteredItems);

        // Recalculate summary based on filtered items if necessary, 
        // though the backend should handle this usually. 
        // For UI consistency, we update the subtotal.
        const newSubtotal = filteredItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
        setCartSummary(prev => ({
          ...prev,
          subTotal: newSubtotal,
          total: newSubtotal + prev.shipping + prev.tax
        }));

      } else {
        setCartItems([]);
        setCartSummary({ subTotal: 0, shipping: 0, tax: 0, total: 0 });
      }
    } catch (err) {
      console.error("Failed to fetch cart", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (item, delta) => {
    if (processingId) return;

    const newQty = item.quantity + delta;
    if (newQty < 1) return;

    if (item.maxQuantity !== undefined && newQty > item.maxQuantity && delta > 0) {
      showAlert(`Only ${item.maxQuantity} items available in stock.`, "warning", "Stock Limit");
      return;
    }

    setProcessingId(item.id);

    try {
      await api.put('Cart/update', {
        cartItemId: item.id,
        quantity: newQty
      });

      // Refetch to be safe and get correct totals
      await fetchCart();
    } catch (err) {
      console.error("Update quantity failed", err);
      showAlert("Could not update quantity. Please try again.", "error", "Error");
    } finally {
      setProcessingId(null);
    }
  };

  const removeItem = async (id) => {
    setProcessingId(id);
    try {
      await api.delete(`Cart/remove/${id}`);
      await fetchCart();
    } catch (err) {
      console.error("Remove item failed", err);
      showAlert("Could not remove item. Please try again.", "error", "Error");
    } finally {
      setProcessingId(null);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await api.delete('Cart/clear');
      setCartItems([]);
      setCartSummary({ subTotal: 0, shipping: 0, tax: 0, total: 0 });
    } catch (err) {
      console.error("Failed to clear cart", err);
    } finally {
      setLoading(false);
      setShowClearCartConfirm(false);
    }
  };

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "save20") {
      setAppliedCoupon(true);
      showAlert("Coupon applied successfully! 20% discount added.", "success", "Coupon Applied");
    } else {
      showAlert("Invalid coupon code.", "warning", "Oops!");
    }
  };

  // UI Variabless
  const subtotal = cartSummary.subTotal;
  const shipping = cartSummary.shipping; // API provided
  const taxes = cartSummary.tax;
  const couponDiscount = appliedCoupon ? 100 : 0; // Local logic for now
  const total = cartSummary.total > 0 ? (cartSummary.total - couponDiscount) : 0; // API total + coupon

  if (loading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-[100px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#205457]/20 border-t-[#205457] rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-[150px] pb-20">

      {/* Header Section */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10 hidden">
        {/* Can put sticky header here if needed */}
      </div>

      <div className="container mx-auto px-4 max-w-7xl">

        {/* Page Title */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-[#205457] mb-3 tracking-tight">{t('cart') || 'Shopping Cart'}</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 font-medium">
            <Link to="/" className="hover:text-[#205457] transition-colors">{t('home') || 'Home'}</Link>
            <span>/</span>
            <span className="text-gray-600">{t('cart')}</span>
          </div>
        </div>

        <CheckoutStepper currentStep={1} />

        {/* Content Grid */}
        <div className="flex flex-col lg:flex-row gap-8 mt-12 relative">

          {/* Left Column: Cart Items */}
          <div className="flex-1 space-y-6">

            {/* Table Header (Desktop) */}

            <div className="hidden md:flex bg-[#B19470] text-white rounded-full px-6 py-3 mb-6 items-center text-sm font-medium uppercase tracking-wider shadow-sm">
              <span className="flex-1">{t('product') || 'Product'}</span>
              <span className="w-32 text-center">{t('price') || 'Price'}</span>
              <span className="w-40 text-center">{t('quantity') || 'Quantity'}</span>
              <span className="w-32 text-center">{t('subtotal')}</span>
              <span className="w-10"></span>
            </div>

            {/* Items List */}
            <div className="space-y-4">
              <AnimatePresence>
                {cartItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[30px] p-16 text-center shadow-sm border border-gray-100 border-dashed"
                  >
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShoppingBag className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t('cartEmpty') || 'Your cart is empty'}</h3>
                    <p className="text-gray-500 mb-8 max-w-xs mx-auto">Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/shop" className="inline-flex items-center gap-2 bg-[#205457] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#1a4345] transition-all hover:shadow-lg">
                      Start Shopping <ArrowRight size={18} />
                    </Link>
                  </motion.div>
                ) : (
                  cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`group bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden ${processingId === item.id ? 'opacity-60 pointer-events-none' : ''}`}
                    >
                      {/* Loading Overlay for Item */}
                      {processingId === item.id && (
                        <div className="absolute inset-0 z-20 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-[#205457] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}

                      <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Image */}
                        <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden bg-[#F4F5F7] flex-shrink-0 relative group-hover:scale-105 transition-transform duration-500">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply p-2" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium">No Image</div>
                          )}
                        </div>

                        {/* Details - Flex 1 */}
                        <div className="flex-1 w-full text-center md:text-left">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-500 font-medium mb-1">
                            {item.color ? (
                              <span className="inline-flex items-center gap-1" title={item.color}>
                                Color:
                                <span
                                  className="w-4 h-4 rounded-full border border-gray-200 inline-block shadow-sm ml-1"
                                  style={{ backgroundColor: item.color }}
                                />
                              </span>
                            ) : 'No options selected'}
                          </p>
                        </div>

                        {/* Price (Desktop) */}
                        <div className="hidden md:block w-32 text-center">
                          <div className="font-bold text-gray-900 text-lg">
                            {formatPrice(item.price)}
                          </div>
                          {item.originalPrice > item.price && (
                            <div className="text-xs text-gray-400 line-through">
                              {formatPrice(item.originalPrice)}
                            </div>
                          )}
                        </div>

                        {/* Quantity Control */}
                        <div className="w-full md:w-40 flex justify-center">
                          <div className="inline-flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                            <button
                              onClick={() => updateQuantity(item, -1)}
                              disabled={item.quantity <= 1}
                              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm hover:text-[#205457] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                              <Minus size={14} strokeWidth={3} />
                            </button>
                            <span className="w-12 text-center font-black text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item, 1)}
                              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm hover:text-[#205457] transition-all"
                            >
                              <Plus size={14} strokeWidth={3} />
                            </button>
                          </div>
                        </div>

                        {/* Mobile Price & Subtotal */}
                        <div className="w-full md:w-auto flex justify-between md:hidden items-center border-t border-gray-100 pt-4 mt-2">
                          <span className="font-bold text-gray-500 text-sm">Total</span>
                          <span className="font-black text-[#205457] text-xl">{formatPrice(item.price * item.quantity)}</span>
                        </div>

                        {/* Subtotal (Desktop) */}
                        <div className="hidden md:block w-32 text-center font-black text-[#205457] text-lg">
                          {formatPrice(item.price * item.quantity)}
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-10 h-10 rounded-full md:flex hidden items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Remove Item"
                        >
                          <X size={20} />
                        </button>

                        {/* Mobile Remove */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-red-500 bg-white/80 p-2 rounded-full backdrop-blur-sm"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>

              {cartItems.length > 0 && (
                <div className="flex flex-col gap-6 pt-4">
                  {/* Coupon and Actions */}
                  <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                    <div className="flex items-center gap-2 bg-white p-1 rounded-full border border-gray-200 shadow-sm w-full md:w-auto">
                      <input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder={t('couponCode') || "Coupon Code"}
                        className="bg-transparent px-4 py-2 text-sm outline-none w-full md:w-40"
                      />
                      <button
                        onClick={applyCoupon}
                        className="bg-[#205457] text-white rounded-full px-5 py-2 text-xs font-bold hover:bg-[#1a4345] transition-colors shrink-0"
                      >
                        {t('applyCoupon') || 'Apply'}
                      </button>
                    </div>
                    {appliedCoupon && <span className="text-green-500 text-xs font-bold flex items-center gap-1 justify-center md:justify-start"><Check size={12} /> Applied!</span>}

                    <div className="flex-1 hidden md:block"></div>

                    <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0">
                      <Link to="/shop" className="text-[#205457] font-bold hover:underline transition-all flex items-center gap-2 text-sm">
                        <ArrowLeftIcon /> {t('continueShopping') || 'Continue Shopping'}
                      </Link>

                      <button
                        onClick={() => setShowClearCartConfirm(true)}
                        className="text-gray-500 hover:text-red-500 text-sm font-medium underline transition-colors"
                      >
                        {t('clearCart')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          {cartItems.length > 0 && (
            <div className="lg:w-[380px] flex-shrink-0">
              <div className="bg-white rounded-[30px] p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 sticky top-32">
                <h2 className="text-2xl font-black text-gray-900 mb-8">{t('orderSummary')}</h2>



                <div className="space-y-4 border-t border-gray-100 pt-6">
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>{t('subtotal')}</span>
                    <span className="text-gray-900 font-bold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>{t('shipping')}</span>
                    <span className="text-gray-900 font-bold">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Discount</span>
                      <span className="font-bold">-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t-2 border-dashed border-gray-100 mt-6 pt-6 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-gray-500 font-bold mb-1">{t('total')}</span>
                    <span className="text-4xl font-black text-[#205457] tracking-tight">{formatPrice(total)}</span>
                  </div>
                  <p className="text-xs text-gray-400 text-right mt-1">Including Valid Tax</p>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-[#205457] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:translate-y-[-2px] hover:bg-[#1b4649] transition-all flex items-center justify-center gap-2 group"
                >
                  {t('checkout') || 'Checkout'}
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-400 font-medium flex items-center justify-center gap-2">
                    <span>🔒 Secure Checkout</span>
                    <span>•</span>
                    <span>🛡️ 30 Days return</span>
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Clear Cart Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearCartConfirm}
        onClose={() => setShowClearCartConfirm(false)}
        onConfirm={clearCart}
        title="Clear Shopping Cart?"
        message="Are you sure you want to remove all items from your cart? This action cannot be undone."
        confirmText="Clear Cart"
        cancelText="Keep Items"
        type="danger"
      />
    </div>
  );
};

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Check = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default ShoppingCart;
