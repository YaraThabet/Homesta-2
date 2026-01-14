import { useNavigate } from "react-router-dom";
import { GiSofa } from "react-icons/gi";
import { FaArrowRightLong } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../context/AppContext";

const Hero = () => {
  const navigate = useNavigate();
  const [offsetY, setOffsetY] = useState(0);
  const { t } = useAppContext();

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
        className="absolute bottom-[10%] left-0 w-full md:w-auto md:left-10 md:bottom-20 z-10 flex flex-col items-start gap-4 md:gap-6 px-6 md:px-0"
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
      >
        {/* Title */}
        <motion.div variants={fadeUpVariants}>
          <p className="font-[Outfit] font-bold text-[32px] sm:text-[42px] md:text-[56px] text-white leading-tight text-left">
            <span className="block">{t('heroTitle')}</span>
            <span className="block">{t('heroSubtitle')}</span>
          </p>
          <p className="text-white text-lg max-w-lg mt-2 hidden sm:block">
            {t('heroDesc')}
          </p>
        </motion.div>

        <motion.div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto" variants={fadeUpVariants}>
          <motion.button
            onClick={() => navigate('/shop')}
            className="flex justify-center items-center w-full sm:w-[207px] h-[52px] rounded-3xl px-4 py-2 gap-2 bg-[#beaa8a] text-white font-[Outfit] font-medium hover:scale-105 transition-transform duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(0,0,0,0.3)" }}
          >
            {t('Shop Now')} <FaArrowRightLong className="rtl:rotate-180" />
          </motion.button>

          <motion.div
            onClick={() => navigate('/shop')}
            className="flex items-center justify-center sm:justify-start font-[Outfit] font-medium text-[16px] text-white hover:underline cursor-pointer py-2 sm:py-0"
          >
            {t('View All')}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};



export default Hero;
