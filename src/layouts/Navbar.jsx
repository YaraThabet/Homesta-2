import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { PiShoppingCartThin } from "react-icons/pi";
import { FaBars } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { logo } from "../assets/index"
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FiYoutube } from "react-icons/fi";
import { ImPinterest2 } from "react-icons/im";
import { IoLogoInstagram } from "react-icons/io5";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { language, setLanguage, currency, setCurrency } = useAppContext();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    { id: 1, name: "Home", path: "/" },
    { id: 2, name: "shop", path: "/shop" },
    { id: 3, name: "categories", path: "/Category" },
    { id: 4, name: "About Us", path: "/about" },
    { id: 5, name: "Contact Us", path: "/contact" },
    { id: 6, name: "blog", path: "/blogs" },
  ];
  return (
    <header className="w-full fixed z-50 top-0 left-0 font-display transition-all duration-300">
      <section className={`w-full font-display bg-main transition-all duration-300 ${scrolled ? 'h-0 overflow-hidden opacity-0' : 'opacity-100'}`}>
        <div className='w-[90%] font-display py-3 lg:w-[85%] mx-auto flex justify-between items-center'>
          <a href="tel:+123-456-789" className='text-white text-xs lg:text-sm font-light hover:text-white/80 transition-colors'>Call Us: +123-456-789</a>
          <p className='hidden lg:block text-white text-sm font-light tracking-wide'>
            Sign up and Get 25% OFF for your first order. <Link to="/signup" className='underline font-medium hover:text-white/80 transition-colors ml-1'>Sign up now</Link>
          </p>
          <div className='flex items-center'>
            <div className="flex items-center gap-1 border-r border-white/20 px-2 lg:px-4">
              {Links.map(link => (
                <a href={link.url} key={link.id} className="text-secondry p-2 hidden lg:block hover:text-white transition-colors">
                  {link.icon}
                </a>
              ))}
            </div>

            <div className="flex items-center h-full">
              {/* Language Selector */}
              <div className="flex items-center group relative pl-3 lg:pl-6 pr-2 lg:pr-4">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent text-white text-[11px] lg:text-[12px] font-semibold uppercase tracking-widest outline-none cursor-pointer appearance-none pr-3 ltr:pr-4 rtl:pl-4 transition-all hover:opacity-80"
                >
                  <option value="en" className="text-gray-900">EN</option>
                  <option value="ar" className="text-gray-900">AR</option>
                </select>
                <div className="absolute right-1 lg:right-2 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </div>
              </div>

              <span className='text-white/20 text-xs font-light'>|</span>

              {/* Currency Selector */}
              <div className="flex items-center group relative pl-2 lg:pl-4 pr-3 lg:pr-6">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-transparent text-white text-[11px] lg:text-[12px] font-semibold uppercase tracking-widest outline-none cursor-pointer appearance-none pr-3 ltr:pr-4 rtl:pl-4 transition-all hover:opacity-80"
                >
                  <option value="usd" className="text-gray-900">USD</option>
                  <option value="eg" className="text-gray-900">EGP</option>
                </select>
                <div className="absolute right-1 lg:right-2 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>
      <nav className={`w-full px-6 lg:px-12 transition-all duration-300 ease-in-out ${scrolled ? 'h-16 shadow-lg' : 'h-24'
        } flex justify-between relative items-center ${isDarkText ? 'bg-white border-b border-gray-100' : 'bg-transparent border-b border-white/10 backdrop-blur-md'
        }`}>
        {/* Logo */}
        <div className="logo scale-90 lg:scale-100 origin-left">
          <Link to='/' className="flex gap-3 items-center group">
            <div className={`${isDarkText ? 'bg-[#205457]/10' : 'bg-white/20'} p-2 rounded-xl group-hover:bg-[#205457]/10 transition-all duration-300`}>
              <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
            </div>
            <h1 className={`capitalize text-[22px] lg:text-[28px] font-bold tracking-tight transition-colors duration-300 ${isDarkText ? 'text-[#205457]' : 'text-white'
              }`}>
              homesta
            </h1>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex gap-10 items-center">
          {navLinks.map(link => (
            <NavLink
              key={link.id}
              to={link.path}
              className={({ isActive }) =>
                `relative font-medium text-[15px] capitalize transition-all duration-300 py-1
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
        <div className="flex gap-4 lg:gap-6 items-center">
          <div className="flex items-center gap-1">
            <Link to="/wishlist" className={`p-2 rounded-full transition-all duration-300 group ${isDarkText ? 'hover:bg-gray-100 text-gray-900' : 'hover:bg-white/10 text-white'
              }`}>
              <CiHeart className="text-[24px] group-hover:scale-110 transition-transform" />
            </Link>
            <Link to="/shopping-cart" className={`p-2 rounded-full transition-all duration-300 group relative ${isDarkText ? 'hover:bg-gray-100 text-gray-900' : 'hover:bg-white/10 text-white'
              }`}>
              <PiShoppingCartThin className="text-[24px] group-hover:scale-110 transition-transform" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#B19470] rounded-full border border-white/20"></span>
            </Link>
            <Link to="/account" className={`hidden lg:flex items-center gap-2 p-2 px-3 rounded-xl transition-all duration-300 group ml-2 border ${isDarkText ? 'bg-[#205457] text-white hover:bg-[#205457]/90 border-[#205457]' : 'bg-white/10 hover:bg-white/20 text-white border-white/5'
              }`}>
              <CiUser className="text-[20px] group-hover:rotate-12 transition-transform" />
              <span className="text-[14px] font-semibold uppercase tracking-wider">Account</span>
            </Link>
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
            ${menuOpen ? "translate-x-0 z-50" : "translate-x-full"}`}
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
                    `block text-3xl font-bold capitalize transition-all duration-300 
                    ${isActive ? "text-[#205457] translate-x-3" : "text-gray-900 hover:text-[#205457] hover:translate-x-3"}`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
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
      </nav>
    </header>
  )
}

export default Navbar;
