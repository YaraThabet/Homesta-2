import React from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Home,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

const About = () => {
  const stats = [
    { value: "25+", label: "Years" },
    { value: "180+", label: "Employees" },
    { value: "100k+", label: "Customers" },
    { value: "35+", label: "Stores" },
    { value: "98%", label: "Satisfied" },
  ];

  const qualityStandards = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Our Quality Wood",
      description:
        "We exclusively use premium hardwoods including oak, walnut, and maple sourced from sustainable forests. Each wood piece is carefully selected, kiln-dried to perfection, and inspected for grain quality and durability.",
    },
    {
      icon: <Home className="w-8 h-8" />,
      title: "Comfort-Driven Design",
      description:
        "Great furniture should feel as good as it looks. Our design philosophy centers on ergonomic excellence and everyday comfort. From the perfect seat depth to supportive cushioning, every Homesta piece is engineered for real living.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <header className="bg-[#F6F6F6] py-12 pt-[180px]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            About Us
          </h1>
          <nav className="text-sm text-gray-500">
            <Link to="/" className="hover:text-[#205457] transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#205457]">About Us</span>
          </nav>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 ">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
            <span className="text-gray-900">Crafted Comfort: </span>
            <span style={{ color: "#205457" }}>Quality</span>
          </h1>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
            <span className="text-gray-900">Materials, </span>
            <span style={{ color: "#205457" }}>Enduring Designs</span>
          </h2>

          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-base mb-2">
            At Homesta, we believe your home deserves furniture that tells a
            story. For over 25 years, we've been handcrafting premium furniture
            pieces that blend timeless elegance with modern functionality. Each
            piece is carefully designed and built to become a cherished part of
            your home for generations to come.
          </p>

          <p className="text-gray-900 font-semibold mt-4 text-lg">
            Jenny Alexander
          </p>
        </div>

        {/* IMAGE SECTION - Improved with better object positioning */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {/* Left large image */}
          <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img
              src="/img/about-1.png"
              alt="Workshop craftsman"
              className="w-full h-[400px] md:h-[500px] object-cover"
              style={{ objectPosition: "center 30%" }}
            />
          </div>

          {/* Right 2 images stacked */}
          <div className="grid grid-rows-2 gap-4">
            <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img
                src="/img/about-2.png"
                alt="Craftsman at work"
                className="w-full h-[195px] md:h-[243px] object-cover"
                style={{ objectPosition: "center 20%" }}
              />
            </div>

            <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img
                src="/img/about-3.png"
                alt="Design process"
                className="w-full h-[195px] md:h-[243px] object-cover"
                style={{ objectPosition: "center 30%" }}
              />
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-teal-800 text-white rounded-lg py-10 px-6 mb-16 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            {stats.map((s, i) => (
              <div
                key={i}
                className="transform hover:scale-105 transition-transform"
              >
                <p className="text-3xl md:text-4xl font-bold mb-2">{s.value}</p>
                <p className="text-teal-100 text-xs md:text-sm uppercase tracking-wider">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Quality image */}
          <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img
              src="/img/about-1.png"
              alt="Quality team member"
              className="w-full h-[400px] md:h-[550px] object-cover"
              style={{ objectPosition: "center 25%" }}
            />
          </div>

          {/* Quality text */}
          <div>
            <p className="text-teal-700 font-medium mb-3 text-base">
              - Our Product Quality
            </p>

            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Setting the Standard for{" "}
              <span style={{ color: "#205457" }}>Quality at Homesta</span>
            </h3>

            <p className="text-gray-600 mb-10 leading-relaxed text-base">
              Quality is not just a promise at Homesta—it's our foundation. We
              source only the finest materials, from sustainably harvested
              hardwoods to premium fabrics, ensuring every piece meets our
              rigorous standards. Our skilled craftsmen bring decades of
              experience to every detail, from the precision of each joint to
              the smooth finish of every surface. When you choose Homesta,
              you're choosing furniture built to last a lifetime.
            </p>

            <div className="space-y-8">
              {qualityStandards.map((item, index) => (
                <div key={index} className="flex gap-5">
                  <div className="flex-shrink-0 w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 shadow-sm">
                    {item.icon}
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Team Header */}
          <div className="text-center mb-12">
            <p className="text-teal-700 font-medium mb-3 text-base">
              - Our Team
            </p>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Meet Our Team
            </h3>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Team Member 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-80 overflow-hidden">
                <img
                  src="/img/person2.avif"
                  alt="Jenny Alexander"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-1 text-center">
                  Jenny Alexander
                </h4>
                <p className="text-teal-700 font-medium mb-4 text-center">
                  CEO & Founder
                </p>

                {/* Social Icons */}
                <div className="flex justify-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white cursor-pointer hover:bg-blue-700 transition-colors">
                    <Facebook size={18} />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white cursor-pointer hover:bg-blue-500 transition-colors">
                    <Twitter size={18} />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white cursor-pointer hover:bg-blue-800 transition-colors">
                    <Linkedin size={18} />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center text-white cursor-pointer hover:opacity-90 transition-opacity">
                    <Instagram size={18} />
                  </div>
                </div>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-80 overflow-hidden">
                <img
                  src="/img/team2.png"
                  alt="Robert Fox"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-1 text-center">
                  Robert Fox
                </h4>
                <p className="text-teal-700 font-medium mb-4 text-center">
                  Master Carpenter
                </p>

                {/* Social Icons */}
                <div className="flex justify-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white cursor-pointer hover:bg-blue-700 transition-colors">
                    <Facebook size={18} />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white cursor-pointer hover:bg-blue-500 transition-colors">
                    <Twitter size={18} />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white cursor-pointer hover:bg-blue-800 transition-colors">
                    <Linkedin size={18} />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center text-white cursor-pointer hover:opacity-90 transition-opacity">
                    <Instagram size={18} />
                  </div>
                </div>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-80 overflow-hidden">
                <img
                  src="/img/person 3.avif"
                  alt="Theresa Webb"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-1 text-center">
                  Jhon Webb
                </h4>
                <p className="text-teal-700 font-medium mb-4 text-center">
                  Head Designer
                </p>

                {/* Social Icons */}
                <div className="flex justify-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white cursor-pointer hover:bg-blue-700 transition-colors">
                    <Facebook size={18} />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white cursor-pointer hover:bg-blue-500 transition-colors">
                    <Twitter size={18} />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white cursor-pointer hover:bg-blue-800 transition-colors">
                    <Linkedin size={18} />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center text-white cursor-pointer hover:opacity-90 transition-opacity">
                    <Instagram size={18} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
