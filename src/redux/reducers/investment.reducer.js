import {
  GET_INVESTMENTS,
  ADD_INVESTMENTS,
  EDIT_INVESTMENTS,
  DELETE_INVESTMENTS,
  SOLD_INVESTMENTS,
} from "../actions/investment.action";

const initialState = [];

export default function investmentReducer(state = initialState, action) {
  switch (action.type) {
    case GET_INVESTMENTS:
      return action.payload;
    case ADD_INVESTMENTS:
      return [action.payload, ...state];
    case EDIT_INVESTMENTS:
      return state.map((investment) => {
        if (investment.id === action.payload.id) {
          return {
            ...investment,
            ...action.payload,
          };
        } else return investment;
      });
    case SOLD_INVESTMENTS:
      return state.map((investment) => {
        if (investment.id === action.payload.id) {
          return {
            ...investment,
            content: action.payload.content,
          };
        } else return investment;
      });
    case DELETE_INVESTMENTS:
      return state.filter((investment) => investment.id !== action.payload);
    default:
      return state;
  }
}
