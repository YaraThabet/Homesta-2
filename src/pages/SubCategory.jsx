import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const SubCategory = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  // Formatting category name for display
  const displayTitle = categoryName ? categoryName.replace(/-/g, ' ') : "Sub Category";

  const subCategories = [
    { id: 1, name: "Cooker", imgSrc: "/img/1.jpg" },
    { id: 2, name: "Air Conditioner", imgSrc: "/img/2.jpg" },
    { id: 3, name: "Blender", imgSrc: "/img/3.jpg" },
    { id: 4, name: "Air Fryer", imgSrc: "/img/4.jpg" },
    { id: 5, name: "Coffee Maker", imgSrc: "/img/5.jpg" },
    { id: 6, name: "Washing Machine", imgSrc: "/img/6.jpg" },
    { id: 7, name: "Refrigerator", imgSrc: "/img/7.jpg" },
    { id: 8, name: "Microwave", imgSrc: "/img/8.jpg" },
    { id: 9, name: "Vacuum Cleaner", imgSrc: "/img/9.jpg" },
    { id: 10, name: "Water Heater", imgSrc: "/img/10.jpg" },
    { id: 11, name: "Steam Iron", imgSrc: "/img/11.jpg" },
    { id: 12, name: "Fan", imgSrc: "/img/12.jpg" },
  ];

  const handleSubCategoryClick = (name) => {
    navigate(`/shop?category=${name.toLowerCase()}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F5F5] flex justify-center pt-32 pb-16 px-4">
      {/* Main Container */}
      <div className="w-full max-w-[1312px] flex flex-col gap-8 pt-[50px]">
        {/* Title Dynamic */}
        <div className="w-full py-4">
          <h1 className="font-[Outfit] text-[#205457] text-[42px] font-medium text-center capitalize">
            {displayTitle}
          </h1>
        </div>

        {/* SubCategories Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subCategories.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSubCategoryClick(item.name)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              {/* Image Container */}
              <div className="relative h-56 bg-gray-100 overflow-hidden">
                <img
                  src={item.imgSrc}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Info */}
              <div className="p-6 text-center">
                <h3 className="font-[Outfit] text-[#0E0E0E] text-xl font-semibold group-hover:text-[#205457] transition-colors">
                  {item.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination placeholder */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <button className="w-10 h-10 flex items-center justify-center text-[#205457] hover:bg-[#205457] hover:text-white border border-[#205457] rounded-full transition-all">
            &lt;
          </button>
          <button className="w-10 h-10 flex items-center justify-center bg-[#205457] text-white rounded-full font-bold shadow-md">1</button>
          <button className="w-10 h-10 flex items-center justify-center text-[#205457] hover:bg-[#205457] hover:text-white border border-[#205457] rounded-full transition-all">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubCategory;
