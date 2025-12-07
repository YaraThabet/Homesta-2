import { useState } from "react";
import AccountSidebar from "./components/AccountSidebar";
import ProfileForm from "./components/ProfileForm";

const Account = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
  <div className="min-h-screen bg-gray-100 pt-24 md:pt-32"> {/* Added top padding */}
    <div className="px-4 md:px-8 py-8">
        {/* Mobile Menu Button - Simplified with Tailwind */}
        <div className="lg:hidden mb-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            Menu
          </button>
          
          {/* Mobile Sidebar */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
              <div className="relative flex flex-col w-full max-w-xs bg-white h-full shadow-xl">
                <AccountSidebar className="h-full" />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:flex w-full lg:w-[280px] flex-shrink-0">
            <AccountSidebar className="w-full" />
          </div>
          
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10">
              <ProfileForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
