import React from "react";
import { FaStar } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
const Deals = () => {
  const deals = [
    {
      id: 1,
      category: "Chair",
      name: "Comfort Sofa Plus",
      price: "105$",
      oldPrice: "150$",
      discount: "30% Off",
      rating: 4.9,
      image: "/public/img/chair1.jpg",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
    },
    {
      id: 2,
      category: "Sofa",
      name: "Comfort Sofa Plus",
      price: " 220$",
      oldPrice: "310$",
      discount: "20% Off",
      rating: 4.7,
      image: "/img/chair2.png",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
    },
  ];
  const furnitureCards = [
  {
    id: 3,
    discount: "Flat 15% Discount",
    title: "Wood Chair Collection",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed",
    image: "/img/chair3.png",
    bgColor: "#E0DFDF"
  },
  {
    id: 4,
    discount: "Flat 20% Discount",
    title: "Modern Sofa Collection",
    description: "Discover our exclusive range of comfortable sofas",
    image: "/img/chair4.png",
    bgColor: "#205457"
  }
];
  return (
    <div className="w-full min-h-screen px-4 md:px-10 lg:px-20">
      <div className="flex flex-col lg:flex-row w-full gap-6 lg:gap-0 justify-between mx-5 mt-20">
        <div className="w-full lg:w-[310px] h-auto">
          <p className="font-[Outfit] font-medium text-[28px] md:text-[36px] lg:text-[40px] leading-[120%]">
            <span className="text-[#205457]">Deals</span> of the Day
          </p>
        </div>
        <div className="w-full lg:w-[436px] h-auto">
          <p className="font-[Outfit] font-normal text-[14px] md:text-[15px] lg:text-[16px] leading-[150%]">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam,
          </p>
        </div>
      </div>
      <div className="w-full h-[820] mx-5 my-15 ">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2  gap-6">
{deals.map((item) => (
  <div
    key={item.id}
    className="
      w-full h-auto p-4 border-zinc-500 rounded-2xl shadow-xl
      flex flex-col md:flex-row gap-6 md:gap-[50px]
    "
  >
    {/* الصورة */}
    <div
      className="
        w-full md:w-[304px]
        h-[250px] md:h-[374px]
        rounded-3xl shadow-2xl bg-cover bg-center
        flex flex-col
      "
      style={{ backgroundImage: `url(${item.image})` }}
    >
      <div className="flex items-center justify-center w-[96px] h-[39px] rounded-full bg-[#205457] m-4 px-4 py-2 shadow-md">
        <p className="font-outfit font-semibold text-[16px] text-white text-center">
          {item.discount}
        </p>
      </div>
    </div>

    {/* النص */}
    <div className="flex flex-col w-full md:w-[225px] gap-6">
      <div className="flex flex-col gap-2">
        <p className="font-outfit font-normal text-[18px] md:text-[20px]">
          {item.category}
        </p>
        <p className="font-outfit font-normal text-[18px] md:text-[20px]">
          {item.name}
        </p>
        <p className="font-outfit font-normal text-[16px] md:text-[18px]">
          {item.price}{" "}
          <span className="text-[#A4A7AE]">{item.oldPrice}</span>
        </p>
      </div>

      <div className="flex items-center gap-1">
        <FaStar className="w-5 h-5 text-[#FFCC00]" />
        <p className="font-outfit font-normal text-[16px]">
          {item.rating}
        </p>
      </div>

      <p className="font-outfit font-normal text-[16px] leading-[150%] text-[#4D4A4A]">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
      </p>

      <button className="flex items-center justify-center gap-2 w-full md:w-[207px] h-[52px] rounded-3xl bg-[#205457]">
        <span className="text-white font-outfit font-medium text-[18px]">
          Shop Now
        </span>
        <FaArrowRightLong className="text-white" />
      </button>
    </div>
  </div>
))}


          {
            furnitureCards.map((item)=>(
              <div key={item.id} className="w-full h-auto p-4 border-zinc-500 rounded-2xl shadow-xl gap-[50px] flex justify-between" style={{ backgroundColor: item.bgColor }}>
                <div className="flex flex-col w-[253px] h-[307px] gap-[24px] ">
                  <p className="w-[253px] h-[25px] font-outfit font-medium text-[20px] text-[#78797a] ">{item.discount}</p>
                  <p className="w-[253px] h-[106px] font-outfit font-medium text-[42px]  ">{item.title}</p>
                  <p className="w-[219px] h-[48px] font-outfit font-normal text-[16px] text-[#78797a] ">{item.description}</p>
                   <div className="flex flex-row w-[204px] h-[24px] gap-[8px]">
                  <button className=" flex justify-center w-[207px] h-[52px] rounded-3xl p-x[16px] py-[8px] gap-[8px] bg-[#B19470]">
                    <span className="flex text-white font-[Outfit] font-medium text-[18px] items-center">
                      Shop Now
                    </span>
                    <span className=" flex items-center text-white">
                      <FaArrowRightLong />
                    </span>
                  </button>
                </div>
                </div>
                <div className="w-[230px] h-[327px] ">
                  <img src={item.image} alt="chair"/>
                </div>

              </div>
            ))

          }

        </div>
      </div>
    </div>
  );
};

export default Deals;
