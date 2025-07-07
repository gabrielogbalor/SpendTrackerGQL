import { useQuery } from "@apollo/client";
import { GET_TRANSACTION_STATISTICS } from "../graphql/queries/transaction.query";
import CategoryPieChart from '../components/PieChart';

const Dashboard = () => {
  const { data, loading, error } = useQuery(GET_TRANSACTION_STATISTICS);
  
  if (loading) return <p className="p-6 text-gray-600">Loading dashboard...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error.message}</p>;

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

      {/* Pie Chart */}
      {data?.categoryStatistics && data.categoryStatistics.length > 0 && (
        <CategoryPieChart data={data.categoryStatistics} />
      )}
      
      {/* Spending Breakdown (Live Backend Data) */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Spending Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data?.categoryStatistics.map((stat: any) => (
            <div
              key={stat.category}
              className="border border-gray-200 p-4 rounded-lg shadow-sm bg-gray-50"
            >
              <p className="text-sm text-gray-500">{stat.category}</p>
              <p className="text-xl font-bold text-gray-800">
                ${stat.totalAmount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
