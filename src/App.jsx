import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/home";
import Connexion from "./pages/Connexion/connexion";
import Profil from "./pages/Profile/profil";
import TableauDeBord from "./pages/Dashboard/dashboard";
import PageAddTransac from "./pages/PageForm/pageAddTransac";
import PageTransactions from "./pages/Operations/PageOperations/pageTransactions";
import Statistique from "./pages/Stats/statistique";
import Inscription from "./pages/Inscription/inscription";
import BoardInvest from "./pages/Operations/Boards/boardInvest";
import PageAddInvest from "./pages/PageForm/pageAddInvest";
import PageInvestment from "./pages/Operations/PageOperations/pageInvestment";
import PrivateRoute from "./composant/privateRoute";
import "../styles/globals.css";
import MainLayout from "./layout/mainLayout";
import PageError from "./pages/404/pageError";
import { ROUTES } from "./composant/routes";
import PageAddTransacInvest from "./pages/PageForm/pageAddTransacInvest";
import OrdreInvest from "./pages/Operations/ordreInvest";
import BoardTransactions from "./pages/Operations/Boards/boardTransactions";

function App() {
  const router = createBrowserRouter([
    {
      element: <MainLayout />,
      children: [
        { path: ROUTES.HOME, element: <Home /> },

        {
          path: ROUTES.DASHBOARD,
          element: <PrivateRoute element={<TableauDeBord />} />,
        },

        {
          path: ROUTES.EXPENSE,
          element: (
            <PrivateRoute
              element={<BoardTransactions key="Expense" type="Expense" />}
            />
          ),
        },
        {
          path: ROUTES.ADD_EXPENSE,
          element: (
            <PrivateRoute
              element={<PageAddTransac type="Expense" title="dépense" />}
            />
          ),
        },
        {
          path: ROUTES.EXPENSE_BY_DATE,
          element: (
            <PrivateRoute element={<PageTransactions type="Expense" />} />
          ),
        },
        {
          path: ROUTES.REVENUE,
          element: (
            <PrivateRoute
              element={<BoardTransactions key="Revenue" type="Revenue" />}
            />
          ),
        },
        {
          path: ROUTES.ADD_REVENUE,
          element: (
            <PrivateRoute
              element={<PageAddTransac type="Revenue" title="recette" />}
            />
          ),
        },
        {
          path: ROUTES.REVENUE_BY_DATE,
          element: (
            <PrivateRoute element={<PageTransactions type="Revenue" />} />
          ),
        },
        {
          path: ROUTES.INVESTMENT,
          element: <PrivateRoute element={<BoardInvest />} />,
        },
        {
          path: ROUTES.ADD_INVESTMENT,
          element: <PrivateRoute element={<PageAddInvest />} />,
        },
        {
          path: ROUTES.ADD_TRANSACTION_INVESTMENT,
          element: <PrivateRoute element={<PageAddTransacInvest />} />,
        },
        {
          path: ROUTES.INVESTMENT_BY_ID,
          element: <PrivateRoute element={<PageInvestment />} />,
        },
        {
          path: ROUTES.INVESTMENT_ORDER,
          element: <PrivateRoute element={<OrdreInvest />} />,
        },
        {
          path: ROUTES.STATISTICS,
          element: <PrivateRoute element={<Statistique />} />,
        },

        {
          path: ROUTES.PROFILE,
          element: <PrivateRoute element={<Profil />} />,
        },
        { path: ROUTES.LOGIN, element: <Connexion /> },
        { path: ROUTES.SIGNUP, element: <Inscription /> },
        {
          path: ROUTES.SESSION_TIMED_OUT,
          element: <h1>Session expirée. Veuillez vous reconnecter.</h1>,
        },
        {
          path: "*",
          element: <PageError />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
