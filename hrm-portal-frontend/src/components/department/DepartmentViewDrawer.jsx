import {
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography
} from "@mui/material";


import CloseOutlinedIcon
  from "@mui/icons-material/CloseOutlined";

import BusinessOutlinedIcon
  from "@mui/icons-material/BusinessOutlined";

import GroupsOutlinedIcon
  from "@mui/icons-material/GroupsOutlined";


import DepartmentStatusChip
  from "./DepartmentStatusChip";


import {
  formatDepartmentDate,
  getDepartmentInitials
} from "../../utils/departmentUtils";


const DepartmentViewDrawer = ({
  open,
  department,
  onClose
}) => {

  if (!department) {
    return null;
  }


  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={
        onClose
      }
      PaperProps={{
        sx: {
          width: {
            xs: "100%",
            sm: 460
          }
        }
      }}
    >

      {/* HEADER */}

      <Box
        sx={{
          p: 2.5
        }}
      >

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >

          <Typography
            variant="h6"
            fontWeight={900}
          >
            Department Details
          </Typography>


          <IconButton
            onClick={
              onClose
            }
          >
            <CloseOutlinedIcon />
          </IconButton>

        </Stack>

      </Box>


      <Divider />


      {/* IDENTITY */}

      <Box
        sx={{
          p: 3
        }}
      >

        <Stack
          alignItems="center"
          spacing={1.5}
          textAlign="center"
        >

          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor:
                "primary.main",
              color:
                "primary.contrastText",
              fontSize: 22,
              fontWeight: 900
            }}
          >
            {
              getDepartmentInitials(
                department.departmentName
              )
            }
          </Box>


          <Typography
            variant="h5"
            fontWeight={900}
          >
            {
              department.departmentName
            }
          </Typography>


          <Chip
            size="small"
            label={
              department.departmentCode ||
              "No Code"
            }
            sx={{
              fontWeight: 800
            }}
          />


          <DepartmentStatusChip
            status={
              department.status
            }
            active={
              department.active
            }
          />

        </Stack>

      </Box>


      <Divider />


      {/* DETAILS */}

      <Box
        sx={{
          p: 3
        }}
      >

        <Stack
          spacing={2.5}
        >

          <Detail
            icon={
              <BusinessOutlinedIcon />
            }
            label="Company"
            value={
              department.companyName ||
              "—"
            }
          />


          <Detail
            icon={
              <GroupsOutlinedIcon />
            }
            label="Employees"
            value={
              String(
                department.employeeCount
              )
            }
          />


          <Detail
            label="Description"
            value={
              department.description ||
              "No description provided."
            }
          />


          <Detail
            label="Created"
            value={
              formatDepartmentDate(
                department.createdDate
              )
            }
          />


          <Detail
            label="Last Updated"
            value={
              formatDepartmentDate(
                department.updatedDate
              )
            }
          />

        </Stack>

      </Box>

    </Drawer>
  );
};


// ============================================================
// DETAIL
// ============================================================

const Detail = ({
  icon,
  label,
  value
}) => {

  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="flex-start"
    >

      {icon && (

        <Box
          sx={{
            color:
              "text.secondary",
            mt: 0.25
          }}
        >
          {icon}
        </Box>

      )}


      <Box
        sx={{
          flex: 1,
          minWidth: 0
        }}
      >

        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={700}
        >
          {label}
        </Typography>


        <Typography
          variant="body2"
          fontWeight={750}
          sx={{
            mt: 0.25,
            overflowWrap:
              "anywhere"
          }}
        >
          {value}
        </Typography>

      </Box>

    </Stack>
  );
};


export default DepartmentViewDrawer;