import { Link } from "react-router-dom";

const TrackingHeader = () => {
  return (
    <header className="bg-[#F6F6F6] py-12">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">Tracking Order</h1>
        <nav className="text-sm text-gray-500">
          <Link to="/" className="hover:text-[#205457] transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#205457]">tracking order</span>
        </nav>
      </div>
    </header>
  );
};

export default TrackingHeader;