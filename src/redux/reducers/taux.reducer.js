const SET_VALUE = "SET_VALUE";

export const setValue = (key, value) => ({
  type: SET_VALUE,
  payload: { key, value },
});

const initialState = {
  tauxLivretA: 4,
  tauxLep: 5,
  plafondLivretA: 22950,
  plafondLep: 10000,
};

const tauxReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_VALUE:
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    default:
      return state;
  }
};

export default tauxReducer;
