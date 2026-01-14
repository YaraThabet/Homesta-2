import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from "../lib/axios";
import PageLoader from "../components/PageLoader";
import verifyCodeImg from '../assets/imges/verify-code-img.jpg';

const VerifyCode = () => {
  const { showAlert } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "example@gmail.com";

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
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

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError(null);

    const fullCode = code.join('');
    if (fullCode.length < 6) {
      setApiError("Please enter the full 6-digit code.");
      setLoading(false);
      return;
    }

    try {
      console.log("Verifying code for:", email);
      // Call the new VerifyResetCode endpoint
      await api.post('Auth/VerifyResetCode', { email, code: fullCode });

      console.log("Code verified successfully");
      navigate('/reset-password', { state: { email, code: fullCode } });
    } catch (error) {
      console.error("Verification Failed:", error);
      const msg = error.response?.data?.message || "Invalid or expired code. Please check and try again.";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      // Use the specified resend-reset-code endpoint
      await api.post('Auth/resend-reset-code', { email });
      showAlert("Code resent successfully!", "success", "Success");
    } catch (error) {
      console.error("Resend failed:", error);
      showAlert("Failed to resend code. Please try again.", "error", "Error");
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen font-sans">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Column - Verify Code Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-16 py-10 bg-white order-2 lg:order-1">
          <div className="mb-6 mt-4 lg:mt-0">
            <Link to="/" className="inline-block group">
              <h1 className="text-3xl font-black text-[#205457] tracking-tighter hover:opacity-80 transition-all cursor-pointer">
                HOMESTA
              </h1>
              <div className="h-1 w-8 bg-[#B19470] rounded-full mt-1 group-hover:w-full transition-all duration-300"></div>
            </Link>
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">Verify Code</h2>
            <p className="text-gray-600 text-base">Please enter the code we just sent to email <span className="font-semibold text-[#205457]">{email}</span></p>
          </div>

          {/* API Error Message */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-sm text-red-700 font-medium">{apiError}</p>
            </div>
          )}

          <form onSubmit={onSubmit} className="max-w-md w-full mx-auto lg:mx-0">
            <div className="mb-6">
              <div className="flex gap-3 justify-center lg:justify-start">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-input-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-10 h-10 md:w-14 md:h-14 border-2 border-gray-300 rounded-full text-center text-lg font-semibold focus:outline-none focus:border-blue-500 focus:bg-blue-50 transition-colors duration-300"
                    autoComplete="off"
                  />
                ))}
              </div>
            </div>

            <button type="submit" className="w-full py-4 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-colors duration-300 mb-6 hover:opacity-90" style={{ backgroundColor: '#205457' }}>
              Verify
            </button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Didn't receive code? <button onClick={handleResend} className="font-semibold no-underline hover:underline bg-transparent border-none cursor-pointer" style={{ color: '#205457' }}>Resend Code</button>
          </div>
        </div>

        {/* Right Column - Background Image with Overlay */}
        <div className="hidden lg:flex w-1/2 relative bg-cover bg-center min-h-screen order-1 lg:order-2" style={{ backgroundImage: `url(${verifyCodeImg})` }}>
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/40 flex flex-col justify-end p-12">
            <div className="w-[90%] max-w-[500px] mb-20 lg:mb-0">
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
            <button className="absolute top-8 right-8 py-3 px-8 bg-white/20 text-white border border-white/30 rounded-3xl cursor-pointer text-sm backdrop-blur-md transition-all duration-300 hover:bg-white/30 hover:border-white/50">
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VerifyCode;
