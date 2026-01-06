import React from "react";
import { Routes, Route, useLocation, matchPath } from "react-router-dom";

import Navbar from "./layouts/Navbar";
import SellerNavbar from "./layouts/SellerNavbar.jsx";
import AdminNavbar from "./layouts/AdminNavbar.jsx";
import Footer from "./components/Footer.jsx";
import AIChatFloatButton from "./components/AIChatFloatButton.jsx";

// Pages
import Home from "./pages/home/Home.jsx";
import Category from "./pages/Category.jsx";
import Shop from "./pages/shop/Shop";
import Blogs from "./pages/blogs/Blogs.jsx";
import BlogDetail from "./pages/blogs/BlogDetail.jsx";
import Faqs from "./pages/faqs/Faqs.jsx";
import ProductDetail from "./pages/shop/components/ProductDetail.jsx";
import Checkout from "./pages/checkout/Checkout.jsx";
import Wishlist from "./pages/account/Wishlist.jsx";
import Account from "./pages/account/Account";
import PasswordManager from "./pages/account/PasswordManager.jsx";
import Collections from "./pages/account/Collections.jsx";
import HelpCenter from "./pages/account/HelpCenter.jsx";
import Orders from "./pages/account/Orders.jsx";
import ManageAddress from "./pages/account/ManageAddress";
import Payment from "./pages/account/Payment.jsx";
import MyReviews from "./pages/account/MyReviews.jsx";
import Dashboard from "./pages/profile/Dashboard.jsx";
import Analytics from "./pages/analytics/Analytics.jsx";
import Addproduct from "./pages/addproduct/Addproduct.jsx";
import Notifications from "./pages/Notifications.jsx";
import Chatai from "./pages/chatai/Chatai.jsx";
import AIChatApp from "./pages/chatai/AIChatApp";
import About from "./pages/AboutUS/components/About.jsx";
import ContactUs from "./pages/AboutUS/components/ContactUS.jsx";
import TrackOrder from "./pages/TrackOrder";
import CustomerSupport from "./pages/CustomerSupport";
import SubCategory from "./pages/SubCategory";
import ShoppingCart from "./pages/ShoppingCart.jsx";
import SummaryOrder from "./pages/summaryOrder/SummaryOrder.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import TrackingOrder from "./pages/trackingOrder/TrackingOrder.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import VerifyCode from "./pages/VerifyCode.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";
import AddPassword from "./pages/AddPassword.jsx";
import Error404 from "./pages/Error404";
import Privacy from "./pages/Privacy.jsx";

// Seller Pages
import CreateStore from "./pages/CreateStore.jsx";
import SellerHome from "./pages/SellerHome.jsx";
import Products from "./pages/sellerproducts/Products.jsx";
import EditProduct from "./pages/addproduct/EditProduct.jsx";
import StoreSettings from "./pages/store/StoreSettings.jsx";
import Reviews from "./pages/sellerproducts/Reviews.jsx";
// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminStores from "./pages/admin/AdminStores.jsx";
import AdminStoreDetails from "./pages/admin/AdminStoreDetails.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminCategories from "./pages/admin/AdminCategories.jsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.jsx";
import AdminNotifications from "./pages/admin/AdminNotifications.jsx";
import StoreProducts from "./pages/store/StoreProducts.jsx";

const App = () => {
  const location = useLocation();

  const isSellerPage =
    location.pathname.startsWith("/seller-home") ||
    location.pathname.startsWith("/addproduct") ||
    location.pathname.startsWith("/edit-product") ||
    location.pathname.startsWith("/seller-products") ||
    location.pathname.startsWith("/store-settings") ||
    location.pathname.startsWith("/seller-reviews") ||
    (location.pathname.startsWith("/analytics") &&
      !location.pathname.startsWith("/admin"));

  const isAdminPage = location.pathname.startsWith("/admin");

  const hideLayout =
    location.pathname.startsWith("/create-store") ||
    location.pathname.startsWith("/chatai") ||
    location.pathname.startsWith("/ai-chat") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup") ||
    location.pathname.startsWith("/verify-code") ||
    location.pathname.startsWith("/forgot-password") ||
    location.pathname.startsWith("/reset-password");

  // Identification of valid routes to hide navbar on 404
  const validRoutes = [
    "/",
    "/notifications",
    "/category",
    "/category/:categoryId",
    "/shop",
    "/blogs",
    "/blogs/:id",
    "/faqs",
    "/product/:id",
    "/checkout",
    "/wishlist",
    "/shopping-cart",
    "/account",
    "/account/*",
    "/dashboard",
    "/analytics",
    "/addproduct",
    "/chatai",
    "/ai-chat",
    "/summary-order",
    "/order-success",
    "/tracking-order",
    "/about",
    "/contact",
    "/track-order",
    "/customer-support",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-code",
    "/create-store",
    "/seller-home",
    "/seller-products",
    "/edit-product/:id",
    "/store-settings",
    "/seller-reviews",
    "/privacy",
    // Admin Routes
    "/admin/dashboard",
    "/admin/stores",
    "/admin/products",
    "/admin/categories",
    "/admin/analytics",
    "/admin/notifications",
    "/admin/store/:id",
  ];

  const isInvalidPage = !validRoutes.some((path) =>
    matchPath({ path, end: true }, location.pathname)
  );

  const shouldHideNavbar = hideLayout || isInvalidPage;

  return (
    <div className="min-h-screen flex flex-col">
      {!shouldHideNavbar &&
        (isAdminPage ? (
          <AdminNavbar />
        ) : isSellerPage ? (
          <SellerNavbar />
        ) : (
          <Navbar />
        ))}

      {/* padding-top لتعويض Navbar fixed */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/category" element={<Category />} />
          <Route path="/category/:categoryId" element={<SubCategory />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/shopping-cart" element={<ShoppingCart />} />

          {/* Account */}
          <Route path="/account" element={<Account />}>
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="password" element={<PasswordManager />} />
            <Route path="collections" element={<Collections />} />
            <Route path="help-center" element={<HelpCenter />} />
            <Route path="orders" element={<Orders />} />
            <Route path="/account/ManageAddress" element={<ManageAddress />} />

            <Route path="payment" element={<Payment />} />
            <Route path="reviews" element={<MyReviews />} />
          </Route>

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/addproduct" element={<Addproduct />} />

          {/* AI */}
          <Route path="/chatai" element={<Chatai />} />
          <Route path="/ai-chat" element={<AIChatApp />} />

          {/* Orders */}
          <Route path="/summary-order" element={<SummaryOrder />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/tracking-order" element={<TrackingOrder />} />

          {/* Info */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/customer-support" element={<CustomerSupport />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<AddPassword />} />
          <Route path="/verify-code" element={<VerifyCode />} />

          {/* Seller Routes */}
          <Route path="/create-store" element={<CreateStore />} />
          <Route path="/seller-home" element={<SellerHome />} />
          <Route path="/seller-products" element={<Products />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/store-settings" element={<StoreSettings />} />
          <Route path="/seller-reviews" element={<Reviews />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/stores" element={<AdminStores />} />
          <Route path="/admin/store/:id" element={<AdminStoreDetails />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/store/:id" element={<StoreProducts />} />

          {/* 404 */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </main>

      {!shouldHideNavbar && !isSellerPage && <AIChatFloatButton />}
      {!shouldHideNavbar && !isSellerPage && !isAdminPage && <Footer />}
    </div>
  );
};

export default App;
