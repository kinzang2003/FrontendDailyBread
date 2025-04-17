// Product.jsx
import { useEffect, useState } from "react";
import productData from "../data/products.json";
import ProductCard from "../components/product/ProductCard";
import { useCart } from "../context/CartContext";

// Categories from the data
const getAllCategories = (products) => {
  const unique = new Set(products.map((p) => p.category).filter(Boolean));
  return ["All", ...Array.from(unique)];
};

export default function Product() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const { cart, setCart } = useCart(); // Using context for cart
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);

  const PRODUCTS_PER_PAGE = 6;

  useEffect(() => {
    const filtered = productData.filter((item) => !item.disabled);
    setProducts(filtered);
  }, []);

  const categories = getAllCategories(products);

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
    const existing = cart.find(
      (item) =>
        item.name === product.name && item.description === product.description
    );

    if (existing) {
      setCart(
        cart.map((item) =>
          item.name === product.name && item.description === product.description
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

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
        {paginatedProducts.map((product, index) => (
          <ProductCard
            key={index}
            product={product}
            onAddToCart={handleAddToCart}
          />
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
    </div>
  );
}
