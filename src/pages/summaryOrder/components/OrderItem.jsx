import React, { useState, useEffect, useMemo } from 'react';
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

export default function OrderItem({
  image,
  name,
  color,
  price,
  originalPrice,
  initialQuantity = 1,
  onRemove,
  onQuantityChange,
}) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const { formatPrice, t } = useAppContext();

  /** ✅ Keep quantity in sync with backend refetch */
  useEffect(() => {
    setQuantity(Number(initialQuantity) || 1);
  }, [initialQuantity]);

  /** ✅ Safe numeric values */
  const unitPrice = useMemo(() => Number(price) || 0, [price]);
  const safeQuantity = useMemo(() => Number(quantity) || 0, [quantity]);

  /** ✅ Manual subtotal calculation */
  const subtotal = useMemo(
    () => unitPrice * safeQuantity,
    [unitPrice, safeQuantity]
  );

  const handleDecrease = () => {
    if (safeQuantity > 1) {
      const newQty = safeQuantity - 1;
      setQuantity(newQty);
      onQuantityChange?.(newQty);
    }
  };

  const handleIncrease = () => {
    const newQty = safeQuantity + 1;
    setQuantity(newQty);
    onQuantityChange?.(newQty);
  };

  return (
    <div className="group bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden mb-4">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Image */}
        <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden bg-[#F4F5F7] flex-shrink-0 relative group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-contain mix-blend-multiply p-2"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling?.classList.remove('hidden');
                e.target.nextSibling?.classList.add('flex');
              }}
            />
          ) : null}
          <div className={`${image ? 'hidden' : 'flex'} w-full h-full items-center justify-center text-gray-400 text-xs font-medium`}>
            No Image
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 w-full text-center md:text-left">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{name}</h3>
          <p className="text-sm text-gray-500 font-medium mb-1">
            {color ? (
              <span className="inline-flex items-center gap-1">
                {t('color') || 'Color'}:
                <span
                  className="w-3 h-3 rounded-full border border-gray-200 inline-block"
                  style={{ backgroundColor: color }}
                />
                {color}
              </span>
            ) : 'No options selected'}
          </p>
        </div>

        {/* Unit Price */}
        <div className="hidden md:block w-32 text-center">
          <div className="font-bold text-gray-900 text-lg tabular-nums">
            {formatPrice(unitPrice)}
          </div>
          {originalPrice > unitPrice && (
            <div className="text-xs text-gray-400 line-through tabular-nums">
              {formatPrice(originalPrice)}
            </div>
          )}
        </div>

        {/* Quantity */}
        <div className="w-full md:w-40 flex justify-center">
          <div className="inline-flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
            <button
              onClick={handleDecrease}
              disabled={safeQuantity <= 1}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm hover:text-[#205457] disabled:opacity-50 transition-all"
            >
              −
            </button>
            <span className="w-12 text-center font-black text-gray-900 tabular-nums">
              {safeQuantity}
            </span>
            <button
              onClick={handleIncrease}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm hover:text-[#205457] transition-all"
            >
              +
            </button>
          </div>
        </div>

        {/* Subtotal */}
        <div className="hidden md:block w-32 text-center font-black text-[#205457] text-lg tabular-nums">
          {formatPrice(subtotal)}
        </div>

        {/* Remove */}
        <button
          onClick={onRemove}
          className="w-10 h-10 rounded-full md:flex hidden items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <TrashIcon />
        </button>

        {/* Mobile */}
        <div className="w-full md:hidden pt-4 mt-2 border-t border-gray-100 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">{t('unitPrice') || 'Unit Price'}</span>
            <span className="font-bold">{formatPrice(unitPrice)}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-bold text-gray-500 text-sm">{t('total') || 'Total'}</span>
            <span className="font-black text-[#205457] text-xl">
              {formatPrice(subtotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
