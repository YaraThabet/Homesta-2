import React from 'react'
import Hero from './components/Hero'
import Advantages from './components/Advantages'
import OurLatest  from './components/OurLatest'
import Deals from './components/Deals'
import Follow from './components/Follow'
import NewsLetter from './components/Newsletter'
const Home = () => {
  return (
    <div>
      <Hero/>
      <Advantages/>
      <Deals/>
      <OurLatest/>
      <Follow/>
      <NewsLetter/>
    </div>
  );
};

export default Home;
