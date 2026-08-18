import {
  Chip
} from "@mui/material";


const EmployeeStatusChip = ({
  status,
  active
}) => {

  const normalized =
    String(
      status || ""
    ).toUpperCase();


  if (
    normalized === "ACTIVE" &&
    active !== false
  ) {

    return (
      <Chip
        size="small"
        label="Active"
        color="success"
        sx={{
          fontWeight: 800,
          borderRadius: 1.5
        }}
      />
    );
  }


  if (
    normalized === "INACTIVE" ||
    active === false
  ) {

    return (
      <Chip
        size="small"
        label="Inactive"
        variant="outlined"
        sx={{
          fontWeight: 800,
          borderRadius: 1.5
        }}
      />
    );
  }


  if (
    normalized === "ON_LEAVE"
  ) {

    return (
      <Chip
        size="small"
        label="On Leave"
        color="warning"
        sx={{
          fontWeight: 800,
          borderRadius: 1.5
        }}
      />
    );
  }


  return (
    <Chip
      size="small"
      label={
        normalized
          .replaceAll("_", " ")
      }
      variant="outlined"
      sx={{
        fontWeight: 800,
        borderRadius: 1.5
      }}
    />
  );
};


export default EmployeeStatusChip;