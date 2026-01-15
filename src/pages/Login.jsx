import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import api from "../lib/axios";
import PageLoader from "../components/PageLoader";
import loginImg from '../assets/imges/login-img.jpg';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  // Load saved email on mount
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setValue('email', savedEmail);
      setValue('rememberMe', true);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError(null);

    try {
      const response = await api.post('Auth/login', { email: data.email, password: data.password });

      // Log the full response to debug
      console.log("=== FULL API RESPONSE ===");
      console.log("Response Status:", response.status);
      console.log("Response Headers:", response.headers);
      console.log("Response Data (Full):", JSON.stringify(response.data, null, 2));
      console.log("Response Data Type:", typeof response.data);
      console.log("Response Data Keys:", Object.keys(response.data || {}));
      console.log("Has 'user' property:", !!response.data?.user);
      console.log("Has 'token' property:", !!response.data?.token);
      console.log("=========================");

      // Validate response structure
      if (!response.data) {
        throw new Error("Invalid response: No data received");
      }

      if (!response.data.token) {
        throw new Error("Invalid response: No token received");
      }

      // Handle Remember Me
      if (data.rememberMe) {
        localStorage.setItem('rememberedEmail', data.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Store Token & UserID
      // Response format: { token: "...", userId: "..." } OR { token: "...", user: { ... } }
      const userData = response.data.user || {};
      localStorage.setItem('token', response.data.token);

      // Decode JWT to get user information (email, role, etc.)
      let decodedToken = null;
      let userEmail = userData.email || data.email;
      let rolesArray = [];

      try {
        const base64Url = response.data.token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        decodedToken = JSON.parse(jsonPayload);
        console.log("Decoded JWT:", decodedToken);

        // Extract email from JWT if not in response
        const emailKey = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
        if (!userEmail && decodedToken[emailKey]) {
          userEmail = decodedToken[emailKey];
        }

        // Extract role from JWT
        const roleKey = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
        const jwtRole = decodedToken[roleKey];
        if (jwtRole) {
          rolesArray = Array.isArray(jwtRole) ? jwtRole : [jwtRole];
        }
      } catch (e) {
        console.error("Failed to decode JWT:", e);
      }

      // Fallback: Get roles from response if available
      if (rolesArray.length === 0) {
        if (userData.roles) {
          rolesArray = Array.isArray(userData.roles) ? userData.roles : [userData.roles];
        } else if (response.data.roles) {
          rolesArray = Array.isArray(response.data.roles) ? response.data.roles : [response.data.roles];
        }
      }

      localStorage.setItem('userEmail', userEmail);

      // Store User Name - try to get from response, otherwise use email or default
      const fullName = (userData.firstName && userData.lastName)
        ? `${userData.firstName} ${userData.lastName}`
        : (userData.firstName || userData.userName || response.data.userName || userEmail?.split('@')[0] || 'Account');
      localStorage.setItem('userName', fullName);

      localStorage.setItem('userRoles', JSON.stringify(rolesArray));

      // Store User ID
      let userId = userData.id || response.data.user?.id;
      if (!userId && decodedToken) {
        const nameIdKey = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
        userId = decodedToken[nameIdKey];
      }
      if (userId) localStorage.setItem('userId', userId);

      // Check if user is a seller - based on exact format: roles = ["Seller"]
      const isSeller = rolesArray.some(role => {
        if (typeof role === 'string') {
          return role.toLowerCase().trim() === 'seller';
        }
        if (typeof role === 'object' && role !== null) {
          const roleName = (role.roleName || role.name || '').toLowerCase().trim();
          return roleName === 'seller';
        }
        return false;
      });

      console.log("Seller Check:", {
        isSeller,
        rolesArray,
        userDataRoles: userData.roles,
        userData: userData
      });

      // Check if user is an Admin
      const isAdmin = rolesArray.some(role => {
        if (typeof role === 'string') {
          return ['admin', 'superadmin'].includes(role.toLowerCase().trim());
        }
        if (typeof role === 'object' && role !== null) {
          const roleName = (role.roleName || role.name || '').toLowerCase().trim();
          return ['admin', 'superadmin'].includes(roleName);
        }
        return false;
      });

      if (isAdmin) {
        console.log("🛡️ Admin detected - Redirecting to /admin/dashboard");
        navigate('/admin/dashboard', { replace: true });
        return;
      }

      if (isSeller) {
        // Check if seller already has a store
        try {
          console.log("Checking for existing store...");
          const storeResponse = await api.get('/Store');
          const stores = Array.isArray(storeResponse.data) ? storeResponse.data : [storeResponse.data];

          // Find store matching user email
          const myStore = stores.find(s => s.email?.toLowerCase() === userEmail?.toLowerCase());

          if (myStore) {
            const sid = myStore.storeId || myStore.id;
            localStorage.setItem('storeId', sid.toString());
            console.log("✅ Store found:", sid, "- Redirecting to Dashboard");
            navigate('/seller-home', { replace: true });
          } else {
            console.log("🆕 No store found - Redirecting to Create Store");
            navigate('/create-store', { replace: true });
          }
        } catch (err) {
          console.error("Failed to check store status:", err);
          // Fallback: If we can't check, send to Create Store (safest assumption for flow)
          navigate('/create-store', { replace: true });
        }
        return; // Prevent any further execution
      } else {
        console.log("❌ Not a seller - Redirecting to home");
        navigate('/', { replace: true });
      }

    } catch (error) {
      console.error("Login Failed:", error);

      // Handle Specific Errors
      let msg = "Invalid email or password";
      const backendMsg = error.response?.data?.message || error.response?.data?.error;

      if (backendMsg) {
        if (backendMsg.toLowerCase().includes("confirm") || backendMsg.toLowerCase().includes("verify")) {
          msg = "Please confirm your email address before logging in.";
        } else {
          msg = backendMsg;
        }
      }

      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen font-sans">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Column - Login Form */}
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
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">Sign In</h2>
            <p className="text-gray-600 text-base mb-8">Sign in to stay connected</p>

            {/* API Error Message */}
            {apiError && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
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

            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg text-base transition-colors duration-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", { required: "Password is required" })}
                    placeholder="Enter your password"
                    autoComplete="current-password"
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

              <div className="flex justify-between items-center mb-6">
                <label className="flex items-center cursor-pointer text-sm text-gray-600">
                  <input
                    type="checkbox"
                    {...register('rememberMe')}
                    className="mr-2 rounded border-gray-300 text-[#205457] focus:ring-[#205457]"
                  />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-sm no-underline hover:underline" style={{ color: '#205457' }}>
                  Forget Password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full py-4 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-colors duration-300 mb-6 hover:opacity-90 shadow-md"
                style={{ backgroundColor: '#205457' }}
              >
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
        </div>

        {/* Right Column - Background Image with Overlay */}
        <div className="hidden lg:flex w-1/2 relative bg-cover bg-center min-h-screen order-1 lg:order-2" style={{ backgroundImage: `url(${loginImg})` }}>
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/40 flex flex-col justify-end p-12">

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-[576px] mb-20 lg:mb-0">
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
        </div>
      </div>
    </div>
  );
};

export default Login;
