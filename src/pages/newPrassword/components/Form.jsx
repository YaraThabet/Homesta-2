import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export default function Form() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <section className="flex flex-col justify-center min-h-screen w-full mx-auto px-4">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-12">
         {/* using w-10 h-10 or similar to control image size if needed, assuming generic sizing for now based on previous code */}
        <img src="/img/logo.jpg" alt="Homesta Logo" className="w-10 h-10 object-cover rounded-lg" />
        <h1 className="text-[#205457] text-3xl font-bold">Homesta</h1>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-2 text-black">Set New Password</h2>
        <p className="text-gray-400">Must be at least 8 character</p>
      </div>

      {/* Form */}
      <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
        {/* Password Field */}
        <div className="flex flex-col gap-2">
            <label className="font-medium text-black">Password<span className="text-red-500">*</span></label>
            <div className="relative">
                <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter Password"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 text-gray-700 outline-none focus:border-[#205457]"
                />
                <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    {showPassword ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />}
                </button>
            </div>
        </div>

        {/* Confirm Password Field */}
        <div className="flex flex-col gap-2">
            <label className="font-medium text-black">Confirm Password<span className="text-red-500">*</span></label>
            <div className="relative">
                <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Enter Password"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 text-gray-700 outline-none focus:border-[#205457]"
                />
                <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    {showConfirmPassword ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />}
                </button>
            </div>
        </div>

        {/* Submit Button */}
        <button className="bg-[#205457] text-white py-3.5 rounded-xl font-medium text-lg mt-4 hover:bg-[#1a4346] transition-colors">
            Reset Password
        </button>
      </form>
    </section>
  );
}