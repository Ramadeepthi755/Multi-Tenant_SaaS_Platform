import {
  Avatar,
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";


import ComputerOutlinedIcon
  from "@mui/icons-material/ComputerOutlined";


import PublicOutlinedIcon
  from "@mui/icons-material/PublicOutlined";


import {
  formatDateTime,
  getInitials
} from "../../utils/securityUtils";


import LoginStatusChip
  from "./LoginStatusChip";


const LoginHistoryTable = ({
  history
}) => {

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border:
          "1px solid",
        borderColor:
          "divider",
        borderRadius: 3,
        overflowX: "auto"
      }}
    >

      <Table
        size="small"
        sx={{
          minWidth: 1050
        }}
      >

        <TableHead>

          <TableRow>

            <TableCell
              sx={{
                fontWeight: 900
              }}
            >
              User
            </TableCell>


            <TableCell
              sx={{
                fontWeight: 900
              }}
            >
              Status
            </TableCell>


            <TableCell
              sx={{
                fontWeight: 900
              }}
            >
              Login Time
            </TableCell>


            <TableCell
              sx={{
                fontWeight: 900
              }}
            >
              Logout Time
            </TableCell>


            <TableCell
              sx={{
                fontWeight: 900
              }}
            >
              IP Address
            </TableCell>


            <TableCell
              sx={{
                fontWeight: 900
              }}
            >
              Device
            </TableCell>


            <TableCell
              sx={{
                fontWeight: 900
              }}
            >
              Location
            </TableCell>


            <TableCell
              sx={{
                fontWeight: 900
              }}
            >
              Failure Reason
            </TableCell>

          </TableRow>

        </TableHead>


        <TableBody>

          {history.map(
            item => (

              <TableRow
                key={
                  item.id
                }
                hover
              >

                <TableCell>

                  <Stack
                    direction="row"
                    spacing={1.25}
                    alignItems="center"
                  >

                    <Avatar
                      sx={{
                        width: 34,
                        height: 34,
                        fontSize: 12,
                        fontWeight: 900
                      }}
                    >
                      {
                        getInitials(
                          item.userName
                        )
                      }
                    </Avatar>


                    <Box>

                      <Typography
                        variant="body2"
                        fontWeight={800}
                      >
                        {
                          item.userName
                        }
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {
                          item.email
                        }
                      </Typography>

                    </Box>

                  </Stack>

                </TableCell>


                <TableCell>

                  <LoginStatusChip
                    status={
                      item.status
                    }
                  />

                </TableCell>


                <TableCell>

                  <Typography
                    variant="body2"
                  >
                    {
                      formatDateTime(
                        item.loginTime
                      )
                    }
                  </Typography>

                </TableCell>


                <TableCell>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {
                      formatDateTime(
                        item.logoutTime
                      )
                    }
                  </Typography>

                </TableCell>


                <TableCell>

                  <Typography
                    variant="body2"
                    fontFamily="monospace"
                  >
                    {
                      item.ipAddress
                    }
                  </Typography>

                </TableCell>


                <TableCell>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >

                    <ComputerOutlinedIcon
                      fontSize="small"
                      color="action"
                    />

                    <Box>

                      <Typography
                        variant="body2"
                        fontWeight={700}
                      >
                        {
                          item.device
                        }
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {
                          item.browser
                        }
                      </Typography>

                    </Box>

                  </Stack>

                </TableCell>


                <TableCell>

                  <Stack
                    direction="row"
                    spacing={0.75}
                    alignItems="center"
                  >

                    <PublicOutlinedIcon
                      fontSize="small"
                      color="action"
                    />

                    <Typography
                      variant="body2"
                    >
                      {
                        item.location
                      }
                    </Typography>

                  </Stack>

                </TableCell>


                <TableCell>

                  <Typography
                    variant="body2"
                    color={
                      item.failureReason
                        ? "error.main"
                        : "text.secondary"
                    }
                    sx={{
                      maxWidth: 220
                    }}
                  >
                    {
                      item.failureReason ||
                      "-"
                    }
                  </Typography>

                </TableCell>

              </TableRow>

            )
          )}

        </TableBody>

      </Table>

    </TableContainer>
  );
};


export default LoginHistoryTable;