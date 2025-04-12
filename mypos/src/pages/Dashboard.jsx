import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Dashboard() {
  const [transactionsToday] = useState(12);
  const navigate = useNavigate();

  return (
    <div className="p-4 bg-white min-h-screen">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>

      <div className="grid gap-4">
        <div
          className="p-4 bg-gray-100 rounded shadow cursor-pointer flex justify-between items-center"
          onClick={() => navigate("/transaction")}
        >
          <div>
            <h2 className="text-lg font-medium">Transactions Today</h2>
            <p className="text-2xl font-bold mt-2">{transactionsToday}</p>
          </div>
          <ChevronRight className="w-6 h-6 text-gray-500" />
        </div>

        <div
          className="p-4 bg-gray-100 rounded shadow cursor-pointer flex justify-between items-center"
          onClick={() => navigate("/inventory")}
        >
          <div>
            <h2 className="text-lg font-medium">Low Stock Items</h2>
            <p className="text-sm text-gray-500 mt-2">
              View items that need restocking
            </p>
          </div>
          <ChevronRight className="w-6 h-6 text-gray-500" />
        </div>
      </div>
    </div>
  );
}
