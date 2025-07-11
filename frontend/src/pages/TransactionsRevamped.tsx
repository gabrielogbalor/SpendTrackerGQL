import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import { GET_TRANSACTIONS } from '../graphql/queries/transaction.query.ts';
import { formatDisplayDate } from '../utils/dateUtils';

interface Transaction {
  _id: string;
  description: string;
  amount: number;
  category: string;
  paymentType: string;
  location: string;
  date: string;
}

interface MonthlyGroup {
  month: string;
  year: number;
  transactions: Transaction[];
  totalSpent: number;
}

interface CategorySummary {
  category: string;
  amount: number;
  count: number;
  color: string;
  icon: string;
}

const TransactionsRevamped: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'monthly' | 'categories'>('overview');
  const [animationStage, setAnimationStage] = useState(0);

  const { data, loading, error } = useQuery(GET_TRANSACTIONS, {
    fetchPolicy: 'cache-and-network'
  });

  const transactions: Transaction[] = data?.transactions || [];
  const allTransactions = transactions;

  // Helper functions
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food': return 'from-orange-400 to-red-500';
      case 'entertainment': return 'from-purple-400 to-pink-500';
      case 'utilities': return 'from-blue-400 to-indigo-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food': return '🍽️';
      case 'entertainment': return '🎬';
      case 'utilities': return '⚡';
      default: return '💰';
    }
  };

  // Group transactions by month
  const monthlyGroups: MonthlyGroup[] = React.useMemo(() => {
    const groups: { [key: string]: MonthlyGroup } = {};
    
    allTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      if (!groups[monthKey]) {
        groups[monthKey] = {
          month: monthName,
          year: date.getFullYear(),
          transactions: [],
          totalSpent: 0
        };
      }
      
      groups[monthKey].transactions.push(transaction);
      groups[monthKey].totalSpent += transaction.amount;
    });
    
    return Object.values(groups).sort((a, b) => b.year - a.year);
  }, [allTransactions]);

  // Get category summaries
  const categorySummaries: CategorySummary[] = React.useMemo(() => {
    const summaries: { [key: string]: CategorySummary } = {};
    
    allTransactions.forEach(transaction => {
      const category = transaction.category;
      if (!summaries[category]) {
        summaries[category] = {
          category,
          amount: 0,
          count: 0,
          color: getCategoryColor(category),
          icon: getCategoryIcon(category)
        };
      }
      summaries[category].amount += transaction.amount;
      summaries[category].count += 1;
    });
    
    return Object.values(summaries).sort((a, b) => b.amount - a.amount);
  }, [allTransactions]);

  // Animation sequence
  useEffect(() => {
    const sequence = async () => {
      setAnimationStage(0);
      await new Promise(resolve => setTimeout(resolve, 300));
      setAnimationStage(1);
      await new Promise(resolve => setTimeout(resolve, 600));
      setAnimationStage(2);
      await new Promise(resolve => setTimeout(resolve, 400));
      setAnimationStage(3);
    };
    sequence();
  }, []);

  const totalSpent = allTransactions.reduce((sum, t) => sum + t.amount, 0);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-slate-600">Loading your financial journey...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center text-red-600">
        <p className="text-lg">Error loading transactions: {error.message}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.h1
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                Your Financial Tree 🌳
              </motion.h1>
              <div className="text-sm text-slate-600">
                {allTransactions.length} transactions • ${totalSpent.toFixed(2)} total
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex bg-white rounded-lg shadow-sm overflow-hidden">
              {['overview', 'monthly', 'categories'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as any)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    viewMode === mode
                      ? 'bg-blue-500 text-white'
                      : 'text-slate-600 hover:text-blue-500'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Mode */}
        {viewMode === 'overview' && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: animationStage >= 1 ? 1 : 0, y: animationStage >= 1 ? 0 : 20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {categorySummaries.map((summary, index) => (
                <motion.div
                  key={summary.category}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-2xl shadow-lg bg-gradient-to-r ${summary.color} text-white`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">{summary.category}</p>
                      <p className="text-2xl font-bold">${summary.amount.toFixed(2)}</p>
                      <p className="text-white/80 text-sm">{summary.count} transactions</p>
                    </div>
                    <div className="text-3xl">{summary.icon}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Monthly Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: animationStage >= 2 ? 1 : 0, y: animationStage >= 2 ? 0 : 20 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Monthly Overview</h2>
              <div className="space-y-4">
                {monthlyGroups.map((group, index) => (
                  <motion.div
                    key={group.month}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedMonth(group.month);
                      setViewMode('monthly');
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">📅</div>
                        <div>
                          <h3 className="text-xl font-semibold text-slate-800">{group.month}</h3>
                          <p className="text-slate-600">{group.transactions.length} transactions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-800">${group.totalSpent.toFixed(2)}</p>
                        <p className="text-slate-600 text-sm">Total spent</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Monthly View */}
        {viewMode === 'monthly' && (
          <AnimatePresence mode="wait">
            <motion.div
              key="monthly"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">
                  {selectedMonth || 'All Months'}
                </h2>
                <button
                  onClick={() => setViewMode('overview')}
                  className="text-blue-500 hover:text-blue-600 flex items-center space-x-1"
                >
                  <span>← Back to Overview</span>
                </button>
              </div>

              <div className="grid gap-4">
                {(selectedMonth 
                  ? monthlyGroups.find(g => g.month === selectedMonth)?.transactions || []
                  : allTransactions
                ).map((transaction, index) => (
                  <motion.div
                    key={transaction._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-xl shadow-md bg-gradient-to-r ${getCategoryColor(transaction.category)} text-white`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{getCategoryIcon(transaction.category)}</span>
                        <div>
                          <h3 className="font-semibold">{transaction.description}</h3>
                          <p className="text-white/80 text-sm">
                            {transaction.location} • {formatDisplayDate(transaction.date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">${transaction.amount}</p>
                        <p className="text-white/80 text-sm">{transaction.paymentType}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Categories View */}
        {viewMode === 'categories' && (
          <AnimatePresence mode="wait">
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Categories Breakdown</h2>
                <button
                  onClick={() => setViewMode('overview')}
                  className="text-blue-500 hover:text-blue-600 flex items-center space-x-1"
                >
                  <span>← Back to Overview</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorySummaries.map((summary, index) => (
                  <motion.div
                    key={summary.category}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-6 rounded-2xl shadow-lg bg-gradient-to-r ${summary.color} text-white`}
                  >
                    <div className="text-center space-y-4">
                      <div className="text-4xl">{summary.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold">{summary.category}</h3>
                        <p className="text-3xl font-bold">${summary.amount.toFixed(2)}</p>
                        <p className="text-white/80">{summary.count} transactions</p>
                      </div>
                    </div>
                    
                    {/* Category transactions */}
                    <div className="mt-6 space-y-2">
                      {allTransactions
                        .filter(t => t.category === summary.category)
                        .slice(0, 3)
                        .map((transaction, i) => (
                          <div key={i} className="flex justify-between text-sm text-white/80">
                            <span>{transaction.description}</span>
                            <span>${transaction.amount}</span>
                          </div>
                        ))}
                      {allTransactions.filter(t => t.category === summary.category).length > 3 && (
                        <div className="text-center text-white/60 text-sm">
                          +{allTransactions.filter(t => t.category === summary.category).length - 3} more
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default TransactionsRevamped;