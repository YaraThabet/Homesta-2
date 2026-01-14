import SafeImage from '../../../components/SafeImage';

const ProductItem = ({ product }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-50 last:border-0 pb-6 mb-6 last:pb-0 last:mb-0 group cursor-default font-outfit gap-4 sm:gap-0">
            <div className="flex items-center gap-4 sm:gap-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 group-hover:scale-105 transition-transform duration-500 shadow-sm">
                    <SafeImage
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        type="product"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg group-hover:text-[#205457] transition-colors line-clamp-2 md:line-clamp-none">
                        {product.name}
                        {product.isDeleted && (
                            <span className="ml-2 text-[7px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded uppercase font-black tracking-widest leading-none align-middle border border-red-100">
                                Removed
                            </span>
                        )}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2">
                        <span className="p-1 px-2 bg-gray-50 border border-gray-100 rounded-lg flex items-center gap-1.5" title={product.color}>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Color:</span>
                            <div
                                className="w-2.5 h-2.5 rounded-full border border-gray-100 shadow-sm"
                                style={{ backgroundColor: product.color || '#ccc' }}
                            />
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-300 font-bold uppercase tracking-widest bg-gray-50/50 px-2 py-1 rounded-lg">
                            Qty: {product.quantity}
                        </span>
                    </div>
                </div>
            </div>

            <div className="text-left sm:text-right pl-20 sm:pl-0">
                <p className="text-xl font-black text-[#205457] tracking-tighter">${(product.price * product.quantity).toLocaleString()}</p>
                <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-0.5">${product.price} / unit</p>
            </div>
        </div>
    );
};

export default ProductItem;