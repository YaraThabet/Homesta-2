import { Truck, CreditCard, Headphones } from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free shipping for order above $180",
  },
  {
    icon: CreditCard,
    title: "Flexible Payment",
    description: "Multiple secure payment options",
  },
  {
    icon: Headphones,
    title: "24×7 Support",
    description: "We support online all days.",
  },
];

const FooterBenefits = () => {
  return (
    <footer className="border-t border-gray-200 bg-white py-8 mt-16">
      <div className="container mx-auto px-4 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12  rounded-full flex items-center justify-center">
                <benefit.icon className="h-5 w-5 text-gray-900" />
                {/* <div className="flex-shrink-0 w-5 h-5  bg-[#FEBB36] rounded-full flex items-center justify-center">
                 </div> */}
              </div>
              <div> 
                <h3 className="text-sm font-semibold text-gray-900">{benefit.title}</h3>
                <p className="text-xs text-gray-500">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default FooterBenefits;
