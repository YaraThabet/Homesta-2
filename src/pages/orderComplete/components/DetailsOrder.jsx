import React from 'react';

const DetailsOrder = () => {
    const products = [
        {
            id: 1,
            name: "Wingback Chair",
            color: "Light Brown",
            price: 320.00,
            image: "/img/chair1.jpg" 
        },
        {
            id: 2,
            name: "Wooden Sofa Chair",
            color: "Grey",
            price: 180.00,
            image: "/img/chair2.png"
        },
        {
            id: 3,
            name: "Bar Stool",
            color: "Brown",
            price: 60.00,
            image: "/img/chair3.png"
        },
         {
            id: 4,
            name: "Brown Bean Bag Chair",
            color: "Brown",
            price: 180.00,
            image: "/img/chair4.png"
        }
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-16 shadow-[0px_2px_4px_rgba(0,0,0,0.02)]">
            <h2 className="text-2xl font-medium text-gray-900 mb-8 font-[Outfit]">Order Details</h2>
            
            <div className="flex justify-between items-center text-gray-900 border-b border-gray-100 pb-4 mb-6 font-semibold font-[Outfit]">
                <span>Product</span>
                <span>Sub Total</span>
            </div>

            <div className="space-y-8">
                {products.map(product => (
                    <div key={product.id} className="flex items-center justify-between border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                         <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-[#F4F5F7] rounded-xl overflow-hidden flex-shrink-0">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                            </div>
                            <div className="font-[Outfit]">
                                <h3 className="font-semibold text-gray-900 text-base mb-1">{product.name}</h3>
                                <p className="text-gray-400 text-sm">Color: {product.color}</p>
                            </div>
                         </div>
                         <span className="font-semibold text-gray-900 font-[Outfit]">${product.price.toFixed(2)}</span>
                    </div>
                ))}
            </div>

            {/* Totals Section */}
            <div className="mt-8 space-y-4 pt-6 border-t border-gray-100 font-[Outfit]">
                 <div className="flex justify-between items-center">
                     <span className="text-gray-900 font-semibold">Shipping</span>
                     <span className="text-gray-900 font-semibold">$00.00</span>
                 </div>
                 <div className="flex justify-between items-center">
                     <span className="text-gray-900 font-semibold">Taxes</span>
                     <span className="text-gray-900 font-semibold">$00.00</span>
                 </div>
                 <div className="flex justify-between items-center">
                     <span className="text-gray-900 font-semibold">Coupon Discount</span>
                     <span className="text-gray-900 font-semibold">-$100.00</span>
                 </div>
                 
                 <div className="flex justify-between items-center pt-6 border-t border-gray-100 mt-4">
                     <span className="text-gray-900 font-semibold text-lg">Total</span>
                     <span className="text-gray-900 font-bold text-lg">$640.00</span>
                 </div>
            </div>
        </div>
    );
};

export default DetailsOrder;