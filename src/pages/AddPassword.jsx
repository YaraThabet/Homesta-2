import React from 'react';
import { Link } from 'react-router-dom';
import forgetPassImg from '../assets/imges/forget-pass-img.jpg';

const AddPassword = () => {
  return (
    <div className="min-h-screen font-sans">
      <div className="flex min-h-screen">
        {/* Left Column - Add Password Form */}
        <div className="flex-1 flex flex-col justify-center px-16 bg-white">
          <div className="mb-8">
            <div className="text-3xl font-bold text-gray-800 mb-4">Homesta</div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">Add a new Password</h2>
            <p className="text-gray-600 text-base">The account has been recovered</p>
          </div>

          <form className="max-w-md">
            <div className="mb-6">
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-4 border border-gray-300 rounded-lg text-base transition-colors duration-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white"
                required
              />
            </div>
            
            <div className="mb-6">
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full px-4 py-4 border border-gray-300 rounded-lg text-base transition-colors duration-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white"
                required
              />
            </div>

            <button type="submit" className="w-full py-4 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-colors duration-300 mb-6 hover:opacity-90" style={{backgroundColor: '#205457'}}>
              Log In
            </button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Already have an account? <Link to="/login" className="font-semibold no-underline hover:underline" style={{color: '#205457'}}>Sign In</Link>
          </div>
        </div>

        {/* Right Column - Background Image with Overlay */}
        <div className="flex-1 relative bg-cover bg-center min-h-screen" style={{backgroundImage: `url(${forgetPassImg})`}}>
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/40 flex flex-col justify-between p-8">
            <div className="absolute" style={{width: '576px', height: '302px', top: '466px', left: '16px', gap: '32px', opacity: 1}}>
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
            <button className="absolute bottom-8 right-8 py-3 px-8 bg-white/20 text-white border border-white/30 rounded-3xl cursor-pointer text-sm backdrop-blur-md transition-all duration-300 hover:bg-white/30 hover:border-white/50">
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPassword;
