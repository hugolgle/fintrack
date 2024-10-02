import {
  GET_TRANSACTIONS,
  ADD_TRANSACTIONS,
  EDIT_TRANSACTIONS,
  DELETE_TRANSACTIONS,
} from "../actions/transaction.action";
import {
  ADD_REFUND,
  EDIT_REFUND,
  DELETE_REFUND,
} from "../actions/refund.action";

const initialState = [];

export default function transactionReducer(state = initialState, action) {
  switch (action.type) {
    case GET_TRANSACTIONS:
      return action.payload;
    case ADD_TRANSACTIONS:
      return [action.payload, ...state];
    case EDIT_TRANSACTIONS:
      return state.map((transaction) => {
        if (transaction._id === action.payload._id) {
          return {
            ...transaction,
            content: action.payload.content,
          };
        } else return transaction;
      });
    case DELETE_TRANSACTIONS:
      return state.filter((transaction) => transaction._id !== action.payload);
    case ADD_REFUND:
      return state.map((transaction) => {
        if (transaction._id === action.payload._id) {
          return {
            ...transaction,
            remboursements: [
              ...transaction.remboursements,
              action.payload.refund,
            ],
          };
        } else return transaction;
      });
    case EDIT_REFUND:
      return state.map((transaction) => {
        if (transaction._id === action.payload.transactionId) {
          return {
            ...transaction,
            remboursements: transaction.remboursements.map((refund) =>
              refund._id === action.payload.refund._id
                ? action.payload.refund
                : refund
            ),
          };
        } else return transaction;
      });
    case DELETE_REFUND:
      return state.map((transaction) => {
        if (transaction._id === action.payload.transactionId) {
          return {
            ...transaction,
            remboursements: transaction.remboursements.filter(
              (refund) => refund._id !== action.payload.refundId
            ),
          };
        } else return transaction;
      });
    default:
      return state;
  }
}
