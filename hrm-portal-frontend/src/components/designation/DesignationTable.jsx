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

import { useState } from "react";

import DesignationStatusChip
  from "./DesignationStatusChip";


/*
|--------------------------------------------------------------------------
| LOCAL HELPERS
|--------------------------------------------------------------------------
*/

const formatDesignationDate = (value) => {

  if (!value) {
    return "—";
  }

  try {

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );

  } catch {

    return String(value);

  }

};


const getDesignationInitials = (name) => {

  if (!name) {
    return "NA";
  }

  const words =
    String(name)
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  if (words.length === 1) {

    return words[0]
      .substring(0, 2)
      .toUpperCase();

  }

  return (
    words[0][0] +
    words[1][0]
  ).toUpperCase();

};


/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

const DesignationTable = ({
  designations = [],
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
    selectedDesignation,
    setSelectedDesignation
  ] = useState(null);


  /*
  |--------------------------------------------------------------------------
  | OPEN MENU
  |--------------------------------------------------------------------------
  */

  const openMenu = (
    event,
    designation
  ) => {

    setAnchorEl(
      event.currentTarget
    );

    setSelectedDesignation(
      designation
    );

  };


  /*
  |--------------------------------------------------------------------------
  | CLOSE MENU
  |--------------------------------------------------------------------------
  */

  const closeMenu = () => {

    setAnchorEl(null);

    setSelectedDesignation(null);

  };


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (

    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden"
      }}
    >

      <Table
        sx={{
          minWidth: 1100
        }}
      >

        {/* =====================================================
            TABLE HEADER
        ===================================================== */}

        <TableHead>

          <TableRow
            sx={{
              bgcolor: "background.default"
            }}
          >

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
                CODE
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


        {/* =====================================================
            TABLE BODY
        ===================================================== */}

        <TableBody>

          {designations.map(
            (designation, index) => {

              /*
              |--------------------------------------------------------------------------
              | IMPORTANT
              |--------------------------------------------------------------------------
              | Backend normally returns designationId.
              |
              | Use designationId first.
              | The index is only a final fallback so React never
              | receives an undefined key.
              |--------------------------------------------------------------------------
              */

              const designationKey =
                designation.designationId ??
                designation.id ??
                `designation-${index}`;


              return (

                <TableRow
                  hover
                  key={designationKey}
                  sx={{
                    "&:last-child td": {
                      borderBottom: 0
                    }
                  }}
                >

                  {/* =================================================
                      DESIGNATION
                  ================================================= */}

                  <TableCell>

                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                    >

                      <Avatar
                        sx={{
                          width: 42,
                          height: 42,
                          bgcolor: "primary.main",
                          fontSize: 13,
                          fontWeight: 900
                        }}
                      >

                        {
                          getDesignationInitials(
                            designation.designationName
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
                            designation.designationName ||
                            "Unnamed Designation"
                          }
                        </Typography>


                        <Typography
                          variant="caption"
                          color="text.secondary"
                          noWrap
                        >
                          {
                            designation.description ||
                            "No description"
                          }
                        </Typography>

                      </Box>

                    </Stack>

                  </TableCell>


                  {/* =================================================
                      CODE
                  ================================================= */}

                  <TableCell>

                    <Typography
                      fontWeight={750}
                      variant="body2"
                    >
                      {
                        designation.designationCode ||
                        "—"
                      }
                    </Typography>

                  </TableCell>


                  {/* =================================================
                      DEPARTMENT
                  ================================================= */}

                  <TableCell>

                    <Typography
                      variant="body2"
                      fontWeight={700}
                    >
                      {
                        designation.departmentName ||
                        designation.department?.departmentName ||
                        "—"
                      }
                    </Typography>

                  </TableCell>


                  {/* =================================================
                      COMPANY
                  ================================================= */}

                  <TableCell>

                    <Typography
                      variant="body2"
                      fontWeight={650}
                    >
                      {
                        designation.companyName ||
                        designation.company?.companyName ||
                        "—"
                      }
                    </Typography>

                  </TableCell>


                  {/* =================================================
                      EMPLOYEES
                  ================================================= */}

                  <TableCell>

                    <Typography
                      fontWeight={850}
                    >
                      {
                        designation.employeeCount ??
                        0
                      }
                    </Typography>

                  </TableCell>


                  {/* =================================================
                      STATUS
                  ================================================= */}

                  <TableCell>

                    <DesignationStatusChip
                      status={
                        designation.status
                      }
                      active={
                        designation.active
                      }
                    />

                  </TableCell>


                  {/* =================================================
                      CREATED
                  ================================================= */}

                  <TableCell>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {
                        formatDesignationDate(
                          designation.createdDate ||
                          designation.createdAt
                        )
                      }
                    </Typography>

                  </TableCell>


                  {/* =================================================
                      ACTIONS
                  ================================================= */}

                  <TableCell align="right">

                    <Tooltip
                      title="More actions"
                    >

                      <IconButton
                        onClick={(event) =>
                          openMenu(
                            event,
                            designation
                          )
                        }
                      >

                        <MoreVertOutlinedIcon />

                      </IconButton>

                    </Tooltip>

                  </TableCell>

                </TableRow>

              );

            }
          )}


          {/* =====================================================
              EMPTY STATE
          ===================================================== */}

          {designations.length === 0 && (

            <TableRow
              key="designation-empty-state"
            >

              <TableCell
                colSpan={8}
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
                    No designations found
                  </Typography>


                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 0.75
                    }}
                  >
                    Try changing your
                    search or filters.
                  </Typography>

                </Box>

              </TableCell>

            </TableRow>

          )}

        </TableBody>

      </Table>


      {/* =====================================================
          ACTION MENU
      ===================================================== */}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
      >

        {/* VIEW */}

        <MenuItem
          onClick={() => {

            if (
              selectedDesignation &&
              onView
            ) {

              onView(
                selectedDesignation
              );

            }

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


        {/* EDIT */}

        {canUpdate && (

          <MenuItem
            onClick={() => {

              if (
                selectedDesignation &&
                onEdit
              ) {

                onEdit(
                  selectedDesignation
                );

              }

              closeMenu();

            }}
          >

            <EditOutlinedIcon
              fontSize="small"
              sx={{
                mr: 1.5
              }}
            />

            Edit Designation

          </MenuItem>

        )}


        {/* ACTIVATE / DEACTIVATE */}

        {canUpdate && (

          <MenuItem
            onClick={() => {

              if (
                selectedDesignation &&
                onStatusChange
              ) {

                onStatusChange(
                  selectedDesignation
                );

              }

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
              selectedDesignation?.active
                ? "Deactivate"
                : "Activate"
            }

          </MenuItem>

        )}


        {/* DELETE */}

        {canDelete && (

          <MenuItem
            onClick={() => {

              if (
                selectedDesignation &&
                onDelete
              ) {

                onDelete(
                  selectedDesignation
                );

              }

              closeMenu();

            }}
            sx={{
              color: "error.main"
            }}
          >

            <DeleteOutlineOutlinedIcon
              fontSize="small"
              sx={{
                mr: 1.5
              }}
            />

            Delete Designation

          </MenuItem>

        )}

      </Menu>

    </TableContainer>

  );

};


export default DesignationTable;