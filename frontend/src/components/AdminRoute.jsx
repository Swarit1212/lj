import { useContext } from "react";
import { authContext } from "../context/authContext.jsx";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user } = useContext(authContext);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default AdminRoute;
