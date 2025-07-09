import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { SET_BUDGET, GET_BUDGET } from '../graphql/queries/budget.query';
import toast from 'react-hot-toast';

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
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md mb-4 flex items-center gap-4">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter budget amount"
        className="border px-3 py-2 rounded w-64"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
      >
        {loading ? 'Saving...' : 'Set Budget'}
      </button>
    </form>
  );
};

export default BudgetForm;
