import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Transaction() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [transactions, setTransactions] = useState([]);
  // const transactions = [
  //   { time: "8.20 AM", total: 115, cash: 100, mbob: 15 },
  //   { time: "8.50 AM", total: 430, cash: 300, mbob: 130 },
  //   { time: "9.00 AM", total: 50, cash: 50, mbob: 0 },
  //   { time: "9.30 AM", total: 430, cash: 200, mbob: 230 },
  //   { time: "9.30 AM", total: 50, cash: 30, mbob: 20 },
  //   { time: "9.50 AM", total: 430, cash: 430, mbob: 0 },
  // ];
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(
          "http://localhost:8765/POSMICROSERVICE/api/saless",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await res.json();
        console.log(data, " Sale Data");
        setTransactions(data);
        localStorage.setItem("transactions", JSON.stringify(data));
      } catch (err) {
        console.log(err, " Error");
      }
    };
    fetchTransactions();
  }, []);
  const totalCash = transactions.reduce((acc, t) => acc + t.cash, 0);
  const totalMbob = transactions.reduce((acc, t) => acc + t.digital, 0);
  const totalSum = transactions.reduce((acc, t) => acc + t.digital + t.cash, 0);

  const handleDetailsClick = (index) => {
    navigate(`/details/${index}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Daily Transactions</h1>

      <div className="mb-4">
        <label className="block font-medium mb-1">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border px-3 py-1 rounded"
        />
      </div>

      <table className="w-full text-left">
        <thead>
          <tr>
            <th>#</th>
            <th>Time</th>
            <th>Cash</th>
            <th>MBOB</th>
            <th>Total</th>
            <th>Orders</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, i) => (
            <tr key={i} className="border-t">
              <td>{i + 1}.</td>
              <td>
                {new Date(t.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td>{t.cash}</td>
              <td>{t.digital}</td>
              <td>{t.cash + t.digital}</td>
              <td>
                <button
                  onClick={() => handleDetailsClick(t.id)}
                  className="text-blue-500 hover:underline"
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 font-bold">
        <div>Total Cash: Nu. {totalCash}</div>
        <div>Total MBOB: Nu. {totalMbob}</div>
        <div>Overall Total: Nu. {totalSum}</div>
      </div>
    </div>
  );
}
