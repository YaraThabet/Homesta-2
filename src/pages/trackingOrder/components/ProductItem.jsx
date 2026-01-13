import SafeImage from '../../../components/SafeImage';

const ProductItem = ({ product }) => {
    return (
        <div className="flex justify-between items-center border-b border-gray-50 last:border-0 pb-6 mb-6 last:pb-0 last:mb-0 group cursor-default font-outfit">
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 group-hover:scale-105 transition-transform duration-500">
                    <SafeImage
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        type="product"
                    />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#205457] transition-colors">
                        {product.name}
                        {product.isDeleted && (
                            <span className="ml-2 text-[8px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded uppercase font-black tracking-widest leading-none align-middle border border-red-100">
                                Product Deleted
                            </span>
                        )}
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="p-1 px-2.5 bg-gray-50 border border-gray-100 rounded-lg flex items-center gap-1.5" title={product.color}>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Color:</span>
                            <div
                                className="w-3 h-3 rounded-full border border-gray-100 shadow-sm"
                                style={{ backgroundColor: product.color || '#ccc' }}
                            />
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