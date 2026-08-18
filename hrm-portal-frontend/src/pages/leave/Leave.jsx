import { Box } from "@mui/material";
import LeaveList from "./LeaveList";

const Leave = () => {
  return (
    <Box
      sx={{
        width: "100%",
        mt: 2,
      }}
    >
      <LeaveList />
    </Box>
  );
};

export default Leave;