import { Upload, X, ChevronDown } from "lucide-react";

export default function Form({
  handleSubmit,
  cancelForm,
  handleChange,
  newProduct,
  editingProduct,
  categories,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="relative z-50 mx-auto mt-6 px-4 py-6 bg-white w-full max-w-sm min-h-screen"
    >
      {/* Cancel Button */}
      <button
        type="button"
        onClick={cancelForm}
        className="absolute top-4 right-4 text-black rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-300 transition duration-200"
        aria-label="Cancel"
      >
        <X className="w-5 h-5" />
      </button>

      <h2 className="text-lg font-semibold mb-4">
        {editingProduct !== null ? "Edit Product" : "Add Product"}
      </h2>

      <input
        type="text"
        name="name"
        placeholder="Name"
        className="w-full mb-3 px-4 py-3 border rounded-md text-sm placeholder-gray-400"
        value={newProduct.name}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="description"
        placeholder="Description"
        className="w-full mb-3 px-4 py-3 border rounded-md text-sm placeholder-gray-400"
        value={newProduct.description}
        onChange={handleChange}
      />

      {/* Image Upload Area */}
      <label className="w-full mb-3 h-40 border rounded-md flex items-center justify-center bg-gray-100 cursor-pointer overflow-hidden">
        <input
          type="file"
          name="image"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
        {newProduct.image ? (
          <img
            src={newProduct.image}
            alt="Preview"
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <Upload className="w-8 h-8 text-black" />
        )}
      </label>

      <input
        type="number"
        name="price"
        placeholder="Price in Ngultrum"
        className="w-full mb-3 px-4 py-3 border rounded-md text-sm placeholder-gray-400"
        value={newProduct.price}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="stock"
        placeholder="Stock"
        className="w-full mb-3 px-4 py-3 border rounded-md text-sm placeholder-gray-400"
        value={newProduct.stock}
        onChange={handleChange}
        required
      />

      <div className="relative w-full mb-4">
        <select
          name="category"
          className="appearance-none w-full px-4 py-3 border rounded-md text-sm text-gray-600 bg-white"
          value={newProduct.category}
          onChange={handleChange}
          required
        >
          <option value="">Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <ChevronDown className="w-4 h-4 text-primary" />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white py-3 rounded-md text-sm font-medium"
      >
        {editingProduct !== null ? "Update" : "Confirm"}
      </button>
    </form>
  );
}
