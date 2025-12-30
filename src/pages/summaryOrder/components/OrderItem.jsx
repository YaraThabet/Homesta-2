import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

export default function OrderItem({ image, name, color, price, initialQuantity = 1, onRemove, onQuantityChange }) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const { formatPrice, t } = useAppContext();

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      onQuantityChange && onQuantityChange(newQty);
    }
  };

  const handleIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    onQuantityChange && onQuantityChange(newQty);
  };

  return (
    <div className="flex items-center gap-4 py-5 border-b border-divider last:border-b-0">
      <div className="w-28 h-28 rounded-lg overflow-hidden bg-accent flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          <span className="font-medium text-foreground">{t('color') || 'Color'}:</span> {color}
        </p>

        <div className="flex items-center mt-3 border border-border rounded-full w-fit">
          <button
            onClick={handleDecrease}
            className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted transition-colors rounded-l-full"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center font-medium">{quantity}</span>
          <button
            onClick={handleIncrease}
            className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted transition-colors rounded-r-full"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={onRemove}
        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
        aria-label="Remove item"
      >
        <TrashIcon />
      </button>

      <div className="text-right min-w-[80px]">
        <span className="font-semibold text-foreground">{formatPrice(price)}</span>
      </div>
    </div>
  );
}
