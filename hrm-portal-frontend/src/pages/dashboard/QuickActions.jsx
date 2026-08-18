// src/pages/dashboard/QuickActions.jsx

import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Stack,
} from "@mui/material";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ApartmentIcon from "@mui/icons-material/Apartment";
import BadgeIcon from "@mui/icons-material/Badge";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import PaymentsIcon from "@mui/icons-material/Payments";

import { useAuth } from "../../context/AuthContext";

const QuickActions = () => {
  const navigate = useNavigate();

  const {
    hasPermission,
  } = useAuth();

  // =====================================================
  // QUICK ACTIONS
  // =====================================================

  const actions = [
    {
      key: "employee",
      title: "Add Employee",
      icon: <PersonAddIcon />,
      path: "/employees/new",
      color: "primary",
      permission: "EMPLOYEE_CREATE",
    },

    {
      key: "department",
      title: "Departments",
      icon: <ApartmentIcon />,
      path: "/departments",
      color: "secondary",
      permission: "DEPARTMENT_READ",
    },

    {
      key: "designation",
      title: "Designations",
      icon: <BadgeIcon />,
      path: "/designations",
      color: "success",
      permission: "DESIGNATION_READ",
    },

    {
      key: "attendance",
      title: "Attendance",
      icon: <EventAvailableIcon />,
      path: "/attendance",
      color: "info",
      permission: "ATTENDANCE_READ",
    },

    {
      key: "leave",
      title: "Leave",
      icon: <BeachAccessIcon />,
      path: "/leave",
      color: "warning",
      permission: "LEAVE_READ",
    },

    {
      key: "payroll",
      title: "Payroll",
      icon: <PaymentsIcon />,
      path: "/payroll",
      color: "error",
      permission: "PAYROLL_READ",
    },
  ];

  // =====================================================
  // FILTER BY PERMISSION
  // =====================================================

  const visibleActions =
    actions.filter((action) =>
      hasPermission(
        action.permission
      )
    );

  // =====================================================
  // NOTHING TO SHOW
  // =====================================================

  if (visibleActions.length === 0) {
    return null;
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <Card
      sx={{
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          fontWeight={600}
          mb={3}
        >
          Quick Actions
        </Typography>

        <Grid
          container
          spacing={2}
        >
          {visibleActions.map(
            (action) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={2}
                key={action.key}
              >
                <Button
                  fullWidth
                  variant="contained"
                  color={action.color}
                  startIcon={action.icon}
                  sx={{
                    height: 70,
                    borderRadius: 3,
                    textTransform:
                      "none",
                    fontWeight: 600,
                  }}
                  onClick={() =>
                    navigate(
                      action.path
                    )
                  }
                >
                  <Stack
                    alignItems="center"
                  >
                    {action.title}
                  </Stack>
                </Button>
              </Grid>
            )
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuickActions;