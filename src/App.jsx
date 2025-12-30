import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./layouts/Navbar";
import Footer from "./components/Footer.jsx";

// Pages
import Home from "./pages/home/Home.jsx";
import Category from "./pages/Category.jsx";
import Shop from "./pages/shop/Shop";
import Blogs from "./pages/blogs/Blogs.jsx";
import Faqs from "./pages/faqs/Faqs.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Checkout from "./pages/checkout/Checkout.jsx";
import Wishlist from "./pages/account/Wishlist.jsx";
import Account from "./pages/account/Account";
import PasswordManager from "./pages/account/PasswordManager.jsx";
import Dashboard from "./pages/profile/Dashboard.jsx";
import Analytics from "./pages/analytics/Analytics.jsx";
import Addproduct from "./pages/addproduct/Addproduct.jsx";
import Chatai from "./pages/chatai/Chatai.jsx";
import AIChatApp from "./pages/AIChatApp";

import About from "./pages/AboutUS/components/About.jsx";
import ContactUs from "./pages/AboutUS/components/ContactUS.jsx";
import TrackOrder from "./pages/TrackOrder";
import CustomerSupport from "./pages/CustomerSupport";
import Electronic from "./pages/Electronic";
import Error404 from "./pages/Error404";

const App = () => {
  const location = useLocation();

  const hideLayout =
    location.pathname.startsWith("/chatai") ||
    location.pathname.startsWith("/ai-chat");

  return (
    <div className="min-h-screen flex flex-col">
      {!hideLayout && <Navbar />}

      <main className="flex-1  ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category" element={<Category />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />

          {/* Account */}
          <Route path="/account" element={<Account />}>
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="password" element={<PasswordManager />} />
          </Route>

          {/* Dashboard & Tools */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/addproduct" element={<Addproduct />} />

          {/* AI */}
          <Route path="/chatai" element={<Chatai />} />
          <Route path="/ai-chat" element={<AIChatApp />} />

          {/* Info Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/customer-support" element={<CustomerSupport />} />
          <Route path="/electronic" element={<Electronic />} />

          {/* 404 */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
};

export default App;
