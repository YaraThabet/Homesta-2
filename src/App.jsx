import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import Navbar from "./layouts/Navbar";
import Category from './pages/Category.jsx';
import Account from './pages/account/Account';
import Shop from './pages/shop/Shop';

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/category" element={<Category />} />
          <Route path="/account" element={<Account />} />
          <Route path="/shop" element={<Shop />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
