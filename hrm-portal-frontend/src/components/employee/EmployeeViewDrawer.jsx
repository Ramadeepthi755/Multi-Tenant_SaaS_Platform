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

import AccountTreeOutlinedIcon
  from "@mui/icons-material/AccountTreeOutlined";

import WorkOutlineOutlinedIcon
  from "@mui/icons-material/WorkOutlineOutlined";

import CalendarMonthOutlinedIcon
  from "@mui/icons-material/CalendarMonthOutlined";


import EmployeeStatusChip
  from "./EmployeeStatusChip";


import {
  getEmployeeInitials,
  getEmployeeName,
  formatEmployeeDate,
  formatEmploymentType
} from "../../utils/employeeUtils";


const EmployeeViewDrawer = ({
  open,
  employee,
  onClose
}) => {

  if (!employee) {
    return null;
  }


  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: {
            xs: "100%",
            sm: 480
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
            Employee Profile
          </Typography>


          <IconButton
            onClick={onClose}
          >
            <CloseOutlinedIcon />
          </IconButton>

        </Stack>

      </Box>


      <Divider />


      {/* PROFILE */}

      <Box
        sx={{
          p: 3
        }}
      >

        <Stack
          alignItems="center"
          textAlign="center"
          spacing={1.5}
        >

          <Box
            sx={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor:
                "primary.main",
              color:
                "primary.contrastText",
              fontSize: 25,
              fontWeight: 900
            }}
          >

            {employee.profilePhoto ? (

              <Box
                component="img"
                src={
                  employee.profilePhoto
                }
                alt={
                  getEmployeeName(
                    employee
                  )
                }
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />

            ) : (

              getEmployeeInitials(
                employee
              )

            )}

          </Box>


          <Typography
            variant="h5"
            fontWeight={900}
          >
            {
              getEmployeeName(
                employee
              )
            }
          </Typography>


          <Typography
            color="text.secondary"
          >
            {
              employee.designationName ||
              "Employee"
            }
          </Typography>


          <Stack
            direction="row"
            spacing={1}
          >

            <Chip
              size="small"
              label={
                employee.employeeCode ||
                `EMP-${employee.id}`
              }
              sx={{
                fontWeight: 800
              }}
            />


            <EmployeeStatusChip
              status={
                employee.status
              }
              active={
                employee.active
              }
            />

          </Stack>

        </Stack>

      </Box>


      <Divider />


      {/* INFORMATION */}

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
              employee.companyName ||
              "—"
            }
          />


          <Detail
            icon={
              <AccountTreeOutlinedIcon />
            }
            label="Department"
            value={
              employee.departmentName ||
              "—"
            }
          />


          <Detail
            icon={
              <WorkOutlineOutlinedIcon />
            }
            label="Designation"
            value={
              employee.designationName ||
              "—"
            }
          />


          <Detail
            label="Email"
            value={
              employee.email ||
              "—"
            }
          />


          <Detail
            label="Phone"
            value={
              employee.phone ||
              "—"
            }
          />


          <Detail
            label="Employment Type"
            value={
              formatEmploymentType(
                employee.employmentType
              )
            }
          />


          <Detail
            icon={
              <CalendarMonthOutlinedIcon />
            }
            label="Joining Date"
            value={
              formatEmployeeDate(
                employee.joiningDate
              )
            }
          />


          <Detail
            label="Reporting Manager"
            value={
              employee.reportingManagerName ||
              "—"
            }
          />


          <Detail
            label="Address"
            value={[
              employee.address,
              employee.city,
              employee.state,
              employee.country,
              employee.postalCode
            ]
              .filter(Boolean)
              .join(", ") || "—"
            }
          />

        </Stack>

      </Box>

    </Drawer>
  );
};


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
            mt: .25
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
            mt: .25,
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


export default EmployeeViewDrawer;