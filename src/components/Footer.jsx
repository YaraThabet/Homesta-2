import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebook, FaPinterest } from "react-icons/fa";
import { AiFillTwitterCircle, AiFillInstagram } from "react-icons/ai";
import { FaYoutube } from "react-icons/fa6";
import { useAppContext } from "../context/AppContext";

const Footer = () => {
  const navigate = useNavigate();
  const { t } = useAppContext();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <footer className="w-full bg-[#205457] text-white">
      <div className="max-w-[1243px] mx-auto px-6 py-16 flex flex-col lg:flex-row gap-12">
        <div className="flex flex-col gap-6 max-w-[416px]">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => handleNavigation("/")}>
            <img
              src="/img/logo.jpg"
              alt="Homesta Logo"
              className="w-8 h-8 rounded-lg group-hover:scale-110 transition-transform"
            />
            <p className="font-outfit font-medium text-[32px] group-hover:text-white/80 transition-colors">Homesta</p>
          </div>

          <p className="font-outfit text-[16px] leading-[150%]">
            {t('footerDesc')}
          </p>

          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors">
              <FaFacebook size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors">
              <AiFillTwitterCircle size={24} />
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors">
              <FaPinterest size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors">
              <AiFillInstagram size={24} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors">
              <FaYoutube size={24} />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 flex-1">
          <div className="flex flex-col gap-4">
            <p className="font-outfit font-medium text-[20px]">{t('company')}</p>
            <button
              onClick={() => handleNavigation("/about")}
              className="font-outfit text-[18px] hover:underline text-left text-white"
            >
              {t('aboutUs')}
            </button>
            <button
              onClick={() => handleNavigation("/blogs")}
              className="font-outfit text-[18px] hover:underline text-left text-white"
            >
              {t('blog')}
            </button>
            <button
              onClick={() => handleNavigation("/contact")}
              className="font-outfit text-[18px] hover:underline text-left text-white"
            >
              {t('contactUs')}
            </button>
            <a href="#" className="font-outfit text-[18px] hover:underline text-white">
              {t('career')}
            </a>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-outfit font-medium text-[20px]">
              {t('customerServices')}
            </p>
            <button
              onClick={() => handleNavigation("/account")}
              className="font-outfit text-[18px] hover:underline text-left text-white"
            >
              {t('myAccount')}
            </button>
            <button
              onClick={() => handleNavigation("/track-order")}
              className="font-outfit text-[18px] hover:underline text-left text-white"
            >
              {t('trackOrder')}
            </button>
            <a href="#" className="font-outfit text-[18px] hover:underline text-white">
              {t('return')}
            </a>
            <button
              onClick={() => handleNavigation("/customer-support")}
              className="font-outfit text-[18px] hover:underline text-left text-white"
            >
              {t('faq')}
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-outfit font-medium text-[20px]">
              {t('ourInformation')}
            </p>
            <button
              onClick={() => handleNavigation("/privacy")}
              className="font-outfit text-[18px] hover:underline text-left text-white"
            >
              {t('privacy')}
            </button>
            <button
              onClick={() => handleNavigation("/privacy")}
              className="font-outfit text-[18px] hover:underline text-left text-white"
            >
              {t('termsCondition')}
            </button>
            <button
              onClick={() => handleNavigation("/privacy")}
              className="font-outfit text-[18px] hover:underline text-left text-white"
            >
              {t('returnPolicy')}
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-outfit font-medium text-[20px]">{t('contactInfo')}</p>
            <p className="font-outfit text-[18px]" dir="ltr">+123-456-789</p>
            <p className="font-outfit text-[18px]">support@homesta.com</p>
            <p className="font-outfit text-[18px]">
              8502 Preston Rd. Inglewood, Maine 98380
            </p>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#B19470] py-6 text-center">
        <p className="font-outfit text-[16px] text-white">
          Copyright © {new Date().getFullYear()} Homesta. {t('copyright')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
