// import productData from "../data/products.json";
import React, { useState, useEffect } from "react";
import InventoryActions from "../components/inventory/Actions";
import InventoryList from "../components/inventory/List";
import InventoryForm from "../components/inventory/Form";
import InventoryFilter from "../components/inventory/Filter";
import axios from "axios";

const ITEMS_PER_PAGE = 6;
const API_GATEWAY_BASE_URL = "http://localhost:8765"; // Define base URL

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showOnlyLowStock, setShowOnlyLowStock] = useState(false);
  // Initial state for toast, ensuring it's always an object with 'show' property
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDisabled, setShowDisabled] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    image: "",
    price: "",
    stock: "",
    category: "Category",
  });

  const categories = [
    "Beverages",
    "Ice Cream",
    "Snacks",
    "Bakery",
    "Household",
    "Personal Care",
  ];

  const fetchInventory = async () => {
    try {
      const response = await axios.get(`${API_GATEWAY_BASE_URL}/inventory`);
      setInventory(response.data);

      const hasLowStock = response.data.some(
        (item) => !item.disabled && item.stock < 10
      );
      if (hasLowStock) {
        // Explicitly set toast for low stock as a warning/error type, ensuring 'show: true'
        setToast({ show: true, message: "Some items are low in stock!", type: "error" });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000); // Reset toast fully after timeout
      } else {
        // Clear any previous low stock toast if no low stock items are found
        // IMPORTANT: Reset to the full initial object state
        setToast({ show: false, message: '', type: '' });
      }
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
      // Ensure error toast also has 'show: true'
      setToast({ show: true, message: "Failed to load inventory. Please try again.", type: "error" });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(newProduct).forEach(([key, value]) =>
      formData.append(key, value)
    );

    try {
      if (editingProduct !== null) {
        await axios.put(`${API_GATEWAY_BASE_URL}/inventory/${editingProduct}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${API_GATEWAY_BASE_URL}/inventory`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setToast({ show: true, message: "Product saved successfully!", type: "success" });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);

      fetchInventory();

      setShowForm(false);
      setEditingProduct(null);
      setNewProduct({
        name: "",
        description: "",
        image: "",
        price: "",
        stock: "",
        category: "Category",
      });
    } catch (error) {
      console.error("Error submitting product:", error);
      setToast({ show: true, message: `Error saving product: ${error.message}`, type: "error" });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    }
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

  const toggleDisabled = async (id) => {
    try {
      const response = await axios.patch(
        `${API_GATEWAY_BASE_URL}/inventory/${id}/toggle-disable`
      );
      console.log("Toggle disabled response:", response.data);
      // REMOVED: setToast for success on toggle disabled
      // setToast({ show: true, message: "Item status updated successfully!", type: "success" });
      // setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);

      fetchInventory(); // Re-fetch the inventory list to update the UI
    } catch (error) {
      console.error("Error toggling item status:", error);
      setToast({ show: true, message: `Error toggling status: ${error.message}`, type: "error" });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    }
  };

  const filteredInventory = inventory
    .filter((item) => (showDisabled ? item.disabled : !item.disabled))
    .filter((item) => (showOnlyLowStock ? item.stock < 10 : true))
    .filter(
      (item) => selectedCategory === "All" || item.category === selectedCategory
    );

  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredInventory.length / ITEMS_PER_PAGE);

  return (
    <div className="p-4 max-w-[412px] mx-auto">
      <h1 className="text-xl font-bold">Inventory</h1>
      {toast.show && ( // Check toast.show
        <div className={`p-2 rounded mt-2 ${toast.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {toast.message} {/* Display toast.message */}
        </div>
      )}

      <InventoryActions
        showForm={showForm}
        setShowForm={setShowForm}
        showDisabled={showDisabled}
        setShowDisabled={setShowDisabled}
        showOnlyLowStock={showOnlyLowStock}
        setShowOnlyLowStock={setShowOnlyLowStock}
      />

      <InventoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {!showForm ? (
        <InventoryList
          items={paginatedInventory}
          editProduct={editProduct}
          toggleDisabled={toggleDisabled}
        />
      ) : (
        <InventoryForm
          handleSubmit={handleSubmit}
          cancelForm={cancelForm}
          handleChange={handleChange}
          newProduct={newProduct}
          editingProduct={editingProduct}
          categories={categories}
        />
      )}

      {totalPages > 1 && !showForm && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${currentPage === page ? "bg-black text-white" : "bg-gray-200"}`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
