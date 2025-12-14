import { X } from "lucide-react";

const ActiveFilters = ({ filters, onRemove, onClearAll }) => {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-sm text-muted-foreground mr-1">Active Filter</span>
      {filters.map((filter, index) => (
        <button
          key={index}
          onClick={() => onRemove(filter.type, filter.value)}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#B19470] text-primary-foreground text-xs font-medium rounded-full hover:bg-primary/90 transition-colors"
        >
          {filter.value}
          <X className="h-3 w-3" />
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="text-sm text-muted-foreground hover:text-foreground ml-2 underline-offset-2 hover:underline"
      >
        Clear All
      </button>
    </div>
  );
};

export default ActiveFilters;