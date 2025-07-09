import { useQuery } from "@apollo/client";
import { GET_TRANSACTION_STATISTICS } from "../graphql/queries/transaction.query.ts";
import { GET_BUDGET } from "../graphql/queries/budget.query.ts";
import CategoryPieChart from '../components/PieChart';
import BudgetForm from '../components/BudgetForm';
import { useState } from "react";

const Dashboard = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Query category statistics with date filtering
  const { data: statsData, loading: statsLoading, error: statsError } = useQuery(GET_TRANSACTION_STATISTICS, {
    variables: startDate && endDate ? { startDate, endDate } : {},
    fetchPolicy: 'cache-and-network' // Ensure fresh data when dates change
  });

  const { data: budgetData, loading: loadingBudget } = useQuery(GET_BUDGET);

  const budget = budgetData?.getBudget?.amount || 0;
  
  // Use the filtered statistics data for calculations
  const categoryStats = statsData?.categoryStatistics || [];
  const totalSpent = categoryStats.reduce((sum: number, stat: any) => sum + stat.totalAmount, 0);
  const percentSpent = budget > 0 ? ((totalSpent / budget) * 100) : 0;
  const remaining = budget - totalSpent;

  // Clear date filters
  const clearDateFilter = () => {
    setStartDate('');
    setEndDate('');
  };

  if (statsLoading || loadingBudget) return <p className="p-6 text-gray-600">Loading dashboard...</p>;
  if (statsError) return <p className="p-6 text-red-600">Error: {statsError.message}</p>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
      
      {/* Date Range Filter */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-3">Filter by Date Range</h3>
        <div className="flex items-center gap-4 mb-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-3 py-2 rounded"
            placeholder="Start Date"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-3 py-2 rounded"
            placeholder="End Date"
          />
          {(startDate || endDate) && (
            <button
              onClick={clearDateFilter}
              className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Clear Filter
            </button>
          )}
        </div>
        {startDate && endDate && (
          <p className="text-sm text-gray-600">
            Showing data from {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
          </p>
        )}
      </div>

      <BudgetForm />
      
      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm text-gray-500">Total Budget</p>
          <p className="text-2xl font-bold">${budget.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm text-gray-500">Spent {startDate && endDate ? '(Filtered)' : ''}</p>
          <p className="text-2xl font-bold text-red-600">${totalSpent.toLocaleString()}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm text-gray-500">Remaining</p>
          <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${Math.abs(remaining).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Monthly Progress Bar */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-sm text-gray-600 mb-2">Budget Progress {startDate && endDate ? '(Filtered Period)' : ''}</p>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-blue-500 h-4 rounded-full transition-all duration-300" 
            style={{ width: `${Math.min(percentSpent, 100)}%` }}
          />
        </div>
        <p className="text-sm mt-2 text-right text-gray-500">
          {percentSpent.toFixed(1)}% spent
        </p>
      </div>

      {/* Spending Breakdown Section */}
      {categoryStats.length > 0 ? (
        <div className="space-y-6">
          {/* Category Breakdown Cards */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Spending by Category {startDate && endDate ? '(Filtered)' : ''}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categoryStats.map((stat: any) => (
                <div
                  key={stat.category}
                  className="border border-gray-200 p-4 rounded-lg shadow-sm bg-gray-50"
                >
                  <p className="text-sm text-gray-500">{stat.category}</p>
                  <p className="text-xl font-bold text-gray-800">
                    ${stat.totalAmount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {((stat.totalAmount / totalSpent) * 100).toFixed(1)}% of total
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Category Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Visual Breakdown</h3>
            <CategoryPieChart data={categoryStats} />
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Spending by Category</h3>
          <p className="text-gray-500 text-center py-8">
            {startDate && endDate 
              ? 'No transactions found in the selected date range' 
              : 'No transactions found. Create some transactions to see category breakdown.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
