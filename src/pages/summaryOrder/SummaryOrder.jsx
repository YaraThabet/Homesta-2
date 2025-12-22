import React from 'react';
import Tracking from "./components/Tracking";
import CreditCard from "./components/CreditCard";
import FooterBenefits from "../shop/components/FooterBenefits"; 
import OrderSummary from './components/OrderSummary';

const SummaryOrder = () => {
    // Mock data for order summary (similar to Checkout.jsx)

    return (
        <div className="min-h-screen bg-white">
            <main className="pt-[150px] pb-10">
                <Tracking />
                
                <div className="w-[90%] lg:w-[85%] mx-auto mt-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Left Column: Payment Method (Credit Card) */}
                        <div className="lg:col-span-2 space-y-8">
                             <CreditCard />
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="lg:col-span-1">
                          <OrderSummary  />
                        </div>
                    </div>
                </div>
            </main>

            <FooterBenefits /> 
        </div>
    );
};

export default SummaryOrder;