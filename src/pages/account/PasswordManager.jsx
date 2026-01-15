import React, { useState } from "react";
import AdvantagesItems from "../home/components/Advantages";
import { Eye, EyeOff } from "lucide-react";
import api from "../../lib/axios";
import { useAppContext } from "../../context/AppContext";

const PasswordManager = () => {
  const { showAlert } = useAppContext();
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validatePassword = (pass) => {
    const minLength = pass.length >= 7;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[@$!%*?&]/.test(pass);
    return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
  };

  const handleUpdate = async () => {
    setError('');

    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setError('All fields are required');
      return;
    }

    if (!validatePassword(passwords.new)) {
      setError('New password must be at least 7 characters long and include uppercase, lowercase, number, and special character (@$!%*?&).');
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setError('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      await api.put(`/User/${userId}/update-password`, {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });

      showAlert("Password updated successfully!", "success", "Success");
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      showAlert(err.response?.data?.message || "Failed to update password", "error", "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen gap-8 px-4 sm:px-6 lg:px-0">
      <div className="flex flex-col w-full max-w-[976px] gap-6 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-sm text-red-700 font-medium">
            {error}
          </div>
        )}

        {/* Current Password */}
        <div className="flex flex-col gap-2">
          <label className="font-outfit font-medium text-base text-gray-700">
            Current Password<span className="text-red-500">*</span>
          </label>

          <div className="flex items-center h-14 rounded-2xl border border-gray-200 px-4 bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#205457]/10 transition-all">
            <input
              type={showPassword.current ? "text" : "password"}
              placeholder="Enter current password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === ' ') e.preventDefault();
              }}
              className="w-full outline-none bg-transparent text-gray-900"
            />

            <button
              type="button"
              onClick={() => togglePassword("current")}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              {showPassword.current ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-[#205457] font-semibold hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="flex flex-col gap-2">
          <label className="font-outfit font-medium text-base text-gray-700">
            New Password<span className="text-red-500">*</span>
          </label>

          <div className="flex items-center h-14 rounded-2xl border border-gray-200 px-4 bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#205457]/10 transition-all">
            <input
              type={showPassword.new ? "text" : "password"}
              placeholder="Enter new strong password"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === ' ') e.preventDefault();
              }}
              className="w-full outline-none bg-transparent text-gray-900"
            />

            <button
              type="button"
              onClick={() => togglePassword("new")}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              {showPassword.new ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="flex flex-col gap-2">
          <label className="font-outfit font-medium text-base text-gray-700">
            Confirm New Password<span className="text-red-500">*</span>
          </label>

          <div className="flex items-center h-14 rounded-2xl border border-gray-200 px-4 bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#205457]/10 transition-all">
            <input
              type={showPassword.confirm ? "text" : "password"}
              placeholder="Confirm new password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === ' ') e.preventDefault();
              }}
              className="w-full outline-none bg-transparent text-gray-900"
            />

            <button
              type="button"
              onClick={() => togglePassword("confirm")}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              {showPassword.confirm ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="mt-4 w-full sm:w-fit px-12 py-4 bg-[#205457] text-white rounded-2xl font-bold hover:bg-[#1a4446] transition-all shadow-lg shadow-[#205457]/20 active:scale-95 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

      </div>

      <div className="mt-8">
        <AdvantagesItems />
      </div>
    </div>
  );
};

export default PasswordManager;
