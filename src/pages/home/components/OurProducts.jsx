import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { createPortal } from "react-dom";
import api from "../../../lib/axios";

const OurProducts = () => {
  const navigate = useNavigate();
  const [addingId, setAddingId] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    try {
      setAddingId(product.id);
      await api.post('Cart/add', {
        productId: product.id,
        quantity: 1,
        colorName: null
      });
    } catch (err) {
      console.error("Failed to add to cart", err);
    } finally {
      setAddingId(null);
    }
  };

  const products = [
    {
      id: 184,
      name: "Classic Tufted Upholstered Dining Chair",
      category: "Chair",
      discount: "5% Off",
      price: 110,
      oldPrice: 160,
      rating: 4.9,
      image: "/img/product1.png",
    },
    {
      id: 185,
      name: "Luna Rattan Papasan Chair",
      category: "Armchair",
      discount: "30% Off",
      price: 170,
      oldPrice: 220,
      rating: 4.7,
      image: "/img/product2.png",
    },
    {
      id: 189,
      name: "Eleanor Tufted Velvet Loveseat Chair",
      category: "Dining Chair",
      discount: "20% Off",
      price: 75,
      oldPrice: 110,
      rating: 4.5,
      image: "/img/product3.png",
    },
    {
      id: 181,
      name: "Elara Mid-Century Modern Tub Chair",
      category: "Bar Stool",
      discount: "25% Off",
      price: 500,
      oldPrice: 600,
      rating: 4.6,
      image: "/img/chair3.png",
    },
    {
      id: 186,
      name: "Mid-Century Modern Upholstered Armchair",
      category: "Lounge Chair",
      discount: "15% Off",
      price: 280,
      oldPrice: 350,
      rating: 4.8,
      image: "/img/chair4.png",
    },
  ];

  return (
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-4 md:px-24 text-center">
        <h2 className="text-3xl md:text-4xl font-medium font-outfit mb-10">
          <span className="text-black">Our</span>{" "}
          <span className="text-[#205457]">Products Collections</span>
        </h2>

        <div className="flex flex-wrap justify-center gap-4 mb-14">
          {["All Products", "Latest Products", "Best Selling", "Featured Products"].map((item) => (
            <button
              key={item}
              onClick={() => navigate('/shop')}
              className="px-6 py-2 rounded-full border border-gray-300 text-sm md:text-base font-medium hover:bg-[#205457] hover:text-white transition"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6">
          {products.map((product) => (
            <div key={product.id} className="min-w-[280px] sm:min-w-[320px] md:min-w-[360px] snap-start">
              <div
                className="bg-[#E0DFDF] rounded-2xl relative p-6 h-[420px] flex items-center justify-center cursor-pointer group"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <span className="absolute top-4 left-4 bg-[#205457] text-white text-sm px-4 py-1 rounded-full">
                  {product.discount}
                </span>
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-[220px] object-contain transition-transform duration-500 group-hover:scale-110"
                />
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={addingId === product.id}
                  className="absolute bottom-4 right-4 w-12 h-12 bg-white text-[#205457] rounded-full shadow-lg flex items-center justify-center hover:bg-[#205457] hover:text-white transition-all transform hover:scale-110 active:scale-95"
                >
                  <FaShoppingCart className={addingId === product.id ? 'animate-bounce' : ''} />
                </button>
              </div>

              <div className="mt-4 text-left cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-gray-600 text-[11px] md:text-sm">{product.category}</p>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400 w-3 h-3 md:w-4 md:h-4" />
                    <span className="text-[10px] md:text-sm">{product.rating}</span>
                  </div>
                </div>
                <h3 className="font-medium text-base md:text-lg line-clamp-2 min-h-[1.5em] md:min-h-[2.4em]">{product.name}</h3>
                <p className="text-base font-medium">
                  ${product.price}
                  <span className="line-through text-gray-400 ml-2">${product.oldPrice}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showLoginModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowLoginModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center relative" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 bg-[#205457]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShoppingCart className="w-8 h-8 text-[#205457]" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Login Required</h3>
            <p className="text-gray-600 mb-6">Please sign in to add items to your cart.</p>
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
                Login
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};

export default OurProducts;
