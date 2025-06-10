import { useQuery } from "@apollo/client";
import { useState } from "react";
import { GET_TRANSACTIONS } from "../graphql/queries/transaction.query";
import TransactionTable from "../components/TransactionTable";
import TransactionForm from "../components/TransactionForm";

const Transactions = () => {
  const { data, loading, error } = useQuery(GET_TRANSACTIONS);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [sortKey, setSortKey] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
  
  if (error) return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800">Transactions</h1>
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Error:</strong> {error.message}
        <br />
        <small>Make sure your backend is running and you're authenticated</small>
      </div>
    </div>
  );

  // Check if no transactions
  if (!data?.transactions || data.transactions.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold text-gray-800">Transactions</h1>
        <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-8 rounded text-center">
          <p className="text-lg font-medium">No transactions found</p>
          <p className="text-sm">Create your first transaction to see it here!</p>
        </div>
      </div>
    );
  }

  // Now we can safely filter and sort since we know data.transactions exists
  const filteredTransactions = data.transactions.filter((tx: any) =>
    categoryFilter === 'All' ? true : tx.category === categoryFilter
  );
  
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const aValue = sortKey === 'amount' ? a.amount : new Date(a.date).getTime();
    const bValue = sortKey === 'amount' ? b.amount : new Date(b.date).getTime();
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800">Transactions</h1>
      
      <div className="flex items-center gap-4 mb-4">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="All">All Categories</option>
          <option value="Food">Food</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Utilities">Utilities</option>
        </select>

        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as 'date' | 'amount')}
          className="border px-3 py-2 rounded"
        >
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
        </select>

        <button
          onClick={() =>
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
          }
          className="border px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-700"
        >
          {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
        </button>
      </div>

      <TransactionTable transactions={sortedTransactions} />
      <TransactionForm />
    </div>
  );
};

export default Transactions;
