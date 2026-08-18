import {
  Chip
} from "@mui/material";


const RoleStatusChip = ({
  active
}) => {

  return (
    <Chip
      size="small"
      label={
        active
          ? "Active"
          : "Inactive"
      }
      color={
        active
          ? "success"
          : "default"
      }
      variant={
        active
          ? "filled"
          : "outlined"
      }
      sx={{
        fontWeight: 850,
        borderRadius: 1.5
      }}
    />
  );
};


export default RoleStatusChip;