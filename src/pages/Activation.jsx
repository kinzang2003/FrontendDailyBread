import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// Helper function to parse JWT token (kept as provided)
function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Invalid JWT", e);
    return null;
  }
}

export default function Activation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ show: false, message: '', type: '' }); // State for toast notifications
  const [loading, setLoading] = useState(false); // State for loading indicator

  const token = searchParams.get("token");
  const decodedToken = parseJwt(token);

  // Define the API Gateway base URL
  const API_GATEWAY_BASE_URL = "http://localhost:8765";

  // Function to show toast messages
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000); // Hide after 3 seconds
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    if (!token || !decodedToken) {
      showToast("Invalid or missing activation token.", "error");
      setLoading(false);
      return;
    }

    if (!password) {
      showToast("Please enter a password.", "error");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_GATEWAY_BASE_URL}/user/activate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ activationToken: token, password }),
      });

      const data = await res.json();
      console.log(data, "Activation Data");

      if (res.ok) {
        showToast("Account activated successfully! Redirecting to login...", "success");
        setTimeout(() => {
          navigate("/login"); // Navigate to login page on success
        }, 2000); // Give user time to read toast
      } else {
        showToast(`Activation failed: ${data.message || 'Unknown error.'}`, "error");
      }
    } catch (error) {
      console.error("Error during activation:", error);
      showToast(`An error occurred: ${error.message}`, "error");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Optional: You can uncomment and modify this useEffect if you want
  // to automatically activate based on the token without user input,
  // but the current approach requires a password, so a form is necessary.
  // useEffect(() => {
  //   const activateAccount = async () => {
  //     if (token && decodedToken) {
  //       // This block would be for auto-activation without password input
  //       // You would likely need a different backend endpoint that doesn't require a password
  //     } else {
  //       showToast("Invalid or missing activation token.", "error");
  //     }
  //   };
  //   // activateAccount(); // Call only if you want auto-activation logic
  // }, [token, decodedToken]); // Dependencies for useEffect

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 p-3 rounded-lg shadow-lg text-white z-50
          ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}

      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Account Activation</h1>

      <form
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email:
          </label>
          <p className="p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 w-full">
            {decodedToken?.sub || "No email found in token"}
          </p>
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            New Password:
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            placeholder="Enter your new password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded-md font-semibold
                     hover:bg-primary-light transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          disabled={loading} // Disable button when loading
        >
          {loading ? 'Activating...' : 'Activate Account'}
        </button>
      </form>
    </div>
  );
}
