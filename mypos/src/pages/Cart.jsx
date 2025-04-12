import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { images } from "../assets/constants/images";

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState([
    {
      name: "Coke(L)",
      description: "Large bottle",
      qty: 1,
      price: 65,
      image: images.soda,
    },
    {
      name: "Coke(S)",
      description: "Small bottle",
      qty: 2,
      price: 25,
      image: images.eclairs,
    },
  ]);
  const [cash, setCash] = useState(100);
  const [mbob, setMbob] = useState(15);

  const total = items.reduce((acc, item) => acc + item.qty * item.price, 0);
  const change = cash + mbob - total;

  const handleQuantityChange = (index, delta) => {
    const updated = [...items];
    updated[index].qty = Math.max(1, updated[index].qty + delta);
    setItems(updated);
  };

  const handleDelete = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleConfirm = () => {
    navigate("/transaction");
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      <h1 className="text-xl font-bold mb-4">New Transaction</h1>

      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between mb-4 bg-gray-100 p-3 rounded"
        >
          <div className="flex items-center gap-3">
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 object-contain"
            />
            <div>
              <div className="font-medium">
                {item.name}{" "}
                <span className="text-gray-500">({item.description})</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => handleQuantityChange(index, -1)}
                  className="px-2 bg-gray-300 rounded"
                >
                  -
                </button>
                <span>{item.qty}</span>
                <button
                  onClick={() => handleQuantityChange(index, 1)}
                  className="px-2 bg-gray-300 rounded"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold">Nu. {item.price * item.qty}</div>
            <button
              onClick={() => handleDelete(index)}
              className="text-xs text-red-500 hover:underline mt-1"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between mb-2">
          <span className="font-medium">Total:</span>
          <span className="font-bold">Nu. {total}</span>
        </div>

        <div className="mb-2">
          <label className="block mb-1">Cash:</label>
          <input
            type="number"
            value={cash}
            onChange={(e) => setCash(Number(e.target.value))}
            className="border p-1 w-full rounded"
          />
        </div>

        <div className="mb-2">
          <label className="block mb-1">MBOB:</label>
          <input
            type="number"
            value={mbob}
            onChange={(e) => setMbob(Number(e.target.value))}
            className="border p-1 w-full rounded"
          />
        </div>

        <div className="flex justify-between mb-4">
          <span className="font-medium">Change:</span>
          <span className="font-bold">Nu. {change}</span>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full bg-black text-white py-2 rounded"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
