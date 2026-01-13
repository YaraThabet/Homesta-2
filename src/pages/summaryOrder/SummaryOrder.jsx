import React, { useState, useEffect } from 'react';
import { MapPin, CreditCard } from 'lucide-react';
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

      // 1. Fetch Order details and all Products in parallel
      const [orderRes, productsRes] = await Promise.all([
        api.get(`Order/OrderDetails?orderId=${orderId}`),
        api.get('Product/GetAllProducts').catch(() => ({ data: [] }))
      ]);

      const order = orderRes.data;
      const products = productsRes.data || [];
      setOrderData(order);

      console.log('📦 Order items from API:', order.items);
      console.log('🏪 Products from API:', products);

      if (order.items) {
        // 2. Enrich order items with extra details from products catalog
        const enriched = order.items.map(item => {
          // Priority 1: Use productId from item response
          // Priority 2: Match product catalog by productId (if item has it)
          // Priority 3: Fallback match by name (if item lacks productId)
          const matchingProduct = item.productId
            ? products.find(p => (p.productId || p.id) == item.productId)
            : products.find(p => p.name?.toLowerCase().trim() === item.productName?.toLowerCase().trim());

          const finalProductId = item.productId || matchingProduct?.productId;
          const effectivePrice = item.finalUnitPrice ?? item.finalPrice ??
            (item.subTotal && item.quantity > 0 ? item.subTotal / item.quantity : item.unitPrice);

          const isDeleted = !products.some(p => (p.productId || p.id) == finalProductId);

          return {
            ...item,
            // Normalize for components
            name: item.name || item.productName,
            color: item.color || item.productColor,
            price: effectivePrice,
            originalPrice: item.originalUnitPrice || item.unitPrice || item.price,
            productId: finalProductId,
            effectivePrice: effectivePrice,
            maxQuantity: matchingProduct?.quantity ?? 100,
            // Try to get image from catalog first if available
            image: item.image || matchingProduct?.imagePath || matchingProduct?.image,
            isDeleted
          };
        });

        // 3. Keep all items, even if deleted from catalog
        const enrichedWithImages = [...enriched];

        // 4. Fetch images for items that have productId
        for (let i = 0; i < enrichedWithImages.length; i++) {
          const item = enrichedWithImages[i];
          if (!item.image && item.productId) {
            try {
              console.log(`🖼️ Fetching image for: ${item.productName} (ID: ${item.productId})`);
              const imgRes = await api.get(`/ProductImages/product/${item.productId}`);

              let url = null;
              if (imgRes.data?.images?.length) {
                url = imgRes.data.images[0].imageUrl;
              } else if (imgRes.data?.imageUrls?.length) {
                url = imgRes.data.imageUrls[0];
              }

              if (url) {
                const fullUrl = url.startsWith('http') ? url : `http://homefinish.runasp.net${url.startsWith('/') ? '' : '/'}${url}`;
                enrichedWithImages[i].image = fullUrl;
                console.log(`✅ Image loaded: ${fullUrl}`);
              }
            } catch (err) {
              console.log(`❌ Failed to load image for ${item.productName}:`, err.message);
            }
          }
        }

        setItems(enrichedWithImages);
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
    // Priority: originalUnitPrice (from new API), then unitPrice/price legacy
    const price = item.originalUnitPrice || item.unitPrice || item.price || 0;
    // If original price is 0 or less than effective price, treat effective price as original (no discount)
    const effectivePrice = item.effectivePrice ?? item.finalPrice ?? item.unitPrice ?? 0;
    const finalOriginal = (price > effectivePrice) ? price : effectivePrice;

    return sum + finalOriginal * (item.quantity || 0);
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
            {/* Shipping & Payment Info - Top of Left Column */}
            {orderData && (
              <>
                {/* Shipping Address Block */}
                <div className="bg-[#F8F9FD] rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <MapPin className="text-gray-900" size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 mb-1">Shipping Address</h3>
                      <div className="text-sm text-gray-500 font-medium">
                        {(orderData.firstName || orderData.lastName) && (
                          <p className="font-bold text-gray-900 mb-0.5">{orderData.firstName} {orderData.lastName}</p>
                        )}
                        <p>{orderData.address}</p>
                        <p>{orderData.city}, {orderData.country} {orderData.zipCode && `- ${orderData.zipCode}`}</p>
                        {orderData.phoneNumber && <p className="mt-1">{orderData.phoneNumber}</p>}
                        {orderData.email && <p>{orderData.email}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method Block */}
                <div className="bg-[#F8F9FD] rounded-xl p-6 flex flex-col justify-center">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <h3 className="text-base font-bold text-gray-900">Payment Method</h3>
                    </div>
                    <span className="text-sm font-medium text-gray-500">{orderData.paymentMethod || 'Cash on Delivery'}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-400 font-medium tracking-widest uppercase">
                    {orderData.status || 'Pending'}
                  </div>
                </div>
              </>
            )}

            {/* Order Items Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                Order Items <span className="text-gray-400 text-lg font-normal">({items.length})</span>
              </h2>

              <div className="space-y-4">
                {items.map((item) => {
                  const price = item.effectivePrice ?? item.finalPrice ?? item.unitPrice ?? 0;
                  const itemOriginalPrice = item.unitPrice || item.price || item.finalUnitPrice || 0;
                  const originalPrice = (itemOriginalPrice > price) ? itemOriginalPrice : 0;

                  return (
                    <div key={item.orderItemId} className="bg-white">
                      <OrderItem
                        image={getImageUrl(item.image)}
                        name={item.productName}
                        color={item.productColor}
                        maxQuantity={item.maxQuantity}
                        price={price}
                        originalPrice={originalPrice}
                        initialQuantity={item.quantity}
                        isDeleted={item.isDeleted}
                        onRemove={() => handleRemove(item.orderItemId)}
                        onQuantityChange={(qty) =>
                          handleQuantityChange(item.orderItemId, qty)
                        }
                      />
                    </div>
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
