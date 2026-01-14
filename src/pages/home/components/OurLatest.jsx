import React from "react";
import { useNavigate } from "react-router-dom";

const OurLatest = () => {
  const navigate = useNavigate();
  const blogs = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=300&fit=crop",
      date: "15 April 2025",
      title: "Homesta Trends 2024: What's Hot and What's Not",
      description:
        "Explore the latest interior design trends for 2024, from sustainable materials to bold color palettes that redefine modern living.",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=300&fit=crop",
      date: "10 March 2025",
      title: "Modern Interior Ideas for Your Living Space",
      description:
        "Transform your home with these modern interior ideas. Simple, elegant, and functional designs for every room.",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=300&fit=crop",
      date: "02 February 2025",
      title: "Top Furniture Styles Dominating This Year",
      description:
        "Discover the top furniture styles of the year, focusing on minimalism, comfort, and versatile pieces for any home.",
    },
  ];

  return (
    <div className="flex flex-col w-full px-4 md:px-10 lg:px-20 gap-16">

      {/* Header */}
      <div className="flex flex-col md:flex-row w-full mt-20 justify-between items-center gap-6">
        <div className="max-w-[400px] text-center md:text-left">
          <p className="font-outfit font-medium text-[36px] md:text-[42px]">
            Our Latest{" "}
            <span className="text-[#205457]">News & Blogs</span>
          </p>
        </div>

        <button
          onClick={() => navigate('/blogs')}
          className="bg-[#205457] rounded-3xl text-white px-8 py-3 hover:bg-[#1a4447] transition-colors active:scale-95 shadow-md"
        >
          View All Blogs
        </button>
      </div>

      {/* Blogs Grid */}
      <div className="grid w-full gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((item) => (
          <article
            key={item.id}
            className="group cursor-pointer flex flex-col"
            onClick={() => navigate('/blogs')}
          >
            {/* Image Container */}
            <div className="relative overflow-hidden rounded-2xl mb-6 aspect-[4/3] shadow-md">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                <span className="bg-[#205457] text-white px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap shadow-xl transform transition-transform group-hover:scale-105">
                  {item.date}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 gap-3">
              <h3 className="font-outfit font-semibold text-[22px] md:text-[24px] text-[#2D2D2D] leading-tight group-hover:text-[#205457] transition-colors line-clamp-2">
                {item.title}
              </h3>
              <p className="font-outfit font-normal text-[16px] text-[#4D4A4A] line-clamp-2">
                {item.description}
              </p>
              <div className="mt-auto">
                <span className="text-[16px] font-medium text-[#205457] underline hover:text-[#1a4447] transition-colors inline-flex items-center gap-2">
                  Read More
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default OurLatest;
