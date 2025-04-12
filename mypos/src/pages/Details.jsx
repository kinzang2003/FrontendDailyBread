import { useParams } from "react-router-dom";
import { images } from "../assets/constants/images";

export default function TransactionDetail() {
  const { id } = useParams();

  // Placeholder transaction data (you can fetch this from backend in real case)
  const transactions = [
    {
      time: "8.20 AM",
      items: [
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
      ],
      cash: 100,
      mbob: 15,
    },
    // Add more transactions as needed
  ];

  const transaction = transactions[id];
  const total = transaction.items.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  return (
    <div className="p-4 bg-white min-h-screen">
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
              src={item.image}
              alt={item.name}
              className="w-12 h-12 object-contain"
            />
            <div>
              <div className="font-medium">
                {item.name}{" "}
                <span className="text-gray-500">({item.description})</span>
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
