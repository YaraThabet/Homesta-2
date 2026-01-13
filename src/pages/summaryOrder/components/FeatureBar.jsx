import React from 'react';

function ShippingBoxIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
      <rect x="8" y="16" width="32" height="24" rx="2" fill="#F5E6C8" stroke="#C4A45C" strokeWidth="2"/>
      <path d="M8 22h32" stroke="#C4A45C" strokeWidth="2"/>
      <path d="M20 22v18M28 22v18" stroke="#C4A45C" strokeWidth="1.5" strokeDasharray="3 2"/>
      <path d="M16 8l8 8 8-8" stroke="#C4A45C" strokeWidth="2" fill="none"/>
    </svg>
  );
}

function PaymentIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
      <rect x="6" y="12" width="36" height="24" rx="3" fill="#F5E6C8" stroke="#C4A45C" strokeWidth="2"/>
      <path d="M6 20h36" stroke="#C4A45C" strokeWidth="2"/>
      <rect x="10" y="28" width="12" height="4" rx="1" fill="#C4A45C"/>
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="12" fill="#F5E6C8" stroke="#C4A45C" strokeWidth="2"/>
      <path d="M12 24a12 12 0 0 1 24 0" stroke="#C4A45C" strokeWidth="6" fill="none"/>
      <circle cx="14" cy="28" r="4" fill="#C4A45C"/>
      <circle cx="34" cy="28" r="4" fill="#C4A45C"/>
      <path d="M24 36v4" stroke="#C4A45C" strokeWidth="2"/>
    </svg>
  );
}

const features = [
  {
    icon: ShippingBoxIcon,
    title: 'Free Shipping',
    description: 'Free shipping for order above $180',
  },
  {
    icon: PaymentIcon,
    title: 'Flexible Payment',
    description: 'Multiple secure payment options',
  },
  {
    icon: SupportIcon,
    title: '24×7 Support',
    description: 'We support online all days.',
  },
];

export default function FeatureBar() {
  return (
    <div className="flex flex-wrap justify-center gap-12 py-8 mt-8 border-t border-divider">
      {features.map((feature) => (
        <div key={feature.title} className="flex items-center gap-3">
          <div className="feature-icon">
            <feature.icon />
          </div>
          <div>
            <h4 className="font-semibold text-foreground text-sm">{feature.title}</h4>
            <p className="text-xs text-muted-foreground">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
