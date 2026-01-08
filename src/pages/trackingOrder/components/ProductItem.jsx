import React from "react";

const ProductItem = ({ product }) => {
    return (
        <div className="flex justify-between items-center border-b border-gray-50 last:border-0 pb-6 mb-6 last:pb-0 last:mb-0 group cursor-default font-outfit">
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 group-hover:scale-105 transition-transform duration-500">
                    <img
                        src={product.image || 'https://via.placeholder.com/100?text=Product'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/100?text=Product'}
                    />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#205457] transition-colors">{product.name}</h3>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="px-2.5 py-0.5 bg-gray-50 border border-gray-100 text-[10px] font-black text-gray-400 rounded-lg uppercase tracking-widest leading-none">
                            {product.color || 'Standard'}
                        </span>
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                            Qty: {product.quantity}
                        </span>
                    </div>
                </div>
            </div>

            <div className="text-right">
                <p className="text-lg font-black text-[#205457]">${(product.price * product.quantity).toLocaleString()}</p>
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1">${product.price} / unit</p>
            </div>
        </div>
    );
};

export default ProductItem;