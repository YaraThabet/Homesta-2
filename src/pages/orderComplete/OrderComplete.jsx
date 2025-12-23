import React from "react";
import { BsCheck } from "react-icons/bs";
import { Link } from "react-router-dom";
import DetailsOrder from "./components/DetailsOrder";
import AdvantagesItems from "../../components/AdvantagesItems";

const OrderComplete = () => {
  return (
    <div className="bg-white min-h-screen font-[Outfit] mt-40">
      {/* Header */}
      <header className="bg-[#F6F6F6] py-12 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Order Completed
          </h1>
          <nav className="text-sm text-gray-400">
            <Link to="/" className="hover:text-[#1A4D59] transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Order Completed</span>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 max-w-[1140px]">
        {/* Success Message */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-[#1A4D59] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <BsCheck className="text-white text-4xl" />
          </div>
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">
            Your order is completed!
          </h2>
          <p className="text-gray-500 font-normal">
            Thank you. Your Order has been received.
          </p>
        </div>

        {/* Info Bar */}
        <div className="bg-[#F0F2F5] rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-12 w-full md:w-auto flex-1">
            <div>
              <p className="text-gray-400 text-sm mb-1">Order ID</p>
              <p className="font-medium text-gray-900">#SDGT1254FD</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Payment Method</p>
              <p className="font-medium text-gray-900">Paypal</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Transaction ID</p>
              <p className="font-medium text-gray-900">TR5425SFE</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">
                Estimated Delivery Date
              </p>
              <p className="font-medium text-gray-900">24 April 2024</p>
            </div>
          </div>
          <button className="bg-[#1A4D59] hover:bg-[#143d46] text-white px-8 py-3.5 rounded-full font-medium text-sm transition-colors whitespace-nowrap">
            Download Invoice
          </button>
        </div>

        <DetailsOrder />

        <div className="mb-24">
          <AdvantagesItems />
        </div>
      </div>
    </div>
  );
};

export default OrderComplete;
