export default function Actions({
  showForm,
  setShowForm,
  showDisabled,
  setShowDisabled,
  showOnlyLowStock,
  setShowOnlyLowStock,
}) {
  return (
    <div className="flex justify-between items-center mt-4">
      <button
        onClick={() => setShowForm(true)}
        className="bg-black text-white px-4 py-2 rounded"
      >
        + Add Item
      </button>
      <button
        onClick={() => setShowDisabled(!showDisabled)}
        className="bg-gray-200 px-3 py-1 rounded text-sm"
      >
        {showDisabled ? "Show Enabled" : "Show Disabled"}
      </button>
      <button
        onClick={() => setShowOnlyLowStock(!showOnlyLowStock)}
        className="bg-gray-200 px-3 py-1 rounded text-sm"
      >
        {showOnlyLowStock ? "Show All" : "Show Low Stock"}
      </button>
    </div>
  );
}
