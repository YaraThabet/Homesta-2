import { useState, useMemo, useEffect } from "react";
import { Menu, X } from "lucide-react";
import ShopHeader from "./components/ShopHeader";
import FilterSidebar from "./components/FilterSidebar";
import ActiveFilters from "./components/ActiveFilters";
import ProductGrid from "./components/ProductGrid";
import Pagination from "./components/Pagination";
import FooterBenefits from "./components/FooterBenefits";
import SortDropdown from "./components/SortDropdown";
import api from "../../lib/axios";

const ITEMS_PER_PAGE = 12;

const Shop = () => {
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

  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // --- 1. Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          api.get('/Product/GetAllProducts'),
          api.get('/Category')
        ]);

        const fetchedProducts = Array.isArray(prodRes.data) ? prodRes.data : [];
        setProducts(fetchedProducts);

        const fetchedCats = Array.isArray(catRes.data) ? catRes.data : [];
        setCategories(fetchedCats.map(c => ({ id: c.categoryId || c.id, name: c.name })));

        // Calculate dynamic max price from products
        if (fetchedProducts.length > 0) {
          const max = Math.ceil(Math.max(...fetchedProducts.map(p => p.price)));
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

      } catch (error) {
        console.error("Failed to fetch shop data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 2. Derive Dynamic Filter Options ---
  const { availableColors, maxProductPrice } = useMemo(() => {
    if (products.length === 0) return { availableColors: [], maxProductPrice: 1000 };

    const colorsSet = new Set();
    let max = 0;

    products.forEach(p => {
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
          if (c) colorsSet.add(c); // Use raw case first, normalize later if needed
        });
      }
    });

    return {
      availableColors: Array.from(colorsSet).sort(),
      maxProductPrice: Math.ceil(max) || 1000
    };
  }, [products]);


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
        // Check if any selected color is in product colors (case insensitive)
        return selectedColors.some(sel =>
          pColors.some(pc => pc.toLowerCase() === sel.toLowerCase())
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

    if (priceRange[0] !== 0 || priceRange[1] !== maxProductPrice) {
      // Only show if different from default/max
      // Actually maxProductPrice changes on load, so strictly checking might be tricky if it hasn't loaded yet.
      // Let's just check against current maxProductPrice
      if (maxProductPrice > 0 && (priceRange[0] > 0 || priceRange[1] < maxProductPrice)) {
        filters.push({ type: "price", value: `Price: $${priceRange[0]} - $${priceRange[1]}` });
      }
    }

    selectedColors.forEach((color) => {
      filters.push({ type: "color", value: color });
    });

    if (inStock === true) filters.push({ type: "stock", value: "In Stock" });
    if (inStock === false) filters.push({ type: "stock", value: "Out of Stock" });

    return filters;
  }, [selectedCategories, selectedSubCategories, priceRange, selectedColors, inStock, categories, subCategories, maxProductPrice]);

  const handleRemoveFilter = (type, value) => {
    if (type === "category") {
      // value passed here from ActiveFilters might be the name or ID depending on how we structured it above.
      // In activeFilters construction, we pushed `value: cat.name`.
      // Ideally ActiveFilters should pass back the 'id' if we attached it.
      // Let's see how ActiveFilters works. I'm assuming it might just pass the 'type' and 'value'.
      // I'll need to look up the ID by name if ActiveFilters component isn't smart enough.
      // Or better, I'll assume I need to find the ID. 
      // Strategy: modify ActiveFilters usage? No, I can't see ActiveFilters code right now.
      // Safest: find ID by name.
      const cat = categories.find(c => c.name === value);
      if (cat) setSelectedCategories((prev) => prev.filter((c) => c !== cat.id));
    } else if (type === "subcategory") {
      const sub = subCategories.find(s => s.name === value);
      if (sub) setSelectedSubCategories((prev) => prev.filter((s) => s !== sub.id));
    } else if (type === "price") {
      setPriceRange([0, maxProductPrice]);
    } else if (type === "color") {
      setSelectedColors((prev) => prev.filter((c) => c !== value));
    } else if (type === "stock") {
      setInStock(null);
    }
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setPriceRange([0, maxProductPrice]);
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
              availableSubCategories={subCategories}
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

            {/* Pagination */}
            {!loading && totalPages > 1 && (
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