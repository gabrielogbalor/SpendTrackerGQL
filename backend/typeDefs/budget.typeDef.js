const budgetTypeDef = `#graphql
    type Budget {
        amount: Float
    }

    type Query {
        getBudget: Budget
    }

    type Mutation {
        setBudget(amount: Float!): Budget
    }
`;

export default budgetTypeDef;

