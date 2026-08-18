import {
  Chip
} from "@mui/material";


import {
  getPayrollStatusColor,
  getPayrollStatusLabel
} from "../../utils/payrollUtils";


const PayrollStatusChip = ({
  status
}) => {

  return (
    <Chip
      size="small"
      label={
        getPayrollStatusLabel(
          status
        )
      }
      color={
        getPayrollStatusColor(
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


export default PayrollStatusChip;