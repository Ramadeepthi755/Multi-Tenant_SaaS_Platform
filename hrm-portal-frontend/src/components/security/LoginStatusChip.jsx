import {
  Chip
} from "@mui/material";


import {
  getLoginStatusColor
} from "../../utils/securityUtils";


const LoginStatusChip = ({
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
        getLoginStatusColor(
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


export default LoginStatusChip;