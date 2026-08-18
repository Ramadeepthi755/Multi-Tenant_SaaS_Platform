import PropTypes from "prop-types";

import Button from "@mui/material/Button";

import PermissionGate from "../auth/PermissionGate";

function PermissionButton({
  permission,
  permissions,
  role,
  roles,
  children,
  fallback = null,
  ...buttonProps
}) {
  return (
    <PermissionGate
      permission={
        permission
      }
      permissions={
        permissions
      }
      role={role}
      roles={roles}
      fallback={fallback}
    >
      <Button
        {...buttonProps}
      >
        {children}
      </Button>
    </PermissionGate>
  );
}

PermissionButton.propTypes = {
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

export default PermissionButton;