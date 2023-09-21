import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated, children, adminRoute, isAdmin }) => {
  if (!isAuthenticated) {
    return <Navigate to="/account" />;
  }
  if (adminRoute && !isAdmin) {
    return <Navigate to="/unauthorize" />;
  }
  return children ? children : <Outlet />;
};

export default PrivateRoute;
