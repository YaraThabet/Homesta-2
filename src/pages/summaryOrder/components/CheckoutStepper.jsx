import React from 'react';
import { useAppContext } from '../../../context/AppContext';

function CartIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="m1 1 4 4m0 0 2.68 11.12a2 2 0 0 0 1.94 1.52h9.78a2 2 0 0 0 1.94-1.52L23 6H6" />
    </svg>
  );
}

function ShippingIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M5 18H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v2" />
      <path d="M14 18h6a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-1l-3-3h-4v9a2 2 0 0 0 2 2z" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  );
}

function PaymentIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

function SummaryIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  );
}

const steps = [
  { number: 1, key: 'cart', icon: CartIcon },
  { number: 2, key: 'shipping', icon: ShippingIcon },
  { number: 3, key: 'payment', icon: PaymentIcon },
  { number: 4, key: 'summary', icon: SummaryIcon },
];

export default function CheckoutStepper({ currentStep = 4 }) {
  const { t } = useAppContext();

  return (
    <div className="w-full flex justify-center py-4 md:py-8 overflow-x-auto no-scrollbar">
      <div className="flex items-start min-w-fit px-2">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              {/* Circle */}
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold text-xs md:text-sm transition-colors shrink-0 ${step.number <= currentStep
                    ? 'bg-[#5B8A8A] text-white shadow-md'
                    : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                  }`}
              >
                {step.number}
              </div>

              {/* Label */}
              <div
                className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 mt-2 transition-colors ${step.number <= currentStep ? 'text-gray-900' : 'text-gray-400'
                  }`}
              >
                <step.icon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-[10px] md:text-sm font-medium whitespace-nowrap">{t(step.key)}</span>
              </div>
            </div>

            {/* Line Connector */}
            {index < steps.length - 1 && (
              <div
                className={`h-[2px] w-8 sm:w-12 md:w-20 mt-4 md:mt-5 transition-colors shrink-0 rounded-full ${step.number < currentStep ? 'bg-[#5B8A8A]' : 'bg-gray-200'
                  }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
