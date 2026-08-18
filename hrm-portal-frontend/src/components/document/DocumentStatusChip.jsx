import {
  Chip
} from "@mui/material";


const DocumentStatusChip = ({
  status
}) => {

  const normalized =
    String(
      status || "ACTIVE"
    ).toUpperCase();


  const configuration = {

    ACTIVE: {
      label: "Active",
      color: "success"
    },

    APPROVED: {
      label: "Approved",
      color: "success"
    },

    PENDING: {
      label: "Pending",
      color: "warning"
    },

    REJECTED: {
      label: "Rejected",
      color: "error"
    },

    ARCHIVED: {
      label: "Archived",
      color: "default"
    },

    EXPIRED: {
      label: "Expired",
      color: "error"
    }

  };


  const item =
    configuration[
      normalized
    ] || {
      label: normalized,
      color: "default"
    };


  return (
    <Chip
      size="small"
      label={
        item.label
      }
      color={
        item.color
      }
      variant="outlined"
      sx={{
        fontWeight: 750
      }}
    />
  );
};


export default DocumentStatusChip;