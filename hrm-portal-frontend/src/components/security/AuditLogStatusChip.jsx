import {
  Chip
} from "@mui/material";


import {
  getAuditStatusColor
} from "../../utils/securityUtils";


const AuditLogStatusChip = ({
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
        getAuditStatusColor(
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


export default AuditLogStatusChip;