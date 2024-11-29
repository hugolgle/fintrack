import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import "../styles/globals.css";
import { ROUTES } from "./composant/Routes.jsx";
import PrivateRoute from "./composant/PrivateRoute.jsx";
import BoardTransactions from "./Pages/Transaction/BoardTransactions.jsx";
import PageTransactions from "./Pages/Transaction/PageTransactions.jsx";
import PageAddTransac from "./Pages/Transaction/PageAddTransaction.jsx";
import BoardInvest from "./Pages/Investment/BoardInvest.jsx";
import PageAddOrder from "./Pages/Investment/PageAddOrder.jsx";
import PageAddInvestment from "./Pages/Investment/PageAddInvestment.jsx";
import PageInvestment from "./Pages/Investment/PageInvestment.jsx";
import Login from "./Pages/Login/Login.jsx";
import SignUp from "./Pages/SignUp/SignUp.jsx";
import PageError from "./Pages/404/404.jsx";
import Home from "./Pages/Home/Home.jsx";
import { PageOrder } from "./Pages/Investment/PageOrder.jsx";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";
import Statistic from "./Pages/Statistic/Statistic.jsx";
import { MainLayout } from "./Layout/MainLayout.jsx";
import Profile from "./Pages/Profile/Profile.jsx";

function App() {
  const router = createBrowserRouter([
    {
      element: <MainLayout />,
      children: [
        { path: ROUTES.HOME, element: <Home /> },

        {
          path: ROUTES.DASHBOARD,
          element: <PrivateRoute element={<Dashboard />} />,
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
          path: ROUTES.ADD_ORDER,
          element: <PrivateRoute element={<PageAddOrder />} />,
        },
        {
          path: ROUTES.ADD_INVESTMENT,
          element: <PrivateRoute element={<PageAddInvestment />} />,
        },
        {
          path: ROUTES.INVESTMENT_BY_ID,
          element: <PrivateRoute element={<PageInvestment />} />,
        },
        {
          path: ROUTES.INVESTMENT_ORDER,
          element: <PrivateRoute element={<PageOrder />} />,
        },
        {
          path: ROUTES.STATISTICS,
          element: <PrivateRoute element={<Statistic />} />,
        },

        {
          path: ROUTES.PROFILE,
          element: <PrivateRoute element={<Profile />} />,
        },
        { path: ROUTES.LOGIN, element: <Login /> },
        { path: ROUTES.SIGNUP, element: <SignUp /> },
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
