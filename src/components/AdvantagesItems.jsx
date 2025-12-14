
import { LuBox } from "react-icons/lu";
import { CiCreditCard1 } from "react-icons/ci";
import { CiHeadphones } from "react-icons/ci";
const AdvantagesItems = () => {
  return (
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8 md:gap-12 mb-12 md:mb-24">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left w-full sm:w-[341px] gap-4 sm:gap-3">
          <div className="relative w-[53px] h-[51px] flex-shrink-0">
            <div className="bg-[#FEBB36] rounded-3xl w-[40px] h-[40px] top-[12.5px] left-[13px] absolute z-0"></div>
            <LuBox className="text-[#205457] w-[48px] h-[48px] top-[1.5px] z-10 absolute" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-[Outfit] font-medium text-[18px] md:text-[20px]">
              Free Shipping
            </p>
            <p className="font-[Outfit] font-normal text-[16px] md:text-[18px] text-[#4D4A4A] max-w-[280px]">
              Free shipping for order above $180
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left w-full sm:w-[318px] gap-4 sm:gap-3">
          <div className="relative w-[53px] h-[51px] flex-shrink-0">
            <div className="bg-[#FEBB36] rounded-3xl w-[40px] h-[40px] top-[12.5px] left-[13px] absolute z-0"></div>
            <CiCreditCard1 className="text-[#205457] w-[48px] h-[48px] top-[1.5px] z-10 absolute" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-[Outfit] font-medium text-[18px] md:text-[20px]">
              Flexible Payment
            </p>
            <p className="font-[Outfit] font-normal text-[16px] md:text-[18px] text-[#4D4A4A] max-w-[280px]">
              Multiple secure payment options
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left w-full sm:w-[318px] gap-4 sm:gap-3">
          <div className="relative w-[53px] h-[51px] flex-shrink-0">
            <div className="bg-[#FEBB36] rounded-3xl w-[40px] h-[40px] top-[12.5px] left-[13px] absolute z-0"></div>
            <CiHeadphones className="text-[#205457] w-[48px] h-[48px] top-[1.5px] z-10 absolute" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-[Outfit] font-medium text-[18px] md:text-[20px]">
              24×7 Support
            </p>
            <p className="font-[Outfit] font-normal text-[16px] md:text-[18px] text-[#4D4A4A] max-w-[280px]">
              We support online all days.
            </p>
          </div>
        </div>
      </div>
  )
}

export default AdvantagesItems