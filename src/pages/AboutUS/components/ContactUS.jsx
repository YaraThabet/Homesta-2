import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Package,
  CreditCard,
  Headphones,
} from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Message sent successfully!");
    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const features = [
    {
      icon: <Package className="w-6 h-6" />,
      title: "Free Shipping",
      description: "Free shipping for order above $150",
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Flexible Payment",
      description: "Multiple secure payment options",
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "24x7 Support",
      description: "We support online 24 hours a days",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
      <div className="bg-teal-800 text-white py-4 px-6 text-center">
        <p className="text-sm">
          Call us: +123-456-789 | Sign up and Get 25% Off for your first order.{" "}
          <span className="underline cursor-pointer">Sign up now</span>
        </p>
      </div>

      {/* Page Header */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Contact Us
          </h1>
          <p className="text-gray-600">
            <span className="cursor-pointer hover:text-teal-700">Home</span> /{" "}
            <span className="text-gray-900 font-medium">Contact Us</span>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Form */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Get in Touch
              </h2>
              <p className="text-gray-600">
                Your email address will not be published. Required fields are
                marked *
              </p>
            </div>

            <div className="space-y-6">
              {/* Name and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Reason Ahmed"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="reasonahmed@gmail.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter Subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Description..."
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition resize-none"
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="bg-teal-800 hover:bg-teal-900 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Send Message
              </button>
            </div>
          </div>

          {/* Right Side - Contact Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-teal-800 text-white rounded-lg p-8 shadow-lg sticky top-8">
              {/* Address */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Address</h3>
                <p className="text-teal-100 leading-relaxed">
                  8502 Preston Rd. Inglewood, Maine 98380
                </p>
              </div>

              {/* Contact */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Contact</h3>
                <div className="space-y-2">
                  <p className="flex items-center text-teal-100">
                    <Phone className="w-4 h-4 mr-2" />
                    +123-456-789
                  </p>
                  <p className="flex items-center text-teal-100">
                    <Mail className="w-4 h-4 mr-2" />
                    example@gmail.com
                  </p>
                </div>
              </div>

              {/* Open Time */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Open Time</h3>
                <div className="text-teal-100 space-y-1">
                  <p>Monday - Friday: 10:00-22</p>
                  <p>Saturday-Sunday: 10:00-20:00</p>
                </div>
              </div>

              {/* Stay Connected */}
              <div>
                <h3 className="text-xl font-bold mb-4">Stay Connected</h3>
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-amber-100 hover:bg-amber-200 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                    <Facebook size={18} className="text-teal-800" />
                  </div>
                  <div className="w-10 h-10 bg-amber-100 hover:bg-amber-200 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                    <Twitter size={18} className="text-teal-800" />
                  </div>
                  <div className="w-10 h-10 bg-amber-100 hover:bg-amber-200 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                    <Linkedin size={18} className="text-teal-800" />
                  </div>
                  <div className="w-10 h-10 bg-amber-100 hover:bg-amber-200 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                    <Instagram size={18} className="text-teal-800" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="w-full h-96 bg-gray-200 relative overflow-hidden">
        <img
          src="/img/map.png"
          alt="Location Map"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 bg-amber-50 rounded-lg"
              >
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
