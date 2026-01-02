import { useState } from "react";
import { createPortal } from "react-dom";
import { ShoppingCart, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    console.log("Add to cart");
  };

  return (
    <>
      <Link to={`/product/${product.id}`} className="group bg-card rounded-lg overflow-hidden border border-border/50 border-gray-300 transition-all hover:shadow-md block">
        <div className="relative aspect-square bg-muted/30 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.discount && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#205457]  text-white text-[11px] font-medium rounded-full">
              {product.discount}% Off
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-sm font-medium text-foreground leading-tight">
              {product.name}
            </h3>
            <button
              onClick={handleAddToCart}
              className="p-1.5 hover:bg-muted rounded transition-colors flex-shrink-0"
            >
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs text-price-original line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-rating text-rating fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-muted-foreground">{product.rating}</span>
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