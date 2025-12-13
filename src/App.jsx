import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import Navbar from "./layouts/Navbar";
import Category from './pages/Category.jsx';
import Account from './pages/account/Account';
import Shop from './pages/shop/Shop';
import Home from './pages/home/Home.jsx'
import Blogs from './pages/blogs/Blogs.jsx'
import Wishlist from './pages/account/Wishlist.jsx';
import Checkout from './pages/checkout/Checkout.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import ShoppingCart from './pages/ShoppingCart.jsx';
import Payment from './pages/account/Payment.jsx';
const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category" element={<Category />} />
          <Route path="/account" element={<Account />}>
            <Route index element={null} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="payment" element={<Payment />} />
          </Route>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />

          <Route path="/shop" element={<Shop />} />
          <Route path="/blogs" element={<Blogs />} />
                    <Route path="/cart" element={<ShoppingCart />} />

           <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
