import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock, Plus, Minus } from "lucide-react";

const CustomerSupport = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [openFAQ, setOpenFAQ] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    alert("Message sent successfully!");
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      subtitle: "Available 24/7",
      info: "+123-456-789",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      subtitle: "Reply within 24 hours",
      info: "Support@homesta.com",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      subtitle: "Furniture Showroom",
      info: "8502 Person Rd",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Working Hours",
      subtitle: "Sunday - Thursday",
      info: "9:00 AM - 6:00 PM",
    },
  ];

  const faqs = [
    {
      question: "How can I track my order?",
      answer:
        "You can track your order by logging into your account and visiting the 'Track Order' page. Enter your order ID and email address to see real-time updates on your shipment status.",
    },
    {
      question: "What is your return and exchange policy?",
      answer:
        "We offer a 30-day return policy for all unused items in original packaging. Exchange requests can be made within 14 days of delivery. Please contact our support team to initiate a return or exchange.",
    },
    {
      question: "What payment methods are available?",
      answer:
        "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, PayPal, and cash on delivery for select locations. All transactions are secured with SSL encryption.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Standard delivery takes 5-7 business days. Express delivery (2-3 days) is available for an additional fee. Delivery times may vary based on your location and product availability.",
    },
    {
      question: "Can I modify or cancel my order?",
      answer:
        "Orders can be modified or cancelled within 2 hours of placement. After this time, the order enters processing and cannot be changed. Please contact us immediately if you need to make changes.",
    },
    {
      question: "Do you offer assembly service?",
      answer:
        "Yes! We provide professional assembly service for an additional fee. Our experienced team will assemble your furniture at your location. Select this option at checkout or contact us for more details.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Customer Support
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We'd love to help. Please feel free to reach out to us with any
            questions or inquiries
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 mx-auto mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{item.subtitle}</p>
              <p className="text-sm font-semibold text-gray-900">{item.info}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send Us a Message
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your Full Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="yourmail@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 XXX XXX XXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Your Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Write your message here"
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 resize-none"
                ></textarea>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-teal-800 text-white py-3 rounded-lg font-semibold hover:bg-teal-900 transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Send Message
              </button>
            </div>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="font-semibold text-gray-900">
                      {faq.question}
                    </span>
                    {openFAQ === index ? (
                      <Minus className="w-5 h-5 text-teal-700 flex-shrink-0" />
                    ) : (
                      <Plus className="w-5 h-5 text-teal-700 flex-shrink-0" />
                    )}
                  </button>

                  {openFAQ === index && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Didn't Find What You're Looking For?
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            You can also reach us via social media or call our help center for
            more information
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-white border-2 border-teal-800 text-teal-800 font-semibold rounded-lg hover:bg-teal-50 transition-colors">
              Help Center
            </button>
            <button
              className="px-6 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
              style={{ backgroundColor: "#B19470" }}
            >
              Chat with Support Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;
