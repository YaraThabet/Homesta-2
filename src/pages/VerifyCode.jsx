import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import verifyCodeImg from '../assets/imges/verify-code-img.jpg';

const VerifyCode = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);

  const handleChange = (index, value) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-input-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <div className="flex min-h-screen">
        {/* Left Column - Verify Code Form */}
        <div className="flex-1 flex flex-col justify-center px-16 bg-white">
          <div className="mb-8">
            <div className="text-3xl font-bold text-gray-800 mb-4">Homesta</div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">Verify Code</h2>
            <p className="text-gray-600 text-base">Please enter the code we just sent to email example@gmail.com</p>
          </div>

          <form className="max-w-md">
            <div className="mb-6">
              <div className="flex gap-3 justify-center">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-input-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-14 border-2 border-gray-300 rounded-full text-center text-lg font-semibold focus:outline-none focus:border-blue-500 focus:bg-blue-50 transition-colors duration-300"
                    required
                  />
                ))}
              </div>
            </div>

            <button type="submit" className="w-full py-4 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-colors duration-300 mb-6 hover:opacity-90" style={{backgroundColor: '#205457'}}>
              Verify
            </button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Didn't receive code? <Link to="/forgot-password" className="font-semibold no-underline hover:underline" style={{color: '#205457'}}>Resend Code</Link>
          </div>
        </div>

        {/* Right Column - Background Image with Overlay */}
        <div className="flex-1 relative bg-cover bg-center min-h-screen" style={{backgroundImage: `url(${verifyCodeImg})`}}>
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/40 flex flex-col justify-between p-8">
            <div className="absolute" style={{width: '576px', height: '302px', top: '466px', left: '16px', gap: '32px', opacity: 1}}>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <p className="text-white text-xl leading-relaxed mb-8 italic">
                  "Verify your account securely with the code we sent to your email. Keep your account safe and protected."
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

export default VerifyCode;
