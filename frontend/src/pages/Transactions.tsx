const Transactions = () => {
  const fakeData = [
    { id: 1, date: '2025-06-01', category: 'Food', amount: -25.5 },
    { id: 2, date: '2025-06-02', category: 'Transport', amount: -13.0 },
    { id: 3, date: '2025-06-03', category: 'Entertainment', amount: -40.0 },
    { id: 4, date: '2025-06-05', category: 'Investment', amount: 150.0 },
  ];

  return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold text-gray-800">Transactions</h1>

        <table className="w-full bg-white rounded shadow-md">
          <thead className="text-left text-gray-600 border-b">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Category</th>
              <th className="p-4">Amount</th>
            </tr>
          </thead>
          <tbody>
            {fakeData.map((tx) => (
              <tr key={tx.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{tx.date}</td>
                <td className="p-4">{tx.category}</td>
                <td className={`p-4 ${tx.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {tx.amount < 0 ? `- $${Math.abs(tx.amount)}` : `+ $${tx.amount}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
};

export default Transactions;
