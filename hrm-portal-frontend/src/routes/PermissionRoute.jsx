import {
  Navigate,
  Outlet,
  useLocation
} from "react-router-dom";


import {
  useAuth
} from "../context/AuthContext";


const PermissionRoute = ({
  permission,
  permissions = [],
  mode = "all",
  role
}) => {

  const {
    user,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole
  } = useAuth();


  const location =
    useLocation();


  /*
  -------------------------------------------------------
  AUTH CHECK
  -------------------------------------------------------
  */

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
        state={{
          from:
            location.pathname
        }}
      />
    );

  }


  /*
  -------------------------------------------------------
  ROLE CHECK
  -------------------------------------------------------
  */

  if (role) {

    if (
      !hasRole(
        role
      )
    ) {

      return (
        <Navigate
          to="/unauthorized"
          replace
        />
      );

    }

  }


  /*
  -------------------------------------------------------
  SINGLE PERMISSION
  -------------------------------------------------------
  */

  if (permission) {

    if (
      !hasPermission(
        permission
      )
    ) {

      return (
        <Navigate
          to="/unauthorized"
          replace
        />
      );

    }

  }


  /*
  -------------------------------------------------------
  MULTIPLE PERMISSIONS
  -------------------------------------------------------
  */

  if (
    permissions.length > 0
  ) {

    const allowed =
      mode === "any"
        ? hasAnyPermission(
            permissions
          )
        : hasAllPermissions(
            permissions
          );


    if (!allowed) {

      return (
        <Navigate
          to="/unauthorized"
          replace
        />
      );

    }

  }


  return (
    <Outlet />
  );

};


export default PermissionRoute;