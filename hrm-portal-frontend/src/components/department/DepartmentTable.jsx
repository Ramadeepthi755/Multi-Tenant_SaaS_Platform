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


import DepartmentStatusChip
  from "./DepartmentStatusChip";


import {
  formatDepartmentDate,
  getDepartmentInitials
} from "../../utils/departmentUtils";


const DepartmentTable = ({
  departments = [],
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
    selectedDepartment,
    setSelectedDepartment
  ] = useState(null);


  const openMenu = (
    event,
    department
  ) => {

    setAnchorEl(
      event.currentTarget
    );

    setSelectedDepartment(
      department
    );
  };


  const closeMenu = () => {

    setAnchorEl(null);
    setSelectedDepartment(null);
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
        overflow: "hidden"
      }}
    >

      <Table
        sx={{
          minWidth: 950
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
                DEPARTMENT
              </Typography>
            </TableCell>


            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                CODE
              </Typography>
            </TableCell>


            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                COMPANY
              </Typography>
            </TableCell>


            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                EMPLOYEES
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


            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                CREATED
              </Typography>
            </TableCell>


            <TableCell
              align="right"
            >
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

          {departments.map(
            department => (

              <TableRow
                hover
                key={
                  department.id
                }
                sx={{
                  "&:last-child td":
                    {
                      borderBottom: 0
                    }
                }}
              >

                {/* DEPARTMENT */}

                <TableCell>

                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                  >

                    <Avatar
                      sx={{
                        width: 42,
                        height: 42,
                        bgcolor:
                          "primary.main",
                        fontSize: 13,
                        fontWeight: 900
                      }}
                    >
                      {
                        getDepartmentInitials(
                          department.departmentName
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
                          department.departmentName ||
                          "Unnamed Department"
                        }
                      </Typography>


                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                      >
                        {
                          department.description ||
                          "No description"
                        }
                      </Typography>

                    </Box>

                  </Stack>

                </TableCell>


                {/* CODE */}

                <TableCell>

                  <Typography
                    variant="body2"
                    fontWeight={750}
                  >
                    {
                      department.departmentCode ||
                      "—"
                    }
                  </Typography>

                </TableCell>


                {/* COMPANY */}

                <TableCell>

                  <Typography
                    variant="body2"
                    fontWeight={650}
                  >
                    {
                      department.companyName ||
                      "—"
                    }
                  </Typography>

                </TableCell>


                {/* EMPLOYEES */}

                <TableCell>

                  <Typography
                    variant="body2"
                    fontWeight={850}
                  >
                    {
                      department.employeeCount
                    }
                  </Typography>

                </TableCell>


                {/* STATUS */}

                <TableCell>

                  <DepartmentStatusChip
                    status={
                      department.status
                    }
                    active={
                      department.active
                    }
                  />

                </TableCell>


                {/* CREATED */}

                <TableCell>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {
                      formatDepartmentDate(
                        department.createdDate
                      )
                    }
                  </Typography>

                </TableCell>


                {/* ACTIONS */}

                <TableCell
                  align="right"
                >

                  <Tooltip
                    title="More actions"
                  >

                    <IconButton
                      onClick={event =>
                        openMenu(
                          event,
                          department
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


          {departments.length === 0 && (

            <TableRow>

              <TableCell
                colSpan={7}
              >

                <Box
                  sx={{
                    py: 10,
                    textAlign: "center"
                  }}
                >

                  <Typography
                    variant="h6"
                    fontWeight={850}
                  >
                    No departments found
                  </Typography>


                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 0.75
                    }}
                  >
                    Try changing your
                    search or filter.
                  </Typography>

                </Box>

              </TableCell>

            </TableRow>

          )}

        </TableBody>

      </Table>


      {/* ======================================================
          ACTION MENU
      ====================================================== */}

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
              selectedDepartment
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

          View Details

        </MenuItem>


        {canUpdate && (

          <MenuItem
            onClick={() => {

              onEdit(
                selectedDepartment
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

            Edit Department

          </MenuItem>

        )}


        {canUpdate && (

          <MenuItem
            onClick={() => {

              onStatusChange(
                selectedDepartment
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
              selectedDepartment?.active
                ? "Deactivate"
                : "Activate"
            }

          </MenuItem>

        )}


        {canDelete && (

          <MenuItem
            onClick={() => {

              onDelete(
                selectedDepartment
              );

              closeMenu();

            }}
            sx={{
              color:
                "error.main"
            }}
          >

            <DeleteOutlineOutlinedIcon
              fontSize="small"
              sx={{
                mr: 1.5
              }}
            />

            Delete Department

          </MenuItem>

        )}

      </Menu>

    </TableContainer>
  );
};


export default DepartmentTable;