// import productData from "../data/products.json";
import React, { useState, useEffect } from "react";
import InventoryActions from "../components/inventory/Actions";
import InventoryList from "../components/inventory/List";
import InventoryForm from "../components/inventory/Form";
import InventoryFilter from "../components/inventory/Filter";
import axios from "axios";

const ITEMS_PER_PAGE = 6;

export default function Inventory() {
  // const [inventory, setInventory] = useState(productData);
  const [inventory, setInventory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showOnlyLowStock, setShowOnlyLowStock] = useState(false);
  const [toast, setToast] = useState("");
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

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8765/INVENTORY/api/inventory"
        );
        setInventory(response.data);

        const hasLowStock = response.data.some(
          (item) => !item.disabled && item.stock < 10
        );
        if (hasLowStock) {
          setToast("Some items are low in stock!");
          setTimeout(() => setToast(""), 3000);
        }
      } catch (err) {
        console.error("Failed to fetch inventory:", err);
      }
    };

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
        await axios.put(
          `http://localhost:8765/INVENTORY/api/inventory/${editingProduct}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        await axios.post(
          "http://localhost:8765/INVENTORY/api/inventory",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      // Re-fetch inventory list after update
      const res = await axios.get(
        "http://localhost:8765/INVENTORY/api/inventory"
      );
      setInventory(res.data);

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
      {toast && (
        <div className="bg-red-100 text-red-700 p-2 rounded mt-2">{toast}</div>
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
          setInventory={setInventory}
          inventory={inventory}
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
              className={`px-3 py-1 rounded ${
                currentPage === page ? "bg-black text-white" : "bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
