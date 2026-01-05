import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaDharmachakra, FaBookMedical, FaHome } from "react-icons/fa";
import { TbXboxX } from "react-icons/tb";
import { FaRegImages } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { PiDotsThreeBold } from "react-icons/pi";
import { FaUserCircle, FaBell, FaMoon, FaGlobe, FaShieldAlt } from "react-icons/fa";

export default function Setting() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <div
        className={`relative bg-[#f0f3ff] text-black transition-all duration-300 flex-shrink-0
        ${open ? "w-80" : "w-20"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          {/* Chat Icon (Toggle) */}
          <button
            onClick={() => setOpen(!open)}
            className="text-2xl hover:text-blue-600 transition-colors"
          >
            <FaDharmachakra />
          </button>

          {/* X Icon */}
          {open && (
            <button
              onClick={() => setOpen(false)}
              className="text-2xl hover:text-red-500 transition-colors"
            >
              <TbXboxX />
            </button>
          )}
        </div>

        {/* Menu */}
        <ul className="mt-4 space-y-2 px-3">
          <li
            onClick={() => navigate('/')}
            className="px-3 py-3 hover:bg-white/50 cursor-pointer rounded-xl transition-all text-gray-700 hover:text-blue-600"
          >
            <div className="flex items-center gap-3">
              <FaHome className="text-xl" />
              {open && <span className="font-medium whitespace-nowrap">Home</span>}
            </div>
          </li>

          <li
            onClick={() => navigate('/ai-chat')}
            className="px-3 py-3 hover:bg-white/50 cursor-pointer rounded-xl transition-all text-gray-700 hover:text-blue-600"
          >
            <div className="flex items-center gap-3">
              <FaBookMedical className="text-xl" />
              {open && <span className="font-medium whitespace-nowrap">New Chat</span>}
            </div>
          </li>

          <li className="px-3 py-3 hover:bg-white/50 cursor-pointer rounded-xl transition-all text-gray-700 hover:text-blue-600">
            <div className="flex items-center gap-3">
              <CiSearch className="text-2xl" />
              {open && <span className="font-medium whitespace-nowrap">Search</span>}
            </div>
          </li>

          <li className="px-3 py-3 hover:bg-white/50 cursor-pointer rounded-xl transition-all text-gray-700 hover:text-blue-600">
            <div className="flex items-center gap-3">
              <FaRegImages className="text-xl" />
              {open && <span className="font-medium whitespace-nowrap">Images</span>}
            </div>
          </li>
        </ul>

        {/* Chats Title */}
        {open && (
          <p
            onClick={() => navigate('/ai-chat')}
            className="px-6 py-4 text-gray-400 text-xs font-bold uppercase tracking-wider cursor-pointer hover:text-blue-600"
          >
            Your Chats
          </p>
        )}

        {/* Chat List */}
        <div className="px-3 space-y-1 overflow-y-auto max-h-[40vh] scrollbar-thin scrollbar-thumb-gray-300">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              onClick={() => navigate('/ai-chat')}
              className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/50 cursor-pointer text-gray-600 hover:text-gray-900 transition-all group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                {open && (
                  <p className="text-sm truncate">
                    Previous Chat conversation {i + 1}
                  </p>
                )}
              </div>
              {open && <PiDotsThreeBold className="opacity-0 group-hover:opacity-100" />}
            </div>
          ))}
        </div>

        {/* User Footer */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-[#f0f3ff]">
          <div className={`flex items-center ${open ? 'justify-between' : 'justify-center'} bg-white rounded-2xl p-3 shadow-sm border border-blue-100`}>
            {/* User Info */}
            <div className="flex items-center gap-3">
              <FaUserCircle className="text-3xl text-blue-600" />
              {open && (
                <div className="leading-tight overflow-hidden">
                  <p className="text-sm font-bold text-gray-800 truncate">Maram Ahmed</p>
                  <p className="text-xs text-blue-500 font-medium">Free Plan</p>
                </div>
              )}
            </div>

            {/* Upgrade Button */}
            {open && (
              <button className="text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700 transition">
                Upgrade
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content (Settings Page) */}
      <div className="flex-1 bg-[#F9FAFB] p-8 overflow-y-auto w-full">
        <div className="max-w-4xl mx-auto space-y-8 pb-10">

          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-black text-gray-800">Settings</h1>
              <p className="text-gray-500 mt-1">Manage your account settings and preferences.</p>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-[20px] p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <FaUserCircle size={20} />
              </div>
              Account Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Full Name</label>
                <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" defaultValue="Maram Ahmed" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Email Address</label>
                <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" defaultValue="maram@example.com" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-700">Bio</label>
                <textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" rows="3" defaultValue="Passionate about AI and technology." />
              </div>
            </div>
          </div>

          {/* General Preferences */}
          <div className="bg-white rounded-[20px] p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                <FaGlobe size={20} />
              </div>
              General Preferences
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-2 rounded-lg text-gray-600"><FaMoon /></div>
                  <div>
                    <h3 className="font-bold text-gray-800">Dark Mode</h3>
                    <p className="text-xs text-gray-500">Toggle dark theme for the interface</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-2 rounded-lg text-gray-600"><FaGlobe /></div>
                  <div>
                    <h3 className="font-bold text-gray-800">Language</h3>
                    <p className="text-xs text-gray-500">Select your preferred language</p>
                  </div>
                </div>
                <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none">
                  <option>English</option>
                  <option>Arabic</option>
                  <option>Spanish</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-[20px] p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
                <FaBell size={20} />
              </div>
              Notifications
            </h2>
            <div className="space-y-4">
              {['Email Notifications', 'Push Notifications', 'Weekly Digest'].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">{item}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">Cancel</button>
            <button className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-colors">Save Changes</button>
          </div>

        </div>
      </div>
    </div>
  );
}

