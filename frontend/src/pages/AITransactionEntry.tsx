import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@apollo/client';
import { CREATE_TRANSACTION } from '../graphql/mutations/transaction.mutation.ts';
import { GET_TRANSACTIONS } from '../graphql/queries/transaction.query.ts';
import { formatGraphQLDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';

interface ParsedTransaction {
  description: string;
  amount: number;
  category: string;
  paymentType: string;
  location: string;
  date: string;
}

interface LoadingCard {
  id: string;
  transaction: ParsedTransaction;
  isLoading: boolean;
}

const AITransactionEntry: React.FC = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCards, setLoadingCards] = useState<LoadingCard[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // GraphQL mutation for creating transactions
  const [createTransaction] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: [{ query: GET_TRANSACTIONS }],
    onError: (error) => {
      console.error('Failed to save transaction:', error);
      toast.error(`Failed to save transaction: ${error.message}`);
    }
  });

  useEffect(() => {
    // Auto-focus on input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const parseTransactions = async (text: string) => {
    setIsLoading(true);
    setShowWelcome(false);
    
    try {
      const response = await fetch('http://localhost:4000/api/ai/parse-transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.transactions.length > 0) {
        // Create loading cards with staggered animation
        const cards = data.transactions.map((transaction: ParsedTransaction, index: number) => ({
          id: `card-${index}`,
          transaction,
          isLoading: true
        }));
        
        setLoadingCards(cards);
        
        // Simulate processing time and save transactions one by one
        for (let i = 0; i < cards.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 800 + (i * 400)));
          
          // Mark card as finished processing
          setLoadingCards(prev => prev.map((card, idx) => 
            idx === i ? { ...card, isLoading: false } : card
          ));
          
          // Save transaction to database
          try {
            const transaction = data.transactions[i];
            const input = {
              description: transaction.description,
              amount: transaction.amount,
              category: transaction.category,
              location: transaction.location || 'Unknown',
              paymentType: transaction.paymentType,
              date: formatGraphQLDate(transaction.date)
            };
            
            console.log(`Saving transaction ${i + 1}:`, input);
            
            const result = await createTransaction({
              variables: { input }
            });
            
            console.log(`Transaction ${i + 1} saved successfully:`, result);
          } catch (error) {
            console.error(`Failed to save transaction ${i + 1}:`, error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`Failed to save transaction ${i + 1}: ${errorMessage}`);
          }
        }
        
        // Show success and navigate
        toast.success(`🎉 Successfully saved ${data.transactions.length} transactions!`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        navigate('/transactions');
        
      } else {
        setIsLoading(false);
        setShowWelcome(true);
      }
    } catch (error) {
      console.error('Parsing error:', error);
      setIsLoading(false);
      setShowWelcome(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    parseTransactions(input);
    setInput('');
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <motion.header 
        className="p-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          SpendTracker AI
        </h1>
        <p className="text-slate-600 mt-2">Your intelligent financial companion</p>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 pb-20">
        <div className="w-full max-w-2xl">
          
          {/* Welcome Message */}
          <AnimatePresence>
            {showWelcome && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8"
              >
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-6xl mb-4"
                >
                  🌱
                </motion.div>
                <h2 className="text-3xl font-semibold text-slate-800 mb-4">
                  Welcome! Let's get started
                </h2>
                <p className="text-slate-600 text-lg">
                  Tell me about your spending in natural language, and I'll organize everything for you.
                </p>
                <div className="mt-6 text-sm text-slate-500 space-y-2">
                  <p>Try something like:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      "I spent $200 on lunch, $500 yesterday on dinner, all in Bellevue"
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your spending..."
                className="w-full px-6 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors bg-white/80 backdrop-blur-sm shadow-lg"
                disabled={isLoading}
              />
              <motion.button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-2 p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </motion.button>
            </div>
          </motion.form>

          {/* Loading Cards */}
          <AnimatePresence>
            {loadingCards.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 space-y-4"
              >
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="text-4xl mb-2"
                  >
                    🌿
                  </motion.div>
                  <p className="text-slate-600">Processing your transactions...</p>
                </div>
                
                <div className="grid gap-4">
                  {loadingCards.map((card, index) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`p-6 rounded-2xl shadow-lg bg-gradient-to-r ${getCategoryColor(card.transaction.category)} text-white`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getCategoryIcon(card.transaction.category)}</span>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {card.transaction.description}
                            </h3>
                            <p className="text-white/80 text-sm">
                              {card.transaction.location} • {card.transaction.date}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">${card.transaction.amount}</p>
                          <p className="text-white/80 text-sm">{card.transaction.paymentType}</p>
                        </div>
                      </div>
                      
                      {card.isLoading && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 0.8 }}
                          className="mt-4 h-1 bg-white/30 rounded-full overflow-hidden"
                        >
                          <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="h-full w-full bg-white/50"
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Processing Complete */}
          {loadingCards.length > 0 && loadingCards.every(card => !card.isLoading) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 text-center"
            >
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6 }}
                className="text-5xl mb-4"
              >
                🌳
              </motion.div>
              <p className="text-slate-600 text-lg">
                Processing complete! Taking you to your spending overview...
              </p>
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AITransactionEntry; 