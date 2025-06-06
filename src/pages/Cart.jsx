import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { Trash2 } from 'lucide-react'; // Import the Trash2 icon

export default function Cart() {
  const navigate = useNavigate();
  const { cart, setCart } = useCart(); // use shared context

  // Initialize cash and mbob to 0 for empty input experience
  const [cash, setCash] = useState(0);
  const [mbob, setMbob] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '', type: '' }); // State for toast notifications

  const total = cart.reduce((acc, item) => acc + item.qty * item.price, 0);
  const change = (cash + mbob - total).toFixed(2); // Format change to 2 decimal places

  // Define the API Gateway base URL
  const API_GATEWAY_BASE_URL = "http://localhost:8765";

  // Helper function to get the current timezone offset in hours
  const getUTCOffsetInHours = () => {
    const offsetMinutes = new Date().getTimezoneOffset(); // Returns offset in minutes
    return -offsetMinutes / 60; // Convert minutes to hours and invert sign for UTC+
  };

  // Function to show toast messages
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000); // Hide after 3 seconds
  };

  const handleQuantityChange = (index, delta) => {
    const updated = [...cart];
    updated[index].qty = Math.max(1, updated[index].qty + delta);
    setCart(updated);
  };

  const handleDelete = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const saveSale = async () => {
    // Get current local date and time
    const now = new Date();
    // Format to ISO 8601 string, then slice to 23 to getYYYY-MM-DDTHH:MM:SS.SSS
    // This is the format expected by LocalDateTime on the backend.
    const localDateTimeString = now.toISOString().slice(0, 23);

    const offsetHours = getUTCOffsetInHours(); // Get client's timezone offset

    const salePayload = {
      digital: mbob,
      cash: cash,
      date: localDateTimeString, // Send local date time string
      offsetHours: offsetHours,  // Send client's offset
      items: cart.map((item) => ({
        itemId: item.id,
        quantity: item.qty,
      })),
    };

    try {
      const res = await fetch(`${API_GATEWAY_BASE_URL}/pos/sales`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(salePayload),
      });

      if (!res.ok) {
        // Attempt to parse error message from backend
        const errorData = await res.text();
        throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorData}`);
      }

      const data = await res.json();
      console.log(data, " Sale Data");
      showToast("Sale confirmed successfully!", "success"); // Show success toast
      return true; // Indicate success
    } catch (err) {
      console.error(err, " Error saving sale");
      showToast(`Failed to confirm sale: ${err.message}`, "error"); // Show failure toast
      return false; // Indicate failure
    }
  };

  const handleConfirm = async () => {
    // Basic validation: ensure cart is not empty and payment covers total
    if (cart.length === 0) {
      showToast("Cart is empty. Add items before confirming.", "error");
      return;
    }

    if ((cash + mbob) < total) {
      showToast("Payment is less than the total amount.", "error");
      return;
    }

    console.log("Sending transaction:", cart);
    const saleSuccessful = await saveSale(); // Wait for saveSale to complete
    if (saleSuccessful) {
      localStorage.removeItem("cart"); // Clear cart from local storage
      setCart([]); // Clear cart state
      setCash(0); // Reset cash
      setMbob(0); // Reset mbob
      navigate("/transaction"); // Navigate to transactions page
    }
    // If not successful, saveSale would have already shown the error toast
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 p-3 rounded-lg shadow-lg text-white z-50
          ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}

      <h1 className="text-xl font-bold mb-4 text-black">New Transaction</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Cart is empty.</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between mb-4 bg-gray-100 p-3 rounded"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.image || "https://placehold.co/48x48/CCCCCC/FFFFFF?text=No+Image"}
                  alt={item.name}
                  className="w-12 h-12 object-contain rounded"
                  // Fallback for image loading error
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/48x48/CCCCCC/FFFFFF?text=No+Image" }}
                />
                <div>
                  <div className="font-medium text-black">
                    {item.name}
                    {item.description && (
                      <span className="text-gray-500 text-sm ml-1">
                        ({item.description})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => handleQuantityChange(index, -1)}
                      className="px-2 py-1 bg-gray-300 text-white rounded hover:bg-gray-400 transition-colors"
                      disabled={item.qty <= 1} // Disable if quantity is 1
                    >
                      -
                    </button>
                    <span className="text-black">{item.qty}</span>
                    <button
                      onClick={() => handleQuantityChange(index, 1)}
                      className="px-2 py-1 bg-gray-300 text-white rounded hover:bg-gray-400 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-semibold text-black">Nu. {(item.price * item.qty).toFixed(2)}</div>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded-md p-1"
                  aria-label="Delete item"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}

          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium text-black">Total:</span>
              <span className="font-bold text-lg text-black">Nu. {total.toFixed(2)}</span>
            </div>

            <div className="mb-2">
              <label htmlFor="cashInput" className="block mb-1 text-black">Cash:</label>
              <input
                id="cashInput"
                type="number"
                value={cash === 0 ? '' : cash} // Display empty string if value is 0
                onChange={(e) => setCash(Number(e.target.value))}
                placeholder="Enter cash amount"
                className="border border-gray-300 p-2 w-full rounded-md shadow-sm focus:ring-primary focus:border-primary"
                min="0" // Ensure non-negative input
              />
            </div>

            <div className="mb-2">
              <label htmlFor="mbobInput" className="block mb-1 text-black">MBOB (Digital):</label>
              <input
                id="mbobInput"
                type="number"
                value={mbob === 0 ? '' : mbob} // Display empty string if value is 0
                onChange={(e) => setMbob(Number(e.target.value))}
                placeholder="Enter MBOB amount"
                className="border border-gray-300 p-2 w-full rounded-md shadow-sm focus:ring-primary focus:border-primary"
                min="0" // Ensure non-negative input
              />
            </div>

            <div className="flex justify-between mb-4">
              <span className="font-medium text-black">Change:</span>
              <span className="font-bold text-lg text-black">Nu. {change}</span>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full bg-primary text-white py-3 rounded-md font-semibold text-lg
                         hover:bg-primary-light transition-colors shadow-lg
                         focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-75"
              disabled={cart.length === 0 || (cash + mbob) < total} // Disable if cart is empty or payment insufficient
            >
              Confirm Transaction
            </button>
          </div>
        </>
      )}
    </div>
  );
}
