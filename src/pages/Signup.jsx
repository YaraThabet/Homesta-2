import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import signupImg from '/signup-img.jpg';
import api from "../lib/axios";
import PageLoader from "../components/PageLoader";
import { Eye, EyeOff } from 'lucide-react';

const schema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(7, 'Password must be at least 7 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
  role: z.enum(['buyer', 'seller'], {
    required_error: "Please select a role",
  }),
  terms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions')
});

const Signup = () => {
  const navigate = useNavigate();
  const { showAlert, t } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, getValues, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError(null);

    try {
      // Determine selected role based on UI choice
      // Buyer -> ID "2", Name "User"
      // Seller -> ID "3", Name "Seller"
      const selectedRole = data.role === 'buyer'
        ? { id: "2", roleName: "User", isSelected: true }
        : { id: "3", roleName: "Seller", isSelected: true };

      // Format payload for Backend DTO
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        agreeTerms: data.terms,
        roles: [selectedRole] // Send ONLY the selected role
      };

      console.log("Registering with:", payload);

      // Call API
      const response = await api.post('Auth/register', payload);

      console.log("Signup Success:", response.data);

      // Show Success Alert
      const role = getValues('role');
      const msg = role === 'seller'
        ? "Registration successful! We will send you a confirmation email once the admin revises your application."
        : "Registration successful! We've sent a confirmation link to your email.";

      showAlert(msg, 'success', 'Welcome to Homesta!');
      navigate('/login');

    } catch (error) {
      console.error("Signup Failed:", error);
      const msg = error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        "Registration failed. Please try again.";
      setApiError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 xl:px-24 py-12 lg:py-20">
        <div className="max-w-md w-full mx-auto">
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
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600 mb-8">{t ? t('signUpOffer') : "Sign up and get 20% off your first order."}</p>

          {/* API Error Message */}
          {apiError && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0 text-red-500">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">
                    {apiError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                I want to join as a:
              </label>
              <div className="flex p-1 bg-gray-100 rounded-xl w-full">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    value="buyer"
                    {...register('role')}
                    className="hidden peer"
                    defaultChecked
                  />
                  <div className="py-2.5 text-center rounded-lg text-sm font-medium transition-all duration-300 peer-checked:bg-white peer-checked:text-[#205457] peer-checked:shadow-sm text-gray-500">
                    Buyer
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    value="seller"
                    {...register('role')}
                    className="hidden peer"
                  />
                  <div className="py-2.5 text-center rounded-lg text-sm font-medium transition-all duration-300 peer-checked:bg-white peer-checked:text-[#205457] peer-checked:shadow-sm text-gray-500">
                    Seller
                  </div>
                </label>
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600 font-medium">{errors.role.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  autoComplete="given-name"
                  {...register('firstName')}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  autoComplete="family-name"
                  {...register('lastName')}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                {...register('email')}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  {...register('password')}
                  onKeyDown={(e) => {
                    if (e.key === ' ') e.preventDefault();
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'
                    } pr-10`}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                {...register('terms')}
                className={`w-4 h-4 border rounded focus:ring-blue-500 ${errors.terms ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                Agree with <Link to="/privacy" className="text-[#205457] font-bold hover:underline">Terms & Condition</Link> and <Link to="/privacy" className="text-[#205457] font-bold hover:underline">Privacy Policy</Link>
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm text-red-600">{errors.terms.message}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#205457] text-white py-3 rounded-lg font-medium hover:bg-[#205457]/80 transition-colors"
            >
              Sign Up
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Continue With</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <button className="flex justify-center items-center py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </button>
              <button className="flex justify-center items-center py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button className="flex justify-center items-center py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" fill="#000" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-[#205457] hover:text-[#205457]/80 font-medium">
                Sign In
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* Right Column - Image with Overlay */}
      {/* Right Column - Image with Overlay */}
      <div className="hidden lg:block lg:w-1/2 relative p-4">
        <img
          src={signupImg}
          alt="Home appliances"
          className="w-[608px] h-[800px] object-cover rounded-[20px]"
        />

        {/* Transparent Glassmorphism Overlay */}
        <div className="
    absolute w-[90%] max-w-[500px] bottom-16 left-1/2 transform -translate-x-1/2
    bg-white/20 backdrop-blur-xl
    border border-white/30 shadow-xl
    rounded-[22px] p-10
    flex items-center justify-center
  ">
          <div className="text-center text-gray-900 space-y-4">
            <p className="text-lg font-light leading-relaxed">
              "Homesta has transformed how we shop for furniture. The quality is unmatched and the delivery was incredibly fast!"
            </p>

            <div className="space-y-1">
              <p className="text-sm font-semibold">Maram Ahmed</p>
              <p className="text-xs opacity-75">Interior Designer</p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <div className="w-8 h-1 bg-white rounded-full"></div>
          <div className="w-8 h-1 bg-white/50 rounded-full"></div>
          <div className="w-8 h-1 bg-white/50 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
