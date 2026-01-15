import { Link } from "react-router-dom";

const Error404 = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center">
      {/* 404 Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 flex flex-col justify-center">
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
          <Link
            to="/"
            className="px-8 py-3 bg-teal-800 text-white font-semibold rounded-lg hover:bg-teal-900 transition-colors shadow-md hover:shadow-lg inline-block"
          >
            Go to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error404;
