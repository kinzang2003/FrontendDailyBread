import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TransactionDetail() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the transaction ID from the URL
  const [transactionDetail, setTransactionDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_GATEWAY_BASE_URL = "http://localhost:8765"; // Your API Gateway URL

  // Memoize the fetch function
  const fetchTransactionDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch the single transaction detail from the backend
      const res = await fetch(
        `${API_GATEWAY_BASE_URL}/pos/sale?saleId=${id}`, // Use the single sale endpoint
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Fetched Transaction Detail:", data);
      setTransactionDetail(data);
    } catch (err) {
      console.error("Error fetching transaction details:", err);
      setError("Failed to load transaction details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id, API_GATEWAY_BASE_URL]); // Dependencies: id changes, or base URL changes

  useEffect(() => {
    if (id) {
      fetchTransactionDetails();
    }
  }, [id, fetchTransactionDetails]); // Re-run when id or fetchTransactionDetails changes

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Loading transaction details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-700 p-4 rounded-lg shadow-md">
        <p className="text-center">{error}</p>
      </div>
    );
  }

  if (!transactionDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-gray-700 text-lg mb-4">Transaction not found.</p>
        <button
          onClick={() => navigate("/transaction")}
          className="text-blue-600 hover:underline px-4 py-2 rounded-md bg-blue-100"
        >
          Go back to Transactions
        </button>
      </div>
    );
  }

  const totalItemsPrice = transactionDetail.items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  return (
    <div className="p-4 bg-white min-h-screen flex flex-col">
      <button
        onClick={() => navigate("/transaction")}
        className="text-sm text-blue-600 mb-4 underline flex items-center"
      >
        <ArrowLeft className="inline mr-1 h-4 w-4" /> Back to Transactions
      </button>

      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Transaction Details -{" "}
        {transactionDetail.date
          ? new Date(transactionDetail.date).toLocaleString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "N/A"}
      </h1>

      <div className="flex-grow">
        {" "}
        {/* Allows content to push totals to bottom */}
        {transactionDetail.items.length > 0 ? (
          <div className="space-y-4">
            {transactionDetail.items.map((item, index) => (
              <div
                key={item.itemId} // Use item.itemId as key, assuming it's unique
                className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      item.image ||
                      "https://placehold.co/48x48/CCCCCC/FFFFFF?text=No+Image"
                    } // Use item.image directly
                    alt={item.name}
                    className="w-12 h-12 object-contain rounded-md border border-gray-200"
                  />
                  <div>
                    <div className="font-semibold text-gray-800">
                      {item.name}
                      {item.description && (
                        <span className="text-gray-500 font-normal">
                          {" "}
                          ({item.description})
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Qty:</span> {item.quantity}{" "}
                      x Nu. {item.price.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="text-right font-bold text-lg text-gray-800">
                  Nu. {(item.quantity * item.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-lg py-10">
            No items found for this transaction.
          </div>
        )}
      </div>

      {/* Totals Section */}
      <div className="mt-8 pt-4 border-t-2 border-gray-200 bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-gray-700 text-lg">
            Total Items Cost:
          </span>
          <span className="font-bold text-gray-900 text-xl">
            Nu. {totalItemsPrice.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-gray-700 text-lg">
            Cash Paid:
          </span>
          <span className="font-bold text-gray-900 text-xl">
            Nu. {transactionDetail.cash.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-gray-700 text-lg">
            MBOB Paid:
          </span>
          <span className="font-bold text-gray-900 text-xl">
            Nu. {transactionDetail.digital.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-300 mt-4">
          <span className="font-bold text-blue-700 text-xl">
            Overall Total:
          </span>
          <span className="font-bold text-blue-700 text-xl">
            Nu.{" "}
            {(transactionDetail.cash + transactionDetail.digital).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
