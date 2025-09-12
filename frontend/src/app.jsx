import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./app.css";
import "../styles/globals.css";
import { ROUTES } from "./components/route.jsx";
import PrivateRoute from "./components/privateRoutes.jsx";
import BoardTransactions from "./pages/finances/finances.jsx";
import BoardInvest from "./pages/investments/boardInvest.jsx";
import PageInvestment from "./pages/investments/pageInvestment.jsx";
import Login from "./pages/logins/login.jsx";
import SignUp from "./pages/signUps/signUp.jsx";
import PageError from "./pages/404/404.jsx";
import Home from "./pages/homes/homes.jsx";
import { PageOrder } from "./pages/investments/pageOrder.jsx";
import Statistic from "./pages/statistics/statistic.jsx";
import { MainLayout } from "./layouts/mainLayout.jsx";
import Profile from "./pages/profiles/profile.jsx";
import Epargn from "./pages/epargns/epargn.jsx";
import PageAccount from "./pages/epargns/pageAccount.jsx";
import PageOrderById from "./pages/investments/pageOrderById.jsx";
import PageTransaction from "./pages/finances/financePage.jsx";
import { TYPES } from "./staticDatas/staticData.js";
import Dashboard from "./pages/dashboards/dashboard.jsx";
import { AuthLayout } from "./layouts/authLayout.jsx";
import Credit from "./pages/credits/credit.jsx";
import GroupTransactionByIdPage from "./pages/finances/groupTransactionPageById.jsx";
import GroupTransactionPage from "./pages/finances/groupTransactionPage.jsx";

export default function App() {
  const createPrivateRoute = (element) => <PrivateRoute element={element} />;

  const transactionRoutes = [
    {
      path: ROUTES.FINANCE,
      component: <BoardTransactions />,
    },
    {
      path: ROUTES.TRANSACTIONS,
      component: <PageTransaction />,
    },
    {
      path: ROUTES.EXPENSE,
      component: <PageTransaction type={TYPES.EXPENSE} />,
    },
    {
      path: ROUTES.REVENUE,
      component: <PageTransaction type={TYPES.INCOME} />,
    },
    {
      path: ROUTES.EXPENSE_BY_YEAR,
      component: <PageTransaction type={TYPES.EXPENSE} />,
    },
    {
      path: ROUTES.REVENUE_BY_YEAR,
      component: <PageTransaction type={TYPES.INCOME} />,
    },
    {
      path: ROUTES.EXPENSE_BY_MONTH,
      component: <PageTransaction type={TYPES.EXPENSE} />,
    },
    {
      path: ROUTES.REVENUE_BY_MONTH,
      component: <PageTransaction type={TYPES.INCOME} />,
    },
    {
      path: ROUTES.GROUP_TRANSACTION,
      component: <GroupTransactionPage />,
    },
    {
      path: ROUTES.GROUP_TRANSACTION_BY_ID,
      component: <GroupTransactionByIdPage />,
    },
  ];

  const investmentRoutes = [
    { path: ROUTES.INVESTMENT, component: <BoardInvest /> },
    { path: ROUTES.INVESTMENT_BY_ID, component: <PageOrderById /> },
    { path: ROUTES.INVESTMENT_ALL, component: <PageInvestment /> },
    { path: ROUTES.INVESTMENT_IN_PROGRESS, component: <PageInvestment /> },
    { path: ROUTES.INVESTMENT_SOLD, component: <PageInvestment /> },
    { path: ROUTES.INVESTMENT_ORDER, component: <PageOrder /> },
  ];

  const epargnRoutes = [
    { path: ROUTES.EPARGN, component: <Epargn /> },
    { path: ROUTES.ACCOUNT_BY_ID, component: <PageAccount /> },
  ];

  const creditRoutes = [{ path: ROUTES.CREDIT, component: <Credit /> }];

  const publicRoutes = [
    { path: ROUTES.LOGIN, element: <Login /> },
    { path: ROUTES.SIGNUP, element: <SignUp /> },
    { path: "*", element: <PageError /> },
  ];

  const routesWithLayout = [
    { path: ROUTES.DASHBOARD, element: createPrivateRoute(<Dashboard />) },
    ...transactionRoutes.map((route) => ({
      path: route.path,
      element: createPrivateRoute(route.component),
    })),
    ...investmentRoutes.map((route) => ({
      path: route.path,
      element: createPrivateRoute(route.component),
    })),
    ...epargnRoutes.map((route) => ({
      path: route.path,
      element: createPrivateRoute(route.component),
    })),
    ...creditRoutes.map((route) => ({
      path: route.path,
      element: createPrivateRoute(route.component),
    })),
    { path: ROUTES.STATISTICS, element: createPrivateRoute(<Statistic />) },
    { path: ROUTES.PROFILE, element: createPrivateRoute(<Profile />) },
  ];

  const router = createBrowserRouter([
    {
      element: createPrivateRoute(<MainLayout />),
      children: routesWithLayout.map((route) => ({
        path: route.path,
        element: route.element,
      })),
    },
    {
      element: <AuthLayout />,
      children: publicRoutes.map((route) => ({
        path: route.path,
        element: route.element,
      })),
    },
    { path: ROUTES.HOME, element: createPrivateRoute(<Home />) },
  ]);

  return <RouterProvider router={router} />;
}
