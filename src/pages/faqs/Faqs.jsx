import FaqsFooter from "./components/FaqsFooter";
import FaqsTabs from "./components/FaqsTabs";

const Faqs = () => {
  return (
    <div className="">
      <div className="w-full mt-[168px] mx-auto p-6 bg-[#F6F6F6]">
        <p className="font-[Outfit] text-[32px] font-medium text-center">
          FAQs
        </p>
        <p className="text-[#A4A7AE] text-center font-[Outfit] text-[16px]">
          {" "}
          Home / FAQs{" "}
        </p>
      </div>
      <div className="container pl-20 pt-15 pb-15">
        <FaqsTabs />
        <FaqsFooter />
      </div>
    </div>
  );
};

export default Faqs;
