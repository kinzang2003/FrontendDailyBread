import { NavLink, useNavigate } from "react-router-dom";
import { getUser, logout } from "../../auth/auth";
import { icons } from "../../assets/constants/icons";
import { Bell, ShoppingCart, User } from "lucide-react";

export default function AdminNav() {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-white shadow">
      {/* Logo */}
      <div
        onClick={() => navigate("/dashboard")}
        className="font-bold text-lg flex items-center gap-2 cursor-pointer"
      >
        <img src={icons.logo} alt="logo" className="w-8 h-8" />
        Daily Bread
      </div>

      {/* Nav Links */}
      <div className="flex gap-6 items-center text-gray-600">
        <Bell
          className="w-5 h-5 cursor-pointer hover:text-blue-600"
          onClick={() => navigate("/report")}
        />
        <ShoppingCart
          className="w-5 h-5 cursor-pointer hover:text-red-500"
          onClick={() => navigate("/inventory")}
        />
        <User
          className="w-5 h-5 cursor-pointer hover:text-green-600"
          onClick={() => navigate("/cashier")}
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
