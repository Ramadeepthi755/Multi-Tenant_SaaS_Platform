import {
  Chip
} from "@mui/material";


import {
  getReportStatusColor
} from "../../utils/reportUtils";


const ReportStatusChip = ({
  status
}) => {

  return (
    <Chip
      size="small"
      label={
        String(
          status || "UNKNOWN"
        )
          .replace(
            /_/g,
            " "
          )
      }
      color={
        getReportStatusColor(
          status
        )
      }
      variant="outlined"
      sx={{
        fontWeight: 850,
        borderRadius: 1.5
      }}
    />
  );
};


export default ReportStatusChip;