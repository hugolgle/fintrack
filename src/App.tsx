import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/home";
import Navbar from "./components/navbar";
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
import Refund from "./pages/Operations/OperationById/refund";
import BoardRefund from "./pages/Operations/Boards/boardRefund";
import { ThemeProvider } from "./components/Theme/theme.provider";
import PrivateRoute from "./components/privateRoute";
import BoardRecette from "./pages/Operations/Boards/boardRecette";
import BoardDepense from "./pages/Operations/Boards/boardDepense";

function App() {
  const router = createBrowserRouter([
    {
      element: <Navbar />,
      errorElement: (
        <Navbar>
          <h1>Page introuvable !</h1>
        </Navbar>
      ),
      children: [
        { path: "/", element: <Home /> },

        { path: "/tdb", element: <PrivateRoute element={<TableauDeBord />} /> },

        {
          path: "/depense",
          element: <PrivateRoute element={<BoardDepense />} />,
        },
        {
          path: "/depense/add",
          element: <PrivateRoute element={<PageAddTransac type="Dépense" />} />,
        },
        {
          path: "/depense/:date",
          element: (
            <PrivateRoute element={<PageTransactions type="Dépense" />} />
          ),
        },
        {
          path: "/depense/:date/:id",
          element: <PrivateRoute element={<Transaction />} />,
        },
        {
          path: "/depense/:date/:id/refund",
          element: <PrivateRoute element={<BoardRefund />} />,
        },
        {
          path: "/depense/:date/:id/refund/:idRefund",
          element: <PrivateRoute element={<Refund />} />,
        },
        {
          path: "/recette",
          element: <PrivateRoute element={<BoardRecette />} />,
        },
        {
          path: "/recette/add",
          element: <PrivateRoute element={<PageAddTransac type="Recette" />} />,
        },
        {
          path: "/recette/:date",
          element: (
            <PrivateRoute element={<PageTransactions type="Recette" />} />
          ),
        },
        {
          path: "/recette/:date/:id",
          element: <PrivateRoute element={<Transaction />} />,
        },
        {
          path: "/invest",
          element: <PrivateRoute element={<BoardInvest />} />,
        },
        {
          path: "/invest/add",
          element: <PrivateRoute element={<PageAddInvest />} />,
        },
        {
          path: "/invest/:urlInvest",
          element: <PrivateRoute element={<PageInvestment />} />,
        },
        {
          path: "/invest/:urlInvest/:id",
          element: <PrivateRoute element={<Investment />} />,
        },

        { path: "/stat", element: <PrivateRoute element={<Statistique />} /> },

        { path: "/profil", element: <PrivateRoute element={<Profil />} /> },

        { path: "/connexion", element: <Connexion /> },
        { path: "/inscription", element: <Inscription /> },
        {
          path: "/session-timed-out",
          element: <h1>Session expirée. Veuillez vous reconnecter.</h1>,
        },
      ],
    },
  ]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
