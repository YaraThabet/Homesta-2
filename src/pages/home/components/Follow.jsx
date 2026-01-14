import React, { useState, useEffect } from 'react';

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

  const [imagesPerSlide, setImagesPerSlide] = useState(3);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setImagesPerSlide(1);
      } else if (window.innerWidth < 1024) {
        setImagesPerSlide(2);
      } else {
        setImagesPerSlide(3);
      }
    };

    handleResize(); // Init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const slides = [];
  for (let i = 0; i < images.length; i += imagesPerSlide) {
    slides.push(images.slice(i, i + imagesPerSlide));
  }

  // Reset current slide if it becomes invalid after resize
  useEffect(() => {
    if (currentSlide >= slides.length) {
      setCurrentSlide(0);
    }
  }, [slides.length, currentSlide]);

  return (
    <div className='w-full py-16 md:py-24 flex items-center justify-center px-4'>
      <div className='flex w-full max-w-[1208px] rounded-2xl bg-[#F1EFEF] shadow-xl items-center justify-center'>
        <div className='flex flex-col w-full px-6 py-12 gap-8 md:gap-12'>

          <div className='w-full text-center'>
            <p className="font-outfit font-medium text-2xl md:text-3xl text-center">
              Follow <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className='text-[#205457] hover:underline cursor-pointer'>us on Instagram</a>
            </p>
          </div>

          <div className="flex justify-center items-center gap-4 md:gap-6 min-h-[300px]">
            {slides[currentSlide]?.map((img, index) => (
              <div
                key={index}
                className="w-full sm:w-[260px] h-[300px] rounded-3xl overflow-hidden relative cursor-pointer shadow-md"
              >
                <img
                  src={img}
                  alt="img"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? "bg-[#205457] w-6" : "bg-gray-300"
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