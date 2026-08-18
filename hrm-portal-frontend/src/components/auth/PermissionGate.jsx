import PropTypes from "prop-types";

import {
  useAuth,
} from "../../context/AuthContext";

function PermissionGate({
  permission,
  permissions,
  role,
  roles,
  children,
  fallback = null,
}) {
  const {
    hasPermission,
    hasRole,
  } = useAuth();

  let permissionAllowed =
    true;

  let roleAllowed = true;

  /*
  |--------------------------------------------------------------------------
  | SINGLE PERMISSION
  |--------------------------------------------------------------------------
  */

  if (permission) {
    permissionAllowed =
      hasPermission(
        permission
      );
  }

  /*
  |--------------------------------------------------------------------------
  | MULTIPLE PERMISSIONS
  |--------------------------------------------------------------------------
  */

  if (
    permissions &&
    permissions.length > 0
  ) {
    permissionAllowed =
      permissions.some(
        (item) =>
          hasPermission(item)
      );
  }

  /*
  |--------------------------------------------------------------------------
  | SINGLE ROLE
  |--------------------------------------------------------------------------
  */

  if (role) {
    roleAllowed =
      hasRole(role);
  }

  /*
  |--------------------------------------------------------------------------
  | MULTIPLE ROLES
  |--------------------------------------------------------------------------
  */

  if (
    roles &&
    roles.length > 0
  ) {
    roleAllowed =
      hasRole(roles);
  }

  /*
  |--------------------------------------------------------------------------
  | DENIED
  |--------------------------------------------------------------------------
  */

  if (
    !permissionAllowed ||
    !roleAllowed
  ) {
    return fallback;
  }

  /*
  |--------------------------------------------------------------------------
  | ALLOWED
  |--------------------------------------------------------------------------
  */

  return children;
}

PermissionGate.propTypes = {
  permission:
    PropTypes.string,

  permissions:
    PropTypes.arrayOf(
      PropTypes.string
    ),

  role:
    PropTypes.string,

  roles:
    PropTypes.arrayOf(
      PropTypes.string
    ),

  children:
    PropTypes.node.isRequired,

  fallback:
    PropTypes.node,
};

export default PermissionGate;