import React from "react";
import OrderStatus from "./components/OrderStatus";
import ProductItem from "./components/ProductItem";
import TrackingHeader from "./components/TrackingHeader";
import FooterBenefits from "../shop/components/FooterBenefits";

const products = [
  {
    id: 101,
    name: "Wingback Chair",
    color: "Light Brown",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=200&h=200&fit=crop",
  },
  {
    id: 102,
    name: "Wooden Sofa Chair",
    color: "Grey",
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=200&h=200&fit=crop",
  },
  {
    id: 103,
    name: "Bar Stool",
    color: "Brown",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=200&h=200&fit=crop",
  },
  {
    id: 104,
    name: "Brown Bean Bag Chair",
    color: "Brown",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=200&h=200&fit=crop",
  },
];

const TrackingOrder = () => {


  return (
    <div className="bg-white min-h-screen pb-10">

      <TrackingHeader />
      {/* Header Section */}
      <div className="bg-gray-50 py-10 text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Track Your Order</h1>
        <p className="text-sm text-gray-500 mt-2">Home / Track Your Order</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Order Info Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Order Status</h2>
          <p className="text-gray-500 mt-1">Order ID: #SDGT1254FD</p>
        </div>

        <OrderStatus />

        {/* Product List Section */}
        <div className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Products</h2>

          <div className="space-y-6">
            {products.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      <FooterBenefits />

    </div>
  );
};

export default TrackingOrder;