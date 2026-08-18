import {
  Avatar,
  Box,
  Checkbox,
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


import CompanyStatusChip
  from "./CompanyStatusChip";


import {
  getCompanyInitials,
  formatCompanyDate
} from "../../utils/companyUtils";


const CompanyTable = ({
  companies = [],
  selectedIds = [],
  onSelectionChange,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  canUpdate = false,
  canDelete = false
}) => {

  const [
    menuAnchor,
    setMenuAnchor
  ] = useState(null);


  const [
    menuCompany,
    setMenuCompany
  ] = useState(null);


  // ----------------------------------------------------------
  // MENU
  // ----------------------------------------------------------

  const openMenu = (
    event,
    company
  ) => {

    setMenuAnchor(
      event.currentTarget
    );

    setMenuCompany(
      company
    );
  };


  const closeMenu = () => {

    setMenuAnchor(null);
    setMenuCompany(null);
  };


  // ----------------------------------------------------------
  // SELECT ALL
  // ----------------------------------------------------------

  const allSelected =
    companies.length > 0 &&
    companies.every(
      company =>
        selectedIds.includes(
          company.id
        )
    );


  const handleSelectAll = (
    event
  ) => {

    if (
      !onSelectionChange
    ) {
      return;
    }


    if (
      event.target.checked
    ) {

      onSelectionChange(
        companies.map(
          company =>
            company.id
        )
      );

    } else {

      onSelectionChange([]);
    }
  };


  // ----------------------------------------------------------
  // SELECT ONE
  // ----------------------------------------------------------

  const handleSelect = (
    companyId
  ) => {

    if (
      !onSelectionChange
    ) {
      return;
    }


    if (
      selectedIds.includes(
        companyId
      )
    ) {

      onSelectionChange(
        selectedIds.filter(
          id =>
            id !== companyId
        )
      );

    } else {

      onSelectionChange([
        ...selectedIds,
        companyId
      ]);
    }
  };


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
          minWidth: 900
        }}
      >

        <TableHead>

          <TableRow
            sx={{
              bgcolor:
                "background.default"
            }}
          >

            <TableCell
              padding="checkbox"
            >

              <Checkbox
                checked={
                  allSelected
                }
                indeterminate={
                  selectedIds.length > 0 &&
                  !allSelected
                }
                onChange={
                  handleSelectAll
                }
              />

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
                CODE
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

          {companies.map(
            company => (

              <TableRow
                key={
                  company.id
                }
                hover
                sx={{
                  "&:last-child td":
                    {
                      borderBottom: 0
                    }
                }}
              >

                <TableCell
                  padding="checkbox"
                >

                  <Checkbox
                    checked={
                      selectedIds.includes(
                        company.id
                      )
                    }
                    onChange={() =>
                      handleSelect(
                        company.id
                      )
                    }
                  />

                </TableCell>


                {/* COMPANY */}

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
                        bgcolor:
                          "primary.main",
                        fontSize: 13,
                        fontWeight: 900
                      }}
                    >
                      {
                        getCompanyInitials(
                          company.companyName
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
                          company.companyName ||
                          "Unnamed Company"
                        }
                      </Typography>


                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                      >
                        {
                          company.email ||
                          "No email"
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
                      company.companyCode ||
                      "—"
                    }
                  </Typography>

                </TableCell>


                {/* CONTACT */}

                <TableCell>

                  <Stack
                    spacing={0.25}
                  >

                    <Typography
                      variant="body2"
                      fontWeight={650}
                    >
                      {
                        company.phone ||
                        "—"
                      }
                    </Typography>


                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {
                        company.email ||
                        "—"
                      }
                    </Typography>

                  </Stack>

                </TableCell>


                {/* STATUS */}

                <TableCell>

                  <CompanyStatusChip
                    status={
                      company.status
                    }
                    active={
                      company.active
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
                      formatCompanyDate(
                        company.createdDate
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
                          company
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


          {companies.length === 0 && (

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
                    fontWeight={800}
                  >
                    No companies found
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
          menuAnchor
        }
        open={
          Boolean(
            menuAnchor
          )
        }
        onClose={
          closeMenu
        }
      >

        <MenuItem
          onClick={() => {

            onView(
              menuCompany
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
                menuCompany
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

            Edit Company

          </MenuItem>

        )}


        {canUpdate && (

          <MenuItem
            onClick={() => {

              onStatusChange(
                menuCompany
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
              menuCompany?.active
                ? "Deactivate"
                : "Activate"
            }

          </MenuItem>

        )}


        {canDelete && (

          <MenuItem
            onClick={() => {

              onDelete(
                menuCompany
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

            Delete Company

          </MenuItem>

        )}

      </Menu>

    </TableContainer>
  );
};


export default CompanyTable;