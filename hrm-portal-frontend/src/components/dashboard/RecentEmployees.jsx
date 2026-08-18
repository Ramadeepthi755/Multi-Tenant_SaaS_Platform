import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography
} from "@mui/material";


import {
  getInitials,
  formatDate,
  formatStatus
} from "../../utils/dashboardUtils";


const RecentEmployees = ({
  employees = []
}) => {

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3
      }}
    >

      <CardContent
        sx={{
          p: 2.5
        }}
      >

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >

          <Box>

            <Typography
              variant="h6"
              fontWeight={850}
            >
              Recent Employees
            </Typography>


            <Typography
              variant="body2"
              color="text.secondary"
            >
              Latest workforce additions
            </Typography>

          </Box>

        </Stack>


        <Divider
          sx={{
            my: 2
          }}
        />


        {employees.length === 0 ? (

          <Box
            sx={{
              py: 5,
              textAlign: "center"
            }}
          >

            <Typography
              color="text.secondary"
            >
              No recent employee records.
            </Typography>

          </Box>

        ) : (

          <Stack
            spacing={1}
          >

            {employees
              .slice(0, 5)
              .map(
                (
                  employee,
                  index
                ) => {

                  const name =
                    employee.fullName ||
                    employee.name ||
                    employee.employeeName ||
                    "Employee";


                  const department =
                    employee.departmentName ||
                    employee.department ||
                    "—";


                  const status =
                    employee.status ||
                    "ACTIVE";


                  const date =
                    employee.createdDate ||
                    employee.createdAt;


                  return (
                    <Box
                      key={
                        employee.id ||
                        employee.employeeId ||
                        index
                      }
                      sx={{
                        p: 1.25,
                        borderRadius: 2,
                        "&:hover": {
                          bgcolor:
                            "action.hover"
                        }
                      }}
                    >

                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                      >

                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor:
                              "primary.main",
                            fontSize: 13,
                            fontWeight: 800
                          }}
                        >
                          {getInitials(
                            name
                          )}
                        </Avatar>


                        <Box
                          sx={{
                            flex: 1,
                            minWidth: 0
                          }}
                        >

                          <Typography
                            variant="body2"
                            fontWeight={800}
                            noWrap
                          >
                            {name}
                          </Typography>


                          <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                          >
                            {department}
                            {" • "}
                            {formatDate(
                              date
                            )}
                          </Typography>

                        </Box>


                        <Chip
                          size="small"
                          label={
                            formatStatus(
                              status
                            )
                          }
                          color={
                            String(status)
                              .toUpperCase() ===
                            "ACTIVE"
                              ? "success"
                              : "default"
                          }
                          sx={{
                            display: {
                              xs: "none",
                              sm: "flex"
                            },
                            fontWeight: 700
                          }}
                        />

                      </Stack>

                    </Box>
                  );
                }
              )}

          </Stack>

        )}

      </CardContent>

    </Card>
  );
};


export default RecentEmployees;