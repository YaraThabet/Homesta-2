const ProductItem = ({product}) => {
    return (
     <div className="flex justify-between items-center border-b border-gray-100 last:border-0 pb-6 last:pb-0">
        <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
            </div>
            <div>
            <h3 className="font-bold text-gray-800 text-lg">{product.name}</h3>
            <p className="text-gray-500 text-sm mt-1">Color: {product.color}</p>
            </div>
        </div>
        
        {/* Optional: You could add price or qty here if needed, but image didn't show it explicitly except for the 'form' hint */}
        <div className="hidden sm:block">
                {/* Placeholder for potential actions or price */}
        </div>
        </div>
    )
}

export default ProductItem;