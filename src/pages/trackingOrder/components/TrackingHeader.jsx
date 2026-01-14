import { Link } from "react-router-dom";

const TrackingHeader = () => {
  return (
    <header className="bg-gray-50 py-10 sm:py-12 text-center border-b border-gray-100 font-outfit pt-[180px] sm:pt-[180px]">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 tracking-tight">Track Your Order</h1>
        <nav className="flex items-center justify-center text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-gray-400">
          <Link to="/" className="hover:text-[#205457] transition-all hover:scale-105">
            Home
          </Link>
          <span className="mx-3 opacity-30">/</span>
          <span className="text-[#205457]">Order Tracking</span>
        </nav>
      </div>
    </header>
  );
};

export default TrackingHeader;