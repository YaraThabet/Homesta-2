import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import api from "../lib/axios";
import PageLoader from "../components/PageLoader";
import forgetPassImg from '../assets/imges/forget-pass-img.jpg';

const schema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const AddPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, code } = location.state || {}; // Get email and code from previous steps

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError(null);

    if (!email || !code) {
      setApiError("Missing reset information. Please start over.");
      return;
    }

    try {
      console.log("Resetting password for:", email);
      await api.post('Auth/ResetPassword', {
        email: email,
        code: code,
        newPassword: data.password
      });

      setShowSuccessModal(true);

    } catch (error) {
      console.error("Reset Failed:", error);
      const msg = error.response?.data?.message || "Failed to reset password. Please try again.";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen font-sans relative">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Column - Add Password Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-16 py-10 bg-white order-2 lg:order-1">
          {/* Logo */}
          <div className="mb-6 mt-4 lg:mt-0">
            <Link to="/" className="inline-block group">
              <h1 className="text-3xl font-black text-[#205457] tracking-tighter hover:opacity-80 transition-all cursor-pointer">
                HOMESTA
              </h1>
              <div className="h-1 w-8 bg-[#B19470] rounded-full mt-1 group-hover:w-full transition-all duration-300"></div>
            </Link>
          </div>

          {/* Form Title */}
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">Add a new Password</h2>
          <p className="text-gray-600 text-base mb-8">The account has been recovered</p>

          {/* API Error Message */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-sm text-red-700 font-medium">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="max-w-md w-full mx-auto lg:mx-0">
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Password"
                  onKeyDown={(e) => {
                    if (e.key === ' ') e.preventDefault();
                  }}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg text-base transition-colors duration-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="Confirm Password"
                  onKeyDown={(e) => {
                    if (e.key === ' ') e.preventDefault();
                  }}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg text-base transition-colors duration-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" className="w-full py-4 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-colors duration-300 mb-6 hover:opacity-90" style={{ backgroundColor: '#205457' }}>
              Reset Password
            </button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Already have an account? <Link to="/login" className="font-semibold no-underline hover:underline" style={{ color: '#205457' }}>Sign In</Link>
          </div>
        </div>

        {/* Right Column - Background Image with Overlay */}
        <div className="hidden lg:flex w-1/2 relative bg-cover bg-center min-h-screen order-1 lg:order-2" style={{ backgroundImage: `url(${forgetPassImg})` }}>
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/40 flex flex-col justify-end p-12">
            <div className="w-[90%] max-w-[500px] mb-20 lg:mb-0">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <p className="text-white text-xl leading-relaxed mb-8 italic">
                  "Your account has been successfully recovered. Create a strong password to secure your account."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 border-3 border-white/30"></div>
                  <div>
                    <p className="text-white font-semibold m-0">Maram Ahmed</p>
                    <p className="text-white/80 text-sm m-0">Interior Designer</p>
                  </div>
                </div>
              </div>
            </div>
            <button className="absolute top-8 right-8 py-3 px-8 bg-white/20 text-white border border-white/30 rounded-3xl cursor-pointer text-sm backdrop-blur-md transition-all duration-300 hover:bg-white/30 hover:border-white/50">
              Skip
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center relative animate-fade-in-up">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Password Reset!</h3>
            <p className="text-gray-600 mb-6 font-medium">
              Your password has been successfully updated. You can now login with your new password.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-[#205457] hover:bg-[#1a4345] text-white rounded-lg font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Login Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default AddPassword;
