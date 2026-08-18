import { Box, Typography } from "@mui/material";
import AttendanceList from "./AttendanceList";

const Attendance = () => {
  console.log("Attendance.jsx Loaded");

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Attendance Page Working</Typography>
      <AttendanceList />
    </Box>
  );
};

export default Attendance;