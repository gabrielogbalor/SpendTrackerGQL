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
				const transactions = await Transaction.find({});
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
        categoryStatistics: async (_, __, context) => {
            try {
                // TEMPORARILY COMMENTED OUT FOR TESTING
                // if (!context.getUser()) throw new Error("Unauthorized");
                // const userId = await context.getUser()._id;

                // Get all transactions (for testing)
                const transactions = await Transaction.find({});

                // Group transactions by category and calculate total amount
                const stats = {};
                
                // Initialize with all categories, even if they have 0 transactions
                stats["saving"] = { category: "saving", totalAmount: 0 };
                stats["expense"] = { category: "expense", totalAmount: 0 };
                stats["investment"] = { category: "investment", totalAmount: 0 };

                // Add up transaction amounts by category
                transactions.forEach(transaction => {
                    stats[transaction.category].totalAmount += transaction.amount;
                });

                return Object.values(stats);
            } catch (err) {
                console.error("Error getting category statistics:", err);
                throw new Error("Error getting category statistics");
            }
        }
    },
    Mutation: {
        createTransaction: async (_, { input }, context) => {
			try {
				// TEMPORARILY COMMENTED OUT FOR TESTING
				// const newTransaction = new Transaction({
				// 	...input,
				// 	userId: context.getUser()._id,
				// });

				// For testing, use a dummy userId or make it optional
				const newTransaction = new Transaction({
					...input,
					userId: "507f1f77bcf86cd799439011", // dummy ObjectId for testing
				});
				await newTransaction.save();
				return newTransaction;
			} catch (err) {
				console.error("Error creating transaction:", err);
				throw new Error("Error creating transaction");
			}
		},
		updateTransaction: async (_, { input }) => {
			try {
				const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, {
					new: true,
				});
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