import React from "react";
import AdvantagesItems from "../../../components/AdvantagesItems";

const Advantages = () => {
  return (
    <div className="w-full min-h-screen px-4 md:px-8 lg:px-16 xl:px-24 py-8 md:py-16">
      <AdvantagesItems/>
      <div className="flex flex-col xl:flex-row gap-8 md:gap-12 xl:gap-16">
        <div className="w-full xl:w-1/2 bg-[#E0DFDF] rounded-[20px] p-4 md:p-8 relative min-h-[400px] md:min-h-[672px] flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center flex-1">
            <div className="flex flex-col gap-6 md:gap-8 w-full md:w-auto">
              <div className="flex flex-row w-[125px] h-[41px] bg-white rounded-[20px] p-2 gap-2">
                <div className="flex w-full h-full items-center justify-center">
                  <p className="font-[Outfit] font-medium text-[16px] md:text-[20px] text-[#205457]">
                    1500+ <span className="text-[#000]">Items</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4 md:gap-6">
                <p className="font-[Outfit] font-medium text-[28px] md:text-[32px] lg:text-[36px]">
                  Chairs
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2 md:gap-3">
                  {[
                    "Gaming Chair",
                    "Lounge Chair",
                    "Folding Chair",
                    "Dining Chair",
                    "Office Chair",
                    "Armchair",
                    "Bar Stool",
                    "Club Chair",
                  ].map((item) => (
                    <p
                      key={item}
                      className="font-[Outfit] font-normal text-[16px] md:text-[18px] text-[#4D4A4A]"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-6 md:mt-0">
              <div className="relative w-[200px] h-[200px] md:w-[300px] md:h-[300px] lg:w-[324px] lg:h-[412px]">
                <img
                  src="/public/img/item1.png"
                  alt="Chairs"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full xl:w-1/2 flex flex-col gap-8 md:gap-12">
          <div className="bg-[#E0DFDF] rounded-[20px] p-4 md:p-8 relative min-h-[300px] md:min-h-[325px] flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center flex-1">
              <div className="flex flex-col gap-6 md:gap-8 w-full md:w-auto">
                <div className="flex flex-row w-[125px] h-[41px] bg-white rounded-[20px] p-2 gap-2">
                  <div className="flex w-full h-full items-center justify-center">
                    <p className="font-[Outfit] font-medium text-[16px] md:text-[20px] text-[#205457]">
                      750+ <span className="text-[#000]">Items</span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 md:gap-6">
                  <p className="font-[Outfit] font-medium text-[28px] md:text-[32px] lg:text-[36px]">
                    Sofa
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2 md:gap-3">
                    {[
                      "Reception Sofa",
                      "Sectional Sofa",
                      "Armless Sofa",
                      "Curved Sofa",
                    ].map((item) => (
                      <p
                        key={item}
                        className="font-[Outfit] font-normal text-[16px] md:text-[18px] text-[#4D4A4A]"
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-6 md:mt-0">
                <div className="relative w-[150px] h-[150px] md:w-[200px] md:h-[200px] lg:w-[216px] lg:h-[309px]">
                  <img
                    src="/public/img/item2.png"
                    alt="Sofa"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#E0DFDF] rounded-[20px] p-4 md:p-8 relative min-h-[300px] md:min-h-[325px] flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center flex-1">
              <div className="flex flex-col gap-6 md:gap-8 w-full md:w-auto">
                <div className="flex flex-row w-[125px] h-[41px] bg-white rounded-[20px] p-2 gap-2">
                  <div className="flex w-full h-full items-center justify-center">
                    <p className="font-[Outfit] font-medium text-[16px] md:text-[20px] text-[#205457]">
                      450+ <span className="text-[#000]">Items</span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 md:gap-6">
                  <p className="font-[Outfit] font-medium text-[28px] md:text-[32px] lg:text-[36px]">
                    Lighting
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2 md:gap-3">
                    {[
                      "Table Lights",
                      "Floor Lights",
                      "Ceiling Lights",
                      "Wall Lights",
                    ].map((item) => (
                      <p
                        key={item}
                        className="font-[Outfit] font-normal text-[16px] md:text-[18px] text-[#4D4A4A]"
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-6 md:mt-0">
                <div className="relative w-[150px] h-[150px] md:w-[200px] md:h-[200px] lg:w-[216px] lg:h-[309px]">
                  <img
                    src="/public/img/item3.png"
                    alt="Lighting"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advantages;
