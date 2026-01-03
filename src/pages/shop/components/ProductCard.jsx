import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ShoppingCart, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../lib/axios";

const ProductCard = ({ product }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const productId = product.productId || product.id;

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await api.get(`/ProductImages/product/${productId}`);
        if (res.data && res.data.length > 0 && res.data[0].imageUrls && res.data[0].imageUrls.length > 0) {
          const url = res.data[0].imageUrls[0];
          if (url && typeof url === 'string') {
            setImageUrl(url.startsWith('http') ? url : `http://homefinish.runasp.net${url}`);
          }
        }
      } catch (err) {
        // silent fail
      }
    };
    if (productId) fetchImage();
  }, [productId]);

  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    try {
      setAdding(true);
      await api.post('/Cart/add', { productId: parseInt(productId), quantity: 1 });
      setAdded(true);
    } catch (err) {
      console.error("Failed to add to cart", err);
    } finally {
      setAdding(false);
    }
  };

  const originalPrice = product.originalPrice || (product.discount > 0 ? product.price / (1 - product.discount / 100) : null);

  return (
    <>
      <Link to={`/product/${productId}`} className="group bg-card rounded-lg overflow-hidden border border-gray-100 transition-all hover:shadow-md block h-full flex flex-col">
        <div className="relative aspect-square bg-muted/30 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
              No Image
            </div>
          )}
          {product.discount > 0 && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#205457]  text-white text-[11px] font-medium rounded-full">
              {product.discount}% Off
            </span>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-sm font-medium text-foreground leading-tight line-clamp-2 min-h-[2.5em]">
              {product.name}
            </h3>
            <button
              onClick={handleAddToCart}
              className={`p-1.5 rounded transition-colors flex-shrink-0 ${added ? 'bg-[#205457] text-white' : 'hover:bg-muted text-muted-foreground'}`}
              disabled={adding}
              title={added ? "Added to Cart" : "Add to Cart"}
            >
              <ShoppingCart className={`h-4 w-4 ${adding ? 'animate-bounce' : ''}`} />
            </button>
          </div>
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
    </>
  );
};

export default ProductCard;