import {
  Avatar,
  Box,
  Chip,
  Stack,
  Typography
} from "@mui/material";

import {
  getDashboardGreeting,
  getInitials,
  getRoleLabel
} from "../../../utils/dashboardUtils";

const DashboardHeader = ({
  user,
  onRefresh,
  refreshing
}) => {

  const fullName =
    user?.fullName ||
    user?.name ||
    "User";

  const role =
    user?.role ||
    "EMPLOYEE";

  const initials =
    getInitials(fullName);


  return (
    <Stack
      direction={{
        xs: "column",
        sm: "row"
      }}
      justifyContent="space-between"
      alignItems={{
        xs: "flex-start",
        sm: "center"
      }}
      spacing={2}
      sx={{
        mb: 3
      }}
    >

      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
      >

        <Avatar
          sx={{
            width: 52,
            height: 52,
            fontWeight: 900
          }}
        >
          {initials}
        </Avatar>


        <Box>

          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight={700}
          >
            {getDashboardGreeting()}
          </Typography>


          <Typography
            variant="h4"
            fontWeight={900}
            sx={{
              letterSpacing:
                "-.04em"
            }}
          >
            {fullName}
          </Typography>


          <Stack
            direction="row"
            spacing={1}
            sx={{
              mt: 0.5
            }}
          >

            <Chip
              size="small"
              label={getRoleLabel(role)}
              sx={{
                fontWeight: 800,
                borderRadius: 1.5
              }}
            />

            {user?.companyName && (

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  alignSelf: "center"
                }}
              >
                {user.companyName}
              </Typography>

            )}

          </Stack>

        </Box>

      </Stack>


      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          cursor:
            refreshing
              ? "default"
              : "pointer",
          fontWeight: 750
        }}
        onClick={
          refreshing
            ? undefined
            : onRefresh
        }
      >
        {refreshing
          ? "Refreshing..."
          : "Last updated just now • Refresh"}
      </Typography>

    </Stack>
  );
};


export default DashboardHeader;