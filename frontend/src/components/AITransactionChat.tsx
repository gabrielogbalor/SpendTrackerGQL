import React, { useState, useRef, useEffect } from 'react';

interface ParsedTransaction {
  description: string;
  amount: number;
  category: string;
  paymentType: string;
  location: string;
  date: string;
}

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  transactions?: ParsedTransaction[];
}

interface AITransactionChatProps {
  onTransactionParsed: (transaction: ParsedTransaction) => void;
}

const AITransactionChat: React.FC<AITransactionChatProps> = ({ onTransactionParsed }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hi! I'm your AI transaction assistant. Tell me about your spending like: 'I spent $45 on lunch and $12 on coffee today'",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingTransactions, setPendingTransactions] = useState<ParsedTransaction[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseTransactions = async (text: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:4000/api/ai/parse-transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.transactions.length > 0) {
        const transactions = data.transactions;
        
        if (transactions.length === 1) {
          // Single transaction - immediately populate form
          const transaction = transactions[0];
          const aiMessage: ChatMessage = {
            id: Date.now().toString(),
            content: `✅ Found: $${transaction.amount} for ${transaction.description} (${transaction.category}). I've filled out the form below - please review and submit!`,
            isUser: false,
            timestamp: new Date(),
            transactions: [transaction]
          };
          
          setMessages(prev => [...prev, aiMessage]);
          
          // Populate the form immediately
          console.log('AI Chat calling onTransactionParsed with:', transaction);
          onTransactionParsed(transaction);
          
        } else {
          // Multiple transactions - let user choose
          const aiMessage: ChatMessage = {
            id: Date.now().toString(),
            content: `I found ${transactions.length} transactions: ${transactions.map((t: ParsedTransaction, index: number) => `${index + 1}. $${t.amount} for ${t.description} (${t.category})`).join(', ')}. Which one would you like me to fill out first? (Type the number)`,
            isUser: false,
            timestamp: new Date(),
            transactions: transactions
          };
          
          setMessages(prev => [...prev, aiMessage]);
          setPendingTransactions(transactions);
        }
        
      } else {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          content: "I couldn't find any transactions in that message. Try something like: 'I spent $20 on lunch' or 'Coffee $5, gas $25'",
          isUser: false,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Parsing error:', error);
      let errorMessage = "Sorry, I had trouble processing that. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = "🔌 Cannot connect to AI service. Please make sure the backend is running on port 4000.";
        } else if (error.message.includes('HTTP 500')) {
          errorMessage = "🤖 AI processing error. The model might be loading - please try again in a moment.";
        } else if (error.message.includes('HTTP 404')) {
          errorMessage = "❌ AI service not found. Please check if the backend is properly configured.";
        }
      }
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: errorMessage,
        isUser: false,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectTransaction = (index: number) => {
    if (index >= 0 && index < pendingTransactions.length) {
      const selectedTransaction = pendingTransactions[index];
      
      // Populate the form
      console.log('AI Chat calling onTransactionParsed with selected:', selectedTransaction);
      onTransactionParsed(selectedTransaction);
      
      // Add confirmation message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: `✅ Selected: $${selectedTransaction.amount} for ${selectedTransaction.description} (${selectedTransaction.category}). I've filled out the form below - please review and submit!`,
        isUser: false,
        timestamp: new Date()
      }]);
      
      // Clear pending transactions
      setPendingTransactions([]);
    } else {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: "Invalid selection. Please type a number from the list above.",
        isUser: false,
        timestamp: new Date()
      }]);
    }
  };

  const cancelTransactions = () => {
    setPendingTransactions([]);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content: "Okay, I've cancelled those transactions. What else can I help you with?",
      isUser: false,
      timestamp: new Date()
    }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Check for transaction selection
    if (pendingTransactions.length > 0) {
      // Check if user typed a number to select a transaction
      const selectedNumber = parseInt(input.trim());
      if (!isNaN(selectedNumber) && selectedNumber >= 1 && selectedNumber <= pendingTransactions.length) {
        selectTransaction(selectedNumber - 1); // Convert to 0-based index
      } else if (input.toLowerCase().includes('cancel') || 
                 input.toLowerCase().includes('no')) {
        cancelTransactions();
      } else {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          content: "Please type a number from the list above to select a transaction, or 'cancel' to start over.",
          isUser: false,
          timestamp: new Date()
        }]);
      }
    } else {
      // Parse new transactions
      parseTransactions(input);
    }

    setInput('');
  };

  return (
    <div className="flex flex-col h-96 border border-gray-300 rounded-lg bg-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800 border'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              {message.transactions && (
                <div className="mt-2 text-xs bg-white/10 rounded p-2">
                  {message.transactions.map((t, i) => (
                    <div key={i} className="flex justify-between items-center py-1">
                      <span className="font-medium">{t.description}</span>
                      <span className="ml-2">${t.amount}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg border">
              <div className="flex space-x-1 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <span className="ml-2 text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-300 bg-gray-50">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              pendingTransactions.length > 0 
                ? "Type a number to select a transaction, or 'cancel'" 
                : "Tell me about your spending... (e.g., 'lunch $12, coffee $5')"
            }
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default AITransactionChat; 