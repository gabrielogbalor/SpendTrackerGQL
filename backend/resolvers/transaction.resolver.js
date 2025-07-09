import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

const transactionResolver = {
    Query: {
        transactions: async (_, __, context) => {
			try {
				// TEMPORARILY COMMENTED OUT FOR TESTING
				// if (!context.getUser()) throw new Error("Unauthorized");
				// const userId = await context.getUser()._id;

				// For testing, let's get all transactions (or you can hardcode a userId)
				const transactions = await Transaction.find({}).sort({ date: -1 });
				return transactions;
			} catch (err) {
				console.error("Error getting transactions:", err);
				throw new Error("Error getting transactions");
			}
		},
		transaction: async (_, { transactionId }) => {
			try {
				const transaction = await Transaction.findById(transactionId);
				return transaction;
			} catch (err) {
				console.error("Error getting transaction:", err);
				throw new Error("Error getting transaction");
			}
		},
        categoryStatistics: async (_, { startDate, endDate }, context) => {
            try {
                console.log("CategoryStatistics called with:", { startDate, endDate });
                
                // Build match stage for aggregation
                const matchStage = {
                    // For testing, match a dummy userId or remove userId filter entirely
                    // userId: context.getUser()?._id || mongoose.Types.ObjectId("507f1f77bcf86cd799439011")
                };
                
                // Add date filtering if provided
                if (startDate && endDate) {
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    
                    // Set end date to end of day to include full day
                    end.setHours(23, 59, 59, 999);
                    
                    matchStage.date = {
                        $gte: start,
                        $lte: end,
                    };
                    
                    console.log("Date filtering applied:", { start, end });
                }
                
                console.log("Match stage:", matchStage);
                
                const stats = await Transaction.aggregate([
                    { $match: matchStage },
                    {
                        $group: {
                            _id: '$category',
                            totalAmount: { $sum: '$amount' },
                        },
                    },
                    {
                        $project: {
                            category: '$_id',
                            totalAmount: 1,
                            _id: 0,
                        },
                    },
                ]);
                
                console.log("Category statistics result:", stats);
                return stats;
            } catch (err) {
                console.error("Error getting category statistics:", err);
                throw new Error("Error getting category statistics");
            }
        }
    },
    Mutation: {
        createTransaction: async (_, { input }, context) => {
			try {
				console.log("Received input:", input);
				
				// Ensure date is properly parsed
				const transactionData = {
					...input,
					userId: "507f1f77bcf86cd799439011", // dummy ObjectId for testing
					date: new Date(input.date), // Ensure date is a proper Date object
				};
				
				const newTransaction = new Transaction(transactionData);
				
				console.log("About to save transaction:", newTransaction);
				await newTransaction.save();
				console.log("Transaction saved successfully:", newTransaction);
				return newTransaction;
			} catch (err) {
				console.error("Detailed error creating transaction:", err);
				console.error("Error name:", err.name);
				console.error("Error message:", err.message);
				if (err.errors) {
					console.error("Validation errors:", err.errors);
				}
				throw new Error(`Error creating transaction: ${err.message}`);
			}
		},
		updateTransaction: async (_, { input }) => {
			try {
				// Prepare update data, ensuring date is properly handled
				const updateData = { ...input };
				delete updateData.transactionId; // Remove transactionId from update data
				
				if (input.date) {
					updateData.date = new Date(input.date);
				}
				
				const updatedTransaction = await Transaction.findByIdAndUpdate(
					input.transactionId, 
					updateData, 
					{ new: true }
				);
				
				if (!updatedTransaction) {
					throw new Error("Transaction not found");
				}
				
				return updatedTransaction;
			} catch (err) {
				console.error("Error updating transaction:", err);
				throw new Error("Error updating transaction");
			}
		},
		deleteTransaction: async (_, { transactionId }) => {
			try {
				const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
				return deletedTransaction;
			} catch (err) {
				console.error("Error deleting transaction:", err);
				throw new Error("Error deleting transaction");
			}
		},
    },
    //TODO => ADD USER/TRANSACTION RELATION
};

export default transactionResolver;