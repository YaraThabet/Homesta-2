import { GiSofa } from "react-icons/gi";
import { FaArrowRightLong } from "react-icons/fa6";

const Hero = () => {
  return (
    <div
      className=" flex w-full min-h-screen  bg-center bg-no-repeat bg-cover justify-center items-center relative"
      style={{
        imageRendering: "auto",
        backgroundImage: "url('/img/background.jpg')",
      }}
    >
      <div className="absolute flex flex-col w-[396px] h-[178px] top-[200px] items-center  gap-[24px]  ">
        <div className="flex flex-row bg-white rounded-3xl w-[282px] h-[48px] px-[8px] py-[4px] gap-[4px] ">
          <GiSofa className="bg-[#D9D9D9] text-[#205457] w-[40px] h-[40px] top-[4px] left-[8px] rounded-3xl" />
          <div className="flex w-[222px] h-[20px] items-center">
            <p className="font-[Outfit] font-medium text-[16px] leading-normal pt-4">
              The Best Online Furniture Store
            </p>
          </div>
        </div>
        <div className="w-[396px] h-[106px]">
          <p className="font-[Outfit] font-medium text-[42px] leading-[100%] text-[#205457]">
            <span className="text-white">Explore Our </span>Modern Furniture
            Collection
          </p>
        </div>
      </div>
      <div className="absolute flex flex-row w-[354px] h-[52px]  top-[628px] left-[64px] gap-[16px]">
        <button className=" flex justify-center w-[207px] h-[52px] rounded-3xl p-x[16px] py-[8px] gap-[8px] bg-[#205457]">
          <span className="flex text-white font-[Outfit] font-medium text-[18px] items-center">
            Shop Now
          </span>
          <span className=" flex items-center text-white">
            <FaArrowRightLong />
          </span>
        </button>
        <div className="w-[123px] h-[20px]">
          <a
            href="#"
            className="flex items-center font-[Outfit] font-medium text-[16px] pt-3 text-white"
          >
            View All Products
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
