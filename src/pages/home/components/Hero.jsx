import { useNavigate } from "react-router-dom";
import { GiSofa } from "react-icons/gi";
import { FaArrowRightLong } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Hero = () => {
  const navigate = useNavigate();
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scale = 1 + offsetY * 0.0005;
  const yPos = offsetY * 0.3;

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 2, ease: "easeOut" }
    },
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden pt-16">
      {/* Animated Background */}
      <motion.div
        className="absolute w-full h-full bg-center bg-no-repeat bg-cover top-0 left-0"
        style={{
          backgroundImage: "url('/img/bg.webp')",
          y: yPos,
          scale: scale,
        }}
      />

      {/* Overlay */}
      <div className="absolute w-full h-full bg-black opacity-30 top-0 left-0" />

      {/* Hero Content - bottom left */}
      <motion.div
        className="absolute bottom-10 left-10 z-10 flex flex-col items-start gap-6 px-6 md:px-0"
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
      >
        {/* العنوان على سطرين */}
        <motion.div variants={fadeUpVariants}>
          <p className="font-[Outfit] font-bold text-[42px] md:text-[56px] text-white leading-tight text-left">
            <span className="block">Explore Our Modern</span>
            <span className="block">Furniture Collection</span>
          </p>
        </motion.div>

        <motion.div className="flex flex-col md:flex-row gap-4 mt-4" variants={fadeUpVariants}>
          <motion.button
            onClick={() => navigate('/shop')}
            className="flex justify-center items-center w-[207px] h-[52px] rounded-3xl px-4 py-2 gap-2 bg-[#89917D] text-white font-[Outfit] font-medium hover:scale-105 transition-transform duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(0,0,0,0.3)" }}
          >
            Shop Now <FaArrowRightLong />
          </motion.button>

          <motion.div
            onClick={() => navigate('/shop')}
            className="flex items-center font-[Outfit] font-medium text-[16px] text-white hover:underline cursor-pointer"
          >
            View All Products
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};



export default Hero;
