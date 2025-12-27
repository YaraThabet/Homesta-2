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
import About from "./pages/AboutUS/components/About.jsx";
import ContactUs from "./pages/AboutUS/components/ContactUS.jsx";
import TrackOrder from "./pages/TrackOrder";
import Error404 from "./pages/Error404";
import CustomerSupport from "./pages/CustomerSupport";
import SubCategory from "./pages/SubCategory";
import PasswordManager from "./pages/account/PasswordManager.jsx";
import AIChatApp from "./pages/AIChatApp";
import Notifications from "./pages/Notifications.jsx";
import HelpCenter from "./pages/account/HelpCenter.jsx";
import Orders from "./pages/account/Orders.jsx";
import Payment from "./pages/account/Payment.jsx";
import Collections from "./pages/account/Collections.jsx";
import ShoppingCart from "./pages/ShoppingCart.jsx";
import SummaryOrder from "./pages/summaryOrder/SummaryOrder.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import VerifyCode from "./pages/VerifyCode.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";
import AddPassword from "./pages/AddPassword.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import TrackingOrder from "./pages/trackingOrder/TrackingOrder";
import AIChatFloatButton from "./components/AIChatFloatButton.jsx";
const App = () => {
  const location = useLocation();
  const hideLayout =
    location.pathname.startsWith("/chatai") ||
    location.pathname.startsWith("/ai-chat") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup") ||
    location.pathname.startsWith("/verify-code") ||
    location.pathname.startsWith("/forget-password") ||
    location.pathname.startsWith("/add-password");
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
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/category" element={<Category />} />
          <Route path="/account" element={<Account />}>
            <Route index element={null} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="password" element={<PasswordManager />} />
            {/* <Route path="wishlist" element={<Wishlist />} /> */}
            <Route path="collections" element={<Collections />} />
            <Route path="help-center" element={<HelpCenter />} />
            <Route path="orders" element={<Orders />} />

            <Route path="payment" element={<Payment />} />
          </Route>
          <Route path="/payment" element={<Payment />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/addproduct" element={<Addproduct />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chatai" element={<Chatai />} />
          <Route path="/shopping-cart" element={<ShoppingCart />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/customer-support" element={<CustomerSupport />} />
          <Route path="/category/:categoryName" element={<SubCategory />} />
          <Route path="/ai-chat" element={<AIChatApp />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/new-password" element={<AddPassword />} />
          <Route path="/verify" element={<VerifyCode />} />
        
          <Route path="/summary-order" element={<SummaryOrder />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/add-password" element={<AddPassword />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/tracking-order" element={<TrackingOrder />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </main>
      {!hideLayout && <AIChatFloatButton />}
      {!hideLayout && <Footer />}
    </div>
  );
};

export default App;
