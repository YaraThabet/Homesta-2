import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Package, X } from "lucide-react";
import PageLoader from "../components/PageLoader";
import api from "../lib/axios";

const SubCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [subCategories, setSubCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNoSubsModal, setShowNoSubsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch category name
        const categoryRes = await api.get(`/Category/${categoryId}`);
        setCategoryName(categoryRes.data.name || "Category");

        // Fetch subcategories
        const subCatRes = await api.get(`/SubCategory/by-category/${categoryId}`);
        const data = Array.isArray(subCatRes.data) ? subCatRes.data : [];

        setSubCategories(data);

        // Show modal if no subcategories
        if (data.length === 0) {
          setShowNoSubsModal(true);
        }
      } catch (err) {
        console.error(err);
        setError("Error while loading subcategories ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  const handleSubCategoryClick = (subCategoryId) => {
    navigate(`/shop?subCategoryId=${subCategoryId}`);
  };

  // Pagination logic
  const totalPages = Math.ceil(subCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubCategories = subCategories.slice(startIndex, startIndex + itemsPerPage);

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
        {/* Dynamic Category Title */}
        <div className="w-full py-4">
          <h1 className="font-[Outfit] text-[#205457] text-[42px] font-medium text-center capitalize">
            {categoryName}
          </h1>
        </div>

        {/* SubCategories Grid */}
        {subCategories.length > 0 ? (
          <>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {paginatedSubCategories.map((item) => (
                <div
                  key={item.subCategoryId || item.id}
                  onClick={() => handleSubCategoryClick(item.subCategoryId || item.id)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  {/* Image Container */}
                  <div className="h-56 bg-gray-100 overflow-hidden">
                    <img
                      src={item.imagePath
                        ? `http://homefinish.runasp.net/${item.imagePath.startsWith('/') ? item.imagePath.substring(1) : item.imagePath}`
                        : 'https://via.placeholder.com/300x200?text=No+Image'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center text-[#205457] hover:bg-[#205457] hover:text-white border border-[#205457] rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  &lt;
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-all ${currentPage === i + 1
                        ? 'bg-[#205457] text-white shadow-md'
                        : 'text-[#205457] hover:bg-[#205457] hover:text-white border border-[#205457]'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center text-[#205457] hover:bg-[#205457] hover:text-white border border-[#205457] rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  &gt;
                </button>
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* No Subcategories Modal */}
      {showNoSubsModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-[40px] shadow-2xl p-10 max-w-md w-full text-center relative"
          >
            <button
              onClick={() => {
                setShowNoSubsModal(false);
                navigate('/category');
              }}
              className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>

            <div className="w-20 h-20 bg-[#205457]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={40} className="text-[#205457]" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">New Products on the Way!</h3>
            <p className="text-gray-500 leading-relaxed mb-8">
              We're currently curating amazing furniture pieces for the <span className="font-bold text-[#205457]">{categoryName}</span> category. Check back soon for exciting new arrivals!
            </p>

            <button
              onClick={() => {
                setShowNoSubsModal(false);
                navigate('/category');
              }}
              className="w-full py-4 bg-[#205457] text-white rounded-2xl font-bold hover:bg-[#1a4345] transition-all shadow-lg shadow-[#205457]/20"
            >
              Browse Other Categories
            </button>
          </motion.div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default SubCategory;
