import { useNavigate, useParams } from "react-router-dom";
import productData from "../data/products.json";
import { ArrowLeft } from "lucide-react";

export default function TransactionDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const transactions = [
    {
      time: "8.20 AM",
      items: [
        { name: "Coke", description: "L", qty: 1, price: 65 },
        { name: "Coke", description: "S", qty: 2, price: 25 },
      ],
      cash: 100,
      mbob: 15,
    },
  ];

  const transaction = transactions[id];

  const getImageForItem = (name, description) => {
    const matchedProduct = productData.find(
      (p) => p.name === name && p.description === description
    );
    return matchedProduct?.image || "placeholder.png";
  };

  const total = transaction.items.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  return (
    <div className="p-4 bg-white min-h-screen">
      <button
        onClick={() => navigate("/transaction")}
        className="text-sm text-blue-600 mb-4 underline"
      >
        <ArrowLeft className="inline mr-1" />
      </button>

      <h1 className="text-xl font-bold mb-4">
        Transaction Details - {transaction.time}
      </h1>

      {transaction.items.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between mb-4 bg-gray-100 p-3 rounded"
        >
          <div className="flex items-center gap-3">
            <img
              src={getImageForItem(item.name, item.description)}
              alt={item.name}
              className="w-12 h-12 object-contain"
            />
            <div>
              <div className="font-medium">
                {item.name}
                {item.description && (
                  <span className="text-gray-500"> ({item.description})</span>
                )}
              </div>
              <div className="text-sm text-gray-600">x {item.qty}</div>
            </div>
          </div>
          <div className="text-right font-semibold">
            Nu. {item.qty * item.price}
          </div>
        </div>
      ))}

      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between mb-2">
          <span className="font-medium">Total:</span>
          <span className="font-bold">Nu. {total}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-medium">Cash:</span>
          <span className="font-bold">Nu. {transaction.cash}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-medium">MBOB:</span>
          <span className="font-bold">Nu. {transaction.mbob}</span>
        </div>
      </div>
    </div>
  );
}
