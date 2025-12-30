import { useState, useMemo } from "react";
import { Menu, X } from "lucide-react";
import ShopHeader from "./components/ShopHeader";
import FilterSidebar from "./components/FilterSidebar";
import ActiveFilters from "./components/ActiveFilters";
import ProductGrid from "./components/ProductGrid";
import Pagination from "./components/Pagination";
import FooterBenefits from "./components/FooterBenefits";
import SortDropdown from "./components/SortDropdown";
import { products } from "../../data/products";
const ITEMS_PER_PAGE = 12;

const Shop = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [inStock, setInStock] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);



  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handleColorChange = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
    setCurrentPage(1);
  };

  const handleMaterialChange = (material) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material]
    );
    setCurrentPage(1);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.some((category) =>
          product.category?.toLowerCase() === category.toLowerCase()
        )
      );
    }

    // Filter by price range
    result = result.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filter by color
    if (selectedColors.length > 0) {
      result = result.filter((product) =>
        selectedColors.some((color) =>
          product.color?.toLowerCase() === color.toLowerCase()
        )
      );
    }

    // Filter by material
    if (selectedMaterials.length > 0) {
      result = result.filter((product) =>
        selectedMaterials.some((material) =>
          product.material?.toLowerCase() === material.toLowerCase()
        )
      );
    }

    // Filter by stock availability (based on quantity)
    if (inStock !== null) {
      if (inStock === true) {
        result = result.filter((product) => product.quantity > 0);
      } else {
        result = result.filter((product) => product.quantity === 0);
      }
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    return result;
  }, [selectedCategories, priceRange, selectedColors, selectedMaterials, inStock, sortBy]);

  // Paginate products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const activeFilters = useMemo(() => {
    const filters = [];

    selectedCategories.forEach((category) => {
      filters.push({ type: "category", value: category });
    });

    if (priceRange[0] !== 0 || priceRange[1] !== 200) {
      filters.push({ type: "price", value: `Price: $${priceRange[0]}.00- $${priceRange[1]}.00` });
    }

    selectedColors.forEach((color) => {
      filters.push({ type: "color", value: color });
    });

    selectedMaterials.forEach((material) => {
      filters.push({ type: "material", value: material });
    });

    if (inStock === true) {
      filters.push({ type: "stock", value: "In Stock" });
    } else if (inStock === false) {
      filters.push({ type: "stock", value: "Out of Stock" });
    }

    return filters;
  }, [selectedCategories, priceRange, selectedColors, selectedMaterials, inStock]);

  const handleRemoveFilter = (type, value) => {
    if (type === "category") {
      setSelectedCategories((prev) => prev.filter((c) => c !== value));
    } else if (type === "price") {
      setPriceRange([0, 200]);
    } else if (type === "color") {
      setSelectedColors((prev) => prev.filter((c) => c !== value));
    } else if (type === "material") {
      setSelectedMaterials((prev) => prev.filter((m) => m !== value));
    } else if (type === "stock") {
      setInStock(null);
    }
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setPriceRange([0, 200]);
    setSelectedColors([]);
    setInStock(null);
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background pt-[150px]">
      <ShopHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg"
          >
            {isMobileFilterOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            Filter Options
          </button>

          {/* Filter Sidebar */}
          <div
            className={`${isMobileFilterOpen ? "block" : "hidden"
              } lg:block lg:flex-shrink-0`}
          >
            <FilterSidebar
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              selectedColors={selectedColors}
              onColorChange={handleColorChange}
              selectedMaterials={selectedMaterials}
              onMaterialChange={handleMaterialChange}
              inStock={inStock}
              onStockChange={setInStock}
            />
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {paginatedProducts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} results
              </p>
              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>

            {/* Active Filters */}
            <ActiveFilters
              filters={activeFilters}
              onRemove={handleRemoveFilter}
              onClearAll={handleClearAll}
            />

            {/* Product Grid */}
            <ProductGrid products={paginatedProducts} />

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </main>

      <FooterBenefits />
    </div>
  );
};


export default Shop;