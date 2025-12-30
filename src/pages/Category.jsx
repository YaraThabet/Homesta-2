import React, { useEffect, useState } from "react";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/proxy/Category"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();

        const filteredCategories = data.filter(
          (category) => ![1, 2, 3, 4, 5, 14].includes(category.categoryId)
        );

        setCategories(filteredCategories);
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="w-full min-h-[1024px] bg-[#F8FAE5] flex justify-center">
      <div className="w-[1312px] mt-16 mx-auto flex flex-col gap-[32px]">
        <p className="font-[Outfit] text-[#43766C] text-[32px] font-medium text-center">
          Explore by Category
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {categories.map((category) => (
            <div
              key={category.categoryId}
              className="relative h-[238px] rounded-[15px] overflow-hidden"
              style={{
                backgroundImage: `url(http://homefinish.runasp.net/${category.imagePath})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30"></div>

              {/* Category Name */}
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-white text-2xl font-semibold text-center">
                  {category.name}
                </h2>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <p className="text-center text-gray-500">
            No categories available
          </p>
        )}
      </div>
    </div>
  );
};

export default Category;
