import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ReportAnalysis() {
  const [sortType, setSortType] = useState("asc");
  const [view, setView] = useState("weekly");
  const [weeklySales, setWeeklySales] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [productSales, setProductSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define the API Gateway base URL
  const API_GATEWAY_BASE_URL = "http://localhost:8765";

  // Fetch data from backend via API Gateway
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Trigger report generation first (optional, depends on backend setup)
        // This call goes through the API Gateway: /report/generate -> /api/reports/generate
        const generateRes = await fetch(
          `${API_GATEWAY_BASE_URL}/report/generate`,
          { method: "POST" }
        );
        if (!generateRes.ok) {
          // Log the error but don't stop execution, as other fetches might still work
          console.error(
            "Failed to trigger report generation:",
            await generateRes.text()
          );
        }

        // Fetch weekly sales data via API Gateway: /report/weekly -> /api/reports/weekly
        const weeklyRes = await fetch(`${API_GATEWAY_BASE_URL}/report/weekly`);
        // Fetch monthly sales data via API Gateway: /report/monthly -> /api/reports/monthly
        const monthlyRes = await fetch(
          `${API_GATEWAY_BASE_URL}/report/monthly`
        );
        // Fetch product sales data via API Gateway: /report -> /api/reports
        const productRes = await fetch(`${API_GATEWAY_BASE_URL}/report`);

        if (!weeklyRes.ok || !monthlyRes.ok || !productRes.ok) {
          throw new Error("Failed to fetch report data from API Gateway");
        }

        const weeklyData = await weeklyRes.json();
        const monthlyData = await monthlyRes.json();
        const productData = await productRes.json();

        setWeeklySales(weeklyData);
        setMonthlySales(monthlyData);
        // Map backend ReportDTO to frontend product sales format
        setProductSales(
          productData.map((item) => ({
            product: item.itemName,
            sales: item.quantitySold, // Assuming quantitySold is what you want for 'sales'
          }))
        );
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  const sortedProducts = [...productSales].sort((a, b) => {
    if (sortType === "asc") return a.sales - b.sales;
    if (sortType === "desc") return b.sales - a.sales;
    return 0;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Loading reports...</p>
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
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Sales Report Analysis
      </h1>

      <div className="mb-4 flex space-x-2">
        <button
          className={`px-4 py-2 rounded-md transition-all duration-200 ${
            view === "weekly"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setView("weekly")}
        >
          Weekly Sales
        </button>
        <button
          className={`px-4 py-2 rounded-md transition-all duration-200 ${
            view === "monthly"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setView("monthly")}
        >
          Monthly Sales
        </button>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {view === "weekly"
            ? "Weekly Sales Overview"
            : "Monthly Sales Overview"}
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={view === "weekly" ? weeklySales : monthlySales}>
            <XAxis
              dataKey={view === "weekly" ? "day" : "week"}
              stroke="#6B7280"
            />
            <YAxis stroke="#6B7280" />
            <Tooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
              formatter={(value) => `Nu. ${value.toFixed(2)}`}
              labelFormatter={(label) =>
                `${view === "weekly" ? "Day" : "Week"}: ${label}`
              }
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#374151" }}
            />
            <Bar
              dataKey="total"
              fill="#4B5563"
              barSize={30}
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">
        Product Sales Breakdown
      </h2>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSortType("asc")}
          className={`px-4 py-2 rounded-md transition-all duration-200 ${
            sortType === "asc"
              ? "bg-green-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Sort by Sales: Ascending
        </button>
        <button
          onClick={() => setSortType("desc")}
          className={`px-4 py-2 rounded-md transition-all duration-200 ${
            sortType === "desc"
              ? "bg-red-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Sort by Sales: Descending
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b-2 border-gray-200 text-gray-600 font-medium">
                Product
              </th>
              <th className="p-3 border-b-2 border-gray-200 text-gray-600 font-medium">
                Sales Count
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.length > 0 ? (
              sortedProducts.map((item, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="p-3 text-gray-800">{item.product}</td>
                  <td className="p-3 text-gray-800">{item.sales}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="p-3 text-center text-gray-500">
                  No product sales data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
