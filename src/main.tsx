import React from "react";
import ReactDOM from "react-dom/client";
import store, { persistor } from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App.tsx";
import "./index.css";
import "animate.css";
import { getTransactions } from "./redux/actions/transaction.action.js";
import { getInvestments } from "./redux/actions/investment.action.ts";
store.dispatch(getTransactions());
store.dispatch(getInvestments());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
