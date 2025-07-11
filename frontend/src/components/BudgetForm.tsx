import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { SET_BUDGET, GET_BUDGET } from '../graphql/queries/budget.query';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const BudgetForm = () => {
  const [amount, setAmount] = useState('');

  const [setBudget, { loading }] = useMutation(SET_BUDGET, {
    refetchQueries: [{ query: GET_BUDGET }],
    onCompleted: () => {
      toast.success('Budget updated!');
      setAmount('');
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (isNaN(parsed)) {
      toast.error('Enter a valid number');
      return;
    }
    setBudget({ variables: { amount: parsed } });
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20"
    >
      <h3 className="text-lg font-semibold mb-4 text-slate-800">💰 Set Budget</h3>
      <div className="flex items-center gap-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter budget amount"
          className="border-2 border-slate-200 px-4 py-3 rounded-xl w-64 focus:border-blue-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm"
        />
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg"
        >
          {loading ? 'Saving...' : 'Set Budget'}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default BudgetForm;
