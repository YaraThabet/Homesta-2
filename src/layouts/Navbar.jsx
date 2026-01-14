import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { PiShoppingCartThin } from "react-icons/pi";
import { FaBars } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { CiUser, CiLogout } from "react-icons/ci";
import { LayoutDashboard } from "lucide-react";
import api from "../lib/axios";
import { logo } from "../assets/index"
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FiYoutube } from "react-icons/fi";
import { ImPinterest2 } from "react-icons/im";
import { IoLogoInstagram } from "react-icons/io5";
import { useAppContext } from "../context/AppContext";
import SafeImage from "../components/SafeImage";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, currency, setCurrency, t } = useAppContext();

  const handleLogout = async () => {
    try {
      await api.post('/Auth/logout');
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      setUser(null);
      setShowLogoutModal(false);
      navigate('/'); // Stay on Home Page
    }
  };

  const handleRestrictedClick = (e) => {
    if (!user) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

  useEffect(() => {
    // Check auth state and fetch user details
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUserName = localStorage.getItem('userName');
      const userId = localStorage.getItem('userId');

      if (token && userId) {
        // Optimistic default
        setUser({ name: storedUserName || 'Account', isLoggedIn: true, image: null });

        // Fetch latest details (specifically for image)
        try {
          const res = await api.get(`/User/${userId}`);
          if (res.data) {
            const freshImage = res.data.imageUrl;
            setUser(prev => ({ ...prev, image: freshImage }));
          }
        } catch (err) {
          console.error("Silent auth check failed for image", err);
        }
      } else {
        setUser(null);
      }
    };

    checkAuth();

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const isHomePage = location.pathname === "/";
  const isDarkText = !isHomePage || scrolled;
  const Links = [
    { id: 1, icon: <FaFacebook />, url: "#" },
    { id: 2, icon: <FaTwitter />, url: "#" },
    { id: 3, icon: <FiYoutube />, url: "#" },
    { id: 4, icon: <ImPinterest2 />, url: "#" },
    { id: 5, icon: <IoLogoInstagram />, url: "#" },
  ]
  const navLinks = [
    { id: 1, name: t('home'), path: "/" },
    { id: 2, name: t('shop'), path: "/shop" },
    { id: 3, name: t('categories'), path: "/Category" },
    { id: 4, name: t('aboutUs'), path: "/about" },
    { id: 5, name: t('contactUs'), path: "/contact" },
    { id: 6, name: t('blog'), path: "/blogs" },
  ];
  return (
    <header className="w-full fixed z-50 top-0 left-0 font-display transition-all duration-300">
      <section className={`w-full bg-[#205457] border-b border-white/5 transition-all duration-300 ${scrolled ? 'h-0 overflow-hidden opacity-0' : 'opacity-100'}`}>
        <div className='max-w-[1440px] mx-auto px-4 lg:px-12 h-10 flex justify-between items-center text-white/90 font-outfit overflow-x-auto no-scrollbar'>
          {/* Left Side: Call Us & Sign Up */}
          <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
            <a href="tel:+123-456-789" className='text-[10px] md:text-[13px] font-medium hover:text-white transition-colors flex items-center gap-1 md:gap-2'>
              <span className="text-[#B19470] whitespace-nowrap">{t('Call Us')}</span>
              <span className="hidden sm:inline">: +123-456-789</span>
            </a>
            <span className="w-[1px] h-3 bg-white/20"></span>
            <div className='text-[10px] md:text-[13px] font-light tracking-wide text-white/70 flex items-center gap-1'>
              <span className="hidden sm:inline">{t('signUpOffer')}</span>
              <Link to="/signup" className='text-[#B19470] hover:underline transition-all font-medium whitespace-nowrap'>{t('Sign Up Now')}</Link>
            </div>
          </div>

          {/* Right Side: Social (Desktop only) & Selectors */}
          <div className="flex items-center gap-4 md:gap-6 ml-4">
            {/* Social Icons - Hidden on Mobile */}
            <div className="hidden md:flex items-center gap-3 border-r border-white/10 pr-4">
              {Links.map(link => (
                <a href={link.url} key={link.id} className="text-white/60 hover:text-[#B19470] transition-colors transform hover:scale-110">
                  {link.icon}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
              {/* Currency Selector */}
              <div className="relative flex items-center gap-1 group cursor-pointer">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-transparent text-[10px] md:text-[12px] font-bold uppercase tracking-wider outline-none cursor-pointer appearance-none pr-3 md:pr-4 text-white/90 hover:text-white transition-colors z-10"
                >
                  <option value="usd" className="text-gray-900">USD</option>
                  <option value="eg" className="text-gray-900">EGP</option>
                </select>
                <div className="absolute right-0 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
                  <svg width="8" height="8" className="md:w-2.5 md:h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </div>
              </div>

              <span className='w-[1px] h-3 bg-white/20'></span>

              {/* Language Selector */}
              <div className="relative flex items-center gap-1 group cursor-pointer">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent text-[10px] md:text-[12px] font-bold uppercase tracking-wider outline-none cursor-pointer appearance-none pr-3 md:pr-4 text-white/90 hover:text-white transition-colors z-10"
                >
                  <option value="en" className="text-gray-900">EN</option>
                  <option value="ar" className="text-gray-900">AR</option>
                </select>
                <div className="absolute right-0 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
                  <svg width="8" height="8" className="md:w-2.5 md:h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <nav className={`w-full px-6 lg:px-12 transition-all duration-300 ease-in-out ${scrolled ? 'h-16 shadow-lg' : 'h-24'
        } flex justify-between relative items-center ${isDarkText ? 'bg-white border-b border-gray-100' : 'bg-transparent border-b border-white/10 backdrop-blur-md'
        }`}>
        <div className="logo flex-shrink-0 transition-all duration-500">
          <Link to='/' className="flex gap-2 md:gap-3 items-center group">
            <div className={`${isDarkText ? 'bg-[#205457]/10' : 'bg-white/20'} ${scrolled ? 'p-1 md:p-2' : 'p-1.5 md:p-2.5'} rounded-xl group-hover:bg-[#205457]/20 transition-all duration-500 shadow-sm`}>
              <img
                src={logo}
                alt="logo"
                className={`${scrolled ? 'w-6 h-6 md:w-9 md:h-9' : 'w-7 h-7 md:w-11 md:h-11'} object-contain group-hover:scale-110 transition-all duration-500`}
              />
            </div>
            <h1 className={`${scrolled ? 'text-[17px] md:text-[24px]' : 'text-[20px] md:text-[30px]'} font-black capitalize tracking-tighter transition-all duration-500 ${isDarkText ? 'text-[#205457]' : 'text-white'}`}>
              homesta
            </h1>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex gap-4 xl:gap-8 items-center">
          {navLinks.map(link => (
            <NavLink
              key={link.id}
              to={link.path}
              className={({ isActive }) =>
                `relative font-medium text-[13px] xl:text-[15px] capitalize transition-all duration-300 py-1
                ${isActive ? "opacity-100 after:w-full" : "opacity-70 after:w-0"}
                ${isDarkText ? 'text-gray-900 hover:text-[#205457]' : 'text-white hover:opacity-100'}
                after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#B19470] after:transition-all after:duration-300 hover:after:w-full`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* lists of faviorites and cart */}
        <div className="flex gap-2 lg:gap-4 items-center">
          <div className="flex items-center gap-1">
            <Link
              to="/wishlist"
              onClick={(e) => handleRestrictedClick(e)}
              className={`p-1.5 rounded-full transition-all duration-300 group ${isDarkText ? 'hover:bg-gray-100 text-gray-900' : 'hover:bg-white/10 text-white'}`}
            >
              <CiHeart className="text-[18px] md:text-[22px] group-hover:scale-110 transition-transform" />
            </Link>
            <Link
              to="/shopping-cart"
              onClick={(e) => handleRestrictedClick(e)}
              className={`p-1.5 rounded-full transition-all duration-300 group relative ${isDarkText ? 'hover:bg-gray-100 text-gray-900' : 'hover:bg-white/10 text-white'}`}
            >
              <PiShoppingCartThin className="text-[18px] md:text-[22px] group-hover:scale-110 transition-transform" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#B19470] rounded-full border border-white/20"></span>
            </Link>

            {/* User Account / Sign In */}
            {user ? (
              <div className="flex items-center gap-2 ml-2">
                {/* Desktop: Seller, Profile, Logout */}
                <div className="hidden lg:flex items-center gap-2">
                  {/* Seller Dashboard Link */}
                  {JSON.parse(localStorage.getItem('userRoles') || '[]').some(r =>
                    (typeof r === 'string' ? r.toLowerCase() === 'seller' : r.roleName?.toLowerCase() === 'seller')
                  ) && (
                      <Link
                        to="/seller-home"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#205457] text-white rounded-xl text-[10px] xl:text-xs font-bold uppercase tracking-wider hover:bg-[#1a4345] transition-all mr-1 shadow-lg shadow-[#205457]/10"
                      >
                        <LayoutDashboard size={13} />
                        <span>{t('sellerDashboard')}</span>
                      </Link>
                    )}

                  <Link to="/account" className={`p-2 rounded-full transition-all duration-300 group ${isDarkText ? 'hover:bg-gray-100 text-gray-900' : 'hover:bg-white/10 text-white'}`} title={t('myAccount')}>
                    {user.image ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                        <SafeImage
                          src={user.image}
                          alt={user.name}
                          type="profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <CiUser className="text-[24px] group-hover:scale-110 transition-transform" />
                    )}
                  </Link>
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className={`p-2 rounded-full transition-all duration-300 group ${isDarkText ? 'hover:bg-gray-100 text-gray-900' : 'hover:bg-white/10 text-white'}`}
                    title={t('logOut')}
                  >
                    <CiLogout className="text-[24px] group-hover:scale-110 transition-transform" />
                  </button>
                </div>

                {/* Mobile: Just Profile Icon (redirects to Account) */}
                <Link to="/account" className={`lg:hidden p-2 rounded-full transition-all duration-300 group ${isDarkText ? 'hover:bg-gray-100 text-gray-900' : 'hover:bg-white/10 text-white'}`}>
                  {user.image ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                      <SafeImage
                        src={user.image}
                        alt={user.name}
                        type="profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <CiUser className="text-[24px] group-hover:scale-110 transition-transform" />
                  )}
                </Link>
              </div>
            ) : (
              <>
                <Link to="/login" className={`hidden lg:flex items-center gap-2 p-2 px-3 rounded-xl transition-all duration-300 group ml-2 border ${isDarkText ? 'bg-transparent text-[#205457] border-[#205457] hover:bg-[#205457] hover:text-white' : 'bg-transparent text-white border-white hover:bg-white hover:text-[#205457]'
                  }`}>
                  <CiUser className="text-[20px] group-hover:rotate-12 transition-transform" />
                  <span className="text-[14px] font-semibold uppercase tracking-wider">{t('signIn')}</span>
                </Link>
                {/* Mobile Sign In Icon */}
                <Link to="/login" className={`lg:hidden p-2 rounded-full transition-all duration-300 group ml-1 ${isDarkText ? 'text-[#205457]' : 'text-white'}`}>
                  <CiUser className="text-[24px]" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div
            className={`lg:hidden cursor-pointer w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${isDarkText ? 'bg-gray-100 text-gray-900 hover:bg-gray-200' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <IoClose size={24} /> : <FaBars size={20} />}
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 right-0 h-screen w-[85%] sm:w-[60%] lg:w-[40%] bg-white shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] 
            ${menuOpen ? "translate-x-0 z-[60]" : "translate-x-full z-[40]"}`}
        >
          <div className="flex flex-col h-full bg-white px-8 pt-24 pb-12 overflow-y-auto">
            <button
              className="absolute right-8 top-8 w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 text-gray-900 shadow-sm transition-transform hover:rotate-90"
              onClick={() => setMenuOpen(false)}
            >
              <IoClose size={28} />
            </button>
            <div className="space-y-6">
              <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-4">Navigation</p>
              {navLinks.map((link, idx) => (
                <NavLink
                  key={link.id}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  style={{ transitionDelay: `${idx * 50}ms` }}
                  className={({ isActive }) =>
                    `block text-xl md:text-3xl font-bold capitalize transition-all duration-300 
                    ${isActive ? "text-[#205457] translate-x-3" : "text-gray-900 hover:text-[#205457] hover:translate-x-3"}`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {/* Account / Login Mobile Link (Keep in menu as fallback/extra) */}
              <div className="pt-4 mt-4 border-t border-gray-100">
                {user ? (
                  <div className="space-y-4">
                    <NavLink
                      to="/account"
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `block text-xl md:text-3xl font-bold capitalize transition-all duration-300 
                            ${isActive ? "text-[#205457] translate-x-3" : "text-gray-900 hover:text-[#205457] hover:translate-x-3"}`
                      }
                    >
                      {t('myAccount')}
                    </NavLink>
                    <button
                      onClick={() => { setMenuOpen(false); setShowLogoutModal(true); }}
                      className="flex items-center gap-2 text-xl font-bold capitalize text-red-500 hover:text-red-700 transition-all duration-300"
                    >
                      <span>{t('logOut')}</span>
                      <CiLogout className="text-xl" />
                    </button>
                  </div>
                ) : (
                  <NavLink
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block text-xl md:text-3xl font-bold capitalize text-gray-900 hover:text-[#205457] hover:translate-x-3 transition-all duration-300"
                  >
                    {t('signIn')}
                  </NavLink>
                )}
              </div>
            </div>

            <div className="mt-auto pt-12 space-y-6 border-t border-gray-100">
              <div className="flex justify-between items-center text-gray-900 font-medium pb-4">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Connect</span>
              </div>
              <div className="flex gap-4">
                {Links.map(l => (
                  <a key={l.id} href={l.url} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-900 hover:bg-[#205457] hover:text-white transition-all">
                    {l.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* overlay */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setMenuOpen(false)}
          ></div>
        )}

        {/* Logout Confirmation Modal */}
        {showLogoutModal && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center relative animate-fade-in-up">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CiLogout className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Logout?</h3>
              <p className="text-gray-600 mb-6 font-medium">Are you sure you want to log out of your account?</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors shadow-md"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Login Required Modal */}
        {showLoginModal && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center relative animate-fade-in-up">
              <div className="w-16 h-16 bg-[#205457]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CiUser className="w-8 h-8 text-[#205457]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Login Required</h3>
              <p className="text-gray-600 mb-6">Please sign in to access your wishlist, cart, and account details.</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    navigate('/login');
                  }}
                  className="flex-1 py-2 bg-[#205457] hover:bg-[#1a4345] text-white rounded-lg font-medium transition-colors shadow-md"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </nav>
    </header >
  )
}

export default Navbar;
