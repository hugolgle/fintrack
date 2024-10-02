import axios from "axios";

export const GET_TRANSACTIONS = "GET_TRANSACTIONS";
export const ADD_TRANSACTIONS = "ADD_TRANSACTIONS";
export const EDIT_TRANSACTIONS = "EDIT_TRANSACTIONS";
export const DELETE_TRANSACTIONS = "DELETE_TRANSACTIONS";

export const getTransactions = () => {
  const idUser = localStorage.getItem("idUser");
  return (dispatch) => {
    return axios
      .get(`http://localhost:5001/transactions/user/${idUser}`)
      .then((res) => {
        dispatch({ type: GET_TRANSACTIONS, payload: res.data });
      });
  };
};

export const addTransactions = (data) => {
  return (dispatch) => {
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

export const editTransactions = (data) => {
  return (dispatch) => {
    return axios
      .put(`http://localhost:5001/transactions/${data.id}`, data)
      .then(() => {
        dispatch({ type: EDIT_TRANSACTIONS, payload: data });
      });
  };
};

export const deleteTransactions = (id) => {
  return (dispatch) => {
    return axios.delete(`http://localhost:5001/transactions/${id}`).then(() => {
      dispatch({ type: DELETE_TRANSACTIONS, payload: id });
    });
  };
};
