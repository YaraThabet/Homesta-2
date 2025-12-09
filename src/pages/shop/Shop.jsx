import { useState, useMemo } from "react";
import { Menu, X } from "lucide-react";
import ShopHeader from "./components/ShopHeader";
import FilterSidebar from "./components/FilterSidebar";
import ActiveFilters from "./components/ActiveFilters";
import ProductGrid from "./components/ProductGrid";
import Pagination from "./components/Pagination";
import FooterBenefits from "./components/FooterBenefits";
import SortDropdown from "./components/SortDropdown";

const ITEMS_PER_PAGE = 12;

const Shop = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [inStock, setInStock] = useState(true);
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

const products = [
  {
    id: 1,
    name: "Coffee machine",
    price: 54.00,
    originalPrice: 60.00,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&q=80",
    discount: 10,
  },
  {
    id: 2,
    name: "Dishwasher",
    price: 54.00,
    originalPrice: 60.00,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400&h=400&fit=crop&q=80",
    discount: 10,
  },
  {
    id: 3,
    name: "Toaster",
    price: 54.00,
    originalPrice: 60.00,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&q=80",
    discount: 10,
  },
  {
    id: 4,
    name: "Air Fryer",
    price: 54.00,
    originalPrice: 60.00,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=400&fit=crop&q=80",
    discount: 10,
  },
  {
    id: 5,
    name: "Air Conditioner",
    price: 54.00,
    originalPrice: 60.00,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1625961332771-3f40b0e2bdcf?w=400&h=400&fit=crop&q=80",
    discount: 10,
  },
  {
    id: 6,
    name: "Sofa",
    price: 54.00,
    originalPrice: 60.00,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&q=80",
    discount: 10,
  },
  {
    id: 7,
    name: "Dinnerware Set",
    price: 54.00,
    originalPrice: 60.00,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&q=80",
    discount: 10,
  },
  {
    id: 8,
    name: "Knife Set",
    price: 54.00,
    originalPrice: 60.00,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&q=80",
    discount: 10,
  },
  {
    id: 9,
    name: "Cookware Set",
    price: 54.00,
    originalPrice: 60.00,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&q=80",
    discount: 10,
  },
  {
    id: 10,
    name: "Bath Accessories",
    price: 54.00,
    originalPrice: 60.00,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=400&fit=crop&q=80",
    discount: 10,
  },
  {
    id: 11,
    name: "Glasses Set",
    price: 54.00,
    originalPrice: 60.00,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=400&fit=crop&q=80",
    discount: 20,
  },
  {
    id: 12,
    name: "Chair",
    price: 54.00,
    originalPrice: 60.00,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=400&fit=crop&q=80",
    discount: 20,
  },
];

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

    // Filter by price range
    result = result.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

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
  }, [priceRange, sortBy]);

  // Paginate products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const activeFilters = useMemo(() => {
    const filters = [];
    
    if (priceRange[0] !== 0 || priceRange[1] !== 200) {
      filters.push({ type: "price", value: `Price: $${priceRange[0]}.00- $${priceRange[1]}.00` });
    }
    
    selectedColors.forEach((color) => {
      filters.push({ type: "color", value: color });
    });
    
    if (inStock) {
      filters.push({ type: "stock", value: "In Stock" });
    }
    
    return filters;
  }, [priceRange, selectedColors, inStock]);

  const handleRemoveFilter = (type, value) => {
    if (type === "price") {
      setPriceRange([0, 200]);
    } else if (type === "color") {
      setSelectedColors((prev) => prev.filter((c) => c !== value));
    } else if (type === "stock") {
      setInStock(false);
    }
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setPriceRange([0, 200]);
    setSelectedColors([]);
    setInStock(false);
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
            className={`${
              isMobileFilterOpen ? "block" : "hidden"
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