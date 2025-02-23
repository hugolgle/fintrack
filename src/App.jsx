import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import "../styles/globals.css";
import { ROUTES } from "./composant/Routes.jsx";
import PrivateRoute from "./composant/PrivateRoute.jsx";
import BoardTransactions from "./Pages/Finance/Finance.jsx";
import BoardInvest from "./Pages/Investment/BoardInvest.jsx";
import PageAddInvestment from "./Pages/Investment/PageAddInvestment.jsx";
import PageInvestment from "./Pages/Investment/PageInvestment.jsx";
import Login from "./Pages/Login/Login.jsx";
import SignUp from "./Pages/SignUp/SignUp.jsx";
import PageError from "./Pages/404/404.jsx";
import Home from "./Pages/Home/Home.jsx";
import { PageOrder } from "./Pages/Investment/PageOrder.jsx";
import Statistic from "./Pages/Statistic/Statistic.jsx";
import { MainLayout } from "./Layout/MainLayout.jsx";
import Profile from "./Pages/Profile/Profile.jsx";
import Epargn from "./Pages/Epargn/Epargn.jsx";
import PageAddAccount from "./Pages/Epargn/PageAddAccount.jsx";
import PageAddTransfert from "./Pages/Epargn/Actions/PageAddTransfer.jsx";
import PageAccount from "./Pages/Epargn/PageAccount.jsx";
import PageAddDeposit from "./Pages/Epargn/Actions/PageAddDeposit.jsx";
import EpargnAction from "./Pages/Epargn/Action.jsx";
import PageAddWithdraw from "./Pages/Epargn/Actions/PageAddWithdraw.jsx";
import Heritage from "./Pages/Heritage/Heritage.jsx";
import PageAddInvestmentMain from "./Pages/Investment/PageAddInvestmentMain.jsx";
import PageOrderById from "./Pages/Investment/PageOrderById.jsx";
import PageAddAsset from "./Pages/Heritage/PageAddAsset.jsx";
import PageAssets from "./Pages/Heritage/PageAssets.jsx";
import PageTransaction from "./Pages/Finance/FinancePage.jsx";
import { TYPES } from "./StaticData/StaticData.js";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";

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
  ];

  const investmentRoutes = [
    { path: ROUTES.INVESTMENT, component: <BoardInvest /> },
    { path: ROUTES.ADD_ORDER, component: <PageAddInvestmentMain /> },
    { path: ROUTES.ADD_INVESTMENT, component: <PageAddInvestment /> },
    { path: ROUTES.INVESTMENT_BY_ID, component: <PageOrderById /> },
    { path: ROUTES.INVESTMENT_ALL, component: <PageInvestment /> },
    { path: ROUTES.INVESTMENT_IN_PROGRESS, component: <PageInvestment /> },
    { path: ROUTES.INVESTMENT_SOLD, component: <PageInvestment /> },
    { path: ROUTES.INVESTMENT_ORDER, component: <PageOrder /> },
  ];

  const epargnRoutes = [
    { path: ROUTES.EPARGN, component: <Epargn /> },
    { path: ROUTES.ACCOUNT_BY_ID, component: <PageAccount /> },
    { path: ROUTES.ADD_ACCOUNT, component: <PageAddAccount /> },
    { path: ROUTES.ACTION_EPARGN, component: <EpargnAction /> },
    { path: ROUTES.ADD_TRANSFERT, component: <PageAddTransfert /> },
    { path: ROUTES.ADD_DEPOSIT, component: <PageAddDeposit /> },
    { path: ROUTES.ADD_WITHDRAW, component: <PageAddWithdraw /> },
  ];

  const heritageRoutes = [
    { path: ROUTES.HERITAGE, component: <Heritage /> },
    { path: ROUTES.ADD_ASSET, component: <PageAddAsset /> },
    { path: ROUTES.ASSETS_LIST, component: <PageAssets /> },
  ];

  const publicRoutes = [
    { path: ROUTES.LOGIN, element: <Login /> },
    { path: ROUTES.SIGNUP, element: <SignUp /> },
    {
      path: ROUTES.SESSION_TIMED_OUT,
      element: <h1>Session expirée. Veuillez vous reconnecter.</h1>,
    },
    { path: "*", element: <PageError /> },
  ];

  const routesWithLayout = [
    { path: ROUTES.DASHBOARD, element: <Dashboard /> },
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
    ...heritageRoutes.map((route) => ({
      path: route.path,
      element: createPrivateRoute(route.component),
    })),
    { path: ROUTES.STATISTICS, element: <Statistic /> },
    { path: ROUTES.PROFILE, element: <Profile /> },
  ];

  const router = createBrowserRouter([
    {
      element: <MainLayout />,
      children: routesWithLayout.map((route) => ({
        path: route.path,
        element: route.element,
      })),
    },
    { path: ROUTES.HOME, element: <Home /> }, // Route Home en dehors de MainLayout
    ...publicRoutes.map((route) => ({
      path: route.path,
      element: route.element,
    })),
  ]);

  return <RouterProvider router={router} />;
}
