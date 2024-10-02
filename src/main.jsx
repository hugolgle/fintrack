import React from "react";
import ReactDOM from "react-dom/client";
import store, { persistor } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import "./index.css";
import "animate.css";
import { getTransactions } from "./redux/actions/transaction.action";
import { MessageProvider } from "./context/MessageContext";
import { getInvestments } from "./redux/actions/investment.action";

// Dispatch des actions pour obtenir les transactions et investissements
store.dispatch(getTransactions());
store.dispatch(getInvestments());

// Création de la racine de l'application et rendu
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MessageProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </MessageProvider>
  </React.StrictMode>
);
