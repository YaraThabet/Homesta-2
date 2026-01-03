import React, { useState } from 'react';
import CheckoutHeader from './components/CheckoutHeader';
import CheckoutStepper from './components/CheckoutStepper';
import OrderItem from './components/OrderItem';
import OrderSummaryCard from './components/OrderSummaryCard';
import FeatureBar from './components/FeatureBar';
import { products } from '../../data/products';
import { Link, useNavigate } from 'react-router-dom';
import FooterBenefits from '../shop/components/FooterBenefits';
import { useAppContext } from '../../context/AppContext';
function LocationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

const initialItems = [
  { id: products[12].id, image: products[12].image, name: products[12].name, color: products[12].color, price: products[12].price },
  { id: products[6].id, image: products[6].image, name: products[6].name, color: products[6].color, price: products[6].price },
  { id: products[0].id, image: products[0].image, name: products[0].name, color: products[0].color, price: products[0].price },
  { id: products[10].id, image: products[10].image, name: products[10].name, color: products[10].color, price: products[10].price },
];

export default function Index() {
  const { t, formatPrice } = useAppContext();
  const navigate = useNavigate();
  const [items, setItems] = useState(initialItems);

  const handleRemove = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const shipping = 49.0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = () => {
    // Navigate to success page
    navigate('/order-success');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-background pt-[120px]">
      {/* Header */}
      <header className="bg-[#F6F6F6] py-14 text-center">
        <h1 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">{t('payment')}</h1>
        <nav className="text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground cursor-pointer">{t('home') || 'Home'}</Link>
          <span className="mx-1.5 text-muted-foreground/50">/</span>
          <Link to="/shopping-cart" className="hover:text-foreground cursor-pointer">{t('cart')}</Link>
          <span className="mx-1.5 text-muted-foreground/50">/</span>
          <Link to="/checkout" className="hover:text-foreground cursor-pointer">{t('shipping')}</Link>
          <span className="mx-1.5 text-muted-foreground/50">/</span>
          <Link to="/payment" className="hover:text-foreground cursor-pointer">{t('payment')}</Link>
          <span className="mx-1.5 text-muted-foreground/50">/</span>
          <span className="text-foreground font-medium">{t('checkout')}</span>
        </nav>
      </header>
      <CheckoutStepper currentStep={4} />

      <div className="container max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary Section */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">{t('orderSummary')}</h2>

              {/* Shipping Address */}
              <div className="bg-card border border-border rounded-lg p-6 mb-4">
                <h3 className="font-medium text-foreground mb-3">{t('shippingAddress')}</h3>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <LocationIcon />
                  <div>
                    <p className="text-foreground font-medium">Nasr</p>
                    <p className="text-sm">Giza, Egypt</p>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-medium text-foreground mb-3">{t('paymentMethod')}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Credit Card (Mastercard)</span>
                  <span className="text-muted-foreground text-sm">•••• 789-</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {t('orderItems')} ({items.length})
              </h2>
              <div className="bg-card border border-border rounded-lg p-6 max-h-[600px] overflow-y-auto">
                {items.map((item) => (
                  <OrderItem
                    key={item.id}
                    image={item.image}
                    name={item.name}
                    color={item.color}
                    price={item.price}
                    onRemove={() => handleRemove(item.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <OrderSummaryCard
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
                onPlaceOrder={handlePlaceOrder}
              />

              <div className="flex gap-3 mt-4">
                <Link to="/" className="bg-[#5B8A8A] text-white flex-1 text-sm py-2.5 rounded-lg font-medium hover:bg-[#4a7575] transition-colors text-center">
                  {t('chatWithSeller')}
                </Link>
                <Link to="/" className="border border-border text-foreground flex-1 text-sm py-2.5 rounded-lg font-medium hover:bg-muted transition-colors text-center">
                  {t('backToHome')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <FooterBenefits />
      </div>
    </div>
  );
}
