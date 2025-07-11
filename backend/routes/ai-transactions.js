import express from 'express';
import { ChatOllama } from '@langchain/ollama';
import { PromptTemplate } from '@langchain/core/prompts';
import { JsonOutputParser } from '@langchain/core/output_parsers';

const router = express.Router();

// Initialize Ollama LLM
const llm = new ChatOllama({
  baseUrl: "http://localhost:11434", // Ollama default port
  model: "llama3.1:8b",
  temperature: 0.1, // Low temperature for consistent parsing
});

// Enhanced prompt template for better JSON output
const prompt = PromptTemplate.fromTemplate(`You are a financial transaction parser. Parse the following text into JSON format.

Text to parse: {input}
Today's date: {today}

CRITICAL: Return ONLY valid JSON array format. No other text or explanation.

Example format:
[
  {{
    "description": "lunch",
    "amount": 25,
    "category": "Food",
    "paymentType": "Card",
    "location": "Unknown",
    "date": "2025-01-10"
  }}
]

Rules:
- Extract ALL transactions mentioned
- Use only these categories: Food, Entertainment, Utilities
- Default paymentType: Card
- Default location: Unknown
- Convert relative dates (yesterday, today, etc.) to YYYY-MM-DD format
- Return JSON array ONLY, no other text`);

// Create LangChain chain without JsonOutputParser (we'll parse manually)
const parseChain = prompt.pipe(llm);

router.post('/parse-transactions', async (req, res) => {
  try {
    const { input } = req.body;
    
    if (!input) {
      return res.status(400).json({ error: 'Input text is required' });
    }

    console.log('Parsing input:', input);

    // Get today's date for context
    const today = new Date().toISOString().split('T')[0];

    // Parse transactions using LangChain
    const rawResponse = await parseChain.invoke({
      input: input,
      today: today
    });

    console.log('Raw AI response:', rawResponse);

    // Extract and parse JSON from the response
    let parsedTransactions;
    try {
      // The response might be a string or an object with content
      const responseText = typeof rawResponse === 'string' ? rawResponse : rawResponse.content || rawResponse;
      
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        parsedTransactions = JSON.parse(jsonMatch[0]);
      } else {
        // Try parsing the entire response as JSON
        parsedTransactions = JSON.parse(responseText);
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Raw response:', rawResponse);
      return res.status(500).json({ 
        error: 'Failed to parse AI response as JSON',
        details: parseError.message,
        rawResponse: rawResponse 
      });
    }

    console.log('Parsed transactions:', parsedTransactions);

    // Ensure we have an array
    const transactionArray = Array.isArray(parsedTransactions) ? parsedTransactions : [parsedTransactions];

    // Validate parsed data
    const validTransactions = transactionArray.filter(transaction => {
      return transaction && 
             transaction.description && 
             transaction.amount && 
             transaction.category && 
             transaction.paymentType &&
             transaction.date;
    });

    // Add default values for missing fields
    const normalizedTransactions = validTransactions.map(transaction => ({
      ...transaction,
      location: transaction.location || "Unknown",
      paymentType: (transaction.paymentType === "Unknown" || !transaction.paymentType) ? "Card" : transaction.paymentType
    }));

    res.json({
      success: true,
      transactions: normalizedTransactions,
      originalInput: input,
      count: normalizedTransactions.length
    });

  } catch (error) {
    console.error('Transaction parsing error:', error);
    res.status(500).json({ 
      error: 'Failed to parse transactions',
      details: error.message 
    });
  }
});

export default router; 