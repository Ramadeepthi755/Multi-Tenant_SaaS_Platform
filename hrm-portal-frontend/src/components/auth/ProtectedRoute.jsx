import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PageLoader from "../common/PageLoader";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  const location = useLocation();

  // Authentication state is still being restored
  if (loading) {
    return <PageLoader message="Checking session..." />;
  }

  // User is not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // User is authenticated
  return <Outlet />;
};

export default ProtectedRoute;
