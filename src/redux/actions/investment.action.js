import axios from "axios";

export const GET_INVESTMENTS = "GET_INVESTMENTS";
export const ADD_INVESTMENTS = "ADD_INVESTMENTS";
export const EDIT_INVESTMENTS = "EDIT_INVESTMENTS";
export const SOLD_INVESTMENTS = "SOLD_INVESTMENTS";
export const DELETE_INVESTMENTS = "DELETE_INVESTMENTS";

export const getInvestments = () => {
  const idUser = localStorage.getItem("idUser");
  return (dispatch) => {
    return axios
      .get(`http://localhost:5001/investments/user/${idUser}`)
      .then((res) => {
        // Dispatch the action with the fetched data
        dispatch({ type: GET_INVESTMENTS, payload: res.data });
      });
  };
};

export const addInvestments = (data) => {
  return (dispatch) => {
    return axios
      .post("http://localhost:5001/investments", data)
      .then((response) => {
        dispatch({ type: ADD_INVESTMENTS, payload: response.data });
        return response;
      })
      .catch((error) => {
        throw error;
      });
  };
};

export const editInvestments = (data) => {
  return (dispatch) => {
    return axios
      .put(`http://localhost:5001/investments/${data.id}`, data)
      .then(() => {
        dispatch({ type: EDIT_INVESTMENTS, payload: data });
      });
  };
};

export const soldInvestments = (id, montantVendu) => {
  return (dispatch) => {
    return axios
      .put(`http://localhost:5001/investments/${id}/sold`, { montantVendu })
      .then((response) => {
        dispatch({ type: EDIT_INVESTMENTS, payload: response.data });
      });
  };
};

export const deleteInvestments = (id) => {
  return (dispatch) => {
    return axios.delete(`http://localhost:5001/investments/${id}`).then(() => {
      dispatch({ type: DELETE_INVESTMENTS, payload: id });
    });
  };
};
