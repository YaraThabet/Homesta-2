import { BiMinus, BiPlus } from "react-icons/bi"
import { BsTrash2 } from "react-icons/bs"

const ProductItem = ({ product }) => {
return (
   <div className="flex gap-4">
    {/* Image */}
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
            <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover mix-blend-multiply"
            />
        </div>

        {/* Details */}
        <div className="flex-1 flex justify-between">
            <div className="space-y-1">
                <h3 className="font-semibold text-gray-900 leading-tight">{product.name}</h3>
                <p className="text-sm text-gray-400">Color: {product.color}</p>
                <p className="font-bold text-gray-900 mt-1">${product.price.toFixed(2)}</p>
            </div>

            {/* Quantity Control */}
            <form>
                 <div className="flex flex-col items-center justify-between w-8 bg-gray-50 rounded-lg border border-gray-100 py-1 h-[80px]">
                <button className="text-[#1A4D59] hover:bg-gray-200 rounded p-0.5 transition-colors">
                    <BiPlus  />
                </button>
                <input 
                    type="number" 
                    className="text-xs font-semibold text-gray-600 w-full text-center outline-none border-none bg-transparent appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" 
                    defaultValue={product.quantity} 
                />
                <button className="text-gray-400 hover:text-red-500 hover:bg-gray-200 rounded p-0.5 transition-colors">
                    {product.quantity === 1 ? <BsTrash2  /> : <BiMinus  />}
                </button>
            </div>
           </form>
        </div>
    </div>
    )
}

export default ProductItem