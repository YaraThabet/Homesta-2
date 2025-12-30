import React from 'react';
import { useAppContext } from '../../../context/AppContext';

const steps = [
  { number: 1, key: 'cart', icon: CartIcon },
  { number: 2, key: 'shipping', icon: ShippingIcon },
  { number: 3, key: 'payment', icon: PaymentIcon },
  { number: 4, key: 'summary', icon: SummaryIcon },
];

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="m1 1 4 4m0 0 2.68 11.12a2 2 0 0 0 1.94 1.52h9.78a2 2 0 0 0 1.94-1.52L23 6H6" />
    </svg>
  );
}

function ShippingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 18H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v2" />
      <path d="M14 18h6a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-1l-3-3h-4v9a2 2 0 0 0 2 2z" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  );
}

function PaymentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

function SummaryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  );
}

export default function CheckoutStepper({ currentStep = 4 }) {
  const { t } = useAppContext();

  return (
    <div className="flex flex-col items-center py-8">
      <div className="flex items-center gap-0">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${step.number <= currentStep
                ? 'bg-[#5B8A8A] text-white'
                : 'bg-muted text-muted-foreground border-2 border-border'
                }`}
            >
              {step.number}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-16 transition-colors ${step.number < currentStep ? 'bg-[#5B8A8A]' : 'bg-border'
                  }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center gap-6 mt-3">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`flex items-center gap-1.5 text-sm ${step.number <= currentStep ? 'text-foreground' : 'text-muted-foreground'
              }`}
          >
            <step.icon />
            <span>{t(step.key)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
