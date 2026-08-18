import {
  IconButton,
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


import VisibilityOutlinedIcon
  from "@mui/icons-material/VisibilityOutlined";

import EditOutlinedIcon
  from "@mui/icons-material/EditOutlined";

import SecurityOutlinedIcon
  from "@mui/icons-material/SecurityOutlined";


import RoleStatusChip
  from "./RoleStatusChip";


import {
  getRoleLabel
} from "../../utils/roleUtils";


const RoleTable = ({
  roles = [],
  onView,
  onEdit,
  onPermissions
}) => {

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "auto"
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
                "action.hover"
            }}
          >

            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                ROLE
              </Typography>
            </TableCell>

            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                DESCRIPTION
              </Typography>
            </TableCell>

            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                PERMISSIONS
              </Typography>
            </TableCell>

            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                TYPE
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

          {roles.map(role => (

            <TableRow
              key={role.id || role.name}
              hover
            >

              <TableCell>

                <Typography
                  fontWeight={850}
                >
                  {
                    role.displayName ||
                    getRoleLabel(
                      role.name
                    )
                  }
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {role.name}
                </Typography>

              </TableCell>


              <TableCell
                sx={{
                  maxWidth: 350
                }}
              >

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {
                    role.description ||
                    "No description"
                  }
                </Typography>

              </TableCell>


              <TableCell>

                <Typography
                  fontWeight={800}
                >
                  {
                    role.permissions
                      ?.length || 0
                  }
                </Typography>

              </TableCell>


              <TableCell>

                <Typography
                  variant="body2"
                  fontWeight={750}
                >
                  {
                    role.systemRole
                      ? "System"
                      : "Custom"
                  }
                </Typography>

              </TableCell>


              <TableCell>

                <RoleStatusChip
                  active={
                    role.active
                  }
                />

              </TableCell>


              <TableCell align="right">

                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  spacing={0.5}
                >

                  <Tooltip title="View">

                    <IconButton
                      size="small"
                      onClick={() =>
                        onView(role)
                      }
                    >
                      <VisibilityOutlinedIcon
                        fontSize="small"
                      />
                    </IconButton>

                  </Tooltip>


                  <Tooltip title="Permissions">

                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() =>
                        onPermissions(
                          role
                        )
                      }
                    >
                      <SecurityOutlinedIcon
                        fontSize="small"
                      />
                    </IconButton>

                  </Tooltip>


                  {!role.systemRole && (

                    <Tooltip title="Edit">

                      <IconButton
                        size="small"
                        onClick={() =>
                          onEdit(role)
                        }
                      >
                        <EditOutlinedIcon
                          fontSize="small"
                        />
                      </IconButton>

                    </Tooltip>

                  )}

                </Stack>

              </TableCell>

            </TableRow>

          ))}


          {!roles.length && (

            <TableRow>

              <TableCell
                colSpan={6}
              >

                <Stack
                  alignItems="center"
                  sx={{
                    py: 8
                  }}
                >

                  <Typography
                    variant="h6"
                    fontWeight={850}
                  >
                    No roles found
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Try another search.
                  </Typography>

                </Stack>

              </TableCell>

            </TableRow>

          )}

        </TableBody>

      </Table>

    </TableContainer>
  );
};


export default RoleTable;