const initialeState = {
  isAuthenticated: false,
  user: {
    id: null,
    username: null,
    pseudo: null,
    nom: null,
    prenom: null,
    date: null,
    img: null,
  },
  error: null,
};

export default function userReducer(state = initialeState, action: any) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        user: {
          id: action.payload.id,
          username: action.payload.username,
          pseudo: action.payload.pseudo,
          nom: action.payload.nom,
          prenom: action.payload.prenom,
          date: action.payload.date,
          img: action.payload.img,
        },
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        isAuthenticated: false,
        user: {
          id: null,
          username: null,
          pseudo: null,
          nom: null,
          prenom: null,
          date: null,
          img: null,
        },
        error: action.payload.error,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: {
          id: null,
          username: null,
          pseudo: null,
          nom: null,
          prenom: null,
          date: null,
          img: null,
        },
        error: null,
      };
    case "EDIT_USER":
      return {
        ...state,
        isAuthenticated: true,
        user: {
          id: action.payload._id,
          username: action.payload.username,
          pseudo: action.payload.pseudo,
          password: action.payload.password,
          nom: action.payload.nom,
          prenom: action.payload.prenom,
          date: action.payload.date,
          img: action.payload.img,
        },
        error: null,
      };
    case "DELETE_USER":
      return {
        ...state,
        isAuthenticated: false,
        user: {
          id: null,
          username: null,
          pseudo: null,
          nom: null,
          prenom: null,
          date: null,
          img: null,
        },
        error: null,
      };
    default:
      return state;
  }
}
