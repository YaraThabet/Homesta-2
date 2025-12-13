import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Minus, Plus } from "lucide-react";

const initialCartItems = [
  {
    id: 1,
    name: "Modern Chair",
    color: "Green",
    price: 110,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=400&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Air Conditioner",
    color: "Black",
    price: 200,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1625961332771-3f40b0e2bdcf?w=400&h=400&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Stoneware Bakers",
    color: "Brown",
    price: 50,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1603199506016-5f36e6d94f30?w=400&h=400&fit=crop&q=80",
  },
];

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(false);
  const navigate = useNavigate();

  const updateQuantity = (id, delta) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const applyCoupon = () => {
    if (couponCode.trim()) {
      setAppliedCoupon(true);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 0;
  const taxes = 0;
  const couponDiscount = appliedCoupon ? 100 : 0;
  const total = subtotal + shipping + taxes - couponDiscount;

  return (
    <div className="min-h-screen bg-background pl-4 pr-4 pt-[150px]">
      {/* Header */}
       <header className="bg-[#F6F6F6] py-12">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">Shopping Cart</h1>
        <nav className="text-sm text-gray-500">
          <Link to="/" className="hover:text-[#205457] transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#205457]">Shopping Cart</span>
        </nav>
      </div>
    </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            {/* Table Header */}
            <div className="bg-[#B19470] text-white rounded-full px-6 py-3 mb-6 flex items-center">
              <span className="flex-1 font-medium">Product</span>
              <span className="w-24 text-center font-medium">Price</span>
              <span className="w-32 text-center font-medium">Quantity</span>
              <span className="w-24 text-center font-medium">Subtotal</span>
            </div>

            {/* Cart Items List */}
            {cartItems.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Your cart is empty
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center py-6 border-b border-border"
                  >
                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-foreground mr-4"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Product Image */}
                    <div className="w-28 h-28 border border-border rounded-lg overflow-hidden bg-muted/30 mr-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.color ? `Color : ${item.color}` : `Select Color : ${item.color}`}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="w-24 text-center text-foreground">
                      ${item.price}
                    </div>

                    {/* Quantity */}
                    <div className="w-32 flex justify-center">
                      <div className="flex items-center border border-border rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-2 hover:bg-muted transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 min-w-[40px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-2 hover:bg-muted transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="w-24 text-center font-medium text-foreground">
                      ${item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Coupon and Clear Cart */}
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <input
                type="text"
                placeholder="Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-48 px-4 py-2 border border-border rounded-full bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={applyCoupon}
                className="bg-[#205457] hover:bg-[#205457]/90 text-white rounded-xl px-6 py-2 font-medium transition-colors"
              >
                Apply Coupon
              </button>
              <button
                onClick={clearCart}
                className="text-foreground underline hover:text-primary transition-colors "
              >
                Clear Shopping Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80">
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Order Summary
              </h2>
              <div className="border-t border-border pt-4 space-y-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Item</span>
                  <span>{cartItems.length}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Sub Total</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>${shipping.toString().padStart(2, '0')}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Taxes</span>
                  <span>${taxes.toString().padStart(2, '0')}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Coupon Discount</span>
                  <span>{couponDiscount > 0 ? `-$${couponDiscount}` : "$0"}</span>
                </div>
              </div>
              <div className="border-t border-border mt-4 pt-4">
                <div className="flex justify-between font-semibold text-foreground text-lg">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-6 bg-[#205457] hover:bg-[#205457]/90 text-white rounded-xl py-3 font-medium transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
