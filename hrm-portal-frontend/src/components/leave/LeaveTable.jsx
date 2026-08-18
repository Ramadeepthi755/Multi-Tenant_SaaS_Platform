import {
  Avatar,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from "@mui/material";


import VisibilityOutlinedIcon
  from "@mui/icons-material/VisibilityOutlined";

import CheckOutlinedIcon
  from "@mui/icons-material/CheckOutlined";

import CloseOutlinedIcon
  from "@mui/icons-material/CloseOutlined";


import LeaveStatusChip
  from "./LeaveStatusChip";


import {
  formatLeaveDate,
  getLeaveTypeLabel
} from "../../utils/leaveUtils";


const LeaveTable = ({
  leaves = [],
  onView,
  onApprove,
  onReject,
  canApprove = false,
  canReject = false
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
        overflow:
          "auto"
      }}
    >

      <Table
        sx={{
          minWidth: 1100
        }}
      >

        <TableHead>

          <TableRow
            sx={{
              bgcolor:
                "action.hover"
            }}
          >

            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                EMPLOYEE
              </Typography>
            </TableCell>


            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                LEAVE TYPE
              </Typography>
            </TableCell>


            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                DATES
              </Typography>
            </TableCell>


            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                DAYS
              </Typography>
            </TableCell>


            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                REASON
              </Typography>
            </TableCell>


            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                STATUS
              </Typography>
            </TableCell>


            <TableCell align="right">
              <Typography
                variant="caption"
                fontWeight={900}
              >
                ACTIONS
              </Typography>
            </TableCell>

          </TableRow>

        </TableHead>


        <TableBody>

          {leaves.map(
            leave => {

              const name =
                leave.employeeName ||
                "Unknown Employee";

              const initials =
                name
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map(
                    part =>
                      part[0]
                  )
                  .join("")
                  .toUpperCase();


              const isPending =
                leave.status ===
                "PENDING";


              return (

                <TableRow
                  key={
                    leave.id
                  }
                  hover
                >

                  {/* EMPLOYEE */}

                  <TableCell>

                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                    >

                      <Avatar
                        sx={{
                          width: 38,
                          height: 38,
                          fontSize: 13,
                          fontWeight: 900,
                          bgcolor:
                            "primary.100",
                          color:
                            "primary.main"
                        }}
                      >
                        {initials}
                      </Avatar>


                      <Stack>

                        <Typography
                          variant="body2"
                          fontWeight={850}
                        >
                          {
                            name
                          }
                        </Typography>


                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {
                            leave.employeeCode ||
                            leave.employeeId ||
                            "—"
                          }
                        </Typography>

                      </Stack>

                    </Stack>

                  </TableCell>


                  {/* TYPE */}

                  <TableCell>

                    <Typography
                      variant="body2"
                      fontWeight={750}
                    >
                      {
                        getLeaveTypeLabel(
                          leave.leaveType
                        )
                      }
                    </Typography>

                  </TableCell>


                  {/* DATES */}

                  <TableCell>

                    <Typography
                      variant="body2"
                      fontWeight={750}
                    >
                      {
                        formatLeaveDate(
                          leave.fromDate
                        )
                      }
                    </Typography>


                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      to{" "}
                      {
                        formatLeaveDate(
                          leave.toDate
                        )
                      }
                    </Typography>

                  </TableCell>


                  {/* DAYS */}

                  <TableCell>

                    <Typography
                      fontWeight={850}
                    >
                      {
                        leave.days
                      }
                    </Typography>

                  </TableCell>


                  {/* REASON */}

                  <TableCell>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        maxWidth: 220,
                        overflow:
                          "hidden",
                        textOverflow:
                          "ellipsis",
                        whiteSpace:
                          "nowrap"
                      }}
                    >
                      {
                        leave.reason ||
                        "—"
                      }
                    </Typography>

                  </TableCell>


                  {/* STATUS */}

                  <TableCell>

                    <LeaveStatusChip
                      status={
                        leave.status
                      }
                    />

                  </TableCell>


                  {/* ACTIONS */}

                  <TableCell align="right">

                    <Stack
                      direction="row"
                      spacing={.5}
                      justifyContent="flex-end"
                    >

                      <Tooltip
                        title="View details"
                      >

                        <IconButton
                          size="small"
                          onClick={() =>
                            onView(
                              leave
                            )
                          }
                        >

                          <VisibilityOutlinedIcon
                            fontSize="small"
                          />

                        </IconButton>

                      </Tooltip>


                      {isPending &&
                        canApprove && (

                          <Tooltip
                            title="Approve"
                          >

                            <IconButton
                              size="small"
                              color="success"
                              onClick={() =>
                                onApprove(
                                  leave
                                )
                              }
                            >

                              <CheckOutlinedIcon
                                fontSize="small"
                              />

                            </IconButton>

                          </Tooltip>

                        )}


                      {isPending &&
                        canReject && (

                          <Tooltip
                            title="Reject"
                          >

                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                onReject(
                                  leave
                                )
                              }
                            >

                              <CloseOutlinedIcon
                                fontSize="small"
                              />

                            </IconButton>

                          </Tooltip>

                        )}

                    </Stack>

                  </TableCell>

                </TableRow>

              );

            }
          )}


          {!leaves.length && (

            <TableRow>

              <TableCell
                colSpan={7}
              >

                <Stack
                  alignItems="center"
                  sx={{
                    py: 8
                  }}
                >

                  <Typography
                    variant="h6"
                    fontWeight={850}
                  >
                    No leave requests found
                  </Typography>


                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: .5
                    }}
                  >
                    Try changing your filters
                    or search criteria.
                  </Typography>

                </Stack>

              </TableCell>

            </TableRow>

          )}

        </TableBody>

      </Table>

    </TableContainer>
  );
};


export default LeaveTable;