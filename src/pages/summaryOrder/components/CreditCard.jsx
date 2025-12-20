import React, { useState } from 'react';
import { BiCalendar, BiChevronDown, BiPlus, BiUser } from 'react-icons/bi';
import { FaRegEye } from "react-icons/fa6";
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { IoCaretForwardCircleOutline } from 'react-icons/io5';
import { BsPersonCheck } from "react-icons/bs";
import { BsCalendarRange } from "react-icons/bs";
import { LuCalendarCheck } from "react-icons/lu";

const CreditCard = () => {
    const [showCCV , setShowCCV] = useState(false)
    return (
    <div>
    <h2 className="text-[32px] font-bold text-gray-800 mb-6">Payment method</h2>
    <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    {/* Form */}
    <form className="space-y-5">
    <div className="relative w-full max-w-[340px] h-[220px] mx-auto mb-10 p-5 shadow-xl rounded-2xl">
        <div className="w-full h-full rounded-2xl relative  shadow-xl transition-transform hover:scale-105 duration-300"      
        >            
            <img src="/img/credit.png" className="w-full h-full object-fit" />
        {/* Plus Button */}
        <label className="cursor-pointer absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 bg-white border border-[#2D72B2] rounded-lg flex items-center justify-center text-[#2D72B2] shadow-sm hover:shadow-md hover:bg-blue-50 transition-all z-0 focus:outline-none">

        <BiPlus size={18} />

      <input
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            console.log("Selected file:", file.name);
          }
        }}
      />
    </label>
</div>
        </div>
          

                {/* Use saved card */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr,2fr] gap-4 items-center">
                    <label className="text-[16px] font-medium text-[#4D4A4A]">Use saved card:</label>
                    <div className="relative">
                        <select className="w-full bg-indigo-50/50 border-none rounded-lg px-4 py-3 text-gray-700 appearance-none focus:ring-2 focus:ring-[#205457]/50 outline-none cursor-pointer">
                            <option>Mastercard</option>
                            <option>Visa</option>
                        </select>
                         <BiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#205457] pointer-events-none" size={18} />
                    </div>
                </div>

                {/* Name on card */}
                <div className="space-y-2">
                    <label className="text-[16px] text-[#4D4A4A] font-medium mb-2">Name on card:</label>
                    <div className="relative mt-3">
                        <input 
                            type="text" 
                            defaultValue="Maram Ahmed"
                            className="w-full bg-indigo-50/50 border-none rounded-lg pl-4 pr-10 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#205457]/50 outline-none"
                        />
                        <BsPersonCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-[#205457]" size={20} />
                    </div>
                </div>

                {/* Card number */}
                <div className="space-y-2">
                    <label className="text-[16px] text-[#4D4A4A] font-medium mb-2">Card number:</label>
                    <div className="relative mt-3">
                        <input 
                            type="text" 
                            defaultValue="123-456-789-"
                            className="w-full bg-indigo-50/50 border-none rounded-lg pl-4 pr-10 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#205457]/50 outline-none font-mono"
                        />
                         <BsCalendarRange className="absolute right-4 top-1/2 -translate-y-1/2 text-[#205457]" size={18} />
                    </div>
                </div>

                {/* Expiry & CCV */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[16px] text-[#4D4A4A] font-medium mb-2 ">Expiry date:</label>
                        <div className="relative mt-3">
                            <input 
                                type="text" 
                                placeholder="MM / YY"
                                className="w-full bg-indigo-50/50 border-none rounded-lg pl-4 pr-10 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#205457]/50 outline-none"
                            />
                            <LuCalendarCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-[#205457]" size={18} />
                        </div>
                    </div>
                    <div className="space-y-2">
                         <label className="text-[16px] text-[#4D4A4A] font-medium mb-2 ">CCV</label>
                        <div className="relative mt-3">
                            <input 
                                type={showCCV ? "text" : "password"} 
                                placeholder="•••"
                                className="w-full bg-indigo-50/50 border-none rounded-lg pl-4 pr-10 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#205457]/50 outline-none tracking-widest"
                            />
                                <button type="button" onClick={() => setShowCCV(!showCCV)} className="absolute right-4 top-1/2 -translate-y-1/2" >
                                    {showCCV ? <FiEyeOff className="text-[#205457] cursor-pointer hover:text-gray-600" size={18} /> : <FiEye className="text-[#205457] cursor-pointer hover:text-gray-600" size={18}  />}
                                </button>
                        </div>
                    </div>
                </div>

            {/* Footer Logos */}
            <div className="mt-8 flex justify-end items-center gap-3 text-2xl">
                <img  src="/img/visa-1.png" />
                <img  src="/img/visa-2.png" />
                <img  src="/img/visa-3.png" />

            </div>
     </form>
   </div>
 </div>
 );
};

export default CreditCard;