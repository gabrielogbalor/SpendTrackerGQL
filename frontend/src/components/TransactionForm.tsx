import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_TRANSACTION } from '../graphql/mutations/transaction.mutation';
import { GET_TRANSACTIONS } from '../graphql/queries/transaction.query';
import toast from 'react-hot-toast';

const TransactionForm = () => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    location: '',
    paymentType: '',
    date: '',
  });

  const [createTransaction, { loading, error }] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: [{ query: GET_TRANSACTIONS }],
    onCompleted: (data) => {
      console.log('Transaction created successfully:', data);
      setFormData({
        description: '',
        amount: '',
        category: '',
        location: '',
        paymentType: '',
        date: '',
      });
      toast.success('Transaction added successfully!');
    },
    onError: (error) => {
      console.error('Transaction creation error:', error);
      toast.error(`Error: ${error.message}`);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    
    // Validate required fields
    if (!formData.description || !formData.amount || !formData.category || !formData.paymentType || !formData.date) {
      toast.error('Please fill in all required fields');
      console.log('Validation failed - missing fields');
      return;
    }

    const input = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category, // Keep original capitalization
      location: formData.location || 'Unknown',
      paymentType: formData.paymentType,
      date: formData.date,
    };

    console.log('Sending mutation with input:', input);

    createTransaction({
      variables: { input },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">Add New Transaction</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error.message}
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <input 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          placeholder="Description *" 
          className="border p-2 rounded"
          required
        />
        
        <input 
          name="amount" 
          value={formData.amount} 
          onChange={handleChange} 
          placeholder="Amount *" 
          type="number" 
          step="0.01"
          min="0"
          className="border p-2 rounded"
          required
        />
        
        <select 
          name="category" 
          value={formData.category} 
          onChange={handleChange} 
          className="border p-2 rounded"
          required
        >
          <option value="">Select Category *</option>
          <option value="Food">Food</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Utilities">Utilities</option>
        </select>
        
        <input 
          name="location" 
          value={formData.location} 
          onChange={handleChange} 
          placeholder="Location" 
          className="border p-2 rounded" 
        />
        
        <select 
          name="paymentType" 
          value={formData.paymentType} 
          onChange={handleChange} 
          className="border p-2 rounded"
          required
        >
          <option value="">Payment Type *</option>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
        </select>
        
        <input 
          name="date" 
          value={formData.date} 
          onChange={handleChange} 
          type="date" 
          className="border p-2 rounded"
          required
        />
      </div>
      
      <button 
        type="submit" 
        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Transaction'}
      </button>
    </form>
  );
};

export default TransactionForm;
