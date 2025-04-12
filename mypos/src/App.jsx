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
import Details from "./pages/Details";
import Inventory from "./pages/Inventory";
import Product from "./pages/Product";
import ReportAnalysis from "./pages/ReportAnalysis";
import SignIn from "./pages/SignIn";
import Transaction from "./pages/Transaction";

import ProtectedRoute from "./routes/ProtectedRoute";

import { getUser } from "./auth/auth";
import AdminNav from "./components/AdminNav";
import CashierNav from "./components/CashierNav";

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
    <Router>
      <LayoutWrapper>
        <Routes>
          {/* Public Route */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/" element={<Navigate to="/signin" />} />

          {/* Routes for both admin and user */}
          <Route
            path="/product"
            element={
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <Product />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transaction"
            element={
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <Transaction />
              </ProtectedRoute>
            }
          />
          <Route
            path="/details"
            element={
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <Details />
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
  );
}
