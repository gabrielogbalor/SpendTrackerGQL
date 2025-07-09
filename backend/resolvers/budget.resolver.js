import Budget from '../models/budget.model.js';

const budgetResolver = {
  Query: {
    getBudget: async (_, __, context) => {
      try {
        // TODO: Tie to actual user later
        let budget = await Budget.findOne({});
        
        // If no budget exists, create a default one
        if (!budget) {
          budget = new Budget({ 
            amount: 0,
            // Leave userId undefined for now since auth isn't fully implemented
          });
          await budget.save();
        }
        
        return budget;
      } catch (error) {
        console.error("Error getting budget:", error);
        throw new Error("Error getting budget");
      }
    }
  },
  Mutation: {
    setBudget: async (_, { amount }, context) => {
      try {
        // Overwrite or create
        const existing = await Budget.findOne({});
        if (existing) {
          existing.amount = amount;
          await existing.save();
          return existing;
        }
        const newBudget = new Budget({ 
          amount,
          // Leave userId undefined for now since auth isn't fully implemented
        });
        await newBudget.save();
        return newBudget;
      } catch (error) {
        console.error("Error setting budget:", error);
        throw new Error("Error setting budget");
      }
    }
  }
};

export default budgetResolver;
