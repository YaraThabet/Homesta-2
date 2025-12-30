import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquareText } from "lucide-react";

/**
 * Floating AI Chat Assistant Button
 * Positioned fixed at the bottom right of the screen
 */
const AIChatFloatButton = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate("/ai-chat")}
            className="fixed bottom-8 right-8 z-[9999] group flex items-center gap-3"
            aria-label="AI Chat Assistant"
        >
            {/* Label that shows on hover */}
            <div className="bg-[#205457] text-white px-4 py-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 font-medium text-sm pointer-events-none">
                Chat with AI Assistant
            </div>

            {/* The Button Icon */}
            <div className="w-16 h-16 bg-[#205457] rounded-full flex items-center justify-center shadow-2xl shadow-[#205457]/30 border-4 border-white/10 hover:scale-110 active:scale-95 transition-all duration-300 relative">
                {/* Animated Glow Effect */}
                <div className="absolute inset-0 bg-[#205457] rounded-full animate-ping opacity-20 group-hover:opacity-30"></div>

                <MessageSquareText className="text-white w-8 h-8 relative z-10" />

                {/* Online Indicator Badge */}
                <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
        </button>
    );
};

export default AIChatFloatButton;
