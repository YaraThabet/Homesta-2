import React, { useState, useEffect } from 'react';
import CheckoutStepper from './components/CheckoutStepper';
import OrderItem from './components/OrderItem';
import OrderSummaryCard from './components/OrderSummaryCard';
import { Link, useNavigate } from 'react-router-dom';
import FooterBenefits from '../shop/components/FooterBenefits';
import { useAppContext } from '../../context/AppContext';
import api from '../../lib/axios';
import PageLoader from '../../components/PageLoader';

function LocationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default function Index() {
  const { t, showAlert } = useAppContext();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const orderId = localStorage.getItem('currentOrderId');
      if (!orderId) return;

      // 1. Fetch both Order and Cart. 
      // We fetch Cart because it usually holds the "live" discounted finalPrice
      const [orderRes, cartRes] = await Promise.all([
        api.get(`Order/OrderDetails?orderId=${orderId}`),
        api.get('Cart').catch(() => ({ data: { cartItems: [] } }))
      ]);

      const order = orderRes.data;
      const cartItems = cartRes.data?.cartItems || [];
      setOrderData(order);

      if (order.items) {
        // 2. Enrich order items with Cart pricing if Order pricing is missing/wrong
        const enriched = order.items.map(item => {
          const cartItem = cartItems.find(ci => ci.productId === item.productId || ci.productID === item.productId);

          return {
            ...item,
            // Prefer order's finalPrice, but if missing or same as unitPrice, check cart
            effectivePrice: item.finalPrice || cartItem?.finalPrice || (item.subTotal && item.quantity > 0 ? item.subTotal / item.quantity : item.unitPrice)
          };
        });

        // 3. Fetch images
        for (let i = 0; i < enriched.length; i++) {
          const item = enriched[i];
          if (!item.image && item.productId) {
            try {
              const imgRes = await api.get(`/ProductImages/product/${item.productId}`);
              if (imgRes.data?.images?.length) {
                enriched[i].image = imgRes.data.images[0].imageUrl;
              }
            } catch { }
          }
        }

        setItems(enriched);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const handleRemove = async (orderItemId) => {
    try {
      await api.delete(`Order/item/${orderItemId}`);
      await fetchOrderDetails();
      showAlert('Item removed', 'success', 'Success');
    } catch {
      showAlert('Failed to remove item', 'error', 'Error');
    }
  };

  const handleQuantityChange = async (orderItemId, quantity) => {
    try {
      await api.put('Order/item/update', { orderItemId, quantity });
      await fetchOrderDetails();
    } catch {
      showAlert('Failed to update quantity', 'error', 'Error');
    }
  };

  // =========================
  // MANUAL PRICE CALCULATION
  // =========================

  const itemsSubtotal = items.reduce((sum, item) => {
    const price = item.effectivePrice ?? item.finalPrice ?? item.unitPrice ?? 0;
    return sum + price * item.quantity;
  }, 0);

  const originalSubtotal = items.reduce((sum, item) => {
    return sum + (item.unitPrice || 0) * (item.quantity || 0);
  }, 0);

  const shipping = orderData?.shipping || 0;
  const tax = orderData?.tax || 0;

  const total = itemsSubtotal + shipping + tax;
  const discount = Math.max(0, originalSubtotal - itemsSubtotal);

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `http://homefinish.runasp.net${url.startsWith('/') ? '' : '/'}${url}`;
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-background pt-[120px]">
      <header className="bg-[#F6F6F6] py-14 text-center">
        <h1 className="text-2xl font-semibold">{t('orderSummary') || 'Order Summary'}</h1>
      </header>

      <CheckoutStepper currentStep={4} />

      <div className="container max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {t('orderItems')} ({items.length})
              </h2>

              <div className="bg-card border rounded-lg p-6">
                {items.map((item) => {
                  const price = item.effectivePrice ?? item.finalPrice ?? item.unitPrice ?? 0;
                  const originalPrice =
                    (item.unitPrice && item.unitPrice > price)
                      ? item.unitPrice
                      : 0;

                  return (
                    <OrderItem
                      key={item.orderItemId}
                      image={getImageUrl(item.image)}
                      name={item.productName}
                      color={item.productColor}
                      price={price}
                      originalPrice={originalPrice}
                      initialQuantity={item.quantity}
                      onRemove={() => handleRemove(item.orderItemId)}
                      onQuantityChange={(qty) =>
                        handleQuantityChange(item.orderItemId, qty)
                      }
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <OrderSummaryCard
              subtotal={originalSubtotal}
              discount={discount}
              shipping={shipping}
              tax={tax}
              total={total}
              onPlaceOrder={async () => {
                try {
                  setSubmitting(true);
                  await api.post('Order/Create/Place', {
                    userId: localStorage.getItem('userId'),
                    orderId: Number(localStorage.getItem('currentOrderId'))
                  });
                  navigate('/order-success');
                } catch {
                  showAlert('Failed to place order', 'error', 'Error');
                } finally {
                  setSubmitting(false);
                }
              }}
              submitting={submitting}
            />
          </div>
        </div>
      </div>

      <FooterBenefits />
    </div>
  );
}
