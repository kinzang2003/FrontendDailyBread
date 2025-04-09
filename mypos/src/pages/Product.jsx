import { Link } from "react-router-dom";
import { useState } from "react";
import { images } from "../assets/constants/images";

export default function Product() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);

  const products = [
    {
      name: "Coke(L)",
      description: "Large bottle",
      qty: 1,
      price: 65,
      category: "Beverages",
      image: images.soda,
    },
    {
      name: "Eclairs",
      description: "Chocolate candy",
      qty: 1,
      price: 2,
      category: "Snacks",
      image: images.eclairs,
    },
    // Add more products here
  ];

  const filteredProducts = products.filter(
    (product) =>
      (category === "All" || product.category === category) &&
      product.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToCart = (product) => {
    const existing = cart.find((item) => item.name === product.name);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.name === product.name ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const total = cart.reduce((acc, item) => acc + item.qty * item.price, 0);

  const categories = [
    "All",
    "Beverages",
    "Snacks",
    "Bakery",
    "Household",
    "Personal Care",
  ];

  return (
    <div className="p-4 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Products</h1>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-1 rounded"
        />
      </div>

      <div className="mb-4">
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-3 py-1 rounded-full text-sm border ${
                category === cat ? "bg-black text-white" : "bg-gray-200"
              }`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredProducts.map((item, index) => (
          <div
            key={index}
            className="w-[182px] h-[215px] bg-gray-100 rounded p-2 flex flex-col items-center justify-between"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-[158px] h-[158px] object-contain"
            />
            <div className="text-center text-sm">
              <div className="font-medium">
                {item.name}{" "}
                {item.description && (
                  <span className="text-gray-500">({item.description})</span>
                )}
              </div>
              <div className="font-bold text-right mt-1">Nu. {item.price}</div>
            </div>
            <button
              onClick={() => handleAddToCart(item)}
              className="mt-2 w-full bg-black text-white text-xs py-1 rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 border-t mt-4">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Cart Total:</span>
            <span className="font-bold">Nu. {total}</span>
          </div>
          <Link to="/cart">
            <button className="w-full bg-black text-white py-2 rounded">
              Go to Cart
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
