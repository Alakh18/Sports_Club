import { Navigate } from "react-router-dom";
import { useUser } from "../context/usercontext.js";

function PrivateRoute({ children }) {
  const { user } = useUser();
  return user ? children : <Navigate to="/" />;
}

export default PrivateRoute;
