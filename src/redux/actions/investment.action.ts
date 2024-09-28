import { Dispatch } from "redux";
import axios from "axios";

export const GET_INVESTMENTS = "GET_INVESTMENTS";
export const ADD_INVESTMENTS = "ADD_INVESTMENTS";
export const EDIT_INVESTMENTS = "EDIT_INVESTMENTS";
export const SOLD_INVESTMENTS = "SOLD_INVESTMENTS";
export const DELETE_INVESTMENTS = "DELETE_INVESTMENTS";

interface getInvestmentsAction {
  type: typeof GET_INVESTMENTS;
  payload: any[];
}

interface AddInvestmentsAction {
  type: typeof ADD_INVESTMENTS;
  payload: any;
}

interface editInvestmentsAction {
  type: typeof EDIT_INVESTMENTS;
  payload: any;
}

interface deleteInvestmentsAction {
  type: typeof DELETE_INVESTMENTS;
  payload: any;
}

export const getInvestments = () => {
  const idUser = localStorage.getItem("idUser");
  return (dispatch: Dispatch<getInvestmentsAction>) => {
    return axios
      .get(`http://localhost:5001/investments/user/${idUser}`)
      .then((res) => {
        // Change this line to match the new route
        dispatch({ type: GET_INVESTMENTS, payload: res.data });
      });
  };
};

export const addInvestments = (data: any) => {
  return (dispatch: Dispatch<AddInvestmentsAction>) => {
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

export const editInvestments = (data: any) => {
  return (dispatch: Dispatch<editInvestmentsAction>) => {
    return axios
      .put(`http://localhost:5001/investments/${data.id}`, data)
      .then(() => {
        dispatch({ type: EDIT_INVESTMENTS, payload: data });
      });
  };
};

export const soldInvestments = (id: string, montantVendu: number) => {
  return (dispatch: Dispatch<editInvestmentsAction>) => {
    return axios
      .put(`http://localhost:5001/investments/${id}/sold`, { montantVendu })
      .then((response) => {
        dispatch({ type: EDIT_INVESTMENTS, payload: response.data });
      });
  };
};

export const deleteInvestments = (id: any) => {
  return (dispatch: Dispatch<deleteInvestmentsAction>) => {
    return axios.delete(`http://localhost:5001/investments/${id}`).then(() => {
      dispatch({ type: DELETE_INVESTMENTS, payload: id });
    });
  };
};
