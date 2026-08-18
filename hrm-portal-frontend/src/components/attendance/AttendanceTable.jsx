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


import AttendanceStatusChip
  from "./AttendanceStatusChip";


import {
  formatAttendanceDate,
  formatAttendanceTime,
  formatWorkingHours
} from "../../utils/attendanceUtils";


const AttendanceTable = ({
  attendance = [],
  onView
}) => {

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "auto"
      }}
    >

      <Table
        sx={{
          minWidth: 1000
        }}
      >

        {/* ===================================================
            HEADER
        =================================================== */}

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
                DATE
              </Typography>
            </TableCell>


            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                CHECK IN
              </Typography>
            </TableCell>


            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                CHECK OUT
              </Typography>
            </TableCell>


            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                WORKING HOURS
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
                ACTION
              </Typography>
            </TableCell>

          </TableRow>

        </TableHead>


        {/* ===================================================
            BODY
        =================================================== */}

        <TableBody>

          {attendance.map(
            record => {

              const name =
                record.employeeName ||
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


              return (

                <TableRow
                  key={
                    record.id ??
                    `${record.employeeId}-${record.date}`
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
                          {name}
                        </Typography>


                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {
                            record.employeeCode ||
                            record.employeeId ||
                            "—"
                          }
                        </Typography>

                      </Stack>

                    </Stack>

                  </TableCell>


                  {/* DATE */}

                  <TableCell>

                    <Typography
                      variant="body2"
                    >
                      {
                        formatAttendanceDate(
                          record.date
                        )
                      }
                    </Typography>

                  </TableCell>


                  {/* CHECK IN */}

                  <TableCell>

                    <Typography
                      variant="body2"
                      fontWeight={750}
                    >
                      {
                        formatAttendanceTime(
                          record.checkIn
                        )
                      }
                    </Typography>

                  </TableCell>


                  {/* CHECK OUT */}

                  <TableCell>

                    <Typography
                      variant="body2"
                      fontWeight={750}
                    >
                      {
                        formatAttendanceTime(
                          record.checkOut
                        )
                      }
                    </Typography>

                  </TableCell>


                  {/* WORKING HOURS */}

                  <TableCell>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {
                        formatWorkingHours(
                          record.workingMinutes
                        )
                      }
                    </Typography>

                  </TableCell>


                  {/* STATUS */}

                  <TableCell>

                    <AttendanceStatusChip
                      status={
                        record.status
                      }
                    />

                  </TableCell>


                  {/* ACTION */}

                  <TableCell align="right">

                    <Tooltip
                      title="View attendance details"
                    >

                      <IconButton
                        size="small"
                        onClick={() =>
                          onView(
                            record
                          )
                        }
                        sx={{
                          border: "1px solid",
                          borderColor:
                            "divider"
                        }}
                      >

                        <VisibilityOutlinedIcon
                          fontSize="small"
                        />

                      </IconButton>

                    </Tooltip>

                  </TableCell>

                </TableRow>

              );

            }
          )}


          {/* =================================================
              EMPTY
          ================================================= */}

          {!attendance.length && (

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
                    No attendance records
                  </Typography>


                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: .5
                    }}
                  >
                    No attendance data matches
                    your current filters.
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


export default AttendanceTable;