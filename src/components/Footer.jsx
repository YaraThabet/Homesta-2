import React from "react";
import { FaFacebook, FaPinterest } from "react-icons/fa";
import { AiFillTwitterCircle, AiFillInstagram } from "react-icons/ai";
import { FaYoutube } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="w-full bg-[#205457] text-white">
      <div className="max-w-[1243px] mx-auto px-6 py-16 flex flex-col lg:flex-row gap-12">
        <div className="flex flex-col gap-6 max-w-[416px]">
          <div className="flex items-center gap-2">
            <img
              src="/img/logo.jpg"
              alt="Homesta Logo"
              className="w-8 h-8 rounded-lg"
            />
            <p className="font-outfit font-medium text-[32px]">Homesta</p>
          </div>

          <p className="font-outfit text-[16px] leading-[150%]">
            Homesta helps you transform your home into your dream oasis by
            selecting, designing, and implementing furniture, decor, and smart
            solutions with professional expertise.
          </p>

          <div className="flex gap-4">
            <FaFacebook size={24} />
            <AiFillTwitterCircle size={24} />
            <FaPinterest size={24} />
            <AiFillInstagram size={24} />
            <FaYoutube size={24} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 flex-1">
          <div className="flex flex-col gap-4">
            <p className="font-outfit font-medium text-[20px]">Company</p>
            {["About Us", "Blog", "Contact Us", "Career"].map((item) => (
              <a
                key={item}
                href="#"
                className="font-outfit text-[18px] hover:underline"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-outfit font-medium text-[20px]">
              Customer Services
            </p>
            {["My Account", "Track Your Order", "Return", "FAQ"].map((item) => (
              <a
                key={item}
                href="#"
                className="font-outfit text-[18px] hover:underline"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-outfit font-medium text-[20px]">
              Our Information
            </p>
            {["Privacy", "User Terms & Condition", "Return Policy"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="font-outfit text-[18px] hover:underline"
                >
                  {item}
                </a>
              )
            )}
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-outfit font-medium text-[20px]">Contact Info</p>
            {[
              "+123-456-789",
              "maramahmed@gmail.com",
              "8502 Person Rd, Inglewood, Maine 98380",
            ].map((item) => (
              <p key={item} className="font-outfit text-[18px]">
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full bg-[#B19470] py-6 text-center">
        <p className="font-outfit text-[16px] text-[#43766C]">
          Copyright © 2025 Homesta. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
