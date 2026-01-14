import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from "../lib/axios";
import PageLoader from "../components/PageLoader";
import forgetPassImg from '../assets/imges/forget-pass-img.jpg';

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError(null);

    try {
      console.log("Requesting password reset for:", data.email);
      await api.post('Auth/ForgetPassword', { email: data.email });

      // Navigate to Verify Code page, passing the email
      navigate('/verify-code', { state: { email: data.email } });

    } catch (error) {
      console.error("Reset Failed:", error);
      const msg = error.response?.data?.message || "Failed to send reset link. Please try again.";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen font-sans">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Column - Forget Password Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-16 lg:px-24 py-12 lg:py-20 bg-white order-2 lg:order-1">
          <div className="max-w-md w-full mx-auto lg:mx-0">
            {/* Logo */}
            <div className="mb-8 mt-4 lg:mt-0">
              <Link to="/" className="inline-block group">
                <h1 className="text-3xl font-black text-[#205457] tracking-tighter hover:opacity-80 transition-all cursor-pointer">
                  HOMESTA
                </h1>
                <div className="h-1 w-8 bg-[#B19470] rounded-full mt-1 group-hover:w-full transition-all duration-300"></div>
              </Link>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">Forget Password</h2>
            <p className="text-gray-600 text-base mb-8">Enter your email to reset password</p>

            {/* API Error Message */}
            {apiError && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
                <p className="text-sm text-red-700 font-medium">{apiError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  placeholder="Enter your registered email"
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#205457]/10 focus:border-[#205457] focus:bg-white"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#205457] text-white rounded-xl text-base font-bold shadow-lg shadow-[#205457]/20 hover:bg-[#205457]/90 active:scale-[0.98] transition-all duration-300"
              >
                Send Reset Link
              </button>
            </form>

            <div className="text-center relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gray-100"></div>
              </div>
              <span className="bg-white px-4 text-gray-400 text-xs uppercase tracking-widest relative">Or Continue With</span>
            </div>

            <div className="flex gap-4 mb-10">
              <button className="flex-1 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center group">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </button>
              <button className="flex-1 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center group">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button className="flex-1 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center group">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="#000" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.42-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.42C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Wait, I remember my password!{' '}
                <Link to="/login" className="text-[#205457] font-bold hover:underline transition-all">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Background Image with Overlay */}
      <div className="hidden lg:flex w-1/2 relative bg-cover bg-center min-h-screen order-1 lg:order-2" style={{ backgroundImage: `url(${forgetPassImg})` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/40 flex flex-col justify-end p-12">
          <div className="w-[90%] max-w-[500px] mb-20 lg:mb-0">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <p className="text-white text-xl leading-relaxed mb-8 italic">
                "Reset your password easily and get back to finding your dream home."
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
  );
};

export default ForgetPassword;
