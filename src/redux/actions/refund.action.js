import axios from "axios";
import { GET_TRANSACTIONS } from "./transaction.action";

export const ADD_REFUND = "ADD_REFUND";
export const EDIT_REFUND = "EDIT_REFUND";
export const DELETE_REFUND = "DELETE_REFUND";

export const addRefund = (transactionId, refundData) => {
  return (dispatch) => {
    return axios
      .post(
        `http://localhost:5001/transactions/${transactionId}/refund`,
        refundData
      )
      .then((response) => {
        const lastRefund = response.data.remboursements.slice(-1)[0];
        dispatch({
          type: ADD_REFUND,
          payload: { _id: transactionId, refund: lastRefund },
        });
        return axios.get("http://localhost:5001/transactions");
      })
      .then((response) => {
        dispatch({ type: GET_TRANSACTIONS, payload: response.data });
      })
      .catch((error) => {
        console.error("Error adding refund:", error);
        throw error;
      });
  };
};

export const editRefund = (transactionId, refundData) => {
  return (dispatch) => {
    return axios
      .put(
        `http://localhost:5001/transactions/${transactionId}/refund/${refundData.id}`,
        refundData
      )
      .then(() => {
        dispatch({
          type: EDIT_REFUND,
          payload: { transactionId, refund: refundData },
        });
        return axios.get("http://localhost:5001/transactions");
      })
      .then((response) => {
        dispatch({ type: GET_TRANSACTIONS, payload: response.data });
      })
      .catch((error) => {
        console.error("Error editing refund:", error);
        throw error;
      });
  };
};

export const deleteRefund = (transactionId, refundId) => {
  return (dispatch) => {
    return axios
      .delete(
        `http://localhost:5001/transactions/${transactionId}/refund/${refundId}`
      )
      .then(() => {
        dispatch({ type: DELETE_REFUND, payload: { transactionId, refundId } });
        return axios.get("http://localhost:5001/transactions");
      })
      .then((response) => {
        dispatch({ type: GET_TRANSACTIONS, payload: response.data });
      })
      .catch((error) => {
        console.error("Error deleting refund:", error);
        throw error;
      });
  };
};
