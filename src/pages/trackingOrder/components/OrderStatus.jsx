import { BsCheckSquareFill } from "react-icons/bs"; 
import { FaRegListAlt, FaClipboardCheck, FaBoxOpen, FaTruck, FaHome } from "react-icons/fa";
import React, { useState } from "react";
import { FaCheckSquare } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";

const OrderStatus = () => {
    const initialSteps = [
      {
        id: 1,
        title: "Order Placed",
        date: "20 Apr 2025",
        time: "11:00 AM",
        icon: <FaRegListAlt className="text-2xl" />,
        isCompleted: true,
      },
      {
        id: 2,
        title: "Accepted",
        date: "20 Apr 2025",
        time: "11:15 AM",
        icon: <FaCheckSquare className="text-2xl" />,
        isCompleted: true,
      },
      {
        id: 3,
        title: "In Progress",
        date: "Expected",
        time: "21 Apr 2025",
        icon: <FaBoxOpen className="text-2xl" />,
        isCompleted: false,
      },
      {
        id: 4,
        title: "On the Way",
        date: "Expected",
        time: "22,23 Apr 2025",
        icon: <FaTruck className="text-2xl" />,
        isCompleted: false,
      },
      {
        id: 5,
        title: "Delivered",
        date: "Expected",
        time: "24 Apr 2025",
        icon: <FaHome className="text-2xl" />,
        isCompleted: false,
      },
    ];

     const [steps, setSteps] = useState(initialSteps);
    
    const toggleStep = (index) => {
        const newSteps = [...steps];
        newSteps[index].isCompleted = !newSteps[index].isCompleted;
        setSteps(newSteps);
    };

    return (
        <section>
            
        {/* Stepper Card */}
        <div className="border border-gray-200 rounded-xl p-6 sm:p-10 mb-10 shadow-sm bg-white overflow-x-auto">
          {/* Container for the specific layout: Icons -> Bar -> Dates */}
          <div className="min-w-[700px]"> {/* Ensure min width for horizontal layout on small screens */}
            
            {/* 1. Icons and Titles Row */}
            <div className="grid grid-cols-5 text-center mb-4">
                {steps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center justify-end h-20">
                         <div className={`text-3xl mb-2 ${step.isCompleted ? 'text-[#e67e22]' : 'text-[#E0DFDF]'}`}>
                             {step.icon}
                         </div>
                         <h3 className={`text-sm font-semibold ${step.isCompleted ? 'text-gray-800' : 'text-[#E0DFDF]'}`}>
                            {step.title}
                        </h3>
                    </div>
                ))}
            </div>

            {/* 2. Progress Bar Row */}
            <div className="relative h-8 mb-4">
                {/* Background Line */}
                <div className="absolute top-1/2 left-[10%] w-[80%] h-2 bg-gray-200 -translate-y-1/2 z-0" />

                {/* Grid for Checkboxes and Segments */}
                <div className="grid grid-cols-5 relative z-10 h-full">
                    {steps.map((step, index) => {
                        const isLast = index === steps.length - 1;
                        // Logic: Line after this step is green ONLY if this step AND next step are completed
                        const isLineActive = step.isCompleted && steps[index + 1]?.isCompleted;
                        
                        return (
                        <div key={step.id} className="relative flex items-center justify-center">
                            
                            {/* Connector Line to the Right (Custom segment) */}
                            {!isLast && (
                                <div className={`absolute left-[50%] w-full h-2 top-1/2 -translate-y-1/2 -z-10 ${isLineActive ? 'bg-[#2F4F4F]' : 'bg-gray-200'}`} />
                            )}

                            {/* Checkbox Input (Hidden but functional or visual representation) */}
                            <label className="cursor-pointer bg-white">
                                <input 
                                    type="checkbox" 
                                    checked={step.isCompleted} 
                                    onChange={() => toggleStep(index)} 
                                    className="hidden" 
                                />
                                <div className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${step.isCompleted ? 'bg-[#2F4F4F] text-white' : 'bg-gray-200 text-[#E0DFDF]'}`}>
                                    <FaCheck className="text-sm" />
                                </div>
                            </label>
                        </div>
                    )})}
                </div>
            </div>

             {/* 3. Dates Row */}
             <div className="grid grid-cols-5 text-center">
                {steps.map((step) => (
                    <div key={step.id}>
                      <p className={`text-sm font-meduim ${step.isCompleted ? 'text-black ' : 'text-[#E0DFDF]'} `}>{step.date}</p>
                      <p className={`text-sm ${step.isCompleted ? 'text-black ' : 'text-[#E0DFDF]'} `}>{step.time}</p>
                    </div>
                ))}
            </div>

          </div>
        </div>
        </section>

    )
}

export default OrderStatus;