import React from 'react'
const Category = () => {
  const categories = [
    { id: 1, name: "Electrical Appliances", imgSrc: "/img/kitchen.jpg" },
    { id: 2, name: "Bedrooms", imgSrc: "/img/Bedrooms.jpg" },
    { id: 3, name: "Living Room", imgSrc: "/img/living-room.jpg" },
    { id: 4, name: "Kitchen", imgSrc: "/img/kitchen2.jpg" },
    { id: 5, name: "Sanitary Ware", imgSrc: "/img/Sanitary.jpg" },
    { id: 6, name: "Decor", imgSrc: "/img/decor.jpeg" },
    { id: 7, name: "Home Tools", imgSrc: "/img/home-tools.png" },
    { id: 8, name: "Furniture", imgSrc: "/img/furniture.jpeg" },
    { id: 9, name: "Dinning Room", imgSrc: "/img/dinning-room.jpg" },
  ];

  return (
    <div className='w-full min-h-[1024px] bg-[#F8FAE5] flex justify-center'>
      <div className='w-[1312px] mt-[168px] mx-auto flex flex-col gap-[32px]'>

        <p className='font-[Outfit] text-[#43766C] text-[32px] font-medium leading-[100%] text-center'>
          Explore by Category
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">

          {categories.map((category) => (
            <div
              key={category.id}
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
  )
}

export default Category

