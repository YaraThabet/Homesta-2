import React, { useState } from "react";
import { Package, CreditCard, Headphones } from "lucide-react";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (orderId && email) {
      console.log("Tracking order:", orderId, email);
      alert(`Tracking Order ID: ${orderId} with Email: ${email}`);
    } else {
      alert("Please fill in both fields");
    }
  };

  const features = [
    {
      icon: <Package className="w-8 h-8" />,
      title: "Free Shipping",
      description: "Free shipping for order above $180",
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Flexible Payment",
      description: "Multiple secure payment options",
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "24x7 Support",
      description: "We support online all days.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Track Your Order
          </h1>
          <p className="text-gray-600">Home / Track Your Order</p>
        </div>

        {/* Track Order Form */}
        <div className="max-w-2xl mx-auto bg-gray-50 rounded-lg p-8 mb-16 shadow-sm">
          <p className="text-gray-700 mb-8 text-center leading-relaxed">
            To track your order please enter your Order ID in the box below and
            press the "Track Order" button. This was given to you on your
            receipt and in the confirmation email you should have received.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-900 font-semibold mb-2">
                Order ID *
              </label>
              <input
                type="text"
                placeholder="Enter Your Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-900 font-semibold mb-2">
                Billing Email *
              </label>
              <input
                type="email"
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent transition-all"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full md:w-auto px-10 py-3 bg-teal-800 text-white font-semibold rounded-lg hover:bg-teal-900 transition-colors shadow-md hover:shadow-lg"
            >
              Track Order
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              <div className="flex-shrink-0 w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
