import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AccountSidebar from "./components/AccountSidebar";
import ProfileForm from "./components/ProfileForm";
import { IoClose } from "react-icons/io5";
import FooterBenefits from "../shop/components/FooterBenefits";

const Account = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileData, setProfileData] = useState({
    firstName: "Maram",
    lastName: "Elamly",
    email: "maramahmed@gmail.com"
  });

  // Load profile data from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfileData(parsedProfile);
      if (parsedProfile.profileImage) {
        setProfileImage(parsedProfile.profileImage);
      }
    }
  }, []);

  const updateProfileData = (newData) => {
    const updatedProfile = { ...profileData, ...newData };
    setProfileData(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  };

  const handleProfileImageChange = (imageUrl) => {
    setProfileImage(imageUrl);
    updateProfileData({ profileImage: imageUrl });
  };

  const location = useLocation();
  const isRootAccountPath = location.pathname === '/account' || location.pathname === '/account/';

  return (
    <div className="min-h-screen bg-gray-100 pt-24 md:pt-32">
      <div className="px-4 md:px-8 py-8">
        {/* Mobile Menu Button */}
        <div className="lg:hidden mb-4">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            Menu
          </button>
          
          {/* Mobile Sidebar */}
          <div className={`fixed inset-0 z-50 flex lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
            {/* Overlay */}
            <div 
              className={`fixed inset-0 bg-black transition-opacity duration-300 ${
                sidebarOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
              }`}
              onClick={() => setSidebarOpen(false)}
            ></div>
            
            {/* Sidebar */}
            <div 
              className={`relative flex flex-col w-4/5 max-w-sm bg-white h-full shadow-xl transform transition-transform duration-300 ease-in-out ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600 transition-colors z-10"
                aria-label="Close sidebar"
              >
                <IoClose className="w-6 h-6" />
              </button>
              
              {/* Sidebar Content */}
              <div className="pt-16 px-4 overflow-y-auto h-full">
                <AccountSidebar 
                  onNavigate={() => setSidebarOpen(false)}
                  profileImage={profileImage}
                  firstName={profileData.firstName}
                  lastName={profileData.lastName}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:flex w-full lg:w-[280px] flex-shrink-0">
            <AccountSidebar 
              profileImage={profileImage}
              firstName={profileData.firstName}
              lastName={profileData.lastName}
            />
          </div>
          
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10">
              {isRootAccountPath ? (
                <ProfileForm 
                  profileImage={profileImage}
                  onProfileImageChange={handleProfileImageChange}
                  profileData={profileData}
                  onProfileUpdate={updateProfileData}
                />
              ) : (
                <Outlet />
              )}
            </div>
          </div>
        </div>
      </div>
      <FooterBenefits/>
    </div>
  );
};

export default Account;