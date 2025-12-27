import React, { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";

const Electronic = () => {
  const [likedProducts, setLikedProducts] = useState({});

  const products = [
    { id: 1, name: "Cooker", price: "400.00$", imgSrc: "/img/1.jpg" },
    { id: 2, name: "Air Conditioner", price: "700.00$", imgSrc: "/img/2.jpg" },
    { id: 3, name: "Blender", price: "300.00$", imgSrc: "/img/3.jpg" },
    { id: 4, name: "Air Fryer", price: "400.00$", imgSrc: "/img/4.jpg" },
    { id: 5, name: "Coffee Maker", price: "200.00$", imgSrc: "/img/5.jpg" },
    { id: 6, name: "Washing Machine", price: "900.00$", imgSrc: "/img/6.jpg" },
    { id: 7, name: "Refrigerator", price: "900.00$", imgSrc: "/img/7.jpg" },
    { id: 8, name: "Microwave", price: "300.00$", imgSrc: "/img/8.jpg" },
    { id: 9, name: "Vacuum Cleaner", price: "400.00$", imgSrc: "/img/9.jpg" },
    { id: 10, name: "Water Heater", price: "7000.00$", imgSrc: "/img/10.jpg" },
    { id: 11, name: "Steam Iron", price: "200.00$", imgSrc: "/img/11.jpg" },
    { id: 12, name: "Fan", price: "300.00$", imgSrc: "/img/12.jpg" },
  ];

  const toggleLike = (id) => {
    setLikedProducts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F5F5] flex justify-center pt-32 pb-16 px-4">
      {/* Main Container */}
      <div className="w-full max-w-[1312px] flex flex-col gap-8">
        {/* Title Electronic */}
        <div className="w-full py-4">
          <h1 className="font-[Outfit] text-[#0E0E0E] text-[42px] font-bold text-center">
            Electronic
          </h1>
        </div>

        {/* Products Grid - 3 rows x 4 columns = 12 products */}
        <div className="w-full grid grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative h-44 bg-gray-100">
                <img
                  src={product.imgSrc}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  {/* Like Button */}
                  <button
                    onClick={() => toggleLike(product.id)}
                    className="w-9 h-9 rounded-full bg-[#B19470] hover:bg-[#9d7f5c] flex items-center justify-center transition-colors shadow-md"
                  >
                    <Heart
                      size={18}
                      className={`${
                        likedProducts[product.id]
                          ? "fill-white text-white"
                          : "text-white"
                      } transition-all`}
                    />
                  </button>

                  {/* Cart Button */}
                  <button className="w-9 h-9 rounded-full bg-[#B19470] hover:bg-[#9d7f5c] flex items-center justify-center transition-colors shadow-md">
                    <ShoppingCart size={18} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col gap-1">
                {/* Product Name */}
                <h3 className="font-[Outfit] text-[#0E0E0E] text-base font-medium">
                  {product.name}
                </h3>

                {/* Price */}
                <p className="font-[Outfit] text-[#B19470] text-sm font-normal">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <button className="w-9 h-9 flex items-center justify-center text-[#43766C] hover:bg-white rounded-full transition-colors">
            &lt;
          </button>

          <button className="w-9 h-9 flex items-center justify-center bg-[#43766C] text-white rounded-full font-medium">
            1
          </button>
          <button className="w-9 h-9 flex items-center justify-center text-[#43766C] hover:bg-white rounded-full transition-colors font-medium">
            2
          </button>
          <button className="w-9 h-9 flex items-center justify-center text-[#43766C] hover:bg-white rounded-full transition-colors font-medium">
            3
          </button>
          <button className="w-9 h-9 flex items-center justify-center text-[#43766C] hover:bg-white rounded-full transition-colors font-medium">
            4
          </button>

          <span className="text-[#43766C] mx-1">...</span>

          <button className="w-9 h-9 flex items-center justify-center text-[#43766C] hover:bg-white rounded-full transition-colors font-medium">
            7
          </button>

          <button className="w-9 h-9 flex items-center justify-center text-[#43766C] hover:bg-white rounded-full transition-colors">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Electronic;
