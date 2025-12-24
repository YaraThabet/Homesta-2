import React from 'react';
import { BsCart3, BsTruck, BsCreditCard } from 'react-icons/bs';

const Tracking = () => {
    return (
        <div className="w-full flex justify-center items-center py-8 bg-[#F0F4FF] h-[135px]">
            <div className="flex items-center gap-2">
                {/* Step 1: Cart */}
                <div className="flex items-center md:gap-2 gap-1 text-[#2D4F75] font-medium italic">
                    <BsCart3 className="md:text-2xl text-lg" />
                    <span className="md:text-lg text-sm">cart</span>
                </div>
                
                {/* Dot and Line 1 */}
                <div className="flex items-center">
                    <div className="md:w-3 md:h-3 h-2 w-2 rounded-full bg-[#1A4D59] mx-1"></div>
                    <div className="md:w-24 w-5 h-[2px] bg-[#1A4D59]"></div>
                </div>

                {/* Step 2: Shipping */}
                <div className="flex items-center md:gap-2 gap-1 text-[#2D4F75] font-medium italic">
                    <BsTruck className="md:text-2xl text-lg" />
                    <span className="md:text-lg text-sm">Shipping</span>
                </div>

                {/* Dot and Line 2 */}
                <div className="flex items-center">
                    <div className="md:w-3 md:h-3 h-2 w-2 rounded-full bg-[#1A4D59] mx-1"></div>
                    <div className="md:w-24 w-5 h-[2px] bg-[#1A4D59]"></div>
                </div>

                {/* Step 3: Payment */}
                <div className="flex items-center md:gap-2 gap-1 text-[#2D4F75] font-medium italic">
                    <BsCreditCard className="md:text-2xl text-lg" />
                    <span className="md:text-lg text-sm">Payment</span>
                </div>
            </div>
        </div>
    );
};

export default Tracking;