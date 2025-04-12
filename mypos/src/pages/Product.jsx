import { Link } from "react-router-dom";
import { useState } from "react";
import { images } from "../assets/constants/images";

export default function Product() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const PRODUCTS_PER_PAGE = 6;

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

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
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

  const handleRemoveFromCart = (productName) => {
    setCart(cart.filter((item) => item.name !== productName));
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
              onClick={() => {
                setCategory(cat);
                setCurrentPage(1);
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {paginatedProducts.map((item, index) => (
          <div
            key={index}
            className="w-full bg-gray-100 rounded p-2 flex flex-col items-center justify-between"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-36 object-contain"
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

      {totalPages > 1 && (
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

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 border-t mt-4">
          <div className="mb-2 max-h-40 overflow-y-auto">
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between mb-2"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 object-contain"
                  />
                  <div className="text-sm">
                    <div>{item.name}</div>
                    <div className="text-gray-500">x {item.qty}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(item.name)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
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
