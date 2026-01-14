import { Truck, CreditCard, Headphones } from "lucide-react";
import { useAppContext } from "../../../context/AppContext";

const FooterBenefits = () => {
  const { t } = useAppContext();

  const benefits = [
    {
      icon: Truck,
      title: t('freeShipping'),
      description: t('freeShippingDesc'),
    },
    {
      icon: CreditCard,
      title: t('flexiblePayment'),
      description: t('flexiblePaymentDesc'),
    },
    {
      icon: Headphones,
      title: t('support24x7'),
      description: t('supportDesc'),
    },
  ];

  return (
    <footer className="border-t border-gray-200 bg-white py-8 px-8  mt-16">
      <div className="container px-4 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center pl-12 gap-4">
              <div className="flex-shrink-0 w-12 h-12  bg-[#FEBB36] rounded-full flex items-center justify-center">
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
