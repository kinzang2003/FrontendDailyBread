export default function Transaction() {
  const transactions = [
    { time: "8.20 AM", total: 115 },
    { time: "8.50 AM", total: 430 },
    { time: "9.00 AM", total: 50 },
    { time: "9.30 AM", total: 430 },
    { time: "9.30 AM", total: 50 },
    { time: "9.50 AM", total: 430 },
  ];

  const totalSum = transactions.reduce((acc, t) => acc + t.total, 0);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Daily Transactions</h1>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>#</th>
            <th>Time</th>
            <th>Total Payment</th>
            <th>Orders</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, i) => (
            <tr key={i} className="border-t">
              <td>{i + 1}</td>
              <td>{t.time}</td>
              <td>{t.total}</td>
              <td>
                <button className="text-blue-500">Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 font-bold">Total: {totalSum}</div>
    </div>
  );
}
