import {
  Button
} from "@mui/material";

import PermissionGate
  from "./PermissionGate";


const PermissionButton = ({
  permission,

  permissions = [],

  mode = "any",

  role,

  roles = [],

  fallback = null,

  children,

  ...buttonProps
}) => {

  return (
    <PermissionGate
      permission={
        permission
      }
      permissions={
        permissions
      }
      mode={
        mode
      }
      role={
        role
      }
      roles={
        roles
      }
      fallback={
        fallback
      }
    >

      <Button
        {...buttonProps}
      >
        {children}
      </Button>

    </PermissionGate>
  );
};


export default PermissionButton;