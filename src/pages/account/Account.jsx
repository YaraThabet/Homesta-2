import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AccountSidebar from "./components/AccountSidebar";
import ProfileForm from "./components/ProfileForm";
import { IoClose } from "react-icons/io5";
import FooterBenefits from "../shop/components/FooterBenefits";
import api from "../../lib/axios";
import { useAppContext } from "../../context/AppContext";

/* ===============================
   Initial Profile Data
================================ */
const getInitialProfileData = () => {
  const savedProfile = localStorage.getItem("userProfile");

  if (savedProfile) {
    return JSON.parse(savedProfile);
  }

  const userName = localStorage.getItem("userName") || "";
  const userEmail = localStorage.getItem("userEmail") || "";

  const nameParts = userName.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return {
    firstName,
    lastName,
    email: userEmail
  };
};

/* ===============================
   Initial Profile Image
================================ */
const getInitialProfileImage = () => {
  const savedProfile = localStorage.getItem("userProfile");
  if (savedProfile) {
    const parsedProfile = JSON.parse(savedProfile);
    // Only return the image URL if it's not a blob URL (starts with 'blob:')
    if (parsedProfile.profileImage && !parsedProfile.profileImage.startsWith('blob:')) {
      return parsedProfile.profileImage;
    }
  }
  return null;
};

const Account = () => {
  const { showAlert } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState(getInitialProfileData);
  const [profileImage, setProfileImage] = useState(getInitialProfileImage);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  // Fetch user profile from API
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/User/${userId}`);
        const userData = response.data;

        const profileFromApi = {
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          mobileNumber: userData.phoneNumber || "",
          gender: userData.gender || "",
          birthday: userData.birthdate || "",
          country: userData.country || "EG",
          address: userData.address || "",
          zipCode: userData.zipCode || "",
          // Only set profileImage if it's a valid URL from the server
          ...(userData.imageUrl && { profileImage: userData.imageUrl })
        };

        setProfileData(prev => ({
          ...prev,
          ...profileFromApi
        }));

        // Update profile image if we have one from the server
        if (userData.imageUrl) {
          setProfileImage(userData.imageUrl);
        } else {
          // Clear any existing image if the server doesn't return one
          setProfileImage(null);
        }

        // Update localStorage with the complete profile data including the image URL
        localStorage.setItem("userProfile", JSON.stringify({
          ...profileFromApi,
          ...(userData.imageUrl && { profileImage: userData.imageUrl })
        }));
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        // Keep using localStorage data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const updateProfileData = async (newData) => {
    if (!userId) {
      showAlert("User ID not found. Please log in again.", "error", "Error");
      return;
    }

    try {
      // Prepare FormData for multipart/form-data
      const formData = new FormData();
      formData.append("FirstName", newData.firstName || "");
      formData.append("LastName", newData.lastName || "");
      formData.append("Email", newData.email || "");
      formData.append("PhoneNumber", newData.mobileNumber || "");
      formData.append("Gender", newData.gender || "");
      formData.append("Birthdate", newData.birthday || "");
      formData.append("Country", newData.country || "");
      formData.append("ZipCode", newData.zipCode || "");
      formData.append("Address", newData.address || "");

      // If there's a new profile image file, append it
      if (newData.imageFile) {
        formData.append("ImageFile", newData.imageFile);
      }

      // Update via API
      const updateResponse = await api.put(`/User/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Get the updated user data from the response
      const userData = updateResponse.data;

      // Create a clean profile object with all the fields
      const updatedProfile = {
        ...profileData, // Keep existing data
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        mobileNumber: userData.phoneNumber || "",
        gender: userData.gender || "",
        birthday: userData.birthdate || "",
        country: userData.country || "EG",
        address: userData.address || "",
        zipCode: userData.zipCode || "",
      };

      // If we have a new image URL from the server, update it
      if (userData.imageUrl) {
        updatedProfile.profileImage = userData.imageUrl;
        setProfileImage(userData.imageUrl);
      }

      // Update both state and localStorage
      setProfileData(prev => ({
        ...prev,
        ...updatedProfile,
        // Clear the imageFile after successful upload
        imageFile: null
      }));

      // Save to localStorage without the imageFile
      const { imageFile, ...profileForStorage } = updatedProfile;
      localStorage.setItem("userProfile", JSON.stringify(profileForStorage));

      showAlert("Profile updated successfully!", "success", "Success");
    } catch (error) {
      console.error("Failed to update profile:", error);
      showAlert(
        error.response?.data?.message || "Failed to update profile. Please try again.",
        "error",
        "Error"
      );
    }
  };

  const handleProfileImageChange = (imageUrl, imageFile) => {
    // Only update the local state with the blob URL for preview
    setProfileImage(imageUrl);
    // Store the file in the profile data for form submission
    // We don't store the blob URL in localStorage as it will be invalid after refresh
    setProfileData(prev => ({
      ...prev,
      imageFile: imageFile  // Store the file for upload
    }));
  };

  const location = useLocation();
  const isRootAccountPath =
    location.pathname === "/account" ||
    location.pathname === "/account/";

  return (
    <div className="min-h-screen bg-gray-100 pt-24 md:pt-32">
      <div className="px-4 md:px-8 py-8">
        {/* Mobile Menu Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
            Menu
          </button>

          {/* Mobile Sidebar */}
          <div
            className={`fixed inset-0 z-50 flex lg:hidden ${sidebarOpen ? "block" : "hidden"
              }`}
          >
            {/* Overlay */}
            <div
              className={`fixed inset-0 bg-black transition-opacity duration-300 ${sidebarOpen
                ? "opacity-50"
                : "opacity-0 pointer-events-none"
                }`}
              onClick={() => setSidebarOpen(false)}
            ></div>

            {/* Sidebar */}
            <div
              className={`relative flex flex-col w-4/5 max-w-sm bg-white h-full shadow-xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
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

      <FooterBenefits />
    </div>
  );
};

export default Account;
