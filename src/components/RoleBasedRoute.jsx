import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "./Loader";
import { normalizeRole } from "../utils/rolePermissions";

const RoleBasedRoute = ({ allowedRoles = [], children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader text="Loading role access..." />;
  }

  const normalizedUserRole = normalizeRole(user?.role);
  const normalizedAllowedRoles = allowedRoles.map((role) => normalizeRole(role));

  if (!user || !normalizedAllowedRoles.includes(normalizedUserRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleBasedRoute;
