import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import Navbar from "./layouts/Navbar";
import Category from "./pages/Category.jsx";
import Account from "./pages/account/Account";
import Shop from "./pages/shop/Shop";
import Home from "./pages/home/Home.jsx";
import Blogs from "./pages/blogs/Blogs.jsx";
import Faqs from "./pages/faqs/Faqs.jsx";
import Wishlist from "./pages/account/Wishlist.jsx";
import Checkout from "./pages/checkout/Checkout.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Analytics from "./pages/analytics/Analytics.jsx";
import Addproduct from "./pages/addproduct/Addproduct.jsx";
import Chatai from "./pages/chatai/Chatai.jsx";
import About from "./pages/AboutUS/components/About.jsx";
import ContactUs from "./pages/AboutUS/components/ContactUS.jsx";
import TrackOrder from "./pages/TrackOrder";
import Error404 from "./pages/Error404";
import CustomerSupport from "./pages/CustomerSupport";
import Electronic from "./pages/Electronic";
import PasswordManager from "./pages/account/PasswordManager.jsx";
import AIChatApp from "./pages/AIChatApp";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgetPassword from "./pages/ForgetPassword";
import AddPassword from "./pages/AddPassword";
import VerifyCode from "./pages/VerifyCode";

const App = () => {
  const location = useLocation();
  const hideLayout =
    location.pathname.startsWith("/chatai") ||
    location.pathname.startsWith("/ai-chat") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup") ||
    location.pathname.startsWith("/forgot-password") ||
    location.pathname.startsWith("/new-password") ||
    location.pathname.startsWith("/verify");

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
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
          <Route path="/chatai" element={<Chatai />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/customer-support" element={<CustomerSupport />} />
          <Route path="/electronic" element={<Electronic />} />
          <Route path="/ai-chat" element={<AIChatApp />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/new-password" element={<AddPassword />} />
          <Route path="/verify" element={<VerifyCode />} />

          <Route path="*" element={<Error404 />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
};

export default App;
