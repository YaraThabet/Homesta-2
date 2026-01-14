import { BsCheckSquareFill } from "react-icons/bs";
import { FaRegListAlt, FaClipboardCheck, FaBoxOpen, FaTruck, FaHome } from "react-icons/fa";
import React from "react";
import { FaCheckSquare, FaCheck } from "react-icons/fa";

const OrderStatus = ({ status }) => {
  // Logic to determine which steps are completed based on status string
  const getStatusIndex = (s) => {
    const lowerStatus = (s || '').toLowerCase();
    if (lowerStatus === 'cancelled') return -1;
    if (lowerStatus === 'delivered') return 5;
    if (lowerStatus === 'shipped') return 4;
    if (lowerStatus === 'processing' || lowerStatus === 'accepted') return 3;
    if (lowerStatus === 'confirmed') return 2;
    return 1; // Order Placed
  };

  const activeIndex = getStatusIndex(status);
  const isCancelled = activeIndex === -1;

  const steps = [
    {
      id: 1,
      title: "Order Placed",
      icon: <FaRegListAlt />,
      isCompleted: activeIndex >= 1,
    },
    {
      id: 2,
      title: "Accepted",
      icon: <FaCheckSquare />,
      isCompleted: activeIndex >= 2,
    },
    {
      id: 3,
      title: "In Progress",
      icon: <FaBoxOpen />,
      isCompleted: activeIndex >= 3,
    },
    {
      id: 4,
      title: "On the Way",
      icon: <FaTruck />,
      isCompleted: activeIndex >= 4,
    },
    {
      id: 5,
      title: "Delivered",
      icon: <FaHome />,
      isCompleted: activeIndex >= 5,
    },
  ];

  return (
    <section className="font-outfit">
      <div className="border border-gray-100 rounded-[20px] sm:rounded-[30px] p-4 sm:p-10 mb-8 sm:mb-10 shadow-sm bg-white overflow-x-auto custom-scrollbar">
        <div className="min-w-[500px] sm:min-w-[700px]">
          {/* Icons and Titles Row */}
          <div className="grid grid-cols-5 text-center mb-6 sm:mb-8">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center justify-end h-16 sm:h-20">
                <div className={`text-2xl sm:text-4xl mb-2 sm:mb-3 transition-all duration-500 ${isCancelled ? 'text-red-400 opacity-50' : step.isCompleted ? 'text-[#205457]' : 'text-gray-200'}`}>
                  {step.icon}
                </div>
                <h3 className={`text-[8px] sm:text-xs font-black uppercase tracking-widest ${isCancelled ? 'text-red-500 font-bold' : step.isCompleted ? 'text-gray-900' : 'text-gray-300'}`}>
                  {isCancelled ? 'Cancelled' : step.title}
                </h3>
              </div>
            ))}
          </div>

          {/* Progress Bar Row */}
          <div className="relative h-1 mb-4 flex items-center">
            <div className="absolute top-1/2 left-[10%] w-[80%] h-[1px] sm:h-1 bg-gray-100 -translate-y-1/2 z-0 rounded-full" />

            <div className="grid grid-cols-5 relative z-10 w-full">
              {steps.map((step, index) => {
                const isLast = index === steps.length - 1;
                const isLineActive = !isCancelled && step.isCompleted && steps[index + 1]?.isCompleted;

                return (
                  <div key={step.id} className="relative flex items-center justify-center">
                    {!isLast && (
                      <div className={`absolute left-[50%] w-full h-[1px] sm:h-1 top-1/2 -translate-y-1/2 -z-10 transition-all duration-700 ${isLineActive ? 'bg-[#205457]' : isCancelled ? 'bg-red-200/50' : 'bg-transparent'}`} />
                    )}

                    <div className={`w-6 h-6 sm:w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-500 ${isCancelled ? 'bg-red-500 text-white scale-110' : step.isCompleted ? 'bg-[#205457] text-white scale-110' : 'bg-white text-gray-200 border border-gray-100'}`}>
                      {isCancelled ? <FaBoxOpen className="text-[10px] sm:text-[14px]" /> : <FaCheck className="text-[8px] sm:text-[10px]" />}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Meta Row */}
          <div className="grid grid-cols-5 text-center mt-4 sm:mt-6">
            {steps.map((step) => (
              <div key={step.id}>
                <p className={`text-[7px] sm:text-[10px] font-black uppercase tracking-widest ${isCancelled ? 'text-red-400' : step.isCompleted ? 'text-[#205457]' : 'text-gray-200'}`}>
                  {isCancelled ? 'Stopped' : step.isCompleted ? 'Verified' : 'Pending'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderStatus;