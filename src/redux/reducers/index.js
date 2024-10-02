import { combineReducers } from "redux";
import transactionReducer from "./transaction.reducer";
import userReducer from "./user.reducer";
import tauxReducer from "./taux.reducer";
import investmentReducer from "./investment.reducer";

// Combine les réducteurs en un rootReducer
const rootReducer = combineReducers({
  investmentReducer,
  transactionReducer,
  userReducer,
  tauxReducer,
});

export default rootReducer;
