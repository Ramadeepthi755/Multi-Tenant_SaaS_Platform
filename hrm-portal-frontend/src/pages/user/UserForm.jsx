import { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

const roles = [
  "SUPER_ADMIN",
  "COMPANY_ADMIN",
  "HR",
  "MANAGER",
  "EMPLOYEE",
];

const statusList = [
  "ACTIVE",
  "INACTIVE",
];

const UserForm = ({
  user,
  companies = [],
  onSubmit,
}) => {

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
    companyId: "",
    status: "ACTIVE",
  });

  useEffect(() => {

    if (user) {

      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        password: "",
        role: user.role || "",
        companyId: user.companyId || "",
        status: user.status || "ACTIVE",
      });

    }

  }, [user]);

  const handleChange = (e) => {

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    onSubmit({
      ...formData,
      companyId: formData.companyId
        ? Number(formData.companyId)
        : null,
    });

  };

  return (

    <form
      id="user-form"
      onSubmit={handleSubmit}
    >

      <Box>

        <Card
          variant="outlined"
          sx={{ mb: 3 }}
        >

          <CardContent>

            <Typography
              variant="h6"
              fontWeight={700}
            >
              User Information
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Grid
              container
              spacing={2}
            >

              <Grid item xs={12} md={6}>

                <TextField
                  fullWidth
                  required
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                />

              </Grid>

              <Grid item xs={12} md={6}>

                <TextField
                  fullWidth
                  required
                  type="email"
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />

              </Grid>

              <Grid item xs={12} md={6}>

                <TextField
                  fullWidth
                  required={!user}
                  type="password"
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  helperText={
                    user
                      ? "Leave blank to keep existing password."
                      : ""
                  }
                />

              </Grid>

              <Grid item xs={12} md={6}>

                <TextField
                  select
                  fullWidth
                  required
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
                      {role.replaceAll("_", " ")}
                    </MenuItem>

                  ))}

                </TextField>

              </Grid>

              <Grid item xs={12} md={6}>

                <TextField
                  select
                  fullWidth
                  required
                  label="Company"
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleChange}
                >

                  {companies.map((company) => (

                    <MenuItem
                      key={company.companyId}
                      value={company.companyId}
                    >
                      {company.companyName}
                    </MenuItem>

                  ))}

                </TextField>

              </Grid>

              <Grid item xs={12} md={6}>

                <TextField
                  select
                  fullWidth
                  required
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >

                  {statusList.map((status) => (

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

          </CardContent>

        </Card>

      </Box>

    </form>

  );

};

export default UserForm;