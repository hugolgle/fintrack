import React from "react";
import ReactDOM from "react-dom/client";
import store from "./redux/store";
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";
import "animate.css";
import { getTransactions } from "./redux/actions/transaction.action";
import { getInvestments } from "./redux/actions/investment.action";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Dispatch des actions pour obtenir les transactions et investissements
store.dispatch(getTransactions());
store.dispatch(getInvestments());

// Création de la racine de l'application et rendu
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Provider store={store}>
        <TooltipProvider>
          <App />
          <Toaster />
        </TooltipProvider>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
