import { mergeTypeDefs } from "@graphql-tools/merge";

import userTypeDef from './user.typeDef.js';
import transactionTypeDef from './transaction.typeDef.js';
import budgetTypeDef from './budget.typeDef.js';

const mergedTypeDefs = mergeTypeDefs([userTypeDef, transactionTypeDef, budgetTypeDef]);

export default mergedTypeDefs;