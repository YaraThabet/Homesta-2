import { useEffect } from "react";
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";
import FooterBenefits from "./shop/components/FooterBenefits";

const OrderSuccess = () => {
  useEffect(() => {
    // Trigger confetti on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen bg-background pt-[120px]">
      <div className="max-w-lg mx-auto px-4 py-16">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 bg-[#43766C] rounded-full flex items-center justify-center shadow-lg shadow-[#43766C]/20">
            <svg
              className="w-16 h-16 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-[#205457] text-center mb-3">
          Order Placed Successfully!
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          Your Order has been confirmed, it will be delivered soon.
        </p>

        {/* Order Details Card */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-muted-foreground">Order Number</span>
            <span className="font-semibold text-foreground">#46406</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-muted-foreground">Estimated Delivery</span>
            <span className="font-semibold text-[#B19470]">3-5 Business Days</span>
          </div>
        </div>

        {/* Emoji Icons */}
        <div className="flex justify-center gap-6 mb-8">
          <span className="text-3xl">🎉</span>
          <span className="text-3xl">📦</span>
          <span className="text-3xl">🚚</span>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full bg-[#205457] text-white text-center py-4 rounded-xl font-bold hover:bg-[#1a4446] transition-all duration-300 shadow-lg shadow-[#205457]/20"
          >
            Back to Home
          </Link>
          <button
            className="w-full bg-transparent border-2 border-[#205457] text-[#205457] py-4 rounded-xl font-bold hover:bg-[#205457] hover:text-white transition-all duration-300"
          >
            <Link to="/track-order">
              Track Order
            </Link>

          </button>
        </div>
      </div>

      {/* Feature Bar */}
      <FooterBenefits />
    </div>
  );
};

export default OrderSuccess;
