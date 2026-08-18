import {
  Box,
  Button,
  Chip,
  Stack,
  Typography
} from "@mui/material";

import AddOutlinedIcon
  from "@mui/icons-material/AddOutlined";

import CalendarMonthOutlinedIcon
  from "@mui/icons-material/CalendarMonthOutlined";

import {
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../../context/AuthContext";

import PermissionButton
  from "../permissions/PermissionButton";


const DashboardHeader = () => {

  const navigate =
    useNavigate();

  const {
    user
  } = useAuth();


  const companyName =
    user?.companyName ||
    "Your Company";


  const fullName =
    user?.fullName ||
    "there";


  const firstName =
    fullName
      .trim()
      .split(/\s+/)[0];


  const currentDate =
    new Intl.DateTimeFormat(
      "en-IN",
      {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
      }
    ).format(
      new Date()
    );


  return (
    <Box
      sx={{
        mb: 3
      }}
    >

      <Stack
        direction={{
          xs: "column",
          md: "row"
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          md: "center"
        }}
        spacing={2}
      >

        <Box>

          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{
              mb: 0.75
            }}
          >

            <Typography
              variant="h4"
              fontWeight={900}
              sx={{
                letterSpacing:
                  "-0.035em"
              }}
            >
              Good day, {firstName} 👋
            </Typography>


            <Chip
              label={user?.role
                ?.replaceAll(
                  "_",
                  " "
                ) || "USER"}
              size="small"
              sx={{
                fontWeight: 800
              }}
            />

          </Stack>


          <Typography
            color="text.secondary"
            sx={{
              mb: 0.5
            }}
          >
            Here's what's happening
            across {companyName}.
          </Typography>


          <Typography
            variant="caption"
            color="text.secondary"
          >
            {currentDate}
          </Typography>

        </Box>


        <Stack
          direction={{
            xs: "column",
            sm: "row"
          }}
          spacing={1.5}
          sx={{
            width: {
              xs: "100%",
              sm: "auto"
            }
          }}
        >

          <Button
            variant="outlined"
            startIcon={
              <CalendarMonthOutlinedIcon />
            }
            onClick={() =>
              navigate(
                "/holidays"
              )
            }
            sx={{
              borderRadius: 2,
              fontWeight: 700
            }}
          >
            Calendar
          </Button>


          <PermissionButton
            permission="EMPLOYEE_CREATE"
            variant="contained"
            startIcon={
              <AddOutlinedIcon />
            }
            onClick={() =>
              navigate(
                "/employees"
              )
            }
            sx={{
              borderRadius: 2,
              fontWeight: 800
            }}
          >
            Add Employee
          </PermissionButton>

        </Stack>

      </Stack>

    </Box>
  );
};


export default DashboardHeader;