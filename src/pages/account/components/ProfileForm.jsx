import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, Edit, Globe, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppContext } from "../../../context/AppContext";

import SafeImage from "../../../components/SafeImage";

// Country data with flags and dial codes
const countryData = {
  US: { flag: '🇺🇸', code: '1', name: 'United States' },
  UK: { flag: '🇬🇧', code: '44', name: 'United Kingdom' },
  CA: { flag: '🇨🇦', code: '1', name: 'Canada' },
  AU: { flag: '🇦🇺', code: '61', name: 'Australia' },
  EG: { flag: '🇪🇬', code: '20', name: 'Egypt' }
};

const profileSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  lastName: z.string().trim().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  email: z.string().trim().email("Invalid email address").max(100, "Email must be less than 100 characters"),
  mobileNumber: z.string().trim().min(10, "Mobile number must be at least 10 digits").max(15, "Mobile number must be less than 15 digits").regex(/^[0-9+\s-]+$/, "Invalid phone number format"),
  gender: z.string().optional(),
  birthday: z.string().optional(),
  country: z.string().trim().min(1, "Country is required").max(100, "Country must be less than 100 characters"),
  address: z.string().trim().min(1, "Address is required").max(200, "Address must be less than 200 characters"),
  zipCode: z.string().trim().min(1, "Zip code is required").max(20, "Zip code must be less than 20 characters"),
});

const defaultValues = {
  firstName: "Maram",
  lastName: "Elamly",
  email: "maramahmed@gmail.com",
  mobileNumber: "0806 123 7890",
  gender: "",
  birthday: "",
  country: "EG",
  address: "123 Main Street, Spring",
  zipCode: "09021",
};

const ProfileForm = ({
  profileImage,
  onProfileImageChange,
  profileData,
  onProfileUpdate
}) => {
  const { showAlert } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('EG');
  const [imageFile, setImageFile] = useState(null); // Store the actual file

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ...defaultValues,
      ...profileData,
      country: profileData.country || "EG"
    },
    mode: "onChange",
  });

  // Watch for country changes
  const watchCountry = watch('country', 'EG');

  // Update selected country when the form's country changes
  useEffect(() => {
    if (watchCountry) {
      setSelectedCountry(watchCountry);
    }
  }, [watchCountry]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.match('image.*')) {
        showAlert('Please select an image file (JPEG, PNG, etc.)', 'warning', 'Invalid File');
        return;
      }

      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showAlert('Image size should be less than 5MB', 'warning', 'File Too Large');
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setImageFile(file); // Store the file for later upload
      // Pass both the preview URL and the actual file
      onProfileImageChange && onProfileImageChange(imageUrl, file);
    }
  };

  const onSubmit = (data) => {
    const formData = {
      ...data,
      profileImage: profileImage,
      imageFile: imageFile // Include the image file
    };
    onProfileUpdate(formData);
    // Don't show alert here - it's handled in the parent component
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset({
      ...profileData,
      country: profileData.country || "EG"
    });
    setSelectedCountry(profileData.country || 'EG');
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Profile Photo Section */}
      <div className="flex flex-col sm:flex-row items-start gap-5">
        <div className="relative group">
          <div className="h-[100px] w-[100px] rounded-full border-4 border-white bg-gray-100 shadow-md overflow-hidden flex items-center justify-center">
            <SafeImage
              src={profileImage}
              alt="Profile"
              type="profile"
              className="w-full h-full object-cover"
            />
          </div>
          {isEditing && (
            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="h-6 w-6 text-white" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          )}
        </div>

        <div className="flex-1 space-y-2">
          {isEditing ? (
            <label className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 text-sm font-medium text-white hover:opacity-90 transition-colors cursor-pointer w-60" style={{ backgroundColor: 'rgb(32, 84, 87)' }}>
              <Camera className="h-4 w-4" />
              Upload new photo
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          ) : (
            <div className="h-10"></div>
          )}
          <p className="text-sm text-gray-500 leading-relaxed hidden">
            At least 800*800 px recommended.<br />
            JPG or PNG is allowed
          </p>
        </div>

        <button
          type="button"
          onClick={isEditing ? handleCancel : handleEdit}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Edit className="h-4 w-4" />
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Form Section */}
      {!isEditing ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">First Name</p>
              <p className="mt-1 text-gray-900">{profileData?.firstName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Name</p>
              <p className="mt-1 text-gray-900">{profileData?.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="mt-1 text-gray-900">{profileData?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Mobile Number</p>
              <p className="mt-1 text-gray-900">{profileData?.mobileNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="mt-1 text-gray-900">{profileData?.address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">ZIP/Postal Code</p>
              <p className="mt-1 text-gray-900">{profileData?.zipCode}</p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Row 1: First Name, Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                First Name<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g., John"
                  className={`w-full h-12 px-4 rounded-xl border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Last Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g., Doe"
                  className={`w-full h-12 px-4 rounded-xl border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  {...register('lastName')}
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Row 2: Email, Mobile Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <div className="space-y-2 text-muted-foreground opacity-70">
              <label className="text-sm font-medium text-gray-900">Email (Uneditable)</label>
              <div className="relative">
                <input
                  type="email"
                  readOnly
                  placeholder="example@email.com"
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed outline-none"
                  {...register('email')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="flex">
                  <div className="flex items-center gap-1.5 px-3 border border-r-0 border-gray-300 rounded-l-xl bg-gray-50 min-w-[70px] justify-center">
                    <span className="text-base">{countryData[selectedCountry]?.flag || '🌐'}</span>
                    <span className="text-sm text-gray-500">+{countryData[selectedCountry]?.code || ''}</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="xxxx-xxx-xxxx"
                    className={`flex-1 h-12 px-4 rounded-r-xl border-l-0 ${errors.mobileNumber ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    {...register('mobileNumber')}
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="mt-1 text-xs text-red-500">{errors.mobileNumber.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Row 3: Gender, Birthday, Country */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Gender</label>
              <div className="relative">
                <div className="flex items-center h-12 px-4 rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <select
                    className="w-full bg-transparent outline-none text-sm text-gray-700"
                    {...register('gender')}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Birthday</label>
              <div className="relative">
                <input
                  type="date"
                  className={`w-full h-12 px-4 rounded-xl border ${errors.birthday ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  {...register('birthday')}
                />
                {errors.birthday && (
                  <p className="mt-1 text-xs text-red-500">{errors.birthday.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Country <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="flex items-center h-12 px-4 rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                  <Globe className="h-4 w-4 text-gray-400 mr-2" />
                  <select
                    className="w-full bg-transparent outline-none text-sm text-gray-700"
                    {...register('country')}
                  >
                    <option value="">Select country</option>
                    {Object.entries(countryData).map(([code, { name }]) => (
                      <option key={code} value={code}>{name}</option>
                    ))}
                  </select>
                </div>
                {errors.country && (
                  <p className="mt-1 text-xs text-red-500">{errors.country.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g., 123 Main Street, Apt 4B"
                className={`w-full h-12 px-4 rounded-xl border ${errors.address ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                {...register('address')}
              />
              {errors.address && (
                <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>
              )}
            </div>
          </div>

          {/* Zip Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                ZIP/Postal Code <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g., 12345 or 12345-6789"
                  className={`w-full h-12 px-4 rounded-xl border ${errors.zipCode ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  {...register('zipCode')}
                />
                {errors.zipCode && (
                  <p className="mt-1 text-xs text-red-500">{errors.zipCode.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="submit"
              className="px-6 py-3 text-sm font-medium text-white border border-transparent rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              style={{ backgroundColor: 'rgb(32, 84, 87)' }}
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileForm;