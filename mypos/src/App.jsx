import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Inventory from "./pages/Inventory";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Transaction from "./pages/Transaction";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/dashboard" element={<Inventory />} />
        <Route path="/product" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/transaction" element={<Transaction />} />
      </Routes>
    </Router>
  );
}
