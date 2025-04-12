// Pagination and category filter added
import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";

const ITEMS_PER_PAGE = 6;

const Inventory = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showOnlyLowStock, setShowOnlyLowStock] = useState(false);
  const [toast, setToast] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDisabled, setShowDisabled] = useState(false);

  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: "Coke",
      description: "L",
      image: "coke.png",
      price: 65,
      stock: 8,
      category: "Beverages",
      disabled: false,
    },
    {
      id: 2,
      name: "Coke",
      description: "S",
      image: "coke.png",
      price: 25,
      stock: 10,
      category: "Beverages",
      disabled: false,
    },
    {
      id: 3,
      name: "Coke",
      description: "L",
      image: "coke.png",
      price: 65,
      stock: 8,
      category: "Beverages",
      disabled: false,
    },
    {
      id: 4,
      name: "Coke",
      description: "L",
      image: "coke.png",
      price: 65,
      stock: 30,
      category: "Beverages",
      disabled: false,
    },
    {
      id: 5,
      name: "Coke",
      description: "L",
      image: "coke.png",
      price: 65,
      stock: 20,
      category: "Beverages",
      disabled: false,
    },
    {
      id: 6,
      name: "Coke",
      description: "L",
      image: "coke.png",
      price: 65,
      stock: 20,
      category: "Beverages",
      disabled: true,
    },
    {
      id: 7,
      name: "Coke",
      description: "L",
      image: "coke.png",
      price: 65,
      stock: 20,
      category: "Beverages",
      disabled: true,
    },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    image: "",
    price: "",
    stock: "",
    category: "Beverages",
  });

  const categories = [
    "Beverages",
    "Ice Cream",
    "Snacks",
    "Bakery",
    "Household",
    "Personal Care",
  ];

  useEffect(() => {
    const hasLowStock = inventory.some(
      (item) => !item.disabled && item.stock < 10
    );
    if (hasLowStock) {
      setToast("Some items are low in stock!");
      setTimeout(() => setToast(""), 3000);
    }
  }, [inventory]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: type === "file" ? URL.createObjectURL(files[0]) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct !== null) {
      setInventory(
        inventory.map((item) =>
          item.id === editingProduct
            ? { id: editingProduct, ...newProduct, disabled: false }
            : item
        )
      );
    } else {
      setInventory([
        ...inventory,
        { id: inventory.length + 1, ...newProduct, disabled: false },
      ]);
    }
    setNewProduct({
      name: "",
      description: "",
      image: "",
      price: "",
      stock: "",
      category: "Beverages",
    });
    setShowForm(false);
    setEditingProduct(null);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const editProduct = (id) => {
    const product = inventory.find((item) => item.id === id);
    setNewProduct({ ...product, description: product.description || "" });
    setEditingProduct(id);
    setShowForm(true);
  };

  const filteredInventory = inventory
    .filter((item) => (showDisabled ? item.disabled : !item.disabled))
    .filter((item) => (showOnlyLowStock ? item.stock < 10 : true))
    .filter(
      (item) => selectedCategory === "All" || item.category === selectedCategory
    )
    .sort((a, b) => a.stock - b.stock);

  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredInventory.length / ITEMS_PER_PAGE);

  return (
    <div className="p-4 max-w-[412px] mx-auto">
      <h1 className="text-xl font-bold">Inventory</h1>

      {toast && (
        <div className="bg-red-100 text-red-700 p-2 rounded mt-2">{toast}</div>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add Item
        </button>

        <button
          onClick={() => setShowDisabled(!showDisabled)}
          className="bg-gray-200 px-3 py-1 rounded text-sm ml-2"
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

      <div className="mt-2">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {!showForm && (
        <div className="mt-4 grid grid-cols-1 gap-4">
          {paginatedInventory.map((item) => {
            const isLowStock = item.stock < 10;
            return (
              <div
                key={item.id}
                className={`flex border p-4 rounded-lg shadow-md max-w-[412px] relative ${
                  isLowStock ? "border-red-500 bg-red-50" : ""
                }`}
              >
                {isLowStock && (
                  <div className="absolute top-2 right-2 animate-pulse text-red-500">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover"
                  />
                  <span className="text-sm">Stock: {item.stock}</span>
                </div>
                <span className="text-center">
                  {item.name}
                  {item.description ? ` (${item.description})` : ""}
                </span>
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
                      onClick={() =>
                        setInventory(
                          inventory.map((invItem) =>
                            invItem.id === item.id
                              ? { ...invItem, disabled: !invItem.disabled }
                              : invItem
                          )
                        )
                      }
                      className="border px-3 py-1 rounded"
                    >
                      {item.disabled ? "Enable" : "Disable"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && !showForm && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page ? "bg-black text-white" : "bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 p-4 border rounded-lg shadow-md max-w-[412px]"
        >
          <h2 className="text-xl font-bold">
            {editingProduct !== null ? "Edit Product" : "Add Product"}
          </h2>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="border p-2 w-full"
            value={newProduct.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description (Optional)"
            className="border p-2 w-full mt-2"
            value={newProduct.description}
            onChange={handleChange}
          />
          <input
            type="file"
            name="image"
            className="border p-2 w-full mt-2"
            onChange={handleChange}
          />
          {newProduct.image && (
            <img
              src={newProduct.image}
              alt="Preview"
              className="w-24 h-24 mt-2 object-cover"
            />
          )}
          <input
            type="number"
            name="price"
            placeholder="Price in Ngultrum"
            className="border p-2 w-full mt-2"
            value={newProduct.price}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            className="border p-2 w-full mt-2"
            value={newProduct.stock}
            onChange={handleChange}
            required
          />
          <select
            name="category"
            className="border p-2 w-full mt-2"
            value={newProduct.category}
            onChange={handleChange}
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded"
            >
              {editingProduct !== null ? "Update" : "Confirm"}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Inventory;
