import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import Navbar from "./layouts/Navbar";
import Category from './pages/Category.jsx';
import Account from './pages/account/Account';
import Shop from './pages/shop/Shop';
import Home from './pages/home/Home.jsx'
import Blogs from './pages/blogs/Blogs.jsx'
import Faqs from './pages/faqs/Faqs.jsx';
import Wishlist from './pages/account/Wishlist.jsx';
import Checkout from './pages/checkout/Checkout.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Analytics from './pages/analytics/Analytics.jsx';
import Addproduct from './pages/addproduct/Addproduct.jsx';
import Chatai from './pages/chatai/Chatai.jsx';
import Dashboard from './pages/profile/Dashboard.jsx';

import PasswordManager from './pages/account/PasswordManager.jsx'
const App = () => {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith('/chatai');

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/category" element={<Category />} />
          <Route path="/account" element={<Account />}>
            <Route index element={null} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="password" element={<PasswordManager />} />
          </Route>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />

          <Route path="/shop" element={<Shop />} />
          <Route path="/blogs" element={<Blogs />} />
           <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/addproduct" element={<Addproduct />} /> 
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chatai" element={<Chatai />}   />   
          
          
           </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
};

export default App;
