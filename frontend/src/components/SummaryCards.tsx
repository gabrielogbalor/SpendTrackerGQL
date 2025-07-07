import React from 'react';

interface Transaction {
  _id: string;
  amount: number;
  category: string;
}

interface Props {
  transactions: Transaction[];
}

const SummaryCards: React.FC<Props> = ({ transactions }) => {
  const totalSpending = transactions
    .filter(tx => tx.amount < 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const topCategory = [...transactions]
    .filter(tx => tx.amount < 0)
    .reduce((acc: Record<string, number>, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + Math.abs(tx.amount);
      return acc;
    }, {});

  const mostSpentCategory = Object.entries(topCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
      <div className="bg-white p-4 rounded shadow text-center">
        <h3 className="text-gray-600 text-sm">Total Spending</h3>
        <p className="text-2xl font-bold text-red-600">${Math.abs(totalSpending).toFixed(2)}</p>
      </div>
      <div className="bg-white p-4 rounded shadow text-center">
        <h3 className="text-gray-600 text-sm">Total Transactions</h3>
        <p className="text-2xl font-bold">{transactions.length}</p>
      </div>
      <div className="bg-white p-4 rounded shadow text-center">
        <h3 className="text-gray-600 text-sm">Top Category</h3>
        <p className="text-xl font-semibold">{mostSpentCategory}</p>
      </div>
    </div>
  );
};

export default SummaryCards;
