import React from 'react';
import { useAppContext } from '../../../context/AppContext';

export default function OrderSummaryCard({ subtotal, discount, shipping, tax, total, onPlaceOrder, submitting }) {
  const { formatPrice, t } = useAppContext();

  return (
    <div className="bg-background border border-border rounded-xl p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">{t('orderSummary')}</h2>

      <div className="space-y-4 text-sm mt-6">
        <div className="flex justify-between text-muted-foreground font-medium">
          <span>{t('subtotal')}</span>
          <span className={`text-foreground font-bold ${discount > 0 ? 'line-through opacity-50' : ''}`}>
            {formatPrice(subtotal)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>{t('discount') || 'Discount'}</span>
            <span className="font-bold">-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-muted-foreground font-medium">
          <span>{t('shipping')}</span>
          <span className="text-foreground font-bold">{total > 500 ? 'Free' : formatPrice(shipping)}</span>
        </div>

        <div className="flex justify-between text-muted-foreground font-medium">
          <span>{t('tax')}</span>
          <span className="text-foreground font-bold">{formatPrice(tax)}</span>
        </div>

        <div className="border-t-2 border-dashed border-border pt-6 mt-6">
          <div className="flex justify-between items-end">
            <span className="text-muted-foreground font-bold mb-1">{t('total')}</span>
            <span className="text-3xl font-black text-[#205457] tracking-tight">{formatPrice(total)}</span>
          </div>
          <p className="text-xs text-gray-400 text-right mt-1 italic">Including Valid Tax</p>
        </div>
      </div>

      <button
        onClick={onPlaceOrder}
        disabled={submitting}
        className="w-full bg-[#205457] text-white py-4 rounded-xl mt-6 font-medium hover:bg-[#205457]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {t('processing') || 'Processing...'}
          </>
        ) : (
          t('placeOrder')
        )}
      </button>
    </div>
  );
}
