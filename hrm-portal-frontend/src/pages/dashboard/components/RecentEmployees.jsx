import {
  Avatar,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";

const RecentEmployees = ({ employees = [] }) => {

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid #e5e7eb",
        height: "100%",
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        mb={2}
      >
        Recent Employees
      </Typography>

      {employees.length === 0 ? (

        <Box
          py={6}
          textAlign="center"
        >
          <Typography color="text.secondary">
            No Employees Found
          </Typography>
        </Box>

      ) : (

        <List>

          {employees.map((employee, index) => (

            <Box key={employee.employeeId}>

              <ListItem
                disablePadding
                sx={{ py: 1.5 }}
              >

                <ListItemAvatar>

                  <Avatar
                    sx={{
                      bgcolor: "#1976d2",
                    }}
                  >
                    <PersonIcon />
                  </Avatar>

                </ListItemAvatar>

                <ListItemText

                  primary={

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >

                      <Typography
                        fontWeight={600}
                      >
                        {employee.fullName}
                      </Typography>

                      <Chip
                        label="Active"
                        color="success"
                        size="small"
                      />

                    </Stack>

                  }

                  secondary={

                    <>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {employee.employeeCode}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {employee.department}
                        {" • "}
                        {employee.designation}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Joined :
                        {" "}
                        {employee.joiningDate
                          ? new Date(employee.joiningDate).toLocaleDateString()
                          : "-"}
                      </Typography>

                    </>

                  }

                />

              </ListItem>

              {index !== employees.length - 1 && (
                <Divider />
              )}

            </Box>

          ))}

        </List>

      )}

    </Paper>
  );
};

export default RecentEmployees;