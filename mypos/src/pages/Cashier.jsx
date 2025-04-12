import { useState } from "react";
import { UserIcon, Trash2 } from "lucide-react";

export default function AddCashier() {
  const [cashiers, setCashiers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAddCashier = () => {
    if (!username || !email) {
      setError("Username and email are required.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setCashiers([...cashiers, { username, email }]);
    setUsername("");
    setEmail("");
    setShowForm(false);
    setError("");
  };

  const handleDelete = (index) => {
    const updated = [...cashiers];
    updated.splice(index, 1);
    setCashiers(updated);
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Manage Cashiers</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Cashier
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <button
            onClick={handleAddCashier}
            className="w-full bg-black text-white py-2 rounded"
          >
            Confirm
          </button>
        </div>
      )}

      {cashiers.length === 0 ? (
        <p className="text-gray-400">No Cashier</p>
      ) : (
        <div className="grid gap-4">
          {cashiers.map((c, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-100 rounded shadow"
            >
              <div className="flex items-center gap-2">
                <UserIcon className="w-6 h-6 text-gray-700" />
                <div className="font-medium">{c.username}</div>
              </div>
              <button onClick={() => handleDelete(index)}>
                <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
