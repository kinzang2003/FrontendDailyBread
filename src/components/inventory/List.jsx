import { AlertCircle } from "lucide-react";

export default function List({ items, editProduct, toggleDisabled }) { // Keep toggleDisabled prop
  return (
    <div className="mt-4 grid grid-cols-1 gap-4">
      {items.map((item) => {
        const isLowStock = item.stock < 10;
        return (
          <div
            key={item.id}
            // Original flex layout for the whole item card
            className={`flex border p-4 rounded-lg shadow-md max-w-[412px] relative ${isLowStock ? "border-red-500 bg-red-50" : "bg-white"
              }`}
          >
            {isLowStock && (
              <div className="absolute top-2 right-2 animate-pulse text-red-500">
                <AlertCircle className="w-5 h-5" />
              </div>
            )}
            {/* Original left section for image and stock */}
            <div>
              <img
                src={item.image || "https://placehold.co/64x64/CCCCCC/FFFFFF?text=No+Image"} // Added fallback
                alt={item.name}
                className="w-16 h-16 object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/64x64/CCCCCC/FFFFFF?text=No+Image" }}
              />
              <span className="text-sm">Stock: {item.stock}</span>
            </div>
            {/* Original center section for name and description */}
            <span className="text-center flex-grow mx-2"> {/* Added mx-2 for spacing */}
              {item.name}
              {item.description ? ` (${item.description})` : ""}
            </span>
            {/* Original right section for price and buttons */}
            <div className="flex flex-col w-full mt-2 items-end">
              <span className="flex-1">{item.price} Nu.</span>
              <div className="flex gap-2 text-sm">
                <button
                  onClick={() => editProduct(item.id)}
                  className="bg-black text-white px-3 py-1 rounded h-[38px] w-20"
                >
                  Edit
                </button>
                <button
                  // This is the critical line: calling the passed-down toggleDisabled prop
                  onClick={() => toggleDisabled(item.id)}
                  className="border px-3 py-1 rounded" // Original button styling
                >
                  {item.disabled ? "Enable" : "Disable"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
