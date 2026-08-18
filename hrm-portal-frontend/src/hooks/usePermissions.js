import { useMemo } from "react";

import { useAuth } from "../context/AuthContext";


/*
|--------------------------------------------------------------------------
| usePermissions
|--------------------------------------------------------------------------
|
| Central permission hook for the entire HRM frontend.
|
| Backend login response provides:
|
| user.permissions = [
|   "COMPANY_CREATE",
|   "COMPANY_READ",
|   "COMPANY_UPDATE",
|   ...
| ]
|
| This hook exposes:
|
| can(permission)
| canAny(permissions)
| canAll(permissions)
| hasRole(role)
| hasAnyRole(roles)
|
|--------------------------------------------------------------------------
*/

const usePermissions = () => {

  const auth = useAuth();


  /*
  |--------------------------------------------------------------------------
  | AUTH DATA
  |--------------------------------------------------------------------------
  */

  const user = auth?.user || null;


  /*
  |--------------------------------------------------------------------------
  | NORMALIZE PERMISSIONS
  |--------------------------------------------------------------------------
  */

  const permissions = useMemo(() => {

    if (!user) {
      return [];
    }

    if (!Array.isArray(user.permissions)) {
      return [];
    }

    return [
      ...new Set(
        user.permissions
          .filter(
            (permission) =>
              typeof permission === "string" &&
              permission.trim() !== ""
          )
          .map(
            (permission) =>
              permission.trim().toUpperCase()
          )
      )
    ];

  }, [user]);


  /*
  |--------------------------------------------------------------------------
  | NORMALIZE ROLE
  |--------------------------------------------------------------------------
  */

  const role = useMemo(() => {

    if (!user?.role) {
      return "";
    }

    return String(user.role)
      .trim()
      .toUpperCase();

  }, [user]);


  /*
  |--------------------------------------------------------------------------
  | CAN
  |--------------------------------------------------------------------------
  |
  | Check whether the current user has one permission.
  |
  | Example:
  |
  | can("COMPANY_READ")
  | can("COMPANY_CREATE")
  |
  */

  const can = (
    permission
  ) => {

    if (
      !permission ||
      typeof permission !== "string"
    ) {
      return false;
    }

    return permissions.includes(
      permission.trim().toUpperCase()
    );
  };


  /*
  |--------------------------------------------------------------------------
  | CAN ANY
  |--------------------------------------------------------------------------
  |
  | User needs at least one permission.
  |
  | Example:
  |
  | canAny([
  |   "COMPANY_UPDATE",
  |   "COMPANY_DELETE"
  | ])
  |
  */

  const canAny = (
    requiredPermissions = []
  ) => {

    if (
      !Array.isArray(requiredPermissions) ||
      requiredPermissions.length === 0
    ) {
      return false;
    }

    return requiredPermissions.some(
      (permission) =>
        can(permission)
    );

  };


  /*
  |--------------------------------------------------------------------------
  | CAN ALL
  |--------------------------------------------------------------------------
  |
  | User must have every permission.
  |
  | Example:
  |
  | canAll([
  |   "COMPANY_READ",
  |   "COMPANY_UPDATE"
  | ])
  |
  */

  const canAll = (
    requiredPermissions = []
  ) => {

    if (
      !Array.isArray(requiredPermissions) ||
      requiredPermissions.length === 0
    ) {
      return false;
    }

    return requiredPermissions.every(
      (permission) =>
        can(permission)
    );

  };


  /*
  |--------------------------------------------------------------------------
  | HAS ROLE
  |--------------------------------------------------------------------------
  */

  const hasRole = (
    requiredRole
  ) => {

    if (
      !requiredRole ||
      typeof requiredRole !== "string"
    ) {
      return false;
    }

    return (
      role ===
      requiredRole.trim().toUpperCase()
    );

  };


  /*
  |--------------------------------------------------------------------------
  | HAS ANY ROLE
  |--------------------------------------------------------------------------
  */

  const hasAnyRole = (
    requiredRoles = []
  ) => {

    if (
      !Array.isArray(requiredRoles) ||
      requiredRoles.length === 0
    ) {
      return false;
    }

    return requiredRoles.some(
      (requiredRole) =>
        hasRole(requiredRole)
    );

  };


  /*
  |--------------------------------------------------------------------------
  | RETURN API
  |--------------------------------------------------------------------------
  */

  return {

    user,

    role,

    permissions,

    can,

    canAny,

    canAll,

    hasRole,

    hasAnyRole

  };

};


export default usePermissions;