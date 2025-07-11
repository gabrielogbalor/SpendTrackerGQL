import { useQuery } from "@apollo/client";
import { GET_TRANSACTION_STATISTICS } from "../graphql/queries/transaction.query.ts";
import { GET_BUDGET } from "../graphql/queries/budget.query.ts";
import CategoryPieChart from '../components/PieChart';
import BudgetForm from '../components/BudgetForm';
import AITransactionChat from '../components/AITransactionChat';
import TransactionForm from '../components/TransactionForm';
import { useState } from "react";
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [aiTransactionData, setAiTransactionData] = useState<any>(null);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Financial Dashboard 📊
          </h1>
          <p className="text-slate-600 mt-2">Your complete spending overview</p>
        </motion.header>
      
      {/* Date Range Filter */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20"
      >
        <h3 className="text-lg font-semibold mb-4 text-slate-800">📅 Filter by Date Range</h3>
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
      </motion.div>

      <BudgetForm />

      {/* AI Transaction Assistant */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20"
      >
        <h3 className="text-lg font-semibold mb-4 text-slate-800">🤖 AI Transaction Assistant</h3>
        <p className="text-sm text-slate-600 mb-4">
          Tell me about your spending in natural language! Try: "I spent $25 on lunch and $10 on coffee today"
        </p>
        <AITransactionChat onTransactionParsed={setAiTransactionData} />
      </motion.div>

      {/* Transaction Form - Highlighted when AI populated */}
      <div className={`${aiTransactionData ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
        <TransactionForm 
          initialData={aiTransactionData} 
          onDataFilled={() => setAiTransactionData(null)} // Clear after filling
        />
      </div>
      
      {/* Budget Summary Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-2xl shadow-lg"
        >
          <p className="text-sm text-blue-100 mb-2">💰 Total Budget</p>
          <p className="text-3xl font-bold">${budget.toLocaleString()}</p>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-2xl shadow-lg"
        >
          <p className="text-sm text-orange-100 mb-2">💸 Spent {startDate && endDate ? '(Filtered)' : ''}</p>
          <p className="text-3xl font-bold">${totalSpent.toLocaleString()}</p>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className={`bg-gradient-to-r ${remaining >= 0 ? 'from-green-500 to-emerald-500' : 'from-red-500 to-pink-500'} text-white p-6 rounded-2xl shadow-lg`}
        >
          <p className="text-sm text-green-100 mb-2">{remaining >= 0 ? '✅' : '⚠️'} Remaining</p>
          <p className="text-3xl font-bold">
            ${Math.abs(remaining).toLocaleString()}
          </p>
        </motion.div>
      </motion.div>

      {/* Monthly Progress Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20"
      >
        <p className="text-sm text-slate-600 mb-4 font-medium">📊 Budget Progress {startDate && endDate ? '(Filtered Period)' : ''}</p>
        <div className="w-full bg-slate-200 rounded-full h-6 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentSpent, 100)}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-6 rounded-full shadow-inner"
          />
        </div>
        <p className="text-sm mt-3 text-right text-slate-600 font-medium">
          {percentSpent.toFixed(1)}% spent
        </p>
      </motion.div>

      {/* Spending Breakdown Section */}
      {categoryStats.length > 0 ? (
        <div className="space-y-6">
          {/* Category Breakdown Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20"
          >
            <h3 className="text-lg font-semibold mb-6 text-slate-800">📈 Spending by Category {startDate && endDate ? '(Filtered)' : ''}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categoryStats.map((stat: any, index: number) => (
                <motion.div
                  key={stat.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  className="bg-gradient-to-r from-slate-100 to-white p-5 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow"
                >
                  <p className="text-sm text-slate-600 mb-2">{stat.category}</p>
                  <p className="text-2xl font-bold text-slate-800">
                    ${stat.totalAmount.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">
                    {((stat.totalAmount / totalSpent) * 100).toFixed(1)}% of total
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Category Pie Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20"
          >
            <h3 className="text-lg font-semibold mb-6 text-slate-800">📊 Visual Breakdown</h3>
            <CategoryPieChart data={categoryStats} />
          </motion.div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20"
        >
          <h3 className="text-lg font-semibold mb-6 text-slate-800">📊 Spending by Category</h3>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌱</div>
            <p className="text-slate-600 text-lg">
              {startDate && endDate 
                ? 'No transactions found in the selected date range' 
                : 'No transactions found. Create some transactions to see category breakdown.'}
            </p>
          </div>
        </motion.div>
      )}
      </div>
    </div>
  );
};

export default Dashboard;
