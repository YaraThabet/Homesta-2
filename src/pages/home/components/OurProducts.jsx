import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import api from "../../../lib/axios";

const OurProducts = () => {
  const navigate = useNavigate();
  const [addingId, setAddingId] = useState(null);

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setAddingId(product.id);
      await api.post('Cart/add', {
        productId: product.id,
        quantity: 1,
        colorName: null
      });
      // Simple feedback: could use a toast here if available globally
    } catch (err) {
      console.error("Failed to add to cart", err);
    } finally {
      setAddingId(null);
    }
  };

  const products = [
    // ... (rest of the products array remains same)
    {
      id: 1,
      name: "Wooden Sofa Chair",
      category: "Chair",
      discount: "50% Off",
      price: 80,
      oldPrice: 160,
      rating: 4.9,
      image: "/img/product1.png",
    },
    {
      id: 2,
      name: "Luxury Armchair",
      category: "Armchair",
      discount: "30% Off",
      price: 120,
      oldPrice: 170,
      rating: 4.7,
      image: "/img/product2.png",
    },
    {
      id: 3,
      name: "Modern Dining Chair",
      category: "Dining Chair",
      discount: "20% Off",
      price: 60,
      oldPrice: 75,
      rating: 4.5,
      image: "/img/product3.png",
    },
    {
      id: 4,
      name: "Elegant Bar Stool",
      category: "Bar Stool",
      discount: "25% Off",
      price: 45,
      oldPrice: 60,
      rating: 4.6,
      image: "/img/chair3.png",
    },
    {
      id: 5,
      name: "Comfortable Lounge Chair",
      category: "Lounge Chair",
      discount: "15% Off",
      price: 90,
      oldPrice: 105,
      rating: 4.8,
      image: "/img/chair4.png",
    },
  ];

  return (
    <section className="w-full py-20 bg-white">
      {/* Container مع مسافة 64px من الجوانب */}
      <div className="container mx-auto px-4 md:px-24 text-center">

        {/* ===== Title ===== */}
        <h2 className="text-3xl md:text-4xl font-medium font-outfit mb-10">
          <span className="text-black">Our</span>{" "}
          <span className="text-[#205457]">Products Collections</span>
        </h2>

        {/* ===== Filter Buttons ===== */}
        <div className="flex flex-wrap justify-center gap-4 mb-14">
          {[
            "All Products",
            "Latest Products",
            "Best Selling",
            "Featured Products",
          ].map((item) => (
            <button
              key={item}
              onClick={() => navigate('/shop')}
              className="px-6 py-2 rounded-full border border-gray-300 text-sm md:text-base font-medium hover:bg-[#205457] hover:text-white transition"
            >
              {item}
            </button>
          ))}
        </div>

        {/* ===== Horizontal Slider ===== */}
        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6">

          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-[280px] sm:min-w-[320px] md:min-w-[360px] snap-start"
            >
              {/* Card */}
              <div className="bg-[#E0DFDF] rounded-2xl relative p-6 h-[420px] flex items-center justify-center">
                <span className="absolute top-4 left-4 bg-[#205457] text-white text-sm px-4 py-1 rounded-full">
                  {product.discount}
                </span>

                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-[220px] object-contain"
                />

                {/* Quick Add To Cart Button */}
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={addingId === product.id}
                  className="absolute bottom-4 right-4 w-12 h-12 bg-white text-[#205457] rounded-full shadow-lg flex items-center justify-center hover:bg-[#205457] hover:text-white transition-all transform hover:scale-110 active:scale-95"
                  title="Quick Add"
                >
                  <FaShoppingCart className={addingId === product.id ? 'animate-bounce' : ''} />
                </button>
              </div>

              {/* Info */}
              <div className="mt-4 text-left cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-gray-600 text-sm">{product.category}</p>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span className="text-sm">{product.rating}</span>
                  </div>
                </div>

                <h3 className="font-medium text-lg">{product.name}</h3>

                <p className="text-base font-medium">
                  ${product.price}
                  <span className="line-through text-gray-400 ml-2">
                    ${product.oldPrice}
                  </span>
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default OurProducts;
