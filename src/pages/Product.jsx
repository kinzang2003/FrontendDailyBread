import { useEffect, useState } from "react";
import ProductCard from "../components/product/ProductCard";
import { useCart } from "../context/CartContext";

// Define the API Gateway base URL
const API_GATEWAY_BASE_URL = "http://localhost:8765"; // Your API Gateway URL

// Categories from the fetched data
const getAllCategories = (products) => {
  const unique = new Set(products.map((p) => p.category).filter(Boolean));
  return ["All", ...Array.from(unique)];
};

export default function Product() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const { cart, setCart } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const PRODUCTS_PER_PAGE = 6; // Still 6 items per page, but now arranged differently on small screens

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch products specifically for the cashier view
        const response = await fetch(
          `${API_GATEWAY_BASE_URL}/inventory/products`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-700 p-4 rounded-lg shadow-md">
        <p className="text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white min-h-screen rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Available Products</h1>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 w-1/3"
        />
      </div>

      <div className="mb-6">
        <div className="flex gap-3 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
                category === cat
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
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

      {paginatedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {/*
            Changed 'grid-cols-1 sm:grid-cols-2' to 'grid-cols-2'
            This makes two columns the default even on the smallest screens (e.g., mobile portrait).
            md:grid-cols-3, lg:grid-cols-4, xl:grid-cols-5 will still apply for larger screens.
          */}
          {paginatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg py-10">
          No products found matching your criteria.
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                currentPage === page
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
