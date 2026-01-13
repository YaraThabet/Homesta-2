import React from 'react'
import { useState } from 'react';

const Follow = () => {

  const images = [
    "/img/follow1.png",
    "/img/follow2.jpg",
    "/img/follow3.jpg",
    "/img/follow4.jpg",
    "/img/furniture.jpeg",
    "/img/kitchen.jpg",
    "/img/kitchen.jpg",
    "/img/item1.png",
    "/img/item3.png",
  ];

  const imagesPerSlide = 3;
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [];
  for (let i = 0; i < images.length; i += imagesPerSlide) {
    slides.push(images.slice(i, i + imagesPerSlide));
  }

  return (
    <div className='w-full min-h-screen py-8 md:py-15 flex items-center justify-center px-4'>
      <div className='flex w-full max-w-[1208px] min-h-[600px] md:h-[789px] rounded-2xl bg-[#F1EFEF] shadow-2xl items-center justify-center'>
        <div className='flex flex-col w-full max-w-[1000px] px-4 md:px-0 my-auto gap-6 md:gap-[48px] py-8'>

          <div className='w-full max-w-[427px] mx-auto'>
            <p className="font-outfit font-medium text-[30px] text-center">
              Follow <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className='text-[#205457] hover:underline cursor-pointer'>us on Instagram</a>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
            {slides[currentSlide].map((img, index) => (
              <div
                key={index}
                className="w-full sm:w-[200px] md:w-[260px] h-[250px] md:h-[300px]  rounded-3xl overflow-hidden relative cursor-pointer"
              >
                <img
                  src={img}
                  alt="img"
                  className="w-full h-full object-cover hover:scale-105 hover: transition-transform duration-300"
                />

              </div>
            ))}
          </div>

          <div className="flex gap-3 md:gap-4 justify-center">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-colors duration-300 ${currentSlide === index ? "bg-[#205457]" : "bg-gray-400"
                  }`}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Follow