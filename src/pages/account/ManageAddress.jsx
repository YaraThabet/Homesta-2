import { useState } from "react";
import { Plus } from "lucide-react";

const countryData = {
  US: { flag: "🇺🇸", name: "United States" },
  UK: { flag: "🇬🇧", name: "United Kingdom" },
  CA: { flag: "🇨🇦", name: "Canada" },
  AU: { flag: "🇦🇺", name: "Australia" },
  EG: { flag: "🇪🇬", name: "Egypt" },
};

const ManageAddress = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      firstName: "Bexta",
      lastName: "Cooper",
      address: "4826 Royal Ln. Mesa, New Jersey 45463",
    },
    {
      id: 2,
      firstName: "Bexta",
      lastName: "Cooper",
      address: "Old Tight St. Cairo, Delaware 10299",
    },
  ]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingId(null);
    setFormData({
      firstName: "",
      lastName: "",
      companyName: "",
      country: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      email: "",
    });
  };

  const handleEdit = (address) => {
    setEditingId(address.id);
    setIsAddingNew(false);
    setFormData({
      firstName: address.firstName || "",
      lastName: address.lastName || "",
      companyName: "",
      country: "",
      streetAddress: address.address || "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      email: "",
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      setAddresses(addresses.filter((addr) => addr.id !== id));
    }
  };

  const handleSubmit = () => {
    if (editingId) {
      setAddresses(
        addresses.map((addr) =>
          addr.id === editingId
            ? {
                ...addr,
                firstName: formData.firstName,
                lastName: formData.lastName,
                address: formData.streetAddress,
              }
            : addr
        )
      );
    } else {
      const newAddress = {
        id: Date.now(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.streetAddress,
      };
      setAddresses([...addresses, newAddress]);
    }

    setIsAddingNew(false);
    setEditingId(null);
    setFormData({
      firstName: "",
      lastName: "",
      companyName: "",
      country: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      email: "",
    });
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3 bg-teal-600 text-white px-6 py-3 rounded-xl">
        <span className="text-lg font-medium">📍 Manage Address</span>
      </div>

      {/* Addresses List */}
      {!isAddingNew && !editingId && (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="border border-gray-200 rounded-xl p-6 flex items-start justify-between hover:border-teal-300 transition-colors"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {address.firstName} {address.lastName}
                </h3>
                <p className="text-gray-600">{address.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleEdit(address)}
                  className="text-teal-600 hover:text-teal-700 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Form */}
      {(isAddingNew || editingId) && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {editingId ? "Edit Address" : "Add New Address"}
          </h2>

          <div className="space-y-5">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Maram"
                  className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Barety"
                  className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name (Optional)
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Enter Company Name"
                className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country<span className="text-red-500">*</span>
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white"
              >
                <option value="">Select Country</option>
                {Object.entries(countryData).map(([code, { name }]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Street Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleInputChange}
                placeholder="Enter Street Address"
                className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Select City"
                className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State<span className="text-red-500">*</span>
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white"
              >
                <option value="">Select State</option>
                <option value="state1">State 1</option>
                <option value="state2">State 2</option>
              </select>
            </div>

            {/* Zip Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zip Code<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                placeholder="Enter Zip Code"
                className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone<span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter Phone Number"
                className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter Email Address"
                className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-start gap-4 pt-4">
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-teal-700 text-white font-medium rounded-xl hover:bg-teal-800 transition-colors"
              >
                {editingId ? "Save Changes" : "Add Address"}
              </button>
              <button
                onClick={handleCancel}
                className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Address Button */}
      {!isAddingNew && !editingId && (
        <button
          onClick={handleAddNew}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium hover:border-teal-500 hover:text-teal-600 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Address
        </button>
      )}
    </div>
  );
};

export default ManageAddress; // ManageAddress
