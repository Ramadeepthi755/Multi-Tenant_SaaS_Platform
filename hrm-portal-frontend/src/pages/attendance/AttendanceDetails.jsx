import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Chip,
  Divider,
} from "@mui/material";

const AttendanceDetails = ({
  open,
  onClose,
  attendance,
}) => {

  if (!attendance) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >

      <DialogTitle>
        Attendance Details
      </DialogTitle>

      <DialogContent dividers>

        <Grid container spacing={3}>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Attendance ID
            </Typography>

            <Typography variant="body1">
              {attendance.attendanceId || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Attendance Date
            </Typography>

            <Typography variant="body1">
              {attendance.attendanceDate || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Employee Code
            </Typography>

            <Typography variant="body1">
              {attendance.employeeCode || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Employee Name
            </Typography>

            <Typography variant="body1">
              {attendance.employeeName || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Check In
            </Typography>

            <Typography variant="body1">
              {attendance.checkIn || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Check Out
            </Typography>

            <Typography variant="body1">
              {attendance.checkOut || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Working Hours
            </Typography>

            <Typography variant="body1">
              {attendance.workingHours || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Status
            </Typography>

            <Chip
              label={attendance.status || "UNKNOWN"}
              color={
                attendance.status === "PRESENT"
                  ? "success"
                  : attendance.status === "HALF_DAY"
                  ? "warning"
                  : attendance.status === "WORK_FROM_HOME"
                  ? "info"
                  : attendance.status === "LEAVE"
                  ? "secondary"
                  : "error"
              }
            />
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Remarks
            </Typography>

            <Typography variant="body1">
              {attendance.remarks || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Created By
            </Typography>

            <Typography variant="body1">
              {attendance.createdBy || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Updated By
            </Typography>

            <Typography variant="body1">
              {attendance.updatedBy || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Created Date
            </Typography>

            <Typography variant="body1">
              {attendance.createdAt || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Updated Date
            </Typography>

            <Typography variant="body1">
              {attendance.updatedAt || "-"}
            </Typography>
          </Grid>

        </Grid>

      </DialogContent>

      <DialogActions>

        <Button
          variant="contained"
          onClick={onClose}
        >
          Close
        </Button>

      </DialogActions>

    </Dialog>
  );
};

export default AttendanceDetails;