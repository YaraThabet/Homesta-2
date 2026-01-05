import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, ChevronRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
    const navigate = useNavigate();

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] font-outfit pt-[120px]">
            {/* Header Section with Breadcrumbs */}
            <div className="bg-[#205457] pt-32 pb-20 px-6 lg:px-16 relative overflow-hidden ">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-white/60 text-sm mb-6 font-medium"
                    >
                        <button onClick={() => navigate('/')} className="hover:text-white transition-colors flex items-center gap-1">
                            <Home size={14} /> Home
                        </button>
                        <ChevronRight size={12} />
                        <span className="text-white">Legal & Privacy</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl lg:text-6xl font-bold text-white tracking-tight"
                    >
                        Legal <span className="opacity-60">&</span> Privacy
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/70 mt-4 text-lg max-w-2xl font-light"
                    >
                        Transparent policies to ensure your trust and security while transforming your space with Homesta.
                    </motion.p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-6 py-16 -mt-10 relative z-20">
                <div className="space-y-8">
                    {/* Cancellation Policy Card */}
                    <motion.section
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="bg-white rounded-[40px] p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-[#B19470]/10 rounded-2xl flex items-center justify-center text-[#B19470]">
                                <FileText size={24} />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">Cancellation Policy</h2>
                        </div>

                        <div className="space-y-6 text-gray-400 leading-relaxed text-lg font-light">
                            <p>
                                At Homesta, we understand that plans can change. Our cancellation policy is designed
                                to be as flexible as possible while ensuring fairness for our sellers and logistics partners.
                            </p>
                            <p>
                                Orders can be cancelled free of charge within <span className="text-gray-900 font-semibold">24 hours</span> of purchase.
                                After this window, if the item has already been dispatched or prepared for shipping,
                                a restocking fee or shipping cost recovery may apply.
                            </p>
                            <p>
                                Custom-made or personalized furniture pieces are exempt from cancellation once
                                production has commenced. We encourage our users to review their space measurements
                                and requirements thoroughly before finalizing these special orders.
                            </p>
                        </div>
                    </motion.section>

                    {/* Terms & Conditions Card */}
                    <motion.section
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="bg-white rounded-[40px] p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-[#205457]/10 rounded-2xl flex items-center justify-center text-[#205457]">
                                <Shield size={24} />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">Terms & Conditions</h2>
                        </div>

                        <div className="space-y-6 text-gray-400 leading-relaxed text-lg font-light">
                            <p>
                                By accessing and using the Homesta platform, you agree to comply with and be bound
                                by the following terms. These terms govern your relationship with Homesta and all
                                secondary transactions facilitated through our marketplace.
                            </p>
                            <p className="bg-gray-50 p-6 rounded-2xl italic border-l-4 border-[#205457]">
                                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                            </p>
                            <p>
                                We prioritize the accuracy of product descriptions and imagery; however, slight
                                variations in color and texture are inherent to furniture products and digital displays.
                                Users are responsible for maintaining the confidentiality of their account credentials.
                            </p>
                        </div>
                    </motion.section>

                    {/* Simple Footer Note */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-center py-10"
                    >
                        <p className="text-gray-300 text-sm">Last Updated: January 2026</p>
                        <button
                            onClick={() => navigate('/contact')}
                            className="text-[#205457] font-bold mt-2 hover:underline inline-flex items-center gap-1"
                        >
                            Have questions? Contact Support <ChevronRight size={14} />
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
