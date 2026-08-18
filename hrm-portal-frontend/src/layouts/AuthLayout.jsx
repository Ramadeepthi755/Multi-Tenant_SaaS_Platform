// src/layouts/AuthLayout.jsx

import { Outlet } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  Stack,
} from "@mui/material";

const AuthLayout = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "background.default",
      }}
    >
      {/* Left Side */}
      <Box
        sx={{
          width: {
            xs: 0,
            md: "50%",
          },

          display: {
            xs: "none",
            md: "flex",
          },

          bgcolor: "primary.main",

          color: "#fff",

          justifyContent: "center",

          alignItems: "center",

          p: 6,
        }}
      >
        <Stack spacing={4} maxWidth={450}>
          <Typography
            variant="h3"
            fontWeight={700}
          >
            Workforce HRM
          </Typography>

          <Typography variant="h6">
            Smart HR Management Platform
          </Typography>

          <Typography variant="body1">
            Manage Employees, Attendance,
            Leave, Payroll, Recruitment and
            much more from one centralized
            platform.
          </Typography>

          <Stack spacing={2}>
            <Typography>
              ✅ Employee Management
            </Typography>

            <Typography>
              ✅ Attendance Tracking
            </Typography>

            <Typography>
              ✅ Leave Management
            </Typography>

            <Typography>
              ✅ Payroll Processing
            </Typography>

            <Typography>
              ✅ Recruitment
            </Typography>

            <Typography>
              ✅ Reports & Analytics
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Right Side */}
      <Box
        sx={{
          flex: 1,

          display: "flex",

          justifyContent: "center",

          alignItems: "center",

          p: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",

            maxWidth: 500,

            p: {
              xs: 3,
              md: 5,
            },

            borderRadius: 4,
          }}
        >
          <Outlet />
        </Paper>
      </Box>
    </Box>
  );
};

export default AuthLayout;