import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Sale = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00"
  });

  useEffect(() => {
    // Set target date to 4 days, 12 hours, 30 minutes from now for demonstration
    // Or set a specific end date
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 4);
    targetDate.setHours(targetDate.getHours() + 12);
    targetDate.setMinutes(targetDate.getMinutes() + 30);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({
          days: days < 10 ? `0${days}` : String(days),
          hours: hours < 10 ? `0${hours}` : String(hours),
          minutes: minutes < 10 ? `0${minutes}` : String(minutes),
          seconds: seconds < 10 ? `0${seconds}` : String(seconds)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timerItems = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ];

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
              {timerItems.map((item, index) => (
                <div key={index} className="text-center min-w-[80px]">
                  <p className="font-outfit font-medium text-3xl md:text-4xl tabular-nums">
                    {item.value}
                  </p>
                  <p className="font-outfit text-lg md:text-xl text-[#205457]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Button */}
            <button
              onClick={() => navigate('/shop')}
              className="flex items-center gap-3 bg-[#205457] text-white px-10 py-4 rounded-full hover:shadow-xl hover:shadow-[#205457]/20 transition-all font-bold active:scale-95"
            >
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

