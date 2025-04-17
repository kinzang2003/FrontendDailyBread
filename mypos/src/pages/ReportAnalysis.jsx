import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock data
const weeklySales = [
  { day: "Mon", total: 120 },
  { day: "Tue", total: 220 },
  { day: "Wed", total: 150 },
  { day: "Thu", total: 170 },
  { day: "Fri", total: 250 },
  { day: "Sat", total: 300 },
  { day: "Sun", total: 190 },
];

const monthlySales = [
  { week: "W1", total: 540 },
  { week: "W2", total: 700 },
  { week: "W3", total: 620 },
  { week: "W4", total: 850 },
];

const initialProductSales = [
  { product: "Coke(L)", sales: 50 },
  { product: "Eclairs", sales: 30 },
  { product: "Sprite(S)", sales: 10 },
  { product: "Oreo", sales: 40 },
];

export default function ReportAnalysis() {
  const [sortType, setSortType] = useState("asc");
  const [view, setView] = useState("weekly");

  const sortedProducts = [...initialProductSales].sort((a, b) => {
    if (sortType === "asc") return a.sales - b.sales;
    if (sortType === "desc") return b.sales - a.sales;
    return 0;
  });

  return (
    <div className="p-4 bg-white min-h-screen">
      <h1 className="text-xl font-bold mb-4">Sales Report</h1>

      <div className="mb-4">
        <button
          className={`mr-2 px-3 py-1 rounded ${
            view === "weekly" ? "bg-black text-white" : "bg-gray-200"
          }`}
          onClick={() => setView("weekly")}
        >
          Weekly
        </button>
        <button
          className={`px-3 py-1 rounded ${
            view === "monthly" ? "bg-black text-white" : "bg-gray-200"
          }`}
          onClick={() => setView("monthly")}
        >
          Monthly
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={view === "weekly" ? weeklySales : monthlySales}>
          <XAxis dataKey={view === "weekly" ? "day" : "week"} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#4B5563" />
        </BarChart>
      </ResponsiveContainer>

      <h2 className="text-lg font-semibold mt-8 mb-2">Sales by Product</h2>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setSortType("asc")}
          className={`px-3 py-1 rounded ${
            sortType === "asc" ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          Ascending
        </button>
        <button
          onClick={() => setSortType("desc")}
          className={`px-3 py-1 rounded ${
            sortType === "desc" ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          Descending
        </button>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Product</th>
            <th>Sales</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.map((item, i) => (
            <tr key={i} className="border-t">
              <td>{item.product}</td>
              <td>{item.sales}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
