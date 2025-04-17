export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="w-full bg-gray-100 rounded p-2 flex flex-col items-center justify-between">
      <img
        src={product.image || "placeholder.png"}
        alt={product.name}
        className="w-full h-36 object-contain"
      />
      <div className="text-center text-sm">
        <div className="font-medium">
          {product.name}
          {product.description && (
            <span className="text-gray-500">({product.description})</span>
          )}
        </div>
        <div className="font-bold text-right mt-1">Nu. {product.price}</div>
      </div>
      <button
        onClick={() => onAddToCart(product)}
        className="mt-2 w-full bg-black text-white text-xs py-1 rounded"
      >
        Add to Cart
      </button>
    </div>
  );
}
