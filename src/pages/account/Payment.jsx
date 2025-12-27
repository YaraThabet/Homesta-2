import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CreditCard } from "lucide-react";
import CheckoutStepper from "../summaryOrder/components/CheckoutStepper";
import { useAppContext } from "../../context/AppContext";

const Payment = () => {
  const { formatPrice, t } = useAppContext();
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [cardData, setCardData] = useState({
    cardHolderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    saveCard: true
  });

  const orderSummary = {
    items: 9,
    subTotal: 740.00,
    shipping: 0.00,
    taxes: 0.00,
    couponDiscount: -100.00,
    total: 640.00
  };

  const handleCardChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCardData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const navigate = useNavigate();

  const handleConfirmPayment = () => {
    console.log("Payment confirmed:", { paymentMethod, cardData });
    navigate("/summary-order");
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
          <span className="text-foreground font-medium">{t('payment')}</span>
        </nav>
      </header>

      {/* Checkout Stepper */}
      <CheckoutStepper currentStep={3} />

      {/* Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-light text-primary mb-8">{t('selectPaymentMethod') || 'Select Payment Method'}</h2>

            {/* Payment Options */}
            <div className="space-y-4 mb-8">
              {/* PayPal */}
              <label className="flex items-center justify-between p-4 border border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 accent-primary"
                  />
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#003087] rounded flex items-center justify-center text-white text-xs font-bold">P</div>
                    <span className="text-foreground">Paypal</span>
                  </div>
                </div>
                <span className="text-primary text-sm cursor-pointer hover:underline">{t('linkAccount') || 'Link account'}</span>
              </label>

              {/* Google Pay */}
              <label className="flex items-center p-4 border border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="googlepay"
                    checked={paymentMethod === "googlepay"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 accent-primary"
                  />
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <span className="text-lg font-medium">
                        <span className="text-blue-500">G</span>
                      </span>
                    </div>
                    <span className="text-foreground">Google Pay</span>
                  </div>
                </div>
              </label>

              {/* Cash On Delivery */}
              <label className="flex items-center p-4 border border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 accent-primary"
                  />
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-muted rounded flex items-center justify-center">
                      <span className="text-xs">💵</span>
                    </div>
                    <span className="text-foreground">Cash On Delivery</span>
                  </div>
                </div>
              </label>
            </div>

            {/* Add New Card Section */}
            <div className="border-t border-border pt-6">
              <label className="flex items-center gap-3 mb-6">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 accent-primary"
                />
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  <span className="text-foreground">{t('addNewCard') || 'Add New Credit/ Debit Card'}</span>
                </div>
              </label>

              {/* Card Form */}
              <div className="space-y-6 pl-7">
                {/* Card Holder Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('cardHolderName') || 'Card Holder Name'}<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="cardHolderName"
                    value={cardData.cardHolderName}
                    onChange={handleCardChange}
                    placeholder="Maram Ahmed"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('cardNumber') || 'Card Number'}<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={cardData.cardNumber}
                    onChange={handleCardChange}
                    placeholder="7461 2796 8074"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                {/* Expiry Date and CVV */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('expiryDate') || 'Expiry Date'}<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={cardData.expiryDate}
                      onChange={handleCardChange}
                      placeholder="02/30"
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('cvv') || 'CVV'}<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={cardData.cvv}
                      onChange={handleCardChange}
                      placeholder="000"
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                {/* Save Card Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="saveCard"
                    checked={cardData.saveCard}
                    onChange={handleCardChange}
                    className="w-4 h-4 accent-primary rounded"
                  />
                  <span className="text-sm text-muted-foreground">{t('saveCard') || 'Save card for future payments'}</span>
                </label>

                {/* Add Card Button */}
                <button className="bg-[#205457] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#205457]/90 transition-colors">
                  {t('addCard') || 'Add Card'}
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-background border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">{t('orderSummary')}</h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('items')}</span>
                  <span className="text-foreground">{orderSummary.items}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('subtotal')}</span>
                  <span className="text-foreground">{formatPrice(orderSummary.subTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('shipping')}</span>
                  <span className="text-foreground">{formatPrice(orderSummary.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('tax')}</span>
                  <span className="text-foreground">{formatPrice(orderSummary.taxes)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('couponDiscount')}</span>
                  <span className="text-foreground">-{formatPrice(Math.abs(orderSummary.couponDiscount))}</span>
                </div>

                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex justify-between font-semibold">
                    <span className="text-foreground">{t('total')}</span>
                    <span className="text-foreground">{formatPrice(orderSummary.total)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConfirmPayment}
                className="w-full bg-[#205457] text-white py-4 rounded-xl mt-6 font-medium hover:bg-[#205457]/90 transition-colors"
              >
                {t('confirmPayment')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
