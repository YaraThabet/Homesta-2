import React from "react";

const OurLatest = () => {
  const blogs = [
    {
      id: 1,
      image: "/public/img/latest1.jpg",
      date: "15 April 2025",
      title: "Homesta Trends 2024: What's Hot and What's Not",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
      link: "#",
    },
    {
      id: 2,
      image: "/public/img/latest2.jpg",
      date: "10 March 2025",
      title: "Modern Interior Ideas for Your Living Space",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
      link: "#",
    },
    {
      id: 3,
      image: "/public/img/latest1.jpg",
      date: "02 February 2025",
      title: "Top Furniture Styles Dominating This Year",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
      link: "#",
    },
  ];

  return (
    <div className="flex flex-col w-full px-4 md:px-10 lg:px-20 gap-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row w-full mt-20 justify-between items-center gap-6">
        <div className="max-w-[300px] text-center md:text-left">
          <p className="font-outfit font-medium text-[36px] md:text-[42px]">
            Our Latest{" "}
            <span className="text-[#205457]">News & Blogs</span>
          </p>
        </div>

        <button className="bg-[#205457] rounded-3xl text-white px-6 py-3">
          View All Blogs
        </button>
      </div>

      {/* Blogs Grid */}
      <div className="grid w-full gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
        {blogs.map((item) => (
          <div
            key={item.id}
            className="flex flex-col w-full max-w-[416px] h-[449px] gap-4"
          >
            {/* Image */}
            <div
              className="relative w-full h-[273px] rounded-2xl bg-cover bg-center"
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[250px] h-[55px] flex items-center justify-center rounded-t-[25px] bg-[#205457]">
                <p className="font-outfit font-medium text-[18px] text-white">
                  {item.date}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-4">
              <p className="font-outfit font-medium text-[24px] md:text-[28px]">
                {item.title}
              </p>
              <p className="font-outfit font-normal text-[16px] text-[#4D4A4A]">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurLatest;
