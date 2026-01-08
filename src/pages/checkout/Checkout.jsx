import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import FooterBenefits from "../shop/components/FooterBenefits";
import CheckoutStepper from "../summaryOrder/components/CheckoutStepper";
import { useAppContext } from "../../context/AppContext";
import api from "../../lib/axios";

const Checkout = () => {
  const { formatPrice, t, showAlert } = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cartData, setCartData] = useState({ items: 0, subTotal: 0, total: 0 });

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('checkoutFormData');
    return saved ? JSON.parse(saved) : {
      firstName: "",
      lastName: "",
      companyName: "",
      country: "Egypt",
      streetAddress: "",
      city: "Cairo",
      state: "Cairo",
      zipCode: "",
      phone: "",
      email: localStorage.getItem('userEmail') || "",
      deliveryAddress: "same"
    };
  });

  useEffect(() => {
    localStorage.setItem('checkoutFormData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const res = await api.get('Cart');
        const items = res.data.cartItems || [];

        // Calculate original subtotal to show discount breakdown
        const originalSubtotal = items.reduce((acc, item) => acc + ((item.unitPrice || 0) * (item.quantity || 0)), 0);
        const currentSubtotal = res.data.subTotal || 0;
        const discount = originalSubtotal - currentSubtotal;

        setCartData({
          items: res.data.totalItems || 0,
          subTotal: currentSubtotal,
          originalSubtotal: originalSubtotal,
          discount: discount > 0 ? discount : 0,
          total: res.data.totalPrice || 0
        });
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!formData.firstName || !formData.lastName || !formData.streetAddress || !formData.phone || !formData.email) {
      showAlert("Please fill in all required fields.", "error", "Missing Information");
      return;
    }

    try {
      setSubmitting(true);
      const userId = localStorage.getItem('userId');

      const payload = {
        userId: userId,
        info: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          address: formData.streetAddress,
          phone: formData.phone,
          city: formData.city,
          country: formData.country,
          zipCode: formData.zipCode
        }
      };

      const res = await api.post('Order/shipping', payload);
      if (res.data) {
        // Robustly extract order ID whether it's a flat value or in an object
        const orderId = res.data.orderId || res.data.id || res.data;
        localStorage.setItem('currentOrderId', orderId.toString());
      }
      navigate("/payment");
    } catch (err) {
      console.error("Failed to save shipping info:", err);
      showAlert("Could not save shipping information. Please try again.", "error", "Error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-[150px] pl-4 pr-4">
      {/* Header */}
      <header className="bg-[#F6F6F6] py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Shipping</h1>
          <nav className="text-sm text-gray-500">
            <Link to="/" className="hover:text-[#205457] transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/shopping-cart" className="hover:text-[#205457] transition-colors">
              Shopping Cart
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#205457]">Shipping</span>
          </nav>
        </div>
      </header>

      {/* Checkout Stepper */}
      <CheckoutStepper currentStep={2} />

      {/* Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Billing Details Form */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-light text-primary mb-8">Billing Details</h2>

            <form className="space-y-6" onSubmit={handleProceedToPayment}>
              {/* Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    First Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Maram"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Last Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Elamly"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter Company Name"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Country<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-muted-foreground"
                  >
                    <option value="Egypt">Egypt</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="UAE">UAE</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Street Address<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="streetAddress"
                  required
                  value={formData.streetAddress}
                  onChange={handleChange}
                  placeholder="Enter Street Address"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  City<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter City"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  State<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter State"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Zip Code */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Zip Code<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="zipCode"
                  required
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="Enter Zip Code"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone<span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter Phone Number"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Delivery Address<span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 px-4 py-3 border border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="deliveryAddress"
                      value="same"
                      checked={formData.deliveryAddress === "same"}
                      onChange={handleChange}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm">Same as shipping address</span>
                  </label>
                  <label className="flex items-center gap-2 px-4 py-3 border border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="deliveryAddress"
                      value="different"
                      checked={formData.deliveryAddress === "different"}
                      onChange={handleChange}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm">Use a different billing address</span>
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-background border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Order Summary</h2>

              <div className="space-y-4 text-sm mt-6">
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Items</span>
                  <span className="text-foreground">{cartData.items}</span>
                </div>
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Sub Total</span>
                  <span className={`text-foreground font-bold ${cartData.discount > 0 ? 'line-through opacity-50' : ''}`}>
                    {formatPrice(cartData.originalSubtotal || cartData.subTotal)}
                  </span>
                </div>
                {cartData.discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount</span>
                    <span className="font-bold">-{formatPrice(cartData.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Shipping</span>
                  <span className="text-foreground font-bold">{cartData.subTotal > 500 ? 'Free' : formatPrice(0)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Taxes</span>
                  <span className="text-foreground font-bold">{formatPrice(0)}</span>
                </div>

                <div className="border-t-2 border-dashed border-border pt-6 mt-6">
                  <div className="flex justify-between items-end">
                    <span className="text-muted-foreground font-bold mb-1">Total</span>
                    <span className="text-3xl font-black text-[#205457] tracking-tight">{formatPrice(cartData.total)}</span>
                  </div>
                  <p className="text-xs text-gray-400 text-right mt-1 italic">Including Valid Tax</p>
                </div>
              </div>

              <button
                onClick={handleProceedToPayment}
                disabled={submitting || loading}
                className="w-full bg-[#205457] text-white py-4 rounded-xl mt-6 font-medium hover:bg-[#205457]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  "Proceed to Payment"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <FooterBenefits />
    </div>
  );
};

export default Checkout;
