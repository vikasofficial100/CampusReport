import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RoleBasedRoute = ({ allowedRoles = [], children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base">
        <div className="w-8 h-8 border-4 border-structural/20 border-t-accent rounded-full animate-spin mb-4"></div>
        <p className="text-structural text-sm font-medium">Loading role access...</p>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleBasedRoute;