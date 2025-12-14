import React from 'react';
import ProductItem from './ProductItem';


const OrderSummary = () => {
    // Mock products for the UI as per the image
    const products = [
        {
            id: 1,
            name: "Wingback Chair",
            color: "Light Brown",
            price: 320.00,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=200&auto=format&fit=crop"
        },
        {
            id: 2,
            name: "Wooden Sofa Chair",
            color: "Grey",
            price: 180.00,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?q=80&w=200&auto=format&fit=crop"
        },
        {
            id: 3,
            name: "Brown Bean Bag Chair",
            color: "Brown",
            price: 120.00,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=200&auto=format&fit=crop"
        },
         {
            id: 3,
            name: "Brown Bean Bag Chair",
            color: "Brown",
            price: 120.00,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=200&auto=format&fit=crop"
        }
    ];

    return (
        <div className="w-full">
            <h2 className="text-[32px] font-bold text-gray-800 mb-6">Order summary</h2>

            {/* Products List Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8 h-[400px] overflow-y-scroll">
                <div className="space-y-6">
                    {products.map((product) => (
                        <ProductItem product={product} />
                    ))}
                </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-gray-600 font-medium">
                    <span>Product total</span>
                    <span className="text-gray-900 font-bold">$680.00</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 font-medium border-b border-gray-200 pb-4">
                    <span>Discount</span>
                    <div className="flex items-center gap-1">
                        <span className="text-gray-900 font-bold">%6</span>
                        <span className="text-gray-400">($40.80)</span>
                    </div>
                </div>
                <div className="flex justify-between items-center text-gray-600 font-medium border-b border-gray-200 pb-4">
                    <span>Delivery fee</span>
                    <span className="text-gray-900 font-bold">Free</span>
                </div>
                <div className="flex justify-between items-center text-[#1A4D59] text-xl font-bold pt-2">
                    <span>Total</span>
                    <span>$639.20</span>
                </div>
            </div>

            {/* Order Button */}
            <button className="w-full bg-[#205457] text-white py-4 rounded-lg font-medium text-lg hover:bg-[#1a4447] transition-all shadow-sm">
                Order
            </button>
        </div>
    );
};

export default OrderSummary;