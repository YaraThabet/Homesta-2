import React from 'react'
import Footer from './components/footer.jsx'
import Category from './pages/Category.jsx'
import { BrowserRouter, Routes ,Route } from 'react-router-dom'
const App = () => {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/Category" element={< Category/>} />
      </Routes>
    </BrowserRouter>
       <Footer/>

    </>
  )
}

export default App
