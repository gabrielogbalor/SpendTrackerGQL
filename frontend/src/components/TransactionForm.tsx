import { useState, useEffect, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_TRANSACTION } from '../graphql/mutations/transaction.mutation.ts';
import { GET_TRANSACTIONS } from '../graphql/queries/transaction.query.ts';
import { getTodayInputDate, formatGraphQLDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface TransactionFormProps {
  initialData?: {
    description?: string;
    amount?: number;
    category?: string;
    location?: string;
    paymentType?: string;
    date?: string;
  };
  onDataFilled?: () => void;
}

const TransactionForm = ({ initialData, onDataFilled }: TransactionFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    location: '',
    paymentType: '',
    date: getTodayInputDate(), // Set today as default
  });

  // Effect to populate form when initialData is provided
  useEffect(() => {
    if (initialData) {
      console.log('TransactionForm received initialData:', initialData);
      setFormData({
        description: initialData.description || '',
        amount: initialData.amount ? initialData.amount.toString() : '',
        category: initialData.category || '',
        location: initialData.location || '',
        paymentType: initialData.paymentType || '',
        date: initialData.date || getTodayInputDate(),
      });
      
      // Call callback to notify that data has been filled
      if (onDataFilled) {
        onDataFilled();
      }
      
      // Show toast notification and scroll to form
      toast.success('🤖 AI parsed your transaction! Review and submit below.');
      
      // Scroll to form after a short delay to ensure it's rendered
      setTimeout(() => {
        formRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [initialData, onDataFilled]);

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
        date: getTodayInputDate(), // Reset to today
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

    try {
      const input = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        location: formData.location || 'Unknown',
        paymentType: formData.paymentType,
        date: formatGraphQLDate(formData.date), // Properly format date for GraphQL
      };

      console.log('Sending mutation with input:', input);

      createTransaction({
        variables: { input },
      });
    } catch (error) {
      toast.error('Invalid date format');
      console.error('Date formatting error:', error);
    }
  };

  return (
    <motion.form 
      ref={formRef} 
      onSubmit={handleSubmit} 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800">
          {initialData ? '🤖 AI Parsed Transaction - Review & Submit' : '📝 Add New Transaction'}
        </h3>
        {initialData && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full font-medium shadow-md"
          >
            AI Generated
          </motion.span>
        )}
      </div>
      
      {initialData && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 text-blue-800 px-5 py-4 rounded-xl mb-6 backdrop-blur-sm"
        >
          <p className="text-sm">
            <strong>✨ AI filled this form for you!</strong> Please review the details below and click "Add Transaction" to save.
          </p>
        </motion.div>
      )}
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 text-red-700 px-5 py-4 rounded-xl mb-6 backdrop-blur-sm"
        >
          Error: {error.message}
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <motion.input 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          placeholder="Description *" 
          className="border-2 border-slate-200 p-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm font-medium"
          required
          whileFocus={{ scale: 1.02 }}
        />
        
        <motion.input 
          name="amount" 
          value={formData.amount} 
          onChange={handleChange} 
          placeholder="Amount *" 
          type="number" 
          step="0.01"
          min="0"
          className="border-2 border-slate-200 p-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm font-medium"
          required
          whileFocus={{ scale: 1.02 }}
        />
        
        <motion.select 
          name="category" 
          value={formData.category} 
          onChange={handleChange} 
          className="border-2 border-slate-200 p-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm font-medium"
          required
          whileFocus={{ scale: 1.02 }}
        >
          <option value="">Select Category *</option>
          <option value="Food">🍽️ Food</option>
          <option value="Entertainment">🎬 Entertainment</option>
          <option value="Utilities">⚡ Utilities</option>
        </motion.select>
        
        <motion.input 
          name="location" 
          value={formData.location} 
          onChange={handleChange} 
          placeholder="Location" 
          className="border-2 border-slate-200 p-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm font-medium"
          whileFocus={{ scale: 1.02 }}
        />
        
        <motion.select 
          name="paymentType" 
          value={formData.paymentType} 
          onChange={handleChange} 
          className="border-2 border-slate-200 p-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm font-medium"
          required
          whileFocus={{ scale: 1.02 }}
        >
          <option value="">Payment Type *</option>
          <option value="Cash">💵 Cash</option>
          <option value="Card">💳 Card</option>
        </motion.select>
        
        <motion.input 
          name="date" 
          value={formData.date} 
          onChange={handleChange} 
          type="date" 
          className="border-2 border-slate-200 p-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm font-medium"
          required
          whileFocus={{ scale: 1.02 }}
        />
      </div>
      
      <motion.button 
        type="submit" 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-3 rounded-xl hover:from-slate-800 hover:to-slate-900 disabled:opacity-50 transition-all font-medium shadow-lg"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Transaction'}
      </motion.button>
    </motion.form>
  );
};

export default TransactionForm;
