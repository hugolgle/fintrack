import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import "../styles/globals.css";
import { ROUTES } from "./components/Routes.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
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
import Profile from "./pages/Profile/Profile.jsx";
import Epargn from "./pages/Epargn/Epargn.jsx";
import PageAddAccount from "./pages/Epargn/PageAddAccount.jsx";
import PageAddTransfert from "./pages/Epargn/Actions/PageAddTransfer.jsx";
import PageAccount from "./pages/Epargn/PageAccount.jsx";
import PageAddDeposit from "./pages/Epargn/Actions/PageAddDeposit.jsx";
import EpargnAction from "./pages/Epargn/Action.jsx";
import PageAddWithdraw from "./pages/Epargn/Actions/PageAddWithdraw.jsx";
import Heritage from "./pages/Heritage/Heritage.jsx";
import PageAddInvestmentMain from "./pages/Investment/PageAddInvestmentMain.jsx";
import PageOrderById from "./pages/Investment/PageOrderById.jsx";
import PageAddAsset from "./pages/Heritage/PageAddAsset.jsx";
import PageAssets from "./pages/Heritage/PageAssets.jsx";
import PageTransaction from "./pages/Finance/FinancePage.jsx";
import { TYPES } from "./StaticData/StaticData.js";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";
import { AuthLayout } from "./Layout/AuthLayout.jsx";
import Credit from "./Pages/Credit/Credit.jsx";

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

  const creditRoutes = [{ path: ROUTES.CREDIT, component: <Credit /> }];

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
    ...heritageRoutes.map((route) => ({
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
