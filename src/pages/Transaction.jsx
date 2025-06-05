import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";

export default function Transaction() {
  const navigate = useNavigate();

  // Helper function to get today's date in YYYY-MM-DD format (local time)
  const getTodayFormattedDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper function to get the current timezone offset in hours
  // Example: for UTC+6, getTimezoneOffset() returns -360 minutes, so offsetHours will be 6
  const getUTCOffsetInHours = () => {
    const offsetMinutes = new Date().getTimezoneOffset();
    return -offsetMinutes / 60; // Convert minutes to hours and invert sign
  };

  // Initialize selectedDate with today's local date
  const [selectedDate, setSelectedDate] = useState(getTodayFormattedDate());
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_GATEWAY_BASE_URL = "http://localhost:8765"; // Your API Gateway URL

  // Memoize fetchTransactions to prevent unnecessary re-creations
  const fetchTransactions = useCallback(
    async (dateToFetch) => {
      setLoading(true);
      setError(null);
      try {
        const offset = getUTCOffsetInHours(); // Get current offset
        // Use the new API endpoint with date filtering and timezone offset
        const res = await fetch(
          `${API_GATEWAY_BASE_URL}/pos/sales/by-date?date=${dateToFetch}&offsetHours=${offset}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!res.ok) {
          if (res.status === 404) {
            setTransactions([]);
            return;
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log(data, " Sale Data for date:", dateToFetch);
        setTransactions(data);
      } catch (err) {
        console.error(err, " Error fetching sales");
        setError("Failed to load transactions. Please try again.");
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    },
    [API_GATEWAY_BASE_URL] // Dependency on API_GATEWAY_BASE_URL
  );

  // Effect to fetch transactions when component mounts or selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      fetchTransactions(selectedDate);
    }
  }, [selectedDate, fetchTransactions]);

  // Calculate totals
  const totalCash = transactions.reduce((acc, t) => acc + t.cash, 0).toFixed(2);
  const totalMbob = transactions
    .reduce((acc, t) => acc + t.digital, 0)
    .toFixed(2);
  const totalSum = (parseFloat(totalCash) + parseFloat(totalMbob)).toFixed(2);

  const handleDetailsClick = (saleId) => {
    navigate(`/details/${saleId}`);
  };

  return (
    <div className="p-4 flex flex-col min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Daily Transactions
      </h1>

      <div className="mb-6">
        <label
          htmlFor="transactionDate"
          className="block text-gray-700 font-medium mb-2"
        >
          Select Date:
        </label>
        <input
          type="date"
          id="transactionDate"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          // Set max to today's local date using the helper function
          max={getTodayFormattedDate()}
          className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center flex-grow text-gray-700 text-lg">
          Loading transactions...
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center flex-grow bg-red-100 text-red-700 p-4 rounded-lg shadow-md">
          <p className="text-center">{error}</p>
        </div>
      )}

      {!loading && !error && transactions.length === 0 && (
        <div className="flex items-center justify-center flex-grow text-gray-500 text-lg">
          No transactions found for this date.
        </div>
      )}

      {!loading && !error && transactions.length > 0 && (
        <div className="overflow-x-auto flex-grow mb-20">
          <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  #
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Time
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Cash (Nu.)
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  MBOB (Nu.)
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Total (Nu.)
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Orders
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr
                  key={t.id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm text-gray-700">{i + 1}.</td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {t.date
                      ? new Date(t.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                      : "N/A"}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {t.cash.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {t.digital.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {(t.cash + t.digital).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <button
                      onClick={() => handleDetailsClick(t.id)}
                      className="text-blue-600 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div
        className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t-2 border-gray-200 shadow-lg
                    flex flex-col sm:flex-row justify-between items-center z-10"
      >
        <div className="font-bold text-lg text-gray-800 mb-2 sm:mb-0">
          Overall Totals:
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-gray-700 text-base">
          <div className="flex justify-between w-full sm:w-auto">
            <span className="font-semibold sm:hidden">Cash:</span>
            <span>Nu. {totalCash}</span>
          </div>
          <div className="flex justify-between w-full sm:w-auto">
            <span className="font-semibold sm:hidden">MBOB:</span>
            <span>Nu. {totalMbob}</span>
          </div>
          <div className="flex justify-between w-full sm:w-auto">
            <span className="font-semibold sm:hidden">Total:</span>
            <span className="text-blue-700 font-bold">Nu. {totalSum}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
