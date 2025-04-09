import React, { useState } from "react";

export default function Cart() {
  const [items, setItems] = useState([
    { name: "Coke(L)", qty: 1, price: 65 },
    { name: "Coke(S)", qty: 2, price: 25 },
  ]);
  const [cash, setCash] = useState(100);
  const [mbob, setMbob] = useState(15);

  const total = items.reduce((acc, item) => acc + item.qty * item.price, 0);
  const change = cash + mbob - total;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">New Transaction</h1>
      {items.map((item, index) => (
        <div key={index} className="flex justify-between items-center mb-2">
          <span>{item.name}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const updated = [...items];
                updated[index].qty = Math.max(1, updated[index].qty - 1);
                setItems(updated);
              }}
            >
              -
            </button>
            <span>{item.qty}</span>
            <button
              onClick={() => {
                const updated = [...items];
                updated[index].qty++;
                setItems(updated);
              }}
            >
              +
            </button>
          </div>
          <span>{item.price}</span>
        </div>
      ))}
      <div className="mt-4">
        <div>Total: {total}</div>
        <div>
          Cash:{" "}
          <input
            value={cash}
            onChange={(e) => setCash(Number(e.target.value))}
            className="border p-1 w-20"
          />
        </div>
        <div>
          MBOB:{" "}
          <input
            value={mbob}
            onChange={(e) => setMbob(Number(e.target.value))}
            className="border p-1 w-20"
          />
        </div>
        <div>Change: {change}</div>
        <button className="mt-4 bg-black text-white py-2 px-4 rounded">
          Confirm
        </button>
      </div>
    </div>
  );
}
