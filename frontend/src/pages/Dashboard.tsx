const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>

      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm text-gray-500">Total Budget</p>
          <p className="text-2xl font-bold">$5,000</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm text-gray-500">Spent This Month</p>
          <p className="text-2xl font-bold text-red-600">$3,200</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm text-gray-500">Remaining</p>
          <p className="text-2xl font-bold text-green-600">$1,800</p>
        </div>
      </div>

      {/* Monthly Progress Bar */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-sm text-gray-600 mb-2">Monthly Budget Progress</p>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div className="bg-blue-500 h-4 rounded-full w-[64%]" />
        </div>
        <p className="text-sm mt-2 text-right text-gray-500">64% spent</p>
      </div>

      {/* Recent Transactions Table (Placeholder) */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-600 border-b">
              <th className="pb-2">Date</th>
              <th className="pb-2">Category</th>
              <th className="pb-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">June 1</td>
              <td>Food</td>
              <td className="text-red-600">- $45.00</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">June 3</td>
              <td>Entertainment</td>
              <td className="text-red-600">- $25.00</td>
            </tr>
            <tr>
              <td className="py-2">June 5</td>
              <td>Transport</td>
              <td className="text-red-600">- $15.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
