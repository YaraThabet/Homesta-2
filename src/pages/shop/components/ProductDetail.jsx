import { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Minus, Plus, Star, ArrowLeft, Upload, ShoppingCart, Check, X } from 'lucide-react';
import api from '../../../lib/axios';
import SafeImage from '../../../components/SafeImage';
import ConfirmModal from '../../../components/ConfirmModal';

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
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const getDistance = (rgb1, rgb2) => {
  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );
};

const getColorName = (colorVal) => {
  if (!colorVal) return "";
  const val = colorVal.trim().toLowerCase();
  if (!val.startsWith('#')) return colorVal;

  // Try exact match
  const exactFound = Object.entries(COLOR_MAP).find(([name, hex]) => hex.toLowerCase() === val);
  if (exactFound) return exactFound[0];

  // Try nearest color
  const targetRgb = hexToRgb(val);
  if (!targetRgb) return colorVal;

  let minDistance = Infinity;
  let nearestName = colorVal;

  Object.entries(COLOR_MAP).forEach(([name, hex]) => {
    const mapRgb = hexToRgb(hex);
    if (mapRgb) {
      const distance = getDistance(targetRgb, mapRgb);
      if (distance < minDistance) {
        minDistance = distance;
        nearestName = name;
      }
    }
  });

  return nearestName.startsWith('#') ? "Custom Color" : nearestName;
};

const safeUnescape = (str) => {
  if (!str) return "";
  const unescape = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"');
  // Decode multiple times to handle double/triple encoding
  return unescape(unescape(unescape(str)));
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert, formatPrice, t } = useAppContext();

  // Data State
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null); // String name
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalType, setModalType] = useState('cart'); // 'cart' or 'wishlist'
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  // Reviews (Mock for now as API endpoint is seller-centric or unconfirmed)
  // We can eventually replace this with a fetch for product specific reviews
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [editingReview, setEditingReview] = useState(null); // { reviewId, rating, comment }
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  const [submitReviewLoading, setSubmitReviewLoading] = useState(false);
  const currentUserId = localStorage.getItem('userId');

  // Base URL for images
  const IMG_BASE_URL = "/";

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);
        window.scrollTo(0, 0);

        // 1. Fetch Product Details
        // Try getting by ID. If 404, we might need to handle it.
        // Assuming /api/Product/{id} exists since DELETE works on it.
        let prodData = null;
        try {
          const prodRes = await api.get(`/Product/GetProductById/${id}`);
          prodData = prodRes.data;
        } catch (e) {
          console.error("Get Product By ID failed", e);
          setError("Product not found");
          setLoading(false);
          return;
        }

        if (!prodData) throw new Error("Product not found");
        setProduct(prodData);

        // Parse Colors
        let availColors = [];
        if (prodData.colors) {
          if (typeof prodData.colors === 'string') {
            availColors = prodData.colors.split(',').map(c => c.trim()).filter(Boolean);
          } else if (Array.isArray(prodData.colors)) {
            availColors = prodData.colors;
          }
        }
        if (availColors.length > 0) setSelectedColor(availColors[0]);

        // 2. Fetch Images - Updated to match new API structure
        const imgRes = await api.get(`/ProductImages/product/${id}`);
        let galleryImages = [];

        // API returns: { productId: id, images: [{ productImageId: x, imageUrl: "..." }] }
        if (imgRes.data && Array.isArray(imgRes.data.images)) {
          galleryImages = imgRes.data.images.map(img => img.imageUrl).filter(Boolean);
        } else if (Array.isArray(imgRes.data) && imgRes.data.length > 0 && imgRes.data[0].imageUrls) {
          // Backward compatibility for old format
          galleryImages = imgRes.data[0].imageUrls;
        }

        // Add main imagePath as fallback if gallery is empty
        if (galleryImages.length === 0 && prodData.imagePath) {
          galleryImages = [prodData.imagePath];
        } else if (galleryImages.length === 0 && prodData.image) {
          galleryImages = [prodData.image];
        }

        // Map to full URLs and set images
        const finalImages = galleryImages
          .filter(img => typeof img === 'string' && img.trim() !== '')
          .map(path =>
            path.startsWith('http') ? path : `${IMG_BASE_URL}${path.startsWith('/') ? path.substring(1) : path}`
          );

        setImages(finalImages.length > 0 ? finalImages : ["https://via.placeholder.com/600x600?text=No+Image"]);;

        // 3. Fetch Related Products (Same Category)
        if (prodData.categoryId) {
          // We fetch a subset of products. 
          // Optimization: If API has /Product/ByCategory/{id}, use it.
          // Else, fetch all (cached usually) and filter.
          const allRes = await api.get('Product/GetAllProducts');
          const all = Array.isArray(allRes.data) ? allRes.data : [];
          const related = all
            .filter(p => p.categoryId === prodData.categoryId && (p.productId || p.id) != id)
            .slice(0, 4);

          // Fix related product images
          const relatedWithImages = await Promise.all(related.map(async (p) => {
            let img = p.imagePath || p.image;
            const pid = p.productId || p.id;

            if (!img && pid) {
              try {
                const imgRes = await api.get(`/ProductImages/product/${pid}`);
                if (imgRes.data?.images?.length) {
                  img = imgRes.data.images[0].imageUrl;
                } else if (imgRes.data?.imageUrls?.length) {
                  img = imgRes.data.imageUrls[0];
                }
              } catch (e) {
                // ignore
              }
            }

            if (!img) {
              img = "https://via.placeholder.com/300?text=No+Image";
            } else if (typeof img === 'string' && !img.startsWith('http')) {
              img = `${IMG_BASE_URL}${img.startsWith('/') ? img.substring(1) : img}`;
            }
            return { ...p, image: img };
          }));
          setRelatedProducts(relatedWithImages);
        }

        // 4. Fetch Product Reviews
        try {
          const revRes = await api.get(`/Review/product/${id}`);
          const fetchedReviews = Array.isArray(revRes.data) ? revRes.data : [];
          setReviews(fetchedReviews);

          // 4b. If logged in, fetch user's own reviews to identify ownership
          const token = localStorage.getItem('token');
          const uid = localStorage.getItem('userId');
          if (token && uid) {
            try {
              const userRevRes = await api.get(`/Review/user/${uid}`);
              if (Array.isArray(userRevRes.data)) {
                // Store IDs of reviews that belong to this user
                const ids = userRevRes.data.map(r => r.reviewId || r.id || r.ReviewId);
                setUserReviewIds(ids);
              }
            } catch (ue) {
              console.log("User reviews fetch failed (optional)", ue);
            }
          }
        } catch (rErr) {
          console.log("Reviews fetch failed (optional)", rErr);
        }

      } catch (err) {
        console.error("Error loading product:", err);
        setError("Could not load product details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductData();
  }, [id]);

  const [userReviewIds, setUserReviewIds] = useState([]);

  useEffect(() => {
    if (reviews.length > 0) {
      console.log("📝 Sample Review Data:", reviews[0]);
      console.log("👤 Current User ID:", currentUserId);
    }
  }, [reviews, currentUserId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setModalType('cart'); // Re-using cart modal type for simplicity, or we can add 'review' type
      setShowLoginModal(true);
      return;
    }
    const userId = localStorage.getItem('userId'); // Ensure Login.jsx saves this now
    if (!userId) {
      // Fallback: try to decode token again or ask login
      setModalType('cart');
      setShowLoginModal(true);
      return;
    }

    try {
      setSubmitReviewLoading(true);
      const payload = {
        comment: newReview.comment,
        rating: parseInt(newReview.rating),
        userId: userId,
        productId: parseInt(product.productId || id),
        storeId: parseInt(product.storeId || 0)
      };
      await api.post('Review', payload);

      // Refresh reviews
      const revRes = await api.get(`/Review/product/${id}`);
      setReviews(Array.isArray(revRes.data) ? revRes.data : []);

      // Also refresh user review IDs to enable edit/delete for new review
      if (token && userId) {
        const userRevRes = await api.get(`/Review/user/${userId}`);
        if (Array.isArray(userRevRes.data)) {
          const ids = userRevRes.data.map(r => r.reviewId || r.id || r.ReviewId);
          setUserReviewIds(ids);
        }
      }

      setNewReview({ rating: 5, comment: '' });
    } catch (err) {
      console.error("Submit review failed", err);
      showAlert("Failed to submit review. Please try again.", "error", "Error");
    } finally {
      setSubmitReviewLoading(false);
    }
  };

  const handleDeleteReview = (reviewId) => {
    setDeleteConfirm({ show: true, id: reviewId });
  };

  const confirmDeleteReview = async () => {
    const reviewId = deleteConfirm.id;
    try {
      await api.delete(`/Review/${reviewId}`);
      // Refresh reviews
      const revRes = await api.get(`/Review/product/${id}`);
      setReviews(Array.isArray(revRes.data) ? revRes.data : []);
    } catch (err) {
      console.error("Delete review failed", err);
      showAlert("Failed to delete review.", "error", "Error");
    } finally {
      setDeleteConfirm({ show: false, id: null });
    }
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    try {
      setSubmitReviewLoading(true);
      const payload = {
        comment: editingReview.comment,
        rating: parseInt(editingReview.rating)
      };
      await api.put(`/Review/${editingReview.reviewId}`, payload);

      // Refresh reviews
      const revRes = await api.get(`/Review/product/${id}`);
      setReviews(Array.isArray(revRes.data) ? revRes.data : []);
      setEditingReview(null);
    } catch (err) {
      console.error("Update review failed", err);
      showAlert("Failed to update review.", "error", "Error");
    } finally {
      setSubmitReviewLoading(false);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (quantity < (product.quantity || 0)) {
      setQuantity(quantity + 1);
    } else {
      showAlert(`Only ${product.quantity} items available in stock.`, "warning", "Stock Limit");
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      setModalType('cart');
      setShowLoginModal(true);
      return;
    }

    try {
      setAddingToCart(true);
      const payload = {
        productId: parseInt(id),
        quantity: quantity,
        colorName: selectedColor
      };
      console.log("🛒 Adding to cart with payload:", payload);
      await api.post('Cart/add', payload);
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Add to cart error", err);

      // Handle different error types
      let title = "Error";
      let msg = "Failed to add to cart.";

      if (err.response?.status === 403) {
        title = "Permission Denied";
        msg = "Your session has expired. Please log in again.";
      } else if (err.response?.status === 401) {
        title = "Session Expired";
        msg = "Your session has expired. Please log in again.";
        // Optionally clear token and redirect to login
        localStorage.removeItem('token');
        setShowLoginModal(true);
        return;
      } else if (err.response?.data?.message) {
        const apiMsg = err.response.data.message;

        // Handle explicit "Cannot add more... available" message
        // Example: "Cannot add more. Only 2 items available"
        if (apiMsg.includes("Cannot add more") && apiMsg.includes("available")) {
          title = "Cart Limit Reached";
          // Extract the number if possible, or just give the general explanation
          msg = "You have already reached the purchase limit for this item based on our current stock.";
        }
        else if (apiMsg.includes("Only") && apiMsg.includes("items available")) {
          title = "High Demand";
          msg = "Sorry, we have limited stock! " + apiMsg;
        } else if (apiMsg.includes("Cannot add more") || apiMsg.includes("stock")) {
          title = "Stock Limit";
          msg = "You cannot add more of this item than is currently in stock.";
        } else if (apiMsg.includes("out of stock")) {
          title = "Out of Stock";
          msg = "This item is currently out of stock.";
        } else {
          msg = apiMsg;
        }
      }

      showAlert(msg, "error", title);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      setModalType('wishlist');
      setShowLoginModal(true);
      return;
    }
    try {
      const raw = localStorage.getItem('wishlist');
      const arr = raw ? JSON.parse(raw) : [];
      const exists = arr.some((it) => String(it.id) === String(id));
      if (exists) {
        const filtered = arr.filter((it) => String(it.id) !== String(id));
        localStorage.setItem('wishlist', JSON.stringify(filtered));
        setIsWishlisted(false);
      } else {
        const item = {
          id: id,
          name: product?.name || '',
          price: product?.price || 0,
          dateAdded: new Date().toLocaleDateString(),
          image: images?.[0] || '',
          color: selectedColor || '',
          quantity: product?.quantity || 0
        };
        const cleaned = arr.filter((it) => String(it.id) !== String(id));
        cleaned.push(item);
        localStorage.setItem('wishlist', JSON.stringify(cleaned));
        setIsWishlisted(true);
      }
    } catch (err) {
      console.error('Wishlist error', err);
    }
  };

  // initialize wishlist state from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('wishlist');
      const arr = raw ? JSON.parse(raw) : [];
      const exists = arr.some((it) => String(it.id) === String(id));
      setIsWishlisted(!!exists);
    } catch (err) {
      console.error('Failed to read wishlist', err);
      setIsWishlisted(false);
    }
  }, [id]);



  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-[150px] flex justify-center">
        <div className="w-10 h-10 border-4 border-[#205457]/10 border-t-[#205457] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background pt-[150px] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-4">{error || "Product not found"}</h1>
          <button
            onClick={() => navigate('/shop')}
            className="text-primary hover:underline"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  // Helper to get available colors array
  const availableColors = product.colors
    ? (Array.isArray(product.colors) ? product.colors : product.colors.split(',').map(c => c.trim()).filter(Boolean))
    : [];

  // Calculate Average Rating dynamically if reviews exist
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length)
    : (product.rating || 0);

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Add to cart
    await handleAddToCart(e);

    // We can assume handleAddToCart handles errors/login. 
    // If successful (no way to check return from handleAddToCart easily without refactor, 
    // but we can check if we are still on the page and logged in).
    // Actually, let's just navigate if token exists.

    const token = localStorage.getItem('token');
    if (token) {
      // Give a short delay for state update/toast
      setTimeout(() => {
        navigate('/shopping-cart');
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-[130px] sm:pt-[110px] md:pt-[120px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
        {/* Back Button */}

        <button
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-md px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-[#205457] font-bold text-xs sm:text-sm shadow-sm hover:shadow-lg hover:-translate-y-0.5 border border-white/60 transition-all mb-6 sm:mb-8 md:mb-10"
        >
          <div className="bg-[#205457]/10 p-1 sm:p-1.5 rounded-full group-hover:bg-[#205457] group-hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          {t('back') || 'Back'}
        </button>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12 animate-fade-in-up">
          {/* Image Gallery */}
          <div>
            <div className="mb-4 sm:mb-6 bg-white/40 backdrop-blur-md rounded-[20px] sm:rounded-[30px] p-4 sm:p-6 md:p-8 flex items-center justify-center border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] group">
              <SafeImage
                src={images[selectedImageIndex]}
                alt={product.name}
                type="product"
                className="w-full h-[250px] sm:h-[350px] md:h-[400px] object-contain mix-blend-multiply"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto py-2 scrollbar-hide">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 border-2 rounded-lg overflow-hidden bg-muted/30 ${selectedImageIndex === index ? 'border-[#205457]' : 'border-border'
                      }`}
                  >
                    <SafeImage
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      type="product"
                      className="w-full h-full object-contain p-1 mix-blend-multiply"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white/60 backdrop-blur-xl rounded-[20px] sm:rounded-[30px] p-5 sm:p-6 md:p-8 lg:p-10 border border-white shadow-xl shadow-[#205457]/5 flex flex-col items-stretch">
            <div className="flex justify-between items-start mb-2 gap-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex-1 min-w-0">{product.name}</h1>
              <button
                onClick={handleWishlistClick}
                className="p-1.5 sm:p-2 hover:bg-muted rounded-full transition-colors flex-shrink-0"
              >
                <Heart
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
                />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <p className="text-xl sm:text-2xl font-bold text-[#205457]">
                {formatPrice(product.finalPrice || (product.discount ? product.price * (1 - product.discount / 100) : product.price))}
              </p>
              {(product.discount > 0 || (product.finalPrice && product.finalPrice < product.price)) && (
                <p className="text-base sm:text-lg text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </p>
              )}
              {product.discount > 0 && (
                <span className="bg-red-100 text-red-600 text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                  -{product.discount}%
                </span>
              )}
            </div>

            {/* Rating (Dynamic) */}
            <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < Math.round(averageRating) ? 'fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-foreground font-bold">{averageRating.toFixed(1)}</span>
              <span className="text-xs sm:text-sm text-muted-foreground underline decoration-dotted cursor-pointer hover:text-[#205457]" onClick={() => document.getElementById('reviews-tab')?.click() || setActiveTab('review')}>
                ({reviews.length} {t('reviews')})
              </span>
            </div>

            <div className="mb-4 sm:mb-6">
              <h3 className="text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">{t('description') || 'Description'}</h3>
              <div
                className="text-muted-foreground text-xs sm:text-sm leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: safeUnescape(product.description || "No description available for this product.") }}
              />
            </div>

            {/* Colors */}
            {availableColors.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-foreground mb-3">
                  <span className="font-medium">{t('selectedColor') || 'Selected Color'} </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((colorVal, index) => {
                    // Support Hex or Name
                    const isHex = colorVal.startsWith('#');
                    const hex = isHex ? colorVal : (COLOR_MAP[colorVal.toLowerCase()] || "#ccc");

                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(colorVal)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${selectedColor === colorVal ? 'border-2 border-[#205457] scale-110 ring-2 ring-[#205457]/20' : 'border border-gray-200 hover:scale-105'
                          }`}
                        style={{ backgroundColor: hex }}
                        title={colorVal}
                      >
                        {/* Checkmark for selected state */}
                        {selectedColor === colorVal && (
                          <div className={`w-2.5 h-2.5 rounded-full shadow-md ${['#ffffff', '#fff', 'white'].includes(hex.toLowerCase()) ? 'bg-[#205457]' : 'bg-white'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-foreground block sm:hidden">{t('quantity')}</label>
                <div className="inline-flex items-center border border-border rounded-lg bg-white">
                  <button
                    onClick={decreaseQuantity}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="px-4 py-2 text-foreground font-medium text-base w-12 text-center">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {(product.stock || product.quantity) <= 0 ? (
                <span className="text-red-500 font-medium text-sm sm:ml-4">{t('outOfStock') || 'Out of Stock'}</span>
              ) : (
                <span className="text-green-600 font-medium text-sm sm:ml-4 flex items-center gap-1">
                  <Check size={16} />
                  {t('inStock') || 'In Stock'} ({product.stock || product.quantity} {t('available')})
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleAddToCart}
                disabled={(product.stock || product.quantity) <= 0 || addingToCart}
                className={`flex-1 ${addingToCart ? 'bg-[#205457]/80' : 'bg-[#205457]'} text-white py-3 sm:py-3.5 rounded-xl font-semibold hover:bg-[#1a4345] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#205457]/20 flex items-center justify-center gap-2 group text-sm sm:text-base`}
              >
                <ShoppingCart className={`w-4 h-4 sm:w-5 sm:h-5 ${addingToCart ? 'text-yellow-400 fill-yellow-400 animate-bounce' : 'text-white transition-colors duration-300 group-active:text-yellow-400 group-active:fill-yellow-400'}`} />
                {addingToCart ? (t('adding') || 'Adding...') : (t('addToCart') || 'Add to Cart')}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={(product.stock || product.quantity) <= 0}
                className="flex-1 bg-white border-2 border-[#205457] text-[#205457] py-3 sm:py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {t('buyNow') || 'Buy Now'}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Section (Description, Reviews) */}
        <div className="mb-10 sm:mb-16">
          {/* Centered Tabs */}
          <div className="flex gap-4 sm:gap-8 border-b border-gray-200 mb-6 sm:mb-8 overflow-x-auto justify-center scrollbar-hide">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-3 sm:pb-4 text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${activeTab === 'description'
                ? 'text-[#205457] border-b-2 border-[#205457]'
                : 'text-gray-500 hover:text-gray-800'
                }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`pb-3 sm:pb-4 text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${activeTab === 'review'
                ? 'text-[#205457] border-b-2 border-[#205457]'
                : 'text-gray-500 hover:text-gray-800'
                }`}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in-up">
            {activeTab === 'description' && (
              <div className="py-8 animate-fade-in-up w-full">
                <div className="prose prose-lg max-w-none">
                  {/* Description Paragraph(s) */}
                  <div
                    className="text-gray-600 leading-loose text-lg font-light mb-10 prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: safeUnescape(product.description || "No detailed description available.")
                    }}
                  />

                  {/* Features / Bullet Points */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#205457]"></div>
                      <span className="text-gray-700 font-medium">Premium Materials</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#205457]"></div>
                      <span className="text-gray-700 font-medium">Modern Design</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#205457]"></div>
                      <span className="text-gray-700 font-medium">Durable Construction</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#205457]"></div>
                      <span className="text-gray-700 font-medium">Easy Maintenance</span>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {activeTab === 'review' && (
              <div id="reviews">
                {/* Review Statistics */}
                {reviews.length > 0 && (
                  <div className="bg-gray-50 rounded-2xl p-8 mb-10 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Left: Average Rating */}
                      <div className="flex flex-col items-center justify-center text-center border-r border-gray-200">
                        <div className="text-5xl font-bold text-gray-900 mb-2">
                          {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${star <= Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                                }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-500">Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
                      </div>

                      {/* Right: Rating Breakdown */}
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const count = reviews.filter(r => r.rating === rating).length;
                          const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                          return (
                            <div key={rating} className="flex items-center gap-3">
                              <div className="flex items-center gap-1 w-16">
                                <span className="text-sm font-medium text-gray-700">{rating}</span>
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              </div>
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-yellow-400 transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-500 w-12 text-right">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews List */}

                {reviews.length > 0 ? (
                  <div className="space-y-6 mb-10">
                    {reviews.map((review, idx) => (
                      <div key={review.reviewId || idx} className="border-b border-gray-100 pb-6 last:border-0 relative">
                        {editingReview?.reviewId === review.reviewId ? (
                          <form onSubmit={handleUpdateReview} className="space-y-4 pt-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-700">Rating:</span>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button key={star} type="button" onClick={() => setEditingReview({ ...editingReview, rating: star })}>
                                    <Star className={`w-4 h-4 ${star <= editingReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <textarea
                              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#205457]/20 text-sm"
                              rows="2"
                              value={editingReview.comment}
                              onChange={e => setEditingReview({ ...editingReview, comment: e.target.value })}
                              required
                            ></textarea>
                            <div className="flex gap-2">
                              <button
                                type="submit"
                                disabled={submitReviewLoading}
                                className="bg-[#205457] text-white px-4 py-1.5 rounded-lg font-medium text-xs hover:bg-[#1a4345] disabled:opacity-50"
                              >
                                {submitReviewLoading ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingReview(null)}
                                className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-lg font-medium text-xs hover:bg-gray-200"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900">{review.userName || "Customer"}</span>
                                {(review.reviewDate || review.createdDate) && (
                                  <span className="text-gray-400 text-sm">
                                    • {new Date(review.reviewDate || review.createdDate).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                              {(() => {
                                const rId = review.reviewId || review.id || review.ReviewId;
                                const revUserId = review.userId || review.UserId || review.uid;
                                const isOwner = (currentUserId && revUserId && String(currentUserId) === String(revUserId)) ||
                                  (userReviewIds.includes(rId));

                                if (isOwner) {
                                  return (
                                    <div className="flex gap-3">
                                      <button
                                        onClick={() => {
                                          setEditingReview({ reviewId: rId, rating: review.rating, comment: review.comment });
                                        }}
                                        className="text-xs font-bold text-[#205457] hover:underline"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => {
                                          handleDeleteReview(rId);
                                        }}
                                        className="text-xs font-bold text-red-500 hover:underline"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  );
                                }
                                return null;
                              })()}
                            </div>
                            <div className="flex text-yellow-400 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                              ))}
                            </div>
                            <p className="text-gray-600">{review.comment}</p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 mb-8">No reviews yet. Be the first to review!</p>
                )}

                {/* Add Review Form */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4">Write a Review</h4>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-gray-700">Rating:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} type="button" onClick={() => setNewReview({ ...newReview, rating: star })}>
                            <Star className={`w-5 h-5 ${star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea
                      className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#205457]/20"
                      rows="3"
                      placeholder="Share your experience..."
                      value={newReview.comment}
                      onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                      required
                    ></textarea>
                    <button
                      type="submit"
                      disabled={submitReviewLoading}
                      className="bg-[#205457] text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-[#1a4345] disabled:opacity-50"
                    >
                      {submitReviewLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <div
                  key={p.productId || p.id}
                  onClick={() => {
                    navigate(`/product/${p.productId || p.id}`);
                  }}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                >
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <SafeImage
                      src={p.image}
                      alt={p.name}
                      type="product"
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                    />
                    {p.discount > 0 && (
                      <span className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full">
                        -{p.discount}%
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 truncate mb-1">{p.name}</h3>
                    <p className="text-[#205457] font-bold">${p.price?.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Login Modal */}
      {showLoginModal && createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center relative">
            <div className="w-16 h-16 bg-[#205457]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              {modalType === 'wishlist' ? (
                <Heart className="w-8 h-8 text-[#205457]" />
              ) : (
                <ShoppingCart className="w-8 h-8 text-[#205457]" />
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Login Required</h3>
            <p className="text-gray-600 mb-6 font-medium">
              Please sign in to {modalType === 'wishlist' ? 'add items to your wishlist' : 'add items to your cart'}.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLoginModal(false)}
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  navigate('/login');
                }}
                className="flex-1 py-2 bg-[#205457] hover:bg-[#1a4345] text-white rounded-lg font-medium transition-colors shadow-md"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Success Modal */}
      {showSuccessModal && createPortal(
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-[30px] shadow-2xl p-8 max-w-sm w-full text-center relative overflow-hidden border border-white/50">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Added to Cart!</h3>
            <p className="text-gray-500 mb-8">This item has been successfully added to your shopping cart.</p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => { setShowSuccessModal(false); navigate('/shopping-cart'); }}
                className="flex-1 py-3 bg-[#205457] hover:bg-[#1a4345] text-white rounded-xl font-bold text-sm transition-colors shadow-lg"
              >
                View Cart
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Review Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, id: null })}
        onConfirm={confirmDeleteReview}
        title="Delete Review?"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default ProductDetail;
