import React from "react";

export default function Image() {
  return (
    <div className="relative w-full h-full min-h-[600px] rounded-[2rem] overflow-hidden">
      {/* Background Image */}
      <img
        src="/img/login.jpg"
        alt="Interior Design"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-black/10 flex flex-col justify-end p-8">
        {/* Glass Card */}
        <div className="bg-white/70 border border-white/30 rounded-3xl p-6 mb-8 text-white shadow-lg">
          <p className="text-base font-normal leading-relaxed mb-6 opacity-90 text-[#333]">
            “Lorem ipsum dolor sit amet consectetur. Pulvinar sit a eu
            pellentesque sagittis mattis. Semper ornare volutpat vitae donec at
            velit.”
          </p>

          <div className="flex flex-col">
            <span className="font-bold text-lg text-white">Maram Ahmed</span>
            <span className="text-sm opacity-80 text-[#333]">
              Interior Designer
            </span>
          </div>
        </div>

        {/* Render Carousel Indicators */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4].map((item, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                index === 3 ? "bg-[#205457]" : "bg-white/60"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
