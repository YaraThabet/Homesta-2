import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Footer from './components/footer.jsx';
import Navbar from "./layouts/Navbar";
import Category from './pages/Category.jsx';
import Account from './pages/account/Account';
import Home from './pages/home/Home.jsx'
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import ForgetPassword from './pages/ForgetPassword.jsx';
import AddPassword from './pages/AddPassword.jsx';
import VerifyCode from './pages/VerifyCode.jsx';

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/category" element={<Category />} />
          <Route path="/account" element={<Account />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/add-password" element={<AddPassword />} />
          <Route path="/verify-code" element={<VerifyCode />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
