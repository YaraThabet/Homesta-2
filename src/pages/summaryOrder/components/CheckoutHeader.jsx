import React from 'react';

export default function CheckoutHeader() {
  return (
    <div className="bg-header py-6 text-center">
      <h1 className="text-2xl font-semibold text-foreground">Check Out</h1>
      <nav className="text-sm text-muted-foreground mt-1">
        <span className="hover:text-foreground cursor-pointer">Home</span>
        <span className="mx-2">/</span>
        <span className="hover:text-foreground cursor-pointer">Shopping Cart</span>
        <span className="mx-2">/</span>
        <span className="text-foreground">Checkout</span>
      </nav>
    </div>
  );
}
