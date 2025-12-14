import React from "react";
import { MdOutgoingMail } from "react-icons/md";
const NewsLetter = () => {
  return (
    <div className="flex w-full min-h-screen justify-center items-center px-4">
      <div className="flex flex-col w-full max-w-[647px] gap-8">

        <div className="flex flex-col gap-4 text-center">
          <p className="font-outfit font-medium text-[28px] md:text-[42px]">
            Subscribe to Our Newsletter to Get{" "}
            <span className="text-[#205457]">
              Updates to Our Latest Collection
            </span>
          </p>

          <p className="font-outfit font-normal text-[16px] md:text-[20px] text-[#A4A7AE]">
            Get 20% off on your first order just by subscribing to our newsletter
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full">

          <div className="flex items-center w-full md:w-[416px] h-[64px] px-4 border border-gray-300 rounded-[20px]">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1F4D4F] mr-3">
                <MdOutgoingMail className="text-white" />
            </div>

            <input
              type="email"
              placeholder="Enter Email Address"
              className="w-full outline-none text-gray-500 text-base"
            />
          </div>

          <button className="w-full md:w-auto h-[64px] px-8 rounded-[20px] bg-[#1F4D4F] text-white text-lg font-medium">
            Subscribe
          </button>
        </div>

      </div>
    </div>
  );
};

export default NewsLetter;
