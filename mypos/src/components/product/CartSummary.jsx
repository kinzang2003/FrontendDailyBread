import { Link } from "react-router-dom";

export default function CartSummary({ cart, onRemove, total }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 border-t mt-4">
      <div className="mb-2 max-h-40 overflow-y-auto">
        {cart.map((item, index) => (
          <div key={index} className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <img
                src={item.image || "placeholder.png"}
                alt={item.name}
                className="w-10 h-10 object-contain"
              />
              <div className="text-sm">
                <div>{item.name}</div>
                <div className="text-gray-500">x {item.qty}</div>
              </div>
            </div>
            <button
              onClick={() => onRemove(item.name)}
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
  );
}
