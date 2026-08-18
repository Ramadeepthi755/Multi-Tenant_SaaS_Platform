import {
  Chip
} from "@mui/material";


import {
  getAttendanceStatusColor,
  getAttendanceStatusLabel
} from "../../utils/attendanceUtils";


const AttendanceStatusChip = ({
  status
}) => {

  return (
    <Chip
      size="small"
      label={
        getAttendanceStatusLabel(
          status
        )
      }
      color={
        getAttendanceStatusColor(
          status
        )
      }
      variant="outlined"
      sx={{
        fontWeight: 800,
        borderRadius: 1.5
      }}
    />
  );
};


export default AttendanceStatusChip;