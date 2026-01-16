import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ShopHeader from "./components/ShopHeader";
import FilterSidebar from "./components/FilterSidebar";
import ActiveFilters from "./components/ActiveFilters";
import ProductGrid from "./components/ProductGrid";
import Pagination from "./components/Pagination";
import FooterBenefits from "./components/FooterBenefits";
import SortDropdown from "./components/SortDropdown";
import api from "../../lib/axios";

const ITEMS_PER_PAGE = 24;

const COLOR_MAP = {
  "brown": "#A67B5B",
  "grey": "#9E9E9E",
  "gray": "#9E9E9E",
  "green": "#5B8C5A",
  "red": "#D64545",
  "orange": "#E8915B",
  "blue": "#5B9BD5",
  "white": "#F5F5F5",
  "black": "#2D2D2D",
  "yellow": "#F59E0B",
  "purple": "#8B5CF6",
  "pink": "#EC4899",
  "beige": "#F5F5DC",
  "gold": "#FFD700",
  "silver": "#C0C0C0",
  "oak": "#B08968",
  "walnut": "#432818",
  "mahogany": "#4A0E0E",
  "cream": "#FFFDD0",
  "ivory": "#FFFFF0",
  "navy": "#000080",
  "teal": "#008080",
  "charcoal": "#36454F",
  "darkgrey": "#545454",
  "darkgray": "#545454",
  "lightgrey": "#D3D3D3",
  "lightgray": "#D3D3D3"
};

const Shop = () => {
  const [searchParams] = useSearchParams();

  // Scroll to top on mount/refresh
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Data State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [selectedCategories, setSelectedCategories] = useState([]); // Array of IDs
  const [selectedSubCategories, setSelectedSubCategories] = useState([]); // Array of IDs (was materials)
  const [priceRange, setPriceRange] = useState([0, 1000]); // Default max, will update
  const [selectedColors, setSelectedColors] = useState([]);
  const [inStock, setInStock] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const [absoluteMaxPrice, setAbsoluteMaxPrice] = useState(1000);

  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // --- 1. Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          api.get('Product/GetAllProducts'),
          api.get('Category')
        ]);

        const fetchedProducts = Array.isArray(prodRes.data) ? prodRes.data : [];
        setProducts(fetchedProducts);

        const fetchedCats = Array.isArray(catRes.data) ? catRes.data : [];
        setCategories(fetchedCats.map(c => ({ id: c.categoryId || c.id, name: c.name })));

        // Calculate absolute max price from all products
        if (fetchedProducts.length > 0) {
          const max = Math.ceil(Math.max(...fetchedProducts.map(p => p.price)));
          setAbsoluteMaxPrice(max);
          setPriceRange([0, max]);
        }

        // Fetch Subcategories
        const subsPromises = fetchedCats.map(c =>
          api.get(`/SubCategory/by-category/${c.categoryId || c.id}`).catch(() => ({ data: [] }))
        );
        const subsResults = await Promise.all(subsPromises);
        const allSubs = [];
        subsResults.forEach(res => {
          if (Array.isArray(res.data)) {
            res.data.forEach(s => {
              allSubs.push({ id: s.subCategoryId || s.id, name: s.name, categoryId: s.categoryId });
            });
          }
        });
        setSubCategories(allSubs);

        // Check for subcategory filter from URL
        const subCatIdFromUrl = searchParams.get('subCategoryId');
        if (subCatIdFromUrl) {
          setSelectedSubCategories([parseInt(subCatIdFromUrl)]);
        }

      } catch (error) {
        console.error("Failed to fetch shop data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  // --- 2. Derive Dynamic Filter Options ---
  const { availableColors, maxProductPrice, filteredSubCategories } = useMemo(() => {
    if (products.length === 0) return { availableColors: [], maxProductPrice: 1000, filteredSubCategories: [] };

    // Filter products by selected categories first (if any)
    let relevantProducts = products;
    if (selectedCategories.length > 0) {
      relevantProducts = products.filter(p => selectedCategories.includes(p.categoryId));
    }

    const colorsMap = new Map(); // Use Map to track normalized -> original value
    let max = 0;

    relevantProducts.forEach(p => {
      // Max Price
      if (p.price > max) max = p.price;

      // Extract colors
      if (p.colors) {
        let pColors = [];
        if (Array.isArray(p.colors)) {
          pColors = p.colors;
        } else if (typeof p.colors === 'string') {
          pColors = p.colors.split(',').map(c => c.trim());
        }
        pColors.forEach(c => {
          if (c) {
            const cleaned = c.trim().replace(/\s+/g, '');
            const lower = cleaned.toLowerCase();

            // Resolve to hex for visual deduplication
            const hex = cleaned.startsWith('#')
              ? cleaned.toUpperCase()
              : (COLOR_MAP[lower] || "#CCCCCC");

            // Only add unique visual hexes
            if (!colorsMap.has(hex)) {
              colorsMap.set(hex, hex);
            }
          }
        });
      }
    });

    // Filter subcategories based on selected categories
    let relevantSubCategories = subCategories;
    if (selectedCategories.length > 0) {
      relevantSubCategories = subCategories.filter(sub =>
        selectedCategories.includes(sub.categoryId)
      );
    }

    return {
      availableColors: Array.from(colorsMap.values()).sort(),
      maxProductPrice: Math.ceil(max) || 1000,
      filteredSubCategories: relevantSubCategories
    };
  }, [products, subCategories, selectedCategories]);


  // --- 3. Handlers ---
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
    setCurrentPage(1);
  };

  const handleSubCategoryChange = (subId) => {
    setSelectedSubCategories((prev) =>
      prev.includes(subId)
        ? prev.filter((s) => s !== subId)
        : [...prev, subId]
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

  // --- 4. Filtering Logic ---
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category (ID match)
    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.categoryId)
      );
    }

    // Filter by Subcategory (ID match)
    if (selectedSubCategories.length > 0) {
      result = result.filter((product) =>
        selectedSubCategories.includes(product.subCategoryId)
      );
    }

    // Filter by Price Range
    result = result.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filter by Color
    if (selectedColors.length > 0) {
      result = result.filter((product) => {
        if (!product.colors) return false;
        const pColors = Array.isArray(product.colors)
          ? product.colors
          : product.colors.split(',').map(c => c.trim());

        return selectedColors.some(selHex =>
          pColors.some(pc => {
            const lower = pc.toLowerCase();
            const productHex = pc.startsWith('#') ? pc.toUpperCase() : (COLOR_MAP[lower] || "#CCCCCC");
            return productHex === selHex.toUpperCase();
          })
        );
      });
    }

    // Filter by Stock
    if (inStock !== null) {
      if (inStock === true) {
        result = result.filter((product) => (product.quantity || product.stock) > 0);
      } else {
        result = result.filter((product) => (product.quantity || product.stock) === 0);
      }
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        result.sort((a, b) => (b.productId || b.id) - (a.productId || a.id));
        break;
      default:
        break;
    }

    return result;
  }, [products, selectedCategories, selectedSubCategories, priceRange, selectedColors, inStock, sortBy]);

  // Paginate
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  // Active Filters Badge Component Helpers
  const activeFilters = useMemo(() => {
    const filters = [];

    selectedCategories.forEach((catId) => {
      const cat = categories.find(c => c.id === catId);
      if (cat) filters.push({ type: "category", value: cat.name, id: catId });
    });

    selectedSubCategories.forEach((subId) => {
      const sub = subCategories.find(s => s.id === subId);
      if (sub) filters.push({ type: "subcategory", value: sub.name, id: subId });
    });

    if (priceRange[0] !== 0 || priceRange[1] !== absoluteMaxPrice) {
      if (absoluteMaxPrice > 0 && (priceRange[0] > 0 || priceRange[1] < absoluteMaxPrice)) {
        filters.push({ type: "price", value: `Price: $${priceRange[0]} - $${priceRange[1]}` });
      }
    }

    selectedColors.forEach((hex) => {
      // Try to find the common name for the hex
      const entry = Object.entries(COLOR_MAP).find(([name, color]) => color === hex.toUpperCase());
      const label = entry ? entry[0].charAt(0).toUpperCase() + entry[0].slice(1) : hex;
      filters.push({ type: "color", value: label });
    });

    if (inStock === true) filters.push({ type: "stock", value: "In Stock" });
    if (inStock === false) filters.push({ type: "stock", value: "Out of Stock" });

    return filters;
  }, [selectedCategories, selectedSubCategories, priceRange, selectedColors, inStock, categories, subCategories, absoluteMaxPrice]);

  const handleRemoveFilter = (type, value) => {
    if (type === "category") {
      const cat = categories.find(c => c.name === value);
      if (cat) setSelectedCategories((prev) => prev.filter((c) => c !== cat.id));
    } else if (type === "subcategory") {
      const sub = subCategories.find(s => s.name === value);
      if (sub) setSelectedSubCategories((prev) => prev.filter((s) => s !== sub.id));
    } else if (type === "price") {
      setPriceRange([0, absoluteMaxPrice]);
    } else if (type === "color") {
      setSelectedColors((prev) => prev.filter((c) => c !== value));
    } else if (type === "stock") {
      setInStock(null);
    }
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setPriceRange([0, absoluteMaxPrice]);
    setSelectedColors([]);
    setInStock(null);
    setSelectedCategories([]);
    setSelectedSubCategories([]);
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
              // Data Props
              availableCategories={categories}
              availableSubCategories={filteredSubCategories}
              availableColors={availableColors}
              maxPrice={maxProductPrice}
              loading={loading}

              // State Props
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}

              selectedSubCategories={selectedSubCategories}
              onSubCategoryChange={handleSubCategoryChange}

              priceRange={priceRange}
              onPriceChange={setPriceRange}

              selectedColors={selectedColors}
              onColorChange={handleColorChange}

              inStock={inStock}
              onStockChange={setInStock}
            />
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <p className="text-sm text-muted-foreground">
                {loading
                  ? "Loading products..."
                  : `Showing ${paginatedProducts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-${Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of ${filteredProducts.length} results`
                }
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
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="animate-fade-in-up">
                <ProductGrid products={paginatedProducts} />
              </div>
            )}
          </div>
        </div>

        {/* Pagination - Moved to absolute bottom of page content */}
        {!loading && totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </main>

      <FooterBenefits />
    </div>
  );
};

export default Shop;