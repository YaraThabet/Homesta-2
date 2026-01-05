import React, { useState } from "react";
import { MdOutgoingMail } from "react-icons/md";
import { useAppContext } from "../../../context/AppContext";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const { showAlert } = useAppContext();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      showAlert("Please enter your email address", "warning");
      return;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert("Please enter a valid email address", "error");
      return;
    }

    // Success state
    showAlert("Successfully subscribed! Check your email for your 20% discount code.", "success");
    setEmail("");
  };

  return (
    <div className="flex w-full py-20 justify-center items-center px-4">
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

        <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row items-center gap-4 w-full">

          <div className="flex items-center w-full md:w-[416px] h-[64px] px-4 border border-gray-300 rounded-[20px] focus-within:border-[#1F4D4F] transition-colors">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1F4D4F] mr-3">
              <MdOutgoingMail className="text-white" />
            </div>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email Address"
              className="w-full outline-none text-gray-700 text-base bg-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full md:w-auto h-[64px] px-10 rounded-[20px] bg-[#1F4D4F] text-white text-lg font-medium hover:bg-[#1a4447] transition-all active:scale-95 shadow-lg"
          >
            Subscribe
          </button>
        </form>

      </div>
    </div>
  );
};

export default NewsLetter;
