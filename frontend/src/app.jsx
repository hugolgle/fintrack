import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./app.css";
import "../styles/globals.css";
import { ROUTES } from "./components/route.jsx";
import PrivateRoute from "./components/privateRoutes.jsx";
import BoardTransactions from "./pages/finances/finances.jsx";
import BoardInvest from "./pages/investments/boardInvest.jsx";
import PageAddInvestment from "./pages/investments/pageAddInvestment.jsx";
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
import PageAddAccount from "./pages/epargns/pageAddAccount.jsx";
import PageAddTransfert from "./pages/epargns/actions/pageAddTransfer.jsx";
import PageAccount from "./pages/epargns/pageAccount.jsx";
import PageAddDeposit from "./pages/epargns/actions/pageAddDeposit.jsx";
import EpargnAction from "./pages/epargns/action.jsx";
import PageAddWithdraw from "./pages/epargns/actions/pageAddWithdraw.jsx";
import Heritage from "./pages/heritages/heritage.jsx";
import PageAddInvestmentMain from "./pages/investments/pageAddInvestmentMain.jsx";
import PageOrderById from "./pages/investments/pageOrderById.jsx";
import PageAddAsset from "./pages/heritages/pageAddAsset.jsx";
import PageAssets from "./pages/heritages/pageAssets.jsx";
import PageTransaction from "./pages/finances/financePage.jsx";
import { TYPES } from "./staticDatas/staticData.js";
import Dashboard from "./pages/dashboards/dashboard.jsx";
import { AuthLayout } from "./layouts/authLayout.jsx";
import Credit from "./pages/credits/credit.jsx";

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
