import React from "react";

const PageLoader = () => {
    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-[#F5F5F5] fixed inset-0 z-50">
            <div className="flex flex-col items-center gap-6">
                {/* Spinning Circle with Brand Color */}
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-[#43766C]/20 border-t-[#43766C] rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-[#B19470] rounded-full animate-ping"></div>
                    </div>
                </div>

                {/* Loading Text */}
                <p className="text-[#43766C] font-[Outfit] text-lg font-medium tracking-wider animate-pulse uppercase">
                    Homesta
                </p>
            </div>
        </div>
    );
};

export default PageLoader;
