import React from 'react';
import { useAppContext } from '../../../context/AppContext';

export default function OrderSummaryCard({ subtotal, shipping, tax, total, onPlaceOrder }) {
  const { formatPrice, t } = useAppContext();

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-foreground mb-5">{t('orderSummary')}</h2>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('subtotal')}</span>
          <span className="text-foreground">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('shipping')}</span>
          <span className="text-foreground">{formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('tax')}</span>
          <span className="text-foreground">{formatPrice(tax)}</span>
        </div>
      </div>

      <div className="border-t border-border mt-4 pt-4">
        <div className="flex justify-between">
          <span className="font-semibold text-foreground">{t('total')}</span>
          <span className="font-semibold text-foreground">{formatPrice(total)}</span>
        </div>
      </div>

      <button
        onClick={onPlaceOrder}
        className="bg-[#5B8A8A] text-white w-full mt-5 py-3 rounded-lg font-medium hover:bg-[#4a7575] transition-colors"
      >
        {t('placeOrder')}
      </button>
    </div>
  );
}
