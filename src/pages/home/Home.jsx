import React from 'react'
import Hero from './components/Hero'
import Advantages from './components/Advantages'
import OurLatest  from './components/OurLatest'
import Deals from './components/Deals'
const Home = () => {
  return (
    <div>
      <Hero/>
      <Advantages/>
      <Deals/>
      <OurLatest/>
    </div>
  )
}

export default Home
