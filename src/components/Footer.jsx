import React from "react";
import { FaFacebook } from "react-icons/fa";
import { AiFillTwitterCircle } from "react-icons/ai";
import { FaPinterest } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { FaYoutube } from "react-icons/fa6";

const footer = () => {
  return (
    <footer className="w-full bg-[#205457] text-white mt-auto">
      <div className="flex  w-[1243px] h-[202px] my-[72px] mx-auto gap-[32px] ">
        <div className="flex flex-col w-[416px] h-[202px] gap-[32px]">
          <div className="flex flex-row w-[170px] h-[40px] gap-[8px]">
            <img
              src="/public/img/logo.jpg"
              alt="homestaLogo"
              className="w-[32px] h-[32px] rounded-[10px] "
            />
            <p className="flex font-[Outfit] items-center font-medium text-[32px]  ">
              Homesta
            </p>
          </div>
          <div className="w-[416px] h-[72px]">
            <p className="flex font-[Outfit] items-center font-normal leading-[150%] text-[16px]">
              Homesta helps you transform your home into your dream oasis by
              selecting, designing, and implementing furniture, decor, and smart
              solutions with professional expertise.
            </p>
          </div>
          <div className="flex flex-row  w-[194px] h-[26px] gap-[16px]">
            <a href="#">
              <FaFacebook size={24} />
            </a>
            <a href="#">
              <AiFillTwitterCircle size={24} />
            </a>
            <a href="#">
              <FaPinterest size={24} />
            </a>
            <a href="#">
              <AiFillInstagram size={24} />
            </a>
            <a href="#">
              <FaYoutube size={24} />
            </a>
          </div>
        </div>

        <div className="flex w-[795px] h-[189px] gap-[48px] ">
          <div className="flex flex-col w-[88px] h-[189px] gap-[24px]">
            <p className="font-[Outfit] font-medium text-[20px] leading-[100%] tracking-[0%] ">
              Company
            </p>
            <div className="flex flex-col w-[88px] h-[140px] gap-[16px]">
              {["About Us", "Blog", "Contact Us", "Career"].map((item) => (
                <ul key={item}>
                  <li>
                    <a className=" font-outfit font-normal text-[18px] leading-[100%]">
                      {item}
                    </a>
                  </li>
                </ul>
              ))}
            </div>
          </div>
          <div className="flex flex-col w-[165px] h-[189px] gap-[24px]">
            <p className="font-[Outfit] font-medium text-[20px] leading-[100%] tracking-[0%] ">
              Customer Services
            </p>
            <div className="flex flex-col w-[137px] h-[140px] gap-[16px]">
              {["My Account", "Track Your Order", "Return", "FAQ"].map(
                (item) => (
                  <ul key={item}>
                    <li>
                      <a className=" font-outfit font-normal text-[18px] leading-[100%]">
                        {item}
                      </a>
                    </li>
                  </ul>
                )
              )}
            </div>
          </div>
          <div className="flex flex-col w-[186px] h-[189px] gap-[24px]">
            <p className="font-[Outfit] font-medium text-[20px] leading-[100%] tracking-[0%] ">
              Our Information
            </p>
            <div className="flex flex-col w-[186px] h-[101px] gap-[16px]">
              {["Privacy", "User Terms & Condition", "Return Policy"].map(
                (item) => (
                  <ul key={item}>
                    <li>
                      <a className=" font-outfit font-normal text-[18px] leading-[100%]">
                        {item}
                      </a>
                    </li>
                  </ul>
                )
              )}
            </div>
          </div>
          <div className="flex flex-col w-[212px] h-[189px] gap-[24px]">
            <p className="font-[Outfit] font-medium text-[20px] leading-[100%] tracking-[0%] ">
              Contact Info
            </p>
            <div className="flex flex-col w-[212px] h-[124px] gap-[16px]">
              {[
                "+123-456-789",
                "maramahmed@gmail.com",
                "8502 Person Rd,Inglewood,Maine 98380",
              ].map((item) => (
                <ul key={item}>
                  <li>
                    <a className=" font-outfit font-normal text-[18px] leading-[100%]">
                      {item}
                    </a>
                  </li>
                </ul>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[80px] bg-[#B19470] ">
        <div className=" flex w-[350px] h-full  mx-auto ">
          <div className="flex  items-center">
            <p className=" font-[Outfit] font-medium text-[16px] leading-[100%] tracking-[0%] text-[#43766C]">
              Copyright © 2025 Homesta. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default footer;
