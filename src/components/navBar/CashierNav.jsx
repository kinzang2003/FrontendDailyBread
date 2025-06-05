import { useNavigate } from "react-router-dom";
import { icons } from "../../assets/constants/icons";
import { getUser, logout } from "../../auth/auth";
import { ShoppingCart, FileText } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function CashierNav() {
  const navigate = useNavigate();
  const user = getUser();
  const { totalQty } = useCart();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-white shadow sticky top-0 z-50">
      <div
        onClick={() => navigate("/product")}
        className="font-bold text-lg flex items-center gap-2 cursor-pointer"
      >
        <img src={icons.logo} alt="logo" className="w-8 h-8" />
        Daily Bread
      </div>

      <div className="flex gap-6 items-center text-gray-600 relative">
        <div className="relative cursor-pointer">
          <ShoppingCart
            className="w-5 h-5 hover:text-blue-600"
            onClick={() => navigate("/cart")}
          />
          {totalQty > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
              {totalQty}
            </span>
          )}
        </div>
        <FileText
          className="w-5 h-5 cursor-pointer hover:text-blue-600"
          onClick={() => navigate("/transaction")}
        />

        <button
          onClick={handleLogout}
          className="text-red-500 font-semibold border px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
