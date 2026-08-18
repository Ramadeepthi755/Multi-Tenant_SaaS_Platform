import { useEffect, useState } from "react";

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Typography,
  Divider,
} from "@mui/material";

import {
  getPermissions,
  updatePermissions,
} from "../../services/roleService";

const availablePermissions = [
  "DASHBOARD",
  "COMPANY",
  "DEPARTMENT",
  "DESIGNATION",
  "EMPLOYEE",
  "ATTENDANCE",
  "LEAVE",
  "PAYROLL",
  "HOLIDAY",
  "USERS",
  "ROLES",
  "REPORTS",
  "SETTINGS",
];

const RolePermissionDialog = ({
  open,
  onClose,
  role,
  reload,
}) => {

  const [permissions, setPermissions] = useState([]);

  useEffect(() => {

    if (open && role) {

      loadPermissions();

    }

  }, [open, role]);

  const loadPermissions = async () => {

    try {

      const data = await getPermissions(role.roleId);

      setPermissions(data || []);

    } catch (error) {

      console.error(error);

    }

  };

  const handlePermissionChange = (permission) => {

    if (permissions.includes(permission)) {

      setPermissions(
        permissions.filter(
          (p) => p !== permission
        )
      );

    } else {

      setPermissions([
        ...permissions,
        permission,
      ]);

    }

  };

  const selectAll = () => {

    setPermissions(availablePermissions);

  };

  const clearAll = () => {

    setPermissions([]);

  };

  const handleSave = async () => {

    try {

      await updatePermissions(
        role.roleId,
        permissions
      );

      reload();

      onClose();

    } catch (error) {

      console.error(error);

      alert("Failed to update permissions.");

    }

  };

  return (

    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >

      <DialogTitle>

        Manage Permissions

      </DialogTitle>

      <DialogContent>

        <Typography
          variant="h6"
          sx={{ mb: 2 }}
        >
          Role :
          {" "}
          {role?.roleName}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>

          {availablePermissions.map(
            (permission) => (

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={permission}
              >

                <FormControlLabel
                  control={

                    <Checkbox
                      checked={permissions.includes(
                        permission
                      )}
                      onChange={() =>
                        handlePermissionChange(
                          permission
                        )
                      }
                    />

                  }
                  label={permission}
                />

              </Grid>

            )
          )}

        </Grid>

      </DialogContent>

      <DialogActions>

        <Button
          color="secondary"
          onClick={clearAll}
        >
          Clear All
        </Button>

        <Button
          color="primary"
          onClick={selectAll}
        >
          Select All
        </Button>

        <Button
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
        >
          Save Permissions
        </Button>

      </DialogActions>

    </Dialog>

  );

};

export default RolePermissionDialog;