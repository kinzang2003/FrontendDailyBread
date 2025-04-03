import React, { useState } from "react";

const Inventory = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
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

  const disableProduct = (id) => {
    setInventory(
      inventory.map((item) =>
        item.id === id ? { ...item, disabled: true } : item
      )
    );
  };

  return (
    <div className="p-4 max-w-[412px] mx-auto">
      {" "}
      {/* this sets the padding to 4px and max width to 412px */}
      <h1 className="text-xl font-bold">Inventory</h1>{" "}
      {/* this sets the text size to extra large and font weight to bold */}
      {!showForm ? (
        <div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-black text-white px-4 py-2 rounded mt-4"
          >
            + Add Item
          </button>{" "}
          {/* this sets background color to black, text color to white, padding x to 4px, padding y to 2px, and rounds the corners */}
          <div className="mt-4 grid grid-cols-1 gap-4">
            {" "}
            {/* this adds margin top 4px and sets a grid layout with 1 column and gap of 4px */}
            {inventory
              .filter((item) => !item.disabled)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex border p-4 rounded-lg shadow-md max-w-[412px]"
                >
                  {" "}
                  {/* this sets a flex column layout, centers items, adds border, padding 4px, rounds corners, and adds shadow */}
                  <div>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover"
                    />{" "}
                    {/* this sets width and height to 16px and ensures the image covers the space */}
                    <span className="text-sm">Stock: {item.stock}</span>{" "}
                    {/* this sets text size to small */}
                  </div>
                  <span className="text-center">
                    {item.name}
                    {item.description ? ` (${item.description})` : ""}
                  </span>{" "}
                  {/* this centers text and makes font semi-bold */}
                  <div className="flex flex-col w-full mt-2 items-end">
                    {" "}
                    {/* this sets a flex layout with space between items, full width, and margin top 2px */}
                    <span className="flex-1">{item.price} Nu.</span>{" "}
                    {/* this aligns text right, sets flex to 1, and makes font bold */}
                    <div className="flex gap-2 text-sm">
                      {/* this sets a flex layout with gap of 2px */}
                      <button
                        onClick={() => editProduct(item.id)}
                        className="bg-black text-white px-3 py-1 rounded h-[38px] w-20"
                      >
                        Edit
                      </button>{" "}
                      {/* this sets background black, text white, padding x 3px, padding y 1px, and rounds corners */}
                      <button
                        onClick={() => disableProduct(item.id)}
                        className="border px-3 py-1 rounded"
                      >
                        Disable
                      </button>{" "}
                      {/* this sets background gray, padding x 3px, padding y 1px, and rounds corners */}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-4 p-4 border rounded-lg shadow-md max-w-[412px]"
        >
          {" "}
          {/* this adds margin top 4px, padding 4px, border, rounded corners, shadow, and max width 412px */}
          <h2 className="text-xl font-bold">
            {editingProduct !== null ? "Edit Product" : "Add Product"}
          </h2>{" "}
          {/* this sets text size to extra large and font bold */}
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="border p-2 w-full"
            value={newProduct.name}
            onChange={handleChange}
            required
          />{" "}
          {/* this adds border, padding 2px, and full width */}
          <input
            type="text"
            name="description"
            placeholder="Description (Optional)"
            className="border p-2 w-full mt-2"
            value={newProduct.description}
            onChange={handleChange}
          />{" "}
          {/* this adds border, padding 2px, full width, and margin top 2px */}
          <input
            type="file"
            name="image"
            className="border p-2 w-full mt-2"
            onChange={handleChange}
          />{" "}
          {/* this adds border, padding 2px, full width, and margin top 2px */}
          {newProduct.image && (
            <img
              src={newProduct.image}
              alt="Preview"
              className="w-24 h-24 mt-2 object-cover"
            />
          )}{" "}
          {/* this sets width 24px, height 24px, margin top 2px, and covers object */}
          <input
            type="number"
            name="price"
            placeholder="Price in Ngultrum"
            className="border p-2 w-full mt-2"
            value={newProduct.price}
            onChange={handleChange}
            required
          />{" "}
          {/* this adds border, padding 2px, full width, and margin top 2px */}
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            className="border p-2 w-full mt-2"
            value={newProduct.stock}
            onChange={handleChange}
            required
          />{" "}
          {/* this adds border, padding 2px, full width, and margin top 2px */}
          <select
            name="category"
            className="border p-2 w-full mt-2"
            value={newProduct.category}
            onChange={handleChange}
            required
          >
            {" "}
            {/* this adds border, padding 2px, full width, and margin top 2px */}
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <div className="flex justify-between mt-4">
            {" "}
            {/* this sets flex layout with space between items and margin top 4px */}
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
