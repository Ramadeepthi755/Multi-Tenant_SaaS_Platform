// src/components/permissions/PermissionGate.jsx

import {
  Fragment
} from "react";

import usePermissions
  from "../../hooks/usePermissions";


const PermissionGate = ({

  permission,

  permissions = [],

  requireAll = false,

  role,

  roles = [],

  fallback = null,

  children,

}) => {

  const {

    can,

    canAll,

    canAny,

    hasRole,

  } = usePermissions();


  /*
  |--------------------------------------------------------------------------
  | PERMISSION CHECK
  |--------------------------------------------------------------------------
  */

  let permissionAllowed = true;


  if (permission) {

    permissionAllowed =
      can(permission);

  }


  if (
    Array.isArray(permissions) &&
    permissions.length > 0
  ) {

    permissionAllowed =
      requireAll
        ? canAll(permissions)
        : canAny(permissions);

  }


  /*
  |--------------------------------------------------------------------------
  | ROLE CHECK
  |--------------------------------------------------------------------------
  */

  let roleAllowed = true;


  if (role) {

    roleAllowed =
      hasRole(role);

  }


  if (
    Array.isArray(roles) &&
    roles.length > 0
  ) {

    roleAllowed =
      roles.some(
        (requiredRole) =>
          hasRole(requiredRole)
      );

  }


  /*
  |--------------------------------------------------------------------------
  | FINAL AUTHORIZATION
  |--------------------------------------------------------------------------
  */

  const allowed =
    permissionAllowed &&
    roleAllowed;


  if (!allowed) {

    return fallback;

  }


  return (
    <Fragment>
      {children}
    </Fragment>
  );

};


export default PermissionGate;