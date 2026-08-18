import {
  Chip
} from "@mui/material";


// ============================================================
// COMPANY STATUS CHIP
// ============================================================

const CompanyStatusChip = ({
  status,
  active
}) => {

  const normalizedStatus =
    String(
      status || ""
    ).toUpperCase();


  const isActive =
    active === true &&
    normalizedStatus ===
      "ACTIVE";


  const label =
    normalizedStatus ===
      "ACTIVE"
      ? "Active"
      : normalizedStatus ===
          "INACTIVE"
        ? "Inactive"
        : normalizedStatus || "Unknown";


  return (
    <Chip
      size="small"
      label={label}
      color={
        isActive
          ? "success"
          : normalizedStatus ===
              "INACTIVE"
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


export default CompanyStatusChip;