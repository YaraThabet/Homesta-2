import React, { useState } from "react";
import AdvantagesItems from "../../components/AdvantagesItems";
import { Eye, EyeOff } from "lucide-react";

const PasswordManager = () => {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="flex flex-col w-full min-h-screen gap-8 px-4 sm:px-6 lg:px-0 justify-between">
      <div className="flex flex-col w-full max-w-[976px] gap-6">

        {/* Current Password */}
        <div className="flex flex-col gap-2">
          <label className="font-outfit font-medium text-base">
            Password<span className="text-red-500">*</span>
          </label>

          <div className="flex items-center h-14 rounded-2xl border-2 border-[#B3B3B3] px-4">
            <input
              type={showPassword.current ? "text" : "password"}
              placeholder="Enter Password"
              className="w-full outline-none bg-transparent"
            />

            <button
              type="button"
              onClick={() => togglePassword("current")}
              className="text-gray-400 hover:text-gray-600"
            >
              {showPassword.current ? <Eye /> :<EyeOff />  }
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-[#205457] underline"
            >
              Forgot Password?
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="flex flex-col gap-2">
          <label className="font-outfit font-medium text-base">
            New Password<span className="text-red-500">*</span>
          </label>

          <div className="flex items-center h-14 rounded-2xl border-2 border-[#B3B3B3] px-4">
            <input
              type={showPassword.new ? "text" : "password"}
              placeholder="Enter Password"
              className="w-full outline-none bg-transparent"
            />

            <button
              type="button"
              onClick={() => togglePassword("new")}
              className="text-gray-400 hover:text-gray-600"
            >
              {showPassword.new ? <Eye /> :<EyeOff /> }
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="flex flex-col gap-2">
          <label className="font-outfit font-medium text-base">
            Confirm New Password<span className="text-red-500">*</span>
          </label>

          <div className="flex items-center h-14 rounded-2xl border-2 border-[#B3B3B3] px-4">
            <input
              type={showPassword.confirm ? "text" : "password"}
              placeholder="Enter Password"
              className="w-full outline-none bg-transparent"
            />

            <button
              type="button"
              onClick={() => togglePassword("confirm")}
              className="text-gray-400 hover:text-gray-600"
            >
              {showPassword.confirm ? <Eye /> :<EyeOff />}
            </button>
          </div>
        </div>

        {/* Button */}
        <button className="mt-4 w-fit px-8 py-3 bg-[#205457] text-white rounded-full font-medium hover:opacity-90 transition">
          Update Password
        </button>

      </div>

      <AdvantagesItems />
    </div>
  );
};

export default PasswordManager;
