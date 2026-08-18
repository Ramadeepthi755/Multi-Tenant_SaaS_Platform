import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography
} from "@mui/material";


import CloseOutlinedIcon
  from "@mui/icons-material/CloseOutlined";


import AccessTimeOutlinedIcon
  from "@mui/icons-material/AccessTimeOutlined";

import CalendarTodayOutlinedIcon
  from "@mui/icons-material/CalendarTodayOutlined";

import BusinessOutlinedIcon
  from "@mui/icons-material/BusinessOutlined";

import LocationOnOutlinedIcon
  from "@mui/icons-material/LocationOnOutlined";


import AttendanceStatusChip
  from "./AttendanceStatusChip";


import {
  formatAttendanceDate,
  formatAttendanceTime,
  formatWorkingHours
} from "../../utils/attendanceUtils";


const InfoItem = ({
  label,
  value,
  icon: Icon
}) => {

  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="flex-start"
    >

      {Icon && (

        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor:
              "action.hover",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color:
              "primary.main",
            flexShrink: 0
          }}
        >

          <Icon
            sx={{
              fontSize: 19
            }}
          />

        </Box>

      )}


      <Box
        sx={{
          minWidth: 0
        }}
      >

        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={700}
        >
          {label}
        </Typography>


        <Typography
          variant="body2"
          fontWeight={800}
          sx={{
            mt: .2,
            wordBreak:
              "break-word"
          }}
        >
          {value || "—"}
        </Typography>

      </Box>

    </Stack>
  );
};


const AttendanceDetailsDialog = ({
  open,
  attendance,
  onClose
}) => {

  if (!attendance) {
    return null;
  }


  return (
    <Dialog
      open={open}
      onClose={
        onClose
      }
      fullWidth
      maxWidth="sm"
    >

      {/* =====================================================
          TITLE
      ===================================================== */}

      <DialogTitle
        sx={{
          pr: 6,
          fontWeight: 900
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
              fontWeight={900}
            >
              Attendance Details
            </Typography>


            <Typography
              variant="caption"
              color="text.secondary"
            >
              {
                attendance.employeeName
              }
            </Typography>

          </Box>


          <IconButton
            onClick={
              onClose
            }
          >
            <CloseOutlinedIcon />
          </IconButton>

        </Stack>

      </DialogTitle>


      <DialogContent
        dividers
      >

        {/* ===================================================
            STATUS
        =================================================== */}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            mb: 2.5
          }}
        >

          <Box>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Attendance Status
            </Typography>

          </Box>


          <AttendanceStatusChip
            status={
              attendance.status
            }
          />

        </Stack>


        <Divider
          sx={{
            mb: 3
          }}
        />


        {/* ===================================================
            INFORMATION
        =================================================== */}

        <Grid
          container
          spacing={3}
        >

          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
          >

            <InfoItem
              label="Employee"
              value={
                attendance.employeeName
              }
              icon={
                CalendarTodayOutlinedIcon
              }
            />

          </Grid>


          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
          >

            <InfoItem
              label="Employee ID"
              value={
                attendance.employeeCode ||
                attendance.employeeId
              }
              icon={
                CalendarTodayOutlinedIcon
              }
            />

          </Grid>


          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
          >

            <InfoItem
              label="Date"
              value={
                formatAttendanceDate(
                  attendance.date
                )
              }
              icon={
                CalendarTodayOutlinedIcon
              }
            />

          </Grid>


          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
          >

            <InfoItem
              label="Department"
              value={
                attendance.department
              }
              icon={
                BusinessOutlinedIcon
              }
            />

          </Grid>


          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
          >

            <InfoItem
              label="Check In"
              value={
                formatAttendanceTime(
                  attendance.checkIn
                )
              }
              icon={
                AccessTimeOutlinedIcon
              }
            />

          </Grid>


          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
          >

            <InfoItem
              label="Check Out"
              value={
                formatAttendanceTime(
                  attendance.checkOut
                )
              }
              icon={
                AccessTimeOutlinedIcon
              }
            />

          </Grid>


          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
          >

            <InfoItem
              label="Working Hours"
              value={
                formatWorkingHours(
                  attendance.workingMinutes
                )
              }
              icon={
                AccessTimeOutlinedIcon
              }
            />

          </Grid>


          <Grid
            size={{
              xs: 12,
              sm: 6
            }}
          >

            <InfoItem
              label="Work Location"
              value={
                attendance.location
              }
              icon={
                LocationOnOutlinedIcon
              }
            />

          </Grid>

        </Grid>


        {/* ===================================================
            REMARKS
        =================================================== */}

        {attendance.remarks && (

          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 2,
              bgcolor:
                "action.hover"
            }}
          >

            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={750}
            >
              Remarks
            </Typography>


            <Typography
              variant="body2"
              sx={{
                mt: .5,
                lineHeight: 1.6
              }}
            >
              {
                attendance.remarks
              }
            </Typography>

          </Box>

        )}

      </DialogContent>

    </Dialog>
  );
};


export default AttendanceDetailsDialog;