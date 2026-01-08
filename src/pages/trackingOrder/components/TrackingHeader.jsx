import { Link } from "react-router-dom";

const TrackingHeader = () => {
  return (
    <header className="bg-gray-50 py-12 text-center border-b border-gray-100 font-outfit">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 tracking-tight">Track Your Order</h1>
        <nav className="flex items-center justify-center text-xs font-black uppercase tracking-[0.2em] text-gray-400">
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