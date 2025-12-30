import React from "react";

const Error404 = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner */}
      <div className="bg-teal-800 text-white py-3 px-6 flex flex-col md:flex-row justify-between items-center text-sm gap-2">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <span>Call Us: +123-456-789</span>
          <span>
            Sign up and Get 25% OFF for your first order.{" "}
            <a href="#" className="underline hover:text-teal-200">
              Sign up now
            </a>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>English</span>
          <span>USD</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-[#205457] rounded flex items-center justify-center">
              <div className="w-4 h-4 bg-white/20 rounded-sm"></div>
            </div>
            <span className="text-xl font-bold text-gray-900">Homesta</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-700 hover:text-teal-700">
              Home
            </a>
            <a href="/shop" className="text-gray-700 hover:text-teal-700">
              Shop
            </a>
            <a href="/categories" className="text-gray-700 hover:text-teal-700">
              Categories
            </a>
            <a href="/about" className="text-gray-700 hover:text-teal-700">
              About Us
            </a>
            <a href="/contact" className="text-gray-700 hover:text-teal-700">
              Contact Us
            </a>
            <a href="/blog" className="text-gray-700 hover:text-teal-700">
              Blog
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-gray-700 hover:text-teal-700">🛒</button>
            <button className="text-gray-700 hover:text-teal-700">❤️</button>
            <button className="text-gray-700 hover:text-teal-700">👤</button>
          </div>
        </div>
      </nav>

      {/* 404 Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          {/* 404 Number with Image Fill */}
          <div className="text-center mb-8 relative">
            <h1
              className="text-[180px] md:text-[280px] font-bold leading-none tracking-tight select-none"
              style={{
                fontFamily: "Outfit, sans-serif",
                WebkitTextFillColor: "transparent",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                backgroundImage: "url(/img/error.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                textShadow: "0px 0px 0px rgba(0,0,0,0)",
              }}
            >
              404
            </h1>
          </div>

          {/* Error Message */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Oops! Page not Found
            </h2>
            <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
              The page you are looking for cannot be found. Take a break before
              trying again
            </p>
          </div>

          {/* Go to Home Button */}
          <a
            href="/"
            className="px-8 py-3 bg-teal-800 text-white font-semibold rounded-lg hover:bg-teal-900 transition-colors shadow-md hover:shadow-lg inline-block"
          >
            Go to Home Page
          </a>
        </div>
      </div>
    </div>
  );
};

export default Error404;
