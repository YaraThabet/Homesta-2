import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import PageLoader from "../components/PageLoader";
import SafeImage from "../components/SafeImage";

const Category = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("Category");

        // api.get returns the response object, data is in response.data
        const data = response.data;
        console.log("Categories Data:", data);
        if (data.length > 0) {
          console.log("First Image Path Example:", data[0].imagePath);
        }

        // Removed filter to verify data visibility
        setCategories(data);
      } catch (err) {
        console.error(err);
        setError("Error while loading categories ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // ===== حالات التحميل والخطأ =====
  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="w-full min-h-[1024px] bg-[#F5F5F5] flex justify-center p-4 pt-[120px] pb-[120px]">
      <div className="w-[1312px] mt-16 mx-auto flex flex-col gap-[32px]">
        <p className="font-[Outfit] text-[#43766C] text-[32px] font-medium text-center">
          Explore by Category
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {categories.map((category) => (
            <button
              type="button"
              key={category.categoryId}
              onClick={() => navigate(`/category/${category.categoryId}`)}
              className=" relative h-[238px] rounded-[18px] overflow-hidden
               focus:outline-none focus:ring-4 focus:ring-[#43766C]/40
               transform transition-all duration-300
               hover:scale-[1.03] hover:shadow-xl
               active:scale-[0.97] group"
            >
              <div className="absolute inset-0 z-0">
                <SafeImage
                  src={category.imagePath}
                  alt={category.name}
                  type="category"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>

              {/* Category Name */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <h2 className="text-white text-2xl font-semibold text-center drop-shadow-md">
                  {category.name}
                </h2>
              </div>
            </button>
          ))}
        </div>

        {categories.length === 0 && (
          <p className="text-center text-gray-500">No categories available</p>
        )}
      </div>
    </div>
  );
};

export default Category;
