import { Dispatch } from "redux";
import axios from "axios";

export const GET_TRANSACTIONS = "GET_TRANSACTIONS";
export const ADD_TRANSACTIONS = "ADD_TRANSACTIONS";
export const EDIT_TRANSACTIONS = "EDIT_TRANSACTIONS";
export const DELETE_TRANSACTIONS = "DELETE_TRANSACTIONS";

interface getTransactionsAction {
  type: typeof GET_TRANSACTIONS;
  payload: any[];
}

interface AddTransactionsAction {
  type: typeof ADD_TRANSACTIONS;
  payload: any;
}

interface editTransactionsAction {
  type: typeof EDIT_TRANSACTIONS;
  payload: any;
}

interface deleteTransactionsAction {
  type: typeof DELETE_TRANSACTIONS;
  payload: any;
}

export const getTransactions = () => {
  const idUser = localStorage.getItem("idUser");
  return (dispatch: Dispatch<getTransactionsAction>) => {
    return axios
      .get(`http://localhost:5001/transactions/user/${idUser}`)
      .then((res) => {
        // Change this line to match the new route
        dispatch({ type: GET_TRANSACTIONS, payload: res.data });
      });
  };
};

export const addTransactions = (data: any) => {
  return (dispatch: Dispatch<AddTransactionsAction>) => {
    return axios
      .post("http://localhost:5001/transactions", data)
      .then((response) => {
        dispatch({ type: ADD_TRANSACTIONS, payload: response.data });
        return response;
      })
      .catch((error) => {
        throw error;
      });
  };
};

export const editTransactions = (data: any) => {
  return (dispatch: Dispatch<editTransactionsAction>) => {
    return axios
      .put(`http://localhost:5001/transactions/${data.id}`, data)
      .then(() => {
        dispatch({ type: EDIT_TRANSACTIONS, payload: data });
      });
  };
};

export const deleteTransactions = (id: any) => {
  return (dispatch: Dispatch<deleteTransactionsAction>) => {
    return axios.delete(`http://localhost:5001/transactions/${id}`).then(() => {
      dispatch({ type: DELETE_TRANSACTIONS, payload: id });
    });
  };
};
