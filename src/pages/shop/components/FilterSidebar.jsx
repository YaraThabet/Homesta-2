import { useState } from "react";
import { ChevronDown, ChevronUp, Check, Filter } from "lucide-react";

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-6 last:mb-0 p-4 border-0 rounded-lg shadow-md ">      <button
      onClick={() => setIsOpen(!isOpen)}
      className="flex items-center justify-between w-full text-left"
    >
      <span className="text-sm font-medium text-foreground">{title}</span>
      {isOpen ? (
        <ChevronUp className="h-4 w-4 text-muted-foreground" />
      ) : (
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      )}
    </button>
      {isOpen && <div className="mt-4 space-y-3">{children}</div>}
    </div>
  );
};

const Checkbox = ({ checked, className = "" }) => (
  <div
    className={`h-4 w-4 rounded border border-border flex items-center justify-center transition-colors ${checked ? "bg-primary border-primary" : "bg-background"
      } ${className}`}
  >
    {checked && <Check className="h-3 w-3 text-primary-foreground" />}
  </div>
);

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
  "silver": "#C0C0C0"
};

const FilterSidebar = ({
  availableCategories = [],
  availableSubCategories = [],
  availableColors = [],
  maxPrice = 1000,
  loading = false,

  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceChange,
  selectedColors,
  onColorChange,
  selectedSubCategories,
  onSubCategoryChange,
  inStock,
  onStockChange,
}) => {
  return (
    <aside className="w-full lg:w-70 bg-card p-5 rounded-lg ">
      <div className="flex items-center justify-center gap-2 mb-6 pb-4 border-b border-gray-200">
        <Filter className="h-5 w-5 text-[#205457]" />
        <h3 className="text-lg font-bold text-[#205457]">
          Filter Options
        </h3>
      </div>

      <FilterSection title="Category">
        <div className="space-y-2.5">
          {loading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-5 bg-gray-100 rounded animate-pulse w-3/4" />
            ))
          ) : (
            availableCategories.map((category) => (
              <div
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className="flex items-center gap-2.5 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Checkbox
                  checked={selectedCategories.includes(category.id)}
                />
                {category.name}
              </div>
            ))
          )}
        </div>
      </FilterSection>

      <FilterSection title="Price">
        <div className="space-y-3">
          {loading ? (
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 rounded w-1/3 animate-pulse" />
              <div className="h-2 bg-gray-100 rounded w-full animate-pulse" />
            </div>
          ) : (
            <>
              <div className="text-sm text-muted-foreground ">
                ${priceRange[0].toFixed(2)} - ${priceRange[1].toFixed(2)}
              </div>
              <div className="relative w-full">
                <input
                  type="range"
                  min={0}
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer range-sm [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#205457] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
                  style={{
                    background: `linear-gradient(to right, #205457 0%, #205457 ${(priceRange[1] / maxPrice) * 100}%, #E5E7EB ${(priceRange[1] / maxPrice) * 100}%, #E5E7EB 100%)`
                  }}
                />
              </div>
            </>
          )}
        </div>
      </FilterSection>

      <FilterSection title="Color">
        <div className="space-y-2.5">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gray-100 animate-pulse" />
                <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
              </div>
            ))
          ) : (
            availableColors.map((colorName) => {
              const isSelected = selectedColors.includes(colorName);
              const hex = COLOR_MAP[colorName.toLowerCase()] || "#CCCCCC";
              const isWhite = colorName.toLowerCase() === "white";

              return (
                <div
                  key={colorName}
                  onClick={() => onColorChange(colorName)}
                  className="flex items-center gap-2.5 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <div
                    className={`relative w-5 h-5 rounded-full flex items-center justify-center transition-all border ${isWhite ? "border-gray-300" : "border-transparent"}`}
                    style={{ backgroundColor: hex }}
                  >
                    {isSelected && (
                      <Check className={`h-3 w-3 ${isWhite ? "text-gray-900" : "text-white"}`} />
                    )}
                  </div>
                  {colorName}
                </div>
              );
            })
          )}
        </div>
      </FilterSection>

      <FilterSection title="Subcategory">
        <div className="space-y-2.5">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-5 bg-gray-100 rounded animate-pulse w-2/3" />
            ))
          ) : (
            availableSubCategories.map((sub) => (
              <div
                key={sub.id}
                onClick={() => onSubCategoryChange(sub.id)}
                className="flex items-center gap-2.5 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Checkbox
                  checked={selectedSubCategories.includes(sub.id)}
                />
                {sub.name}
              </div>
            ))
          )}
        </div>
      </FilterSection>

      <FilterSection title="Availability" defaultOpen={true}>
        <div className="space-y-2.5">
          <div
            onClick={() => onStockChange(inStock === true ? null : true)}
            className="flex items-center gap-2.5 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Checkbox checked={inStock === true} />
            In Stock
          </div>
          <div
            onClick={() => onStockChange(inStock === false ? null : false)}
            className="flex items-center gap-2.5 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Checkbox checked={inStock === false} />
            Out of Stock
          </div>
        </div>
      </FilterSection>
    </aside>
  );
};

export default FilterSidebar;
