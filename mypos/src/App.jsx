import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import Cart from "./pages/Cart";
import Cashier from "./pages/Cashier";
import Dashboard from "./pages/Dashboard";
import TransactionDetails from "./pages/TransactionDetail";
import Inventory from "./pages/Inventory";
import Product from "./pages/Product";
import ReportAnalysis from "./pages/ReportAnalysis";
import SignIn from "./pages/SignIn.jsx";
import Transaction from "./pages/Transaction";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import { getUser } from "./auth/auth";
import AdminNav from "./components/navBar/AdminNav";
import CashierNav from "./components/navBar/CashierNav";
import Activation from "./pages/Activation";

function LayoutWrapper({ children }) {
  const location = useLocation();
  const user = getUser();
  const isSignIn = location.pathname === "/" || location.pathname === "/signin";

  return (
    <>
      {!isSignIn && (
        <div className="sticky top-0 z-50 bg-white">
          {user?.role === "admin" ? <AdminNav /> : <CashierNav />}
        </div>
      )}
      {children}
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Router>
        <LayoutWrapper>
          <Routes>
            {/* Public Route */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/" element={<Navigate to="/signin" />} />
            {/* Activation Route */}
            <Route path="/activate" element={<Activation />} />
            {/* Routes for both admin and user */}
            <Route
              path="/product"
              element={
                <ProtectedRoute allowedRoles={["admin", "cashier"]}>
                  <Product />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute allowedRoles={["admin", "cashier"]}>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transaction"
              element={
                <ProtectedRoute allowedRoles={["admin", "cashier"]}>
                  <Transaction />
                </ProtectedRoute>
              }
            />
            <Route
              path="/details/:id"
              element={
                <ProtectedRoute allowedRoles={["admin", "cashier"]}>
                  <TransactionDetails />
                </ProtectedRoute>
              }
            />

            {/* Admin-only routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ReportAnalysis />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Inventory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cashier"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Cashier />
                </ProtectedRoute>
              }
            />
          </Routes>
        </LayoutWrapper>
      </Router>
    </CartProvider>
  );
}
