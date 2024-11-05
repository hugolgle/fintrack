import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/home";
import Connexion from "./pages/Connexion/connexion";
import Profil from "./pages/Profile/profil";
import TableauDeBord from "./pages/Dashboard/dashboard";
import PageAddTransac from "./pages/PageForm/pageAddTransac";
import PageTransactions from "./pages/Operations/PageOperations/pageTransactions";
import Transaction from "./pages/Operations/OperationById/transaction";
import Statistique from "./pages/Stats/statistique";
import Inscription from "./pages/Inscription/inscription";
import BoardInvest from "./pages/Operations/Boards/boardInvest";
import PageAddInvest from "./pages/PageForm/pageAddInvest";
import PageInvestment from "./pages/Operations/PageOperations/pageInvestment";
import Investment from "./pages/Operations/OperationById/investment";
import PrivateRoute from "./composant/privateRoute";
import BoardRecette from "./pages/Operations/Boards/boardRecette";
import BoardDepense from "./pages/Operations/Boards/boardDepense";
import "../styles/globals.css";
import MainLayout from "./layout/mainLayout";
import PageError from "./pages/404/pageError";
import { ROUTES } from "./composant/routes";
import Branding from "./pages/Branding/branding";

function App() {
  const router = createBrowserRouter([
    {
      element: <MainLayout />,
      errorElement: <PageError />,
      children: [
        { path: ROUTES.HOME, element: <Home /> },

        {
          path: ROUTES.DASHBOARD,
          element: <PrivateRoute element={<TableauDeBord />} />,
        },

        {
          path: ROUTES.EXPENSE,
          element: <PrivateRoute element={<BoardDepense />} />,
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
          path: ROUTES.EXPENSE_BY_ID,
          element: <PrivateRoute element={<Transaction />} />,
        },
        {
          path: ROUTES.REVENUE,
          element: <PrivateRoute element={<BoardRecette />} />,
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
          path: ROUTES.REVENUE_BY_ID,
          element: <PrivateRoute element={<Transaction />} />,
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
          path: ROUTES.INVESTMENT_BY_STATUS,
          element: <PrivateRoute element={<PageInvestment />} />,
        },
        {
          path: ROUTES.INVESTMENT_BY_ID,
          element: <PrivateRoute element={<Investment />} />,
        },

        {
          path: ROUTES.STATISTICS,
          element: <PrivateRoute element={<Statistique />} />,
        },

        {
          path: ROUTES.PROFILE,
          element: <PrivateRoute element={<Profil />} />,
        },

        {
          path: ROUTES.BRANDING,
          element: <PrivateRoute element={<Branding />} />,
        },

        { path: ROUTES.LOGIN, element: <Connexion /> },
        { path: ROUTES.SIGNUP, element: <Inscription /> },
        {
          path: ROUTES.SESSION_TIMED_OUT,
          element: <h1>Session expirée. Veuillez vous reconnecter.</h1>,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
