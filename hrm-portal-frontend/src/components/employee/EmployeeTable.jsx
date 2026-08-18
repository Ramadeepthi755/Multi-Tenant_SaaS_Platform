import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from "@mui/material";


import MoreVertOutlinedIcon
  from "@mui/icons-material/MoreVertOutlined";

import VisibilityOutlinedIcon
  from "@mui/icons-material/VisibilityOutlined";

import EditOutlinedIcon
  from "@mui/icons-material/EditOutlined";

import DeleteOutlineOutlinedIcon
  from "@mui/icons-material/DeleteOutlineOutlined";

import PowerSettingsNewOutlinedIcon
  from "@mui/icons-material/PowerSettingsNewOutlined";


import {
  useState
} from "react";


import EmployeeStatusChip
  from "./EmployeeStatusChip";


import {
  getEmployeeInitials,
  getEmployeeName,
  formatEmployeeDate
} from "../../utils/employeeUtils";


const EmployeeTable = ({
  employees = [],
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  canUpdate = false,
  canDelete = false
}) => {

  const [
    anchorEl,
    setAnchorEl
  ] = useState(null);


  const [
    selectedEmployee,
    setSelectedEmployee
  ] = useState(null);


  const openMenu = (
    event,
    employee
  ) => {

    setAnchorEl(
      event.currentTarget
    );

    setSelectedEmployee(
      employee
    );
  };


  const closeMenu = () => {

    setAnchorEl(null);

    setSelectedEmployee(
      null
    );
  };


  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border:
          "1px solid",
        borderColor:
          "divider",
        borderRadius: 3,
        overflow: "auto"
      }}
    >

      <Table
        sx={{
          minWidth: 1150
        }}
      >

        <TableHead>

          <TableRow
            sx={{
              bgcolor:
                "background.default"
            }}
          >

            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                EMPLOYEE
              </Typography>
            </TableCell>


            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                EMPLOYEE ID
              </Typography>
            </TableCell>


            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                DEPARTMENT
              </Typography>
            </TableCell>


            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                DESIGNATION
              </Typography>
            </TableCell>


            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                CONTACT
              </Typography>
            </TableCell>


            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                JOINED
              </Typography>
            </TableCell>


            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                STATUS
              </Typography>
            </TableCell>


            <TableCell align="right">
              <Typography
                variant="caption"
                fontWeight={900}
              >
                ACTIONS
              </Typography>
            </TableCell>

          </TableRow>

        </TableHead>


        <TableBody>

          {employees.map(
            employee => (

              <TableRow
                key={
                  employee.id
                }
                hover
                sx={{
                  "&:last-child td": {
                    borderBottom: 0
                  }
                }}
              >

                {/* EMPLOYEE */}

                <TableCell>

                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                  >

                    <Avatar
                      src={
                        employee.profilePhoto ||
                        undefined
                      }
                      sx={{
                        width: 42,
                        height: 42,
                        bgcolor:
                          "primary.main",
                        fontWeight: 900
                      }}
                    >
                      {
                        getEmployeeInitials(
                          employee
                        )
                      }
                    </Avatar>


                    <Box
                      sx={{
                        minWidth: 0
                      }}
                    >

                      <Typography
                        fontWeight={850}
                        noWrap
                      >
                        {
                          getEmployeeName(
                            employee
                          )
                        }
                      </Typography>


                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                      >
                        {
                          employee.email ||
                          "No email"
                        }
                      </Typography>

                    </Box>

                  </Stack>

                </TableCell>


                {/* ID */}

                <TableCell>

                  <Typography
                    variant="body2"
                    fontWeight={800}
                  >
                    {
                      employee.employeeCode ||
                      `EMP-${employee.id ?? "—"}`
                    }
                  </Typography>

                </TableCell>


                {/* DEPARTMENT */}

                <TableCell>

                  <Typography
                    variant="body2"
                    fontWeight={700}
                  >
                    {
                      employee.departmentName ||
                      "—"
                    }
                  </Typography>

                </TableCell>


                {/* DESIGNATION */}

                <TableCell>

                  <Typography
                    variant="body2"
                    fontWeight={700}
                  >
                    {
                      employee.designationName ||
                      "—"
                    }
                  </Typography>

                </TableCell>


                {/* CONTACT */}

                <TableCell>

                  <Typography
                    variant="body2"
                    fontWeight={650}
                  >
                    {
                      employee.phone ||
                      "—"
                    }
                  </Typography>

                </TableCell>


                {/* JOINING */}

                <TableCell>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {
                      formatEmployeeDate(
                        employee.joiningDate
                      )
                    }
                  </Typography>

                </TableCell>


                {/* STATUS */}

                <TableCell>

                  <EmployeeStatusChip
                    status={
                      employee.status
                    }
                    active={
                      employee.active
                    }
                  />

                </TableCell>


                {/* ACTION */}

                <TableCell align="right">

                  <Tooltip
                    title="More actions"
                  >

                    <IconButton
                      onClick={event =>
                        openMenu(
                          event,
                          employee
                        )
                      }
                    >
                      <MoreVertOutlinedIcon />
                    </IconButton>

                  </Tooltip>

                </TableCell>

              </TableRow>

            )
          )}


          {!employees.length && (

            <TableRow>

              <TableCell
                colSpan={8}
              >

                <Box
                  sx={{
                    py: 10,
                    textAlign:
                      "center"
                  }}
                >

                  <Typography
                    variant="h6"
                    fontWeight={850}
                  >
                    No employees found
                  </Typography>


                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: .75
                    }}
                  >
                    Try changing the filters
                    or search criteria.
                  </Typography>

                </Box>

              </TableCell>

            </TableRow>

          )}

        </TableBody>

      </Table>


      {/* ACTION MENU */}

      <Menu
        anchorEl={
          anchorEl
        }
        open={
          Boolean(anchorEl)
        }
        onClose={
          closeMenu
        }
      >

        <MenuItem
          onClick={() => {

            onView(
              selectedEmployee
            );

            closeMenu();

          }}
        >

          <VisibilityOutlinedIcon
            fontSize="small"
            sx={{
              mr: 1.5
            }}
          />

          View Profile

        </MenuItem>


        {canUpdate && (

          <MenuItem
            onClick={() => {

              onEdit(
                selectedEmployee
              );

              closeMenu();

            }}
          >

            <EditOutlinedIcon
              fontSize="small"
              sx={{
                mr: 1.5
              }}
            />

            Edit Employee

          </MenuItem>

        )}


        {canUpdate && (

          <MenuItem
            onClick={() => {

              onStatusChange(
                selectedEmployee
              );

              closeMenu();

            }}
          >

            <PowerSettingsNewOutlinedIcon
              fontSize="small"
              sx={{
                mr: 1.5
              }}
            />

            {
              selectedEmployee?.active
                ? "Deactivate"
                : "Activate"
            }

          </MenuItem>

        )}


        {canDelete && (

          <MenuItem
            sx={{
              color:
                "error.main"
            }}
            onClick={() => {

              onDelete(
                selectedEmployee
              );

              closeMenu();

            }}
          >

            <DeleteOutlineOutlinedIcon
              fontSize="small"
              sx={{
                mr: 1.5
              }}
            />

            Delete Employee

          </MenuItem>

        )}

      </Menu>

    </TableContainer>
  );
};


export default EmployeeTable;