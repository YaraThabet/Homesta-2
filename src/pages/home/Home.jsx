import React from 'react'
import Hero from './components/Hero'
import Advantages from './components/Advantages'
import OurProducts from './components/OurProducts'
import OurLatest  from './components/OurLatest'
import Deals from './components/Deals'
import Follow from './components/Follow'
import NewsLetter from './components/Newsletter'
import Sale from './components/Sale'
const Home = () => {
  return (
    <div>
      <Hero/>
      <Advantages/>
      <OurProducts/>
      <Sale/>
      <Deals/>
      <OurLatest/>
      <Follow/>
      <NewsLetter/>
    </div>
  );
};

export default Home;
