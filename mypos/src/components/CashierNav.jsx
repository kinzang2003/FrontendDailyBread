import { useNavigate } from "react-router-dom";
import { icons } from "../assets/constants/icons";
import { getUser, logout } from "../auth/auth";
import { ShoppingCart } from "lucide-react";

export default function CashierNav() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-white shadow">
      {/* Logo */}
      <div
        onClick={() => navigate("/product")}
        className="font-bold text-lg flex items-center gap-2 cursor-pointer"
      >
        <img src={icons.logo} alt="logo" className="w-8 h-8" />
        Daily Bread
      </div>

      {/* Icons */}
      <div className="flex gap-6 items-center text-gray-600">
        <ShoppingCart
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
