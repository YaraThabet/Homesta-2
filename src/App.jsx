import React, { lazy, Suspense, useMemo } from "react";
import { Routes, Route, useLocation, matchPath } from "react-router-dom";

import Navbar from "./layouts/Navbar";
import SellerNavbar from "./layouts/SellerNavbar.jsx";
import AdminNavbar from "./layouts/AdminNavbar.jsx";
import Footer from "./components/Footer.jsx";
import AIChatFloatButton from "./components/AIChatFloatButton.jsx";
import PageLoader from "./components/PageLoader";

// Lazy Loaded Pages
const Home = lazy(() => import("./pages/home/Home.jsx"));
const Category = lazy(() => import("./pages/Category.jsx"));
const Shop = lazy(() => import("./pages/shop/Shop"));
const Blogs = lazy(() => import("./pages/blogs/Blogs.jsx"));
const BlogDetail = lazy(() => import("./pages/blogs/BlogDetail.jsx"));
const Faqs = lazy(() => import("./pages/faqs/Faqs.jsx"));
const ProductDetail = lazy(() => import("./pages/shop/components/ProductDetail.jsx"));
const Checkout = lazy(() => import("./pages/checkout/Checkout.jsx"));
const Wishlist = lazy(() => import("./pages/account/Wishlist.jsx"));
const Account = lazy(() => import("./pages/account/Account"));
const PasswordManager = lazy(() => import("./pages/account/PasswordManager.jsx"));
const Collections = lazy(() => import("./pages/account/Collections.jsx"));
const HelpCenter = lazy(() => import("./pages/account/HelpCenter.jsx"));
const Orders = lazy(() => import("./pages/account/Orders.jsx"));
const ManageAddress = lazy(() => import("./pages/account/ManageAddress"));
const Payment = lazy(() => import("./pages/account/Payment.jsx"));
const MyReviews = lazy(() => import("./pages/account/MyReviews.jsx"));
const Dashboard = lazy(() => import("./pages/profile/Dashboard.jsx"));
const Analytics = lazy(() => import("./pages/analytics/Analytics.jsx"));
const Addproduct = lazy(() => import("./pages/addproduct/Addproduct.jsx"));
const Notifications = lazy(() => import("./pages/Notifications.jsx"));
const Chatai = lazy(() => import("./pages/chatai/Chatai.jsx"));
const AIChatApp = lazy(() => import("./pages/chatai/AIChatApp"));
const About = lazy(() => import("./pages/AboutUS/components/About.jsx"));
const ContactUs = lazy(() => import("./pages/AboutUS/components/ContactUS.jsx"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
const CustomerSupport = lazy(() => import("./pages/CustomerSupport"));
const SubCategory = lazy(() => import("./pages/SubCategory"));
const ShoppingCart = lazy(() => import("./pages/ShoppingCart.jsx"));
const SummaryOrder = lazy(() => import("./pages/summaryOrder/SummaryOrder.jsx"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess.jsx"));
const TrackingOrder = lazy(() => import("./pages/trackingOrder/TrackingOrder.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const VerifyCode = lazy(() => import("./pages/VerifyCode.jsx"));
const ForgetPassword = lazy(() => import("./pages/ForgetPassword.jsx"));
const AddPassword = lazy(() => import("./pages/AddPassword.jsx"));
const Error404 = lazy(() => import("./pages/Error404"));
const Privacy = lazy(() => import("./pages/Privacy.jsx"));

// Seller Pages
const CreateStore = lazy(() => import("./pages/CreateStore.jsx"));
const SellerHome = lazy(() => import("./pages/SellerHome.jsx"));
const Products = lazy(() => import("./pages/sellerproducts/Products.jsx"));
const EditProduct = lazy(() => import("./pages/addproduct/EditProduct.jsx"));
const StoreSettings = lazy(() => import("./pages/store/StoreSettings.jsx"));
const Reviews = lazy(() => import("./pages/sellerproducts/Reviews.jsx"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const AdminStores = lazy(() => import("./pages/admin/AdminStores.jsx"));
const AdminStoreDetails = lazy(() => import("./pages/admin/AdminStoreDetails.jsx"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts.jsx"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories.jsx"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics.jsx"));
const AdminNotifications = lazy(() => import("./pages/admin/AdminNotifications.jsx"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders.jsx"));
const SellerOrders = lazy(() => import("./pages/sellerproducts/SellerOrders.jsx"));
const StoreProducts = lazy(() => import("./pages/store/StoreProducts.jsx"));

const App = () => {
  const location = useLocation();

  const { isSellerPage, isAdminPage, shouldHideNavbar } = useMemo(() => {
    const seller =
      location.pathname.startsWith("/seller-home") ||
      location.pathname.startsWith("/addproduct") ||
      location.pathname.startsWith("/edit-product") ||
      location.pathname.startsWith("/seller-products") ||
      location.pathname.startsWith("/seller-orders") ||
      location.pathname.startsWith("/store-settings") ||
      location.pathname.startsWith("/seller-reviews") ||
      (location.pathname.startsWith("/analytics") &&
        !location.pathname.startsWith("/admin"));

    const admin = location.pathname.startsWith("/admin");

    const hide =
      location.pathname.startsWith("/create-store") ||
      location.pathname.startsWith("/chatai") ||
      location.pathname.startsWith("/ai-chat") ||
      location.pathname.startsWith("/login") ||
      location.pathname.startsWith("/signup") ||
      location.pathname.startsWith("/verify-code") ||
      location.pathname.startsWith("/forgot-password") ||
      location.pathname.startsWith("/reset-password") ||
      location.pathname.startsWith("/blogs/");

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
      "/payment",
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
      "/tracking-order/:id",
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
      "/admin/dashboard",
      "/admin/stores",
      "/admin/products",
      "/admin/categories",
      "/admin/analytics",
      "/admin/notifications",
      "/admin/orders",
      "/admin/store/:id",
      "/seller-orders",
    ];

    const isInvalid = !validRoutes.some((path) =>
      matchPath({ path, end: true }, location.pathname)
    );

    return {
      isSellerPage: seller,
      isAdminPage: admin,
      shouldHideNavbar: hide || isInvalid,
    };
  }, [location.pathname]);

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

      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
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
            <Route path="/payment" element={<Payment />} />
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
            <Route path="/tracking-order/:id?" element={<TrackingOrder />} />

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
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/store/:id" element={<StoreProducts />} />
            <Route path="/seller-orders" element={<SellerOrders />} />

            <Route path="*" element={<Error404 />} />
          </Routes>
        </Suspense>
      </main>

      {!shouldHideNavbar && !isSellerPage && <AIChatFloatButton />}
      {!shouldHideNavbar && !isSellerPage && !isAdminPage && <Footer />}
    </div>
  );
};

export default App;
