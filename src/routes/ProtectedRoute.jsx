import { Navigate } from "react-router-dom";
import { getUser } from "../auth/auth";

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = getUser();

  if (!user) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.authorities[0].authority)) {
    return <Navigate to="/product" />;
  }

  return children;
}
