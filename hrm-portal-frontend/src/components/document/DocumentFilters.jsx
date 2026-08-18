import {
  MenuItem,
  Stack,
  TextField
} from "@mui/material";


const DocumentFilters = ({
  search,
  type,
  status,
  onSearchChange,
  onTypeChange,
  onStatusChange
}) => {

  return (
    <Stack
      direction={{
        xs: "column",
        sm: "row"
      }}
      spacing={1.5}
    >

      <TextField
        size="small"
        fullWidth
        label="Search documents"
        placeholder="Search by file name..."
        value={
          search
        }
        onChange={
          event =>
            onSearchChange?.(
              event.target.value
            )
        }
      />


      <TextField
        size="small"
        select
        label="File Type"
        value={
          type
        }
        onChange={
          event =>
            onTypeChange?.(
              event.target.value
            )
        }
        sx={{
          minWidth: 160
        }}
      >

        <MenuItem value="ALL">
          All Types
        </MenuItem>

        <MenuItem value="PDF">
          PDF
        </MenuItem>

        <MenuItem value="IMAGE">
          Images
        </MenuItem>

        <MenuItem value="WORD">
          Word
        </MenuItem>

        <MenuItem value="EXCEL">
          Excel
        </MenuItem>

      </TextField>


      <TextField
        size="small"
        select
        label="Status"
        value={
          status
        }
        onChange={
          event =>
            onStatusChange?.(
              event.target.value
            )
        }
        sx={{
          minWidth: 150
        }}
      >

        <MenuItem value="ALL">
          All Status
        </MenuItem>

        <MenuItem value="ACTIVE">
          Active
        </MenuItem>

        <MenuItem value="PENDING">
          Pending
        </MenuItem>

        <MenuItem value="APPROVED">
          Approved
        </MenuItem>

        <MenuItem value="ARCHIVED">
          Archived
        </MenuItem>

      </TextField>

    </Stack>
  );
};


export default DocumentFilters;