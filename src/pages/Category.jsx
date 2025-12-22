import React from "react";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 1,
      name: "Electrical Appliances",
      imgSrc: "/img/kitchen.jpg",
      path: "/electronic",
    },
    { id: 2, name: "Bedrooms", imgSrc: "/img/Bedrooms.jpg", path: "/bedrooms" },
    {
      id: 3,
      name: "Living Room",
      imgSrc: "/img/living-room.png",
      path: "/living-room",
    },
    { id: 4, name: "Kitchen", imgSrc: "/img/kitchen2.jpg", path: "/kitchen" },
    {
      id: 5,
      name: "Medical Devices",
      imgSrc: "/img/medical-devices.jpeg",
      path: "/medical-devices",
    },
    { id: 6, name: "Decor", imgSrc: "/img/decor.jpeg", path: "/decor" },
    {
      id: 7,
      name: "Home Tools",
      imgSrc: "/img/home-tools.png",
      path: "/home-tools",
    },
    {
      id: 8,
      name: "Furniture",
      imgSrc: "/img/furniture.jpeg",
      path: "/furniture",
    },
    {
      id: 9,
      name: "Dinning Room",
      imgSrc: "/img/dinning-room.jpg",
      path: "/dinning-room",
    },
  ];

  const handleCategoryClick = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className="w-full min-h-[1024px] bg-[#F8FAE5] flex justify-center">
      <div className="w-[1312px] mt-[168px] mx-auto flex flex-col gap-[32px]">
        <p className="font-[Outfit] text-[#43766C] text-[32px] font-medium leading-[100%] text-center">
          Explore by Category
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.path)}
              className="relative h-[238px] rounded-[15px] overflow-hidden cursor-pointer group"
              style={{
                backgroundImage: `url(${category.imgSrc})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-all duration-300"></div>

              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-white text-2xl font-semibold text-center">
                  {category.name}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
