import {
  Chip
} from "@mui/material";


const DesignationStatusChip = ({
  status,
  active
}) => {

  const normalized =
    String(
      status || ""
    ).toUpperCase();

  const isActive =
    normalized === "ACTIVE" &&
    active === true;

  return (
    <Chip
      size="small"
      label={
        normalized === "ACTIVE"
          ? "Active"
          : normalized === "INACTIVE"
            ? "Inactive"
            : "Unknown"
      }
      color={
        isActive
          ? "success"
          : normalized === "INACTIVE"
            ? "default"
            : "warning"
      }
      variant={
        isActive
          ? "filled"
          : "outlined"
      }
      sx={{
        fontWeight: 800,
        borderRadius: 1.5
      }}
    />
  );
};


export default DesignationStatusChip;