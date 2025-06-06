import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Dashboard() {
  const [transactionsToday, setTransactionsToday] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Define the API Gateway base URL
  const API_GATEWAY_BASE_URL = "http://localhost:8765";

  // Helper function to get today's date in YYYY-MM-DD format (local time)
  const getTodayFormattedDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper function to get the current timezone offset in hours
  const getUTCOffsetInHours = () => {
    const offsetMinutes = new Date().getTimezoneOffset();
    return -offsetMinutes / 60; // Convert minutes to hours and invert sign for UTC+
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Transactions Today
      const todayDate = getTodayFormattedDate();
      const offset = getUTCOffsetInHours();
      const transactionsRes = await fetch(
        `${API_GATEWAY_BASE_URL}/pos/sales/by-date?date=${todayDate}&offsetHours=${offset}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Assuming your POS endpoint is public or handles auth via gateway
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!transactionsRes.ok) {
        // If 404, it means no sales for today, which is not an error
        if (transactionsRes.status === 404) {
          setTransactionsToday(0);
        } else {
          throw new Error(`Failed to fetch transactions: ${transactionsRes.status}`);
        }
      } else {
        const transactionsData = await transactionsRes.json();
        setTransactionsToday(transactionsData.length);
      }

      // 2. Fetch Low Stock Items
      const inventoryRes = await fetch(`${API_GATEWAY_BASE_URL}/inventory`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Assuming your Inventory endpoint is public or handles auth via gateway
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!inventoryRes.ok) {
        throw new Error(`Failed to fetch inventory: ${inventoryRes.status}`);
      }

      const inventoryData = await inventoryRes.json();
      // Define your low stock threshold here (e.g., items with stock less than 10)
      const LOW_STOCK_THRESHOLD = 10;
      const lowStockCount = inventoryData.filter(item => item.stock <= LOW_STOCK_THRESHOLD).length;
      setLowStockItems(lowStockCount);

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [API_GATEWAY_BASE_URL]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Re-run when fetchData changes (which it won't due to useCallback)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-700">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white min-h-screen rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Transactions Today Card */}
        <div
          className="p-6 bg-white rounded-lg shadow-md cursor-pointer flex justify-between items-center transition-transform transform hover:scale-105"
          onClick={() => navigate("/transaction")}
        >
          {/* Group text and number in a flex container */}
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-gray-800">Transactions Today:</h2>
            <p className="text-2xl font-bold text-gray-800">
              {transactionsToday}
            </p>
          </div>
          <ChevronRight className="w-8 h-8 text-primary" />
        </div>

        {/* Low Stock Items Card */}
        <div
          className="p-6 bg-white rounded-lg shadow-md cursor-pointer flex justify-between items-center transition-transform transform hover:scale-105"
          onClick={() => navigate("/inventory")}
        >
          {/* Group text and number in a flex container */}
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-gray-800">Low Stock Items:</h2>
            <p className="text-2xl font-bold text-red-600">
              {lowStockItems}
            </p>
          </div>
          <ChevronRight className="w-8 h-8 text-primary" />
        </div>

        {/* The "View Sales Reports" card has been removed as per your request */}
      </div>
    </div>
  );
}
