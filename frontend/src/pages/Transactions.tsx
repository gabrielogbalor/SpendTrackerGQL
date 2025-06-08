import { useQuery } from "@apollo/client";
import { GET_TRANSACTIONS } from "../graphql/queries/transaction.query";

const Transactions = () => {
  const { data, loading, error } = useQuery(GET_TRANSACTIONS);
  
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800">Transactions</h1>

      <table className="w-full bg-white rounded shadow-md">
        <thead className="text-left text-gray-600 border-b">
          <tr>
            <th className="p-4">Date</th>
            <th className="p-4">Description</th>
            <th className="p-4">Category</th>
            <th className="p-4">Amount</th>
            <th className="p-4">Location</th>
            <th className="p-4">Payment Type</th>
          </tr>
        </thead>
        <tbody>
          {data.transactions.map((tx: any) => (
            <tr key={tx._id} className="border-b hover:bg-gray-50">
              <td className="p-4">{new Date(tx.date).toLocaleDateString()}</td>
              <td className="p-4">{tx.description}</td>
              <td className="p-4 capitalize">{tx.category}</td>
              <td className={`p-4 font-medium ${tx.category === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                ${Math.abs(tx.amount).toFixed(2)}
              </td>
              <td className="p-4">{tx.location || 'N/A'}</td>
              <td className="p-4 capitalize">{tx.paymentType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
