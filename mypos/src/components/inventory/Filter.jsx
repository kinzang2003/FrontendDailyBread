import { ChevronDown } from "lucide-react";

export default function Filter({
  categories,
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <div className="mt-2 relative w-full">
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="appearance-none border p-2 rounded w-full text-sm pr-10"
      >
        <option value="All">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* ChevronDown Icon */}
      <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2">
        <ChevronDown className="w-4 h-4 text-primary" />
      </div>
    </div>
  );
}
