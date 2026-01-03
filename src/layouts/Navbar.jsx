import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
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

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("en");
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
    <header className="w-full fixed z-30 top-0 left-0 font-display ">
      <section className='w-full font-display bg-main '>
        <div className='w-[90%] font-display py-5 lg:w-[85%] mx-auto flex justify-between items-center'>
          <a href="tel:+123-456-789" className='text-white'>Call Us:+123-456-789</a>
          <p className='hidden lg:block text-white text-[16px]'>
            Sign up and Get 25% OFF for your first order. <Link className='underline'>Sign up now</Link>
          </p>
          <div className='flex gap-2 '>
            {Links.map(link => (
              <a href={link.url} key={link.id} className="text-secondry py-4 hidden lg:block">
                {link.icon}
              </a>
            ))}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="  text-white items-center p-2"
            >
              <option value="en" className="">English</option>
              <option value="ar" className="">Arabic</option>
            </select>
            <span className='pt-2 text-white'>|</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="  text-white items-center p-2"
            >
              <option value="usd">usd</option>
              <option value="eg">eg</option>
            </select>
          </div>
        </div>

      </section>
      <nav className="w-full px-7 h-15 flex justify-between relative items-center bg-[#e3d6bc94] ">
        {/* Logo */}
        <div className="logo">
          <Link to='/' className="flex gap-2  items-center ">
            <img src={logo} alt="logo" />
            <h1 className="capitalize text-white text-[25px] lg:text-[32px] font-medium">homesta</h1>
          </Link>
        </div>
        {/* Desktop Links */}
        <div className="hidden lg:flex gap-6  items-center">
          {navLinks.map(link => (
            <NavLink
              key={link.id}
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "font-medium border-b-2 text-white text-6 border-b-main cursor-pointer capitalize"
                  : "font-medium cursor-pointer text-6 capitalize text-white "
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* lists of faviorites and cart */}
        <div className="flex gap-3 ml-4">
          <Link to="/cart" className="relative">
            <PiShoppingCartThin className="text-2xl text-white" />
          </Link>
          <Link to="/wishlist" className="relative">
            <CiHeart className="text-2xl text-white" />
          </Link>
          <Link to="/account" className="relative hidden lg:flex items-center gap-1">
            <CiUser className="text-2xl text-white" />
            <span className="text-sm font-medium text-white ">Account</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div
          className="lg:hidden cursor-pointer z-50"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <IoClose className="text-2xl text-white" /> : <FaBars className="text-2xl text-white" />}
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 right-0 h-screen w-[70%] bg-[#ffffff] shadow-lg transform transition-transform duration-300 ease-in-out lgl:hidden 
            ${menuOpen ? "translate-x-0  z-50" : "translate-x-full"}`}
        >
          <div className="flex flex-col gap-8 pt-28 items-center relative">
            <button className="absolute left-5 top-4 text-3xl  text-main " onClick={() => setMenuOpen(false)}><IoClose /></button>
            {navLinks.map(link => (
              <NavLink
                key={link.id}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "font-medium border-b-2 text-main text-4 border-b-main text-xl cursor-pointer capitalize"
                    : "font-medium  cursor-pointer text-xl capitalize"
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
        {       /* overlay */}
        {menuOpen && (
          <div
            className="fixed z-40 inset-0 lgl:hidden"
            onClick={() => setMenuOpen(false)}
          ></div>
        )}
      </nav>
    </header>
  )
}

export default Navbar;
