import {
  Fragment
} from "react";

import usePermissions
  from "../../hooks/usePermissions";


const RoleGate = ({
  role,
  roles = [],
  fallback = null,
  children
}) => {

  const {
    isRole,
    isAnyRole
  } = usePermissions();


  // ==========================================================
  // SINGLE ROLE
  // ==========================================================

  if (role) {

    if (!isRole(role)) {
      return fallback;
    }
  }


  // ==========================================================
  // MULTIPLE ROLES
  // ==========================================================

  if (
    Array.isArray(roles) &&
    roles.length > 0
  ) {

    if (!isAnyRole(roles)) {
      return fallback;
    }
  }


  return (
    <Fragment>
      {children}
    </Fragment>
  );
};


export default RoleGate;