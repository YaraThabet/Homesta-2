import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ShoppingCart, Star, Check, Heart, Package } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import api from "../../../lib/axios";
import SafeImage from "../../../components/SafeImage";

// Color mapping for common color names
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

const getColorValue = (colorName) => {
  if (!colorName) return "#CCCCCC";
  const lowerColor = colorName.toLowerCase().trim();

  // Check if it's a hex color
  if (lowerColor.startsWith('#')) return lowerColor;

  // Check color map
  return COLOR_MAP[lowerColor] || "#CCCCCC";
};


const ProductCard = ({ product }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const productId = product.productId || product.id;

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await api.get(`/ProductImages/product/${productId}`);
        let url = null;
        if (res.data && Array.isArray(res.data.images) && res.data.images.length > 0) {
          url = res.data.images[0].imageUrl;
        } else if (Array.isArray(res.data) && res.data.length > 0 && res.data[0].imageUrls) {
          url = res.data[0].imageUrls[0];
        }

        if (!url && (product.imagePath || product.image)) {
          url = product.imagePath || product.image;
        }

        if (url && typeof url === 'string') {
          setImageUrl(url.startsWith('http') ? url : `${url.startsWith('/') ? '' : '/'}${url}`);
        }
      } catch (err) {
        // silent fail
      }
    };
    if (productId) fetchImage();
  }, [productId]);

  const [adding, setAdding] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    const checkWishlist = () => {
      try {
        const list = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setInWishlist(list.some(i => i.id === productId));
      } catch (e) { console.error(e); }
    };
    checkWishlist();
    window.addEventListener('storage', checkWishlist); // Listen for cross-tab updates
    return () => window.removeEventListener('storage', checkWishlist);
  }, [productId]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem('token');
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    try {
      const list = JSON.parse(localStorage.getItem('wishlist') || '[]');
      if (inWishlist) {
        const newList = list.filter(i => i.id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(newList));
        setInWishlist(false);
      } else {
        const newItem = {
          id: productId,
          name: product.name,
          image: imageUrl || product.image,
          price: product.price,
          color: selectedColor || ""
        };
        list.push(newItem);
        localStorage.setItem('wishlist', JSON.stringify(list));
        setInWishlist(true);
      }
      window.dispatchEvent(new Event('storage')); // Trigger update
    } catch (e) { console.error(e); }
  };
  const [selectedColor, setSelectedColor] = useState("");

  // Parse colors from product
  const availableColors = (() => {
    if (!product.colors) return [];
    if (Array.isArray(product.colors)) return product.colors;
    if (typeof product.colors === 'string') {
      return product.colors.split(',').map(c => c.trim()).filter(Boolean);
    }
    return [];
  })();

  // Set default color
  useEffect(() => {
    if (availableColors.length > 0 && !selectedColor) {
      setSelectedColor(availableColors[0]);
    }
  }, [availableColors, selectedColor]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check Stock
    if ((product.quantity || 0) <= 0) {
      setShowOutOfStock(true);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    try {
      setAdding(true);
      await api.post('Cart/add', {
        productId: parseInt(productId),
        quantity: 1,
        colorName: selectedColor || ""
      });
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Failed to add to cart", err);
      alert("Failed to add item to cart. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const originalPrice = product.originalPrice || (product.discount > 0 ? product.price / (1 - product.discount / 100) : null);

  return (
    <>
      <div className="group relative bg-card rounded-lg overflow-hidden border border-gray-100 transition-all hover:shadow-md h-full flex flex-col">
        <Link to={`/product/${productId}`} className="block h-full flex flex-col">
          <div className="relative aspect-square bg-muted/30 overflow-hidden">
            <SafeImage
              src={imageUrl}
              alt={product.name}
              type="product"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.discount > 0 && (
              <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#205457]  text-white text-[11px] font-medium rounded-full">
                {product.discount}% Off
              </span>
            )}
            <button
              onClick={toggleWishlist}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm text-gray-400 hover:text-red-500 transition-all shadow-sm z-10"
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>
          <div className="p-4 flex flex-col flex-1">
            <div className="mb-2">
              <h3 className="text-sm font-medium text-foreground leading-tight line-clamp-2 min-h-[2.5em]">
                {product.name}
              </h3>
            </div>

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div className="flex items-center gap-1.5 mb-2" onClick={(e) => e.preventDefault()}>
                {availableColors.map((color, index) => {
                  const colorValue = getColorValue(color);
                  return (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedColor(color);
                      }}
                      className={`w-5 h-5 rounded-full border-2 transition-all ${selectedColor === color
                        ? 'border-[#205457] ring-2 ring-[#205457]/30 scale-110'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                      style={{ backgroundColor: colorValue }}
                      title={color}
                    />
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  ${product.price.toFixed(2)}
                </span>
                {originalPrice && (
                  <span className="text-xs text-price-original line-through">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-rating text-rating fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-muted-foreground">{product.rating || 0}</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Floating Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`absolute bottom-16 right-4 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all ${(product.quantity || 0) <= 0
            ? 'bg-gray-100 text-gray-400'
            : 'bg-white text-[#205457] hover:bg-[#205457] hover:text-white'
            }`}
          disabled={adding}
          title={(product.quantity || 0) <= 0 ? "Out of Stock" : "Add to Cart"}
        >
          <ShoppingCart className={`h-5 w-5 ${adding ? 'animate-bounce' : ''}`} />
        </button>
      </div>

      {/* Out of Stock Modal */}
      {showOutOfStock && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center relative" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sorry!</h3>
            <p className="text-gray-600 mb-6 font-medium">
              This item is currently out of stock. Please check back later.
            </p>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowOutOfStock(false); }}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Login Required Modal (Portaled) */}
      {showLoginModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center relative animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 bg-[#205457]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-[#205457]" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Login Required</h3>
            <p className="text-gray-600 mb-6">Please sign in to add items to your cart.</p>
            <div className="flex gap-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowLoginModal(false);
                }}
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
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

      {/* Success Modal (Portaled) */}
      {showSuccessModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
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
    </>
  );
};

export default ProductCard;