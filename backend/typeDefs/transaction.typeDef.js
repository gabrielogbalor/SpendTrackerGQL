const transactionTypeDef = `#graphql
    type Transaction {
        _id: ID!
        userId: ID!
        description: String!
        paymentType: String!
        category: String!
        amount: Float!
        location: String
        date: String!
    }

    type CategoryStatistics {
        category: String!
        totalAmount: Float!
    }

    type Query {
        transactions: [Transaction!]
        transaction(transactionId:ID!): Transaction
        categoryStatistics(startDate: String, endDate: String): [CategoryStatistics!]!
    }

    type Mutation {
        createTransaction(input: CreateTransactionInput!): Transaction
        updateTransaction(input: UpdateTransactionInput!): Transaction!
        deleteTransaction(transactionId:ID!): Transaction!
    }

    input CreateTransactionInput {
        description: String!
        paymentType: String!
        category: String!
        amount: Float!
        location: String
        date: String!
    }

    input UpdateTransactionInput {
        transactionId: ID!
        paymentType: String
        category: String
        amount: Float
        location: String
        date: String
    }
`;

export default transactionTypeDef;

