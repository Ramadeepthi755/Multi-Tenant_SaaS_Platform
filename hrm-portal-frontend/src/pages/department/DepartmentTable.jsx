import {
  Box,
  IconButton,
  Chip,
} from "@mui/material";

import {
  DataGrid,
} from "@mui/x-data-grid";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const DepartmentTable = ({
  departments,
  onEdit,
  onDelete,
}) => {

  const columns = [
    {
      field: "departmentCode",
      headerName: "Code",
      flex: 1,
    },
    {
      field: "departmentName",
      headerName: "Department",
      flex: 2,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
    },
    {
      field: "companyName",
      headerName: "Company",
      flex: 2,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "ACTIVE"
              ? "success"
              : "error"
          }
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => onEdit(params.row)}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            color="error"
            onClick={() => onDelete(params.row)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ height: 550, width: "100%" }}>
      <DataGrid
        rows={departments}
        columns={columns}
        getRowId={(row) => row.departmentId}
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default DepartmentTable;