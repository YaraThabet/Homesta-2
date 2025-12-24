import React from "react";

const Sale = () => {
  return (
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-4 md:px-16">

        <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-16 min-h-[420px]">

          {/* ===== Text Content ===== */}
          <div className="flex-1 flex flex-col justify-center items-center gap-14 text-center">

            {/* Title */}
            <div className="flex flex-col gap-2">
              <h2 className="font-outfit font-medium text-3xl md:text-4xl">
                Flash sale!
              </h2>
              <p className="font-outfit text-xl md:text-2xl text-[#4D4A4A]">
                Get 25% off - Limited Time Offer!
              </p>
            </div>

            {/* Timer */}
            <div className="flex justify-center gap-10 flex-wrap">
              {[
                { value: "04", label: "Days" },
                { value: "12", label: "Hours" },
                { value: "30", label: "Minutes" },
                { value: "45", label: "Seconds" },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <p className="font-outfit font-medium text-3xl md:text-4xl">
                    {item.value}
                  </p>
                  <p className="font-outfit text-lg md:text-xl text-[#205457]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Button */}
            <button className="flex items-center gap-3 bg-[#205457] text-white px-8 py-3 rounded-full hover:opacity-90 transition">
              Shop Now
            </button>
          </div>

          {/* ===== Image ===== */}
          <div className="flex-1 flex justify-center">
            <img
              src="/img/imgSale.jpg"
              alt="sale"
              className="w-full max-h-[360px] lg:max-h-[420px] object-cover rounded-3xl"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Sale;
