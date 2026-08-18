import {
  Chip
} from "@mui/material";


import {
  getLeaveStatusColor,
  getLeaveStatusLabel
} from "../../utils/leaveUtils";


const LeaveStatusChip = ({
  status
}) => {

  return (
    <Chip
      size="small"
      label={
        getLeaveStatusLabel(
          status
        )
      }
      color={
        getLeaveStatusColor(
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


export default LeaveStatusChip;