import { gql } from "@apollo/client";

export const GET_BUDGET = gql`
  query GetBudget {
    getBudget {
      amount
    }
  }
`; 

export const SET_BUDGET = gql`
  mutation SetBudget($amount: Float!) {
    setBudget(amount: $amount) {
      amount
    }
  }
`;