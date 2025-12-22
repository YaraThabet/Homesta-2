import { useState } from "react";
import { FaDharmachakra, FaBookMedical } from "react-icons/fa6";
import { TbXboxX } from "react-icons/tb";
import { FaRegImages } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { PiDotsThreeBold } from "react-icons/pi";
import { FaUserCircle } from "react-icons/fa";

export default function Setting() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`relative bg-[#f0f3ff] text-black transition-all duration-300
        ${open ? "w-80" : "w-16"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          {/* Chat Icon (Toggle) */}
          <button
            onClick={() => setOpen(!open)}
            className="text-xl hover:text-blue-600"
          >
            <FaDharmachakra />
          </button>

          {/* X Icon */}
          {open && (
            <button
              onClick={() => setOpen(false)}
              className="text-xl hover:text-red-500"
            >
              <TbXboxX />
            </button>
          )}
        </div>

        {/* Menu */}
        <ul className="mt-4 space-y-2 px-2">
          <li className="px-3 py-2 hover:bg-gray-200 rounded">
            <div className="flex items-center gap-3">
              <FaBookMedical />
              {open && <span>New Chat</span>}
            </div>
          </li>

          <li className="px-3 py-2 hover:bg-gray-200 rounded">
            <div className="flex items-center gap-3">
              <CiSearch />
              {open && <span>Search</span>}
            </div>
          </li>

          <li className="px-3 py-2 hover:bg-gray-200 rounded">
            <div className="flex items-center gap-3">
              <FaRegImages />
              {open && <span>Images</span>}
            </div>
          </li>
        </ul>

        {/* Chats Title */}
        {open && (
          <p className="text-center py-4 text-gray-500 text-sm">
            Your Chats
          </p>
        )}

        {/* Chat List */}
        <div className="px-2 space-y-2 overflow-y-auto max-h-[45vh]">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-200 cursor-pointer"
            >
              {open && (
                <>
                  <p className="text-sm truncate">
                    Lorem ipsum dolor sit amet.
                  </p>
                  <PiDotsThreeBold />
                </>
              )}
            </div>
          ))}
        </div>

        <hr className="text-gray-300 mt-[100px]" />

        {/* User Footer */}
        <div className="absolute bottom-0 left-0 w-full p-3">
          <div className="flex items-center justify-between gap-6 bg-[#eef1ff] rounded-xl px-4 py-2">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <FaUserCircle className="text-2xl text-teal-700" />
              {open && (
                <div className="leading-tight">
                  <p className="text-sm font-semibold">Maram Ahmed</p>
                  <p className="text-xs text-gray-500">Free</p>
                </div>
              )}
            </div>

            {/* Upgrade Button */}
            {open && (
              <button className="ml-4 bg-[#dbe1ff] text-sm px-4 py-1 rounded-full hover:bg-[#cdd4ff] transition">
                Upgrade
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[#c0c2cc] p-6">
        <h1 className="text-2xl font-bold"> Content</h1>
      </div>
    </div>
  );
}

