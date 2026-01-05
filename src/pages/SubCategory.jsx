import React, { useEffect, useState } from "react";
import PageLoader from "../components/PageLoader";
import api from "../lib/axios";

const SubCategory = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await api.get("/SubCategory");

        // api.get returns the response object, data is in response.data
        const data = response.data;
        console.log("SubCategories Data:", data);
        if (data.length > 0) {
          console.log("First Image Path Example:", data[0].imagePath);
        }

        // Removed filter to verify data visibility
        setSubCategories(data);
      } catch (err) {
        console.error(err);
        setError("Error while loading subcategories ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="w-full min-h-screen bg-[#F5F5F5] flex justify-center pt-32 pb-16 px-4">
      {/* Main Container */}
      <div className="w-full max-w-[1312px] flex flex-col gap-8 pt-[50px]">
        {/* Title Dynamic */}
        <div className="w-full py-4">
          <h1 className="font-[Outfit] text-[#205457] text-[42px] font-medium text-center capitalize">
            Electronic
          </h1>
        </div>

        {/* SubCategories Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subCategories
            .filter((item) => ![1].includes(item.subCategoryId))
            .map((item) => (
              <div
                key={item.subCategoryId}
                onClick={() => handleSubCategoryClick(item.name)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group z-10"
              >
                {/* Image Container */}
                <div className=" h-56 bg-gray-100 overflow-hidden">
                  <img
                    src={item.imagePath
                      ? `http://homefinish.runasp.net/${item.imagePath.startsWith('/') ? item.imagePath.substring(1) : item.imagePath}`
                      : ''}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.backgroundColor = '#e5e7eb';
                    }}
                  />
                </div>

                {/* Info */}
                <div className="p-4 text-center">
                  <h3 className="font-[Outfit] text-[#0E0E0E] text-xl font-semibold group-hover:text-[#205457] transition-colors">
                    {item.name}
                  </h3>
                </div>
              </div>
            ))}
        </div>

        {/* Pagination placeholder */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <button className="w-10 h-10 flex items-center justify-center text-[#205457] hover:bg-[#205457] hover:text-white border border-[#205457] rounded-full transition-all">
            &lt;
          </button>
          <button className="w-10 h-10 flex items-center justify-center bg-[#205457] text-white rounded-full font-bold shadow-md">
            1
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-[#205457] hover:bg-[#205457] hover:text-white border border-[#205457] rounded-full transition-all">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubCategory;
