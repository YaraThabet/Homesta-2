import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

/**
 * ScrollToTop - A dual-purpose utility:
 * 1. Resets window scroll position to top instantly on route change.
 * 2. Provides a visible floating button to scroll to top smoothly.
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();
    const [isVisible, setIsVisible] = useState(false);

    // 1. Instant scroll reset on navigation
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    // 2. Monitor scroll depth for button visibility
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    whileHover={{ scale: 1.1, translateY: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={scrollToTop}
                    className="fixed bottom-24 right-8 z-[9998] w-12 h-12 md:w-14 md:h-14 bg-white/80 backdrop-blur-md border border-gray-100 shadow-2xl rounded-2xl flex items-center justify-center text-[#205457] hover:bg-[#205457] hover:text-white transition-all duration-300 group"
                    aria-label="Scroll to top"
                >
                    <ChevronUp size={24} className="group-hover:animate-bounce" />

                    {/* Subtle pulse effect */}
                    <div className="absolute inset-0 rounded-2xl ring-4 ring-[#205457]/5 animate-pulse" />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTop;
