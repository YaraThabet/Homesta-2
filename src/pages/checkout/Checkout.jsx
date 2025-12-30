import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import FooterBenefits from "../shop/components/FooterBenefits";
import CheckoutStepper from "../summaryOrder/components/CheckoutStepper";

const Checkout = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    deliveryAddress: "same"
  });

  const orderSummary = {
    items: 9,
    subTotal: 740.00,
    shipping: 0.00,
    taxes: 0.00,
    couponDiscount: -100.00,
    total: 640.00
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

            <form className="space-y-6">
              {/* Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    First Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
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
                    <option value="">Select Country</option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="ca">Canada</option>
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
                <div className="relative">
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-muted-foreground"
                  >
                    <option value="">Select City</option>
                    <option value="ny">New York</option>
                    <option value="la">Los Angeles</option>
                    <option value="ch">Chicago</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  State<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-muted-foreground"
                  >
                    <option value="">Select State</option>
                    <option value="ny">New York</option>
                    <option value="ca">California</option>
                    <option value="tx">Texas</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Zip Code */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Zip Code<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="zipCode"
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
              <h2 className="text-xl font-semibold text-foreground mb-6">Order Summery</h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span className="text-foreground">{orderSummary.items}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sub Total</span>
                  <span className="text-foreground">${orderSummary.subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">${orderSummary.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes</span>
                  <span className="text-foreground">${orderSummary.taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Coupon Discount</span>
                  <span className="text-foreground">-${Math.abs(orderSummary.couponDiscount).toFixed(2)}</span>
                </div>

                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex justify-between font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">${orderSummary.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-[#205457] text-white py-4 rounded-xl mt-6 font-medium hover:bg-[#205457]/90 transition-colors">
                <Link to="/payment">
                  Proceed to Payment
                </Link>
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
