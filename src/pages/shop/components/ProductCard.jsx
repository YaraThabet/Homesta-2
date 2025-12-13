import { ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
const ProductCard = ({ product }) => {
  return (

      <Link to={`/product/${product.id}`} className="group bg-card rounded-lg overflow-hidden border border-border/50 transition-all hover:shadow-md">
      <div className="relative aspect-square bg-muted/30 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discount && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#205457]  text-white text-[11px] font-medium rounded-full">
            {product.discount}% Off
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-medium text-foreground leading-tight">
            {product.name}
          </h3>
          <button className="p-1.5 hover:bg-muted rounded transition-colors flex-shrink-0">
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-xs text-price-original line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-rating text-rating fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-muted-foreground">{product.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;