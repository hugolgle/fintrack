import { combineReducers } from "redux";
import transactionReducer from "./transaction.reducer";
import userReducer from "./user.reducer";
import tauxReducer from "./taux.reducer";
import investmentReducer from "./investment.reducer";

export default combineReducers({
  investmentReducer,
  transactionReducer,
  userReducer,
  tauxReducer,
});
