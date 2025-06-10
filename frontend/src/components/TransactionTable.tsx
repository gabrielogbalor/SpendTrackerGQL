// src/components/TransactionTable.tsx
import React from 'react';

interface Transaction {
  _id: string;
  date: string;
  category: string;
  amount: number;
  location: string;
  paymentType: string;
  description: string;
}

interface Props {
  transactions: Transaction[];
}

const TransactionTable: React.FC<Props> = ({ transactions }) => {
  return (
    <table className="w-full bg-white rounded shadow-md">
      <thead className="text-left text-gray-600 border-b">
        <tr>
          <th className="p-4">Date</th>
          <th className="p-4">Category</th>
          <th className="p-4">Amount</th>
          <th className="p-4">Location</th>
          <th className="p-4">Payment Type</th>
          <th className="p-4">Description</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((tx) => (
          <tr key={tx._id} className="border-b hover:bg-gray-50">
            <td className="p-4">{tx.date}</td>
            <td className="p-4">{tx.category}</td>
            <td className={`p-4 ${tx.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
              ${Math.abs(tx.amount)}
            </td>
            <td className="p-4">{tx.location}</td>
            <td className="p-4">{tx.paymentType}</td>
            <td className="p-4">{tx.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionTable;
