import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";

import Grid from "@mui/material/Grid";

import {
  createUser,
  updateUser,
} from "../../services/userService";

const roles = [
  "SUPER_ADMIN",
  "COMPANY_ADMIN",
  "HR",
  "MANAGER",
  "EMPLOYEE",
];

const statuses = [
  "ACTIVE",
  "INACTIVE",
];

const UserDialog = ({
  open,
  onClose,
  user,
  reload,
}) => {

  const initialState = {
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    companyId: "",
    departmentId: "",
    designationId: "",
    role: "EMPLOYEE",
    status: "ACTIVE",
  };

  const [formData, setFormData] =
    useState(initialState);

  useEffect(() => {

    if (user) {

      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        password: "",
        phoneNumber:
          user.phoneNumber || "",
        companyId:
          user.companyId || "",
        departmentId:
          user.departmentId || "",
        designationId:
          user.designationId || "",
        role:
          user.role || "EMPLOYEE",
        status:
          user.status || "ACTIVE",
      });

    } else {

      setFormData(initialState);

    }

  }, [user]);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const handleSubmit = async () => {

    try {

      if (user) {

        await updateUser(
          user.userId,
          formData
        );

      } else {

        await createUser(formData);

      }

      reload();

      onClose();

    } catch (error) {

      console.error(error);

      alert("Failed to save user.");

    }

  };

  return (

    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >

      <DialogTitle>

        {user
          ? "Edit User"
          : "Add User"}

      </DialogTitle>

      <DialogContent>

        <Grid
          container
          spacing={2}
          sx={{ mt: 1 }}
        >

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>

          {!user && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="password"
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Company ID"
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Department ID"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Designation ID"
              name="designationId"
              value={formData.designationId}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              {roles.map((role) => (
                <MenuItem
                  key={role}
                  value={role}
                >
                  {role}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              {statuses.map((status) => (
                <MenuItem
                  key={status}
                  value={status}
                >
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

        </Grid>

      </DialogContent>

      <DialogActions>

        <Button
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
        >
          {user
            ? "Update User"
            : "Create User"}
        </Button>

      </DialogActions>

    </Dialog>

  );

};

export default UserDialog;