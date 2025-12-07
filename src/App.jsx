import React from 'react'
import Footer from './components/footer.jsx'
import Navbar from "./layouts/Navbar"
import Category from './pages/Category.jsx'
import { Routes, Route } from 'react-router-dom'
const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/Category" element={< Category />} />
      </Routes>

      <Footer />

    </>
  )
}

export default App
