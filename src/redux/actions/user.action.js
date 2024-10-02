import axios from "axios";
import { getTransactions } from "./transaction.action";
import { getInvestments } from "./investment.action";

export const loginUser = (username, password) => {
  return async (dispatch) => {
    try {
      const response = await fetch("http://localhost:5001/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur de réseau. Veuillez réessayer.");
      }

      const usersData = await response.json();

      const user = usersData.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        const { _id, username, nom, prenom, pseudo, img, createdAt } = user;
        localStorage.setItem("idUser", _id);
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            id: _id,
            username,
            nom,
            prenom,
            pseudo,
            img,
            date: createdAt,
          },
        });
        await dispatch(getTransactions());
        await dispatch(getInvestments());
      } else {
        dispatch({
          type: "LOGIN_FAILURE",
          payload: { error: "Nom d'utilisateur ou mot de passe incorrect" },
        });
      }
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: { error: error.message } });
    }
  };
};

export const logoutUser = () => {
  return async (dispatch) => {
    localStorage.removeItem("idUser");
    dispatch({ type: "LOGOUT" });
    await dispatch(getTransactions());
    await dispatch(getInvestments());
  };
};

export const addUser = (data) => {
  return async () => {
    try {
      await axios.post("http://localhost:5001/user/add", data);
    } catch (error) {
      throw error;
    }
  };
};

export const editUser = (formData) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `http://localhost:5001/user/edit/${formData.get("_id")}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUserData = response.data;
      const { _id, username, nom, prenom, pseudo, img, createdAt } =
        updatedUserData;

      dispatch({
        type: "EDIT_USER",
        payload: {
          _id,
          username,
          prenom,
          nom,
          pseudo,
          img,
          date: createdAt,
        },
      });
    } catch (error) {
      // Gestion des erreurs avec un message explicite
      dispatch({
        type: "EDIT_USER_FAILURE",
        payload: { error: error.message },
      });
      throw error;
    }
  };
};

export const deleteUser = (id) => {
  return (dispatch) => {
    return axios.delete(`http://localhost:5001/user/delete/${id}`).then(() => {
      dispatch({ type: "DELETE_USER", payload: id });
    });
  };
};
