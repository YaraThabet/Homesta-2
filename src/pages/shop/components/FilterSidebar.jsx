import { useState } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";

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

const Checkbox = ({ checked, onChange, className = "" }) => (
  <button
    type="button"
    onClick={onChange}
    className={`h-4 w-4 rounded border border-border flex items-center justify-center transition-colors ${
      checked ? "bg-primary border-primary" : "bg-background"
    } ${className}`}
  >
    {checked && <Check className="h-3 w-3 text-primary-foreground" />}
  </button>
);

const categories = [
  "Bed room",
  "Bathroom",
  "Living room",
  "Decoration",
  "Kitchen",
  "Electronic",
  "Medical devices",
];

const colors = [
  { name: "Brown", color: "#A67B5B" },
  { name: "Grey", color: "#9E9E9E" },
  { name: "Green", color: "#5B8C5A" },
  { name: "Red", color: "#D64545" },
  { name: "Orange", color: "#E8915B" },
  { name: "Blue", color: "#5B9BD5" },
  { name: "White", color: "#F5F5F5" },
  { name: "Black", color: "#2D2D2D" },
];

const materials = ["Metal", "Wood", "Upholstered", "Glass", "Plastic"];

const FilterSidebar = ({
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceChange,
  selectedColors,
  onColorChange,
  selectedMaterials,
  onMaterialChange,
  inStock,
  onStockChange,
}) => {
  return (
    <aside className="w-full lg:w-70 bg-card p-5 rounded-lg ">
      <h3 className="text-base font-semibold text-foreground mb-6 pb-4 border-0 shadow-md text-center align-center ">
        Filter Options
      </h3>

      <FilterSection title="Category">
        <div className="space-y-2.5">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-2.5 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Checkbox
                checked={selectedCategories.includes(category)}
                onChange={() => onCategoryChange(category)}
              />
              {category}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price">
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground ">
            ${priceRange[0].toFixed(2)} - ${priceRange[1].toFixed(2)}
          </div>
          <div className="relative w-full">
            <input
              type="range"
              min={0}
              max={200}
              value={priceRange[1]}
              onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer range-sm [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#205457] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
              style={{
                background: `linear-gradient(to right, #205457 0%, #205457 ${(priceRange[1] / 200) * 100}%, #E5E7EB ${(priceRange[1] / 200) * 100}%, #E5E7EB 100%)`
              }}
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Color">
        <div className="space-y-2.5">
          {colors.map((color) => {
            const isSelected = selectedColors.includes(color.name);
            return (
              <label
                key={color.name}
                className="flex items-center gap-2.5 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => onColorChange(color.name)}
              >
                <div
                  className={`relative w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    color.name === "White" ? "border border-border" : ""
                  }`}
                  style={{ backgroundColor: color.color }}
                >
                  {isSelected && (
                    <Check className={`h-3 w-3 ${color.name === "White" || color.name === "Grey" ? "text-foreground" : "text-white"}`} />
                  )}
                </div>
                {color.name}
              </label>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Material">
        <div className="space-y-2.5">
          {materials.map((material) => (
            <label
              key={material}
              className="flex items-center gap-2.5 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Checkbox
                checked={selectedMaterials.includes(material)}
                onChange={() => onMaterialChange(material)}
              />
              {material}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Availability" defaultOpen={true}>
        <div className="space-y-2.5">
          <label className="flex items-center gap-2.5 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Checkbox checked={inStock} onChange={() => onStockChange(true)} />
            In Stock
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Checkbox checked={!inStock} onChange={() => onStockChange(false)} />
            Out of Stock
          </label>
        </div>
      </FilterSection>
    </aside>
  );
};

export default FilterSidebar;
