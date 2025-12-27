import React from 'react';
import { Link } from 'react-router-dom';
import loginImg from '../assets/imges/login-img.jpg';

const Login = () => {
  return (
    <div className="min-h-screen font-sans">
      <div className="flex min-h-screen">
        {/* Left Column - Login Form */}
        <div className="flex-1 flex flex-col justify-center px-16 bg-white">
          <div className="mb-8">
            <Link to="/">
              <div className="text-3xl font-bold text-[#205457] mb-4 hover:opacity-80 transition-opacity cursor-pointer">Homesta</div>
            </Link>
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">Sign In</h2>
            <p className="text-gray-600 text-base">Sign in to stay connected</p>
          </div>

          <form className="max-w-md">
            <div className="mb-6">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-4 border border-gray-300 rounded-lg text-base transition-colors duration-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white"
                required
              />
            </div>

            <div className="mb-6">
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-4 border border-gray-300 rounded-lg text-base transition-colors duration-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white"
                required
              />
            </div>

            <div className="flex justify-between items-center mb-6">
              <label className="flex items-center cursor-pointer text-sm text-gray-600">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm no-underline hover:underline" style={{ color: '#205457' }}>
                Forget Password?
              </Link>
            </div>

            <button type="submit" className="w-full py-4 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-colors duration-300 mb-6 hover:opacity-90" style={{ backgroundColor: '#205457' }}>
              Sign In
            </button>
          </form>

          <div className="text-center relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-gray-300"></div>
            </div>
            <span className="bg-white px-4 text-gray-600 text-sm relative">Or Continue With</span>
          </div>

          <div className="flex gap-4 mb-8">
            <button className="flex-1 py-3 border border-gray-300 rounded-lg bg-white cursor-pointer flex items-center justify-center gap-2 text-sm transition-all duration-300 hover:bg-gray-50 hover:border-blue-500">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>

            <button className="flex-1 py-3 border border-gray-300 rounded-lg bg-white cursor-pointer flex items-center justify-center gap-2 text-sm transition-all duration-300 hover:bg-gray-50 hover:border-blue-500">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>

            <button className="flex-1 py-3 border border-gray-300 rounded-lg bg-white cursor-pointer flex items-center justify-center gap-2 text-sm transition-all duration-300 hover:bg-gray-50 hover:border-blue-500">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#000" d="M17.05 20.28c-.98.95-2.05.88-3.08.42-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.42C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Apple
            </button>
          </div>

          <div className="text-center text-sm text-gray-600">
            Don't have an account? <Link to="/signup" className="font-semibold no-underline hover:underline" style={{ color: '#205457' }}>Sign Up</Link>
          </div>
        </div>

        {/* Right Column - Background Image with Overlay */}
        <div className="flex-1 relative bg-cover bg-center min-h-screen" style={{ backgroundImage: `url(${loginImg})` }}>
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/40 flex flex-col justify-between p-8">
            <div className="absolute" style={{ width: '576px', height: '302px', top: '466px', left: '16px', gap: '32px', opacity: 1 }}>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <p className="text-white text-xl leading-relaxed mb-8 italic">
                  "Find your dream home with ease. Homesta made my search simple and enjoyable."
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
            <button className="absolute bottom-8 right-8 py-3 px-8 bg-white/20 text-white border border-white/30 rounded-3xl cursor-pointer text-sm backdrop-blur-md transition-all duration-300 hover:bg-white/30 hover:border-white/50">
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
