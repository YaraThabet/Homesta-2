import React from 'react'
import Footer from './components/footer.jsx'
import Navbar from "./layouts/Navbar"
import Category from './pages/Category.jsx'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home/Home.jsx'
const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Home/>
      <Routes>
        <Route path="/Category" element={< Category />} />
      </Routes>

      <main className="flex-grow">
        <Routes>
          <Route path="/category" element={<Category />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
