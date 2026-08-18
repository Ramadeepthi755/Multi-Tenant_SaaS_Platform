import { useEffect, useMemo, useState } from "react";

import {
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import Grid from "@mui/material/Grid";

import {
  Add,
  Delete,
  Edit,
  Search,
  Visibility,
  LockOpen,
  Lock,
} from "@mui/icons-material";

import UserDialog from "./UserDialog";
import UserDetails from "./UserDetails";

import {
  getUsers,
  deleteUser,
  activateUser,
  deactivateUser,
} from "../../services/userService";

const UserList = () => {

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);

  const loadUsers = async () => {

    try {

      setLoading(true);

      const data = await getUsers();

      setUsers(data);

    } catch (error) {

      console.error("Error loading users", error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadUsers();

  }, []);

  const filteredUsers = useMemo(() => {

    return users.filter((user) => {

      const keyword = search.toLowerCase();

      const matchesSearch =
        user.fullName?.toLowerCase().includes(keyword) ||
        user.email?.toLowerCase().includes(keyword);

      const matchesRole =
        !roleFilter || user.role === roleFilter;

      const matchesStatus =
        !statusFilter || user.status === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );

    });

  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ]);

  const openAddDialog = () => {

    setSelectedUser(null);

    setDialogOpen(true);

  };

  const openEditDialog = (user) => {

    setSelectedUser(user);

    setDialogOpen(true);

  };

  const openDetails = (user) => {

    setSelectedUser(user);

    setDetailsOpen(true);

  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this user?"))
      return;

    try {

      await deleteUser(id);

      loadUsers();

    } catch (error) {

      console.error(error);

      alert("Unable to delete user.");

    }

  };

  const handleStatus = async (user) => {

    try {

      if (user.status === "ACTIVE") {

        await deactivateUser(user.userId);

      } else {

        await activateUser(user.userId);

      }

      loadUsers();

    } catch (error) {

      console.error(error);

    }

  };

  const statusChip = (status) => {

    if (status === "ACTIVE") {

      return (
        <Chip
          label="Active"
          color="success"
          size="small"
        />
      );

    }

    return (
      <Chip
        label="Inactive"
        color="error"
        size="small"
      />
    );

  };

  return (

    <Card>

      <CardContent>

        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
          }}
        >

          <Typography variant="h5">
            User Management
          </Typography>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openAddDialog}
          >
            Add User
          </Button>

        </Toolbar>

        <Grid
          container
          spacing={2}
          sx={{ mb: 3 }}
        >

          <Grid item xs={12} md={4}>

            <TextField
              fullWidth
              placeholder="Search Users..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />

          </Grid>

          <Grid item xs={12} md={4}>

            <TextField
              select
              fullWidth
              label="Role"
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value)
              }
            >

              <MenuItem value="">
                All Roles
              </MenuItem>

              <MenuItem value="SUPER_ADMIN">
                SUPER_ADMIN
              </MenuItem>

              <MenuItem value="COMPANY_ADMIN">
                COMPANY_ADMIN
              </MenuItem>

              <MenuItem value="HR">
                HR
              </MenuItem>

              <MenuItem value="MANAGER">
                MANAGER
              </MenuItem>

              <MenuItem value="EMPLOYEE">
                EMPLOYEE
              </MenuItem>

            </TextField>

          </Grid>

          <Grid item xs={12} md={4}>

            <TextField
              select
              fullWidth
              label="Status"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >

              <MenuItem value="">
                All Status
              </MenuItem>

              <MenuItem value="ACTIVE">
                Active
              </MenuItem>

              <MenuItem value="INACTIVE">
                Inactive
              </MenuItem>

            </TextField>

          </Grid>

        </Grid>

        <TableContainer component={Paper}>

          <Table>

            <TableHead>

              <TableRow>

                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">
                  Actions
                </TableCell>

              </TableRow>

            </TableHead>
                        <TableBody>

              {loading ? (

                <TableRow>

                  <TableCell
                    colSpan={6}
                    align="center"
                  >
                    Loading users...
                  </TableCell>

                </TableRow>

              ) : filteredUsers.length === 0 ? (

                <TableRow>

                  <TableCell
                    colSpan={6}
                    align="center"
                  >
                    No users found.
                  </TableCell>

                </TableRow>

              ) : (

                filteredUsers.map((user) => (

                  <TableRow
                    key={user.userId}
                    hover
                  >

                    <TableCell>

                      <Typography
                        fontWeight="bold"
                      >
                        {user.fullName}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {user.phoneNumber}
                      </Typography>

                    </TableCell>

                    <TableCell>
                      {user.email}
                    </TableCell>

                    <TableCell>

                      <Chip
                        label={user.role}
                        color="primary"
                        size="small"
                      />

                    </TableCell>

                    <TableCell>
                      {user.companyName || "-"}
                    </TableCell>

                    <TableCell>
                      {statusChip(user.status)}
                    </TableCell>

                    <TableCell align="center">

                      <Tooltip title="View">

                        <IconButton
                          color="primary"
                          onClick={() =>
                            openDetails(user)
                          }
                        >
                          <Visibility />
                        </IconButton>

                      </Tooltip>

                      <Tooltip title="Edit">

                        <IconButton
                          color="warning"
                          onClick={() =>
                            openEditDialog(user)
                          }
                        >
                          <Edit />
                        </IconButton>

                      </Tooltip>

                      <Tooltip
                        title={
                          user.status === "ACTIVE"
                            ? "Deactivate"
                            : "Activate"
                        }
                      >

                        <IconButton
                          color={
                            user.status === "ACTIVE"
                              ? "error"
                              : "success"
                          }
                          onClick={() =>
                            handleStatus(user)
                          }
                        >

                          {user.status === "ACTIVE" ? (
                            <Lock />
                          ) : (
                            <LockOpen />
                          )}

                        </IconButton>

                      </Tooltip>

                      <Tooltip title="Delete">

                        <IconButton
                          color="error"
                          onClick={() =>
                            handleDelete(
                              user.userId
                            )
                          }
                        >
                          <Delete />
                        </IconButton>

                      </Tooltip>

                    </TableCell>

                  </TableRow>

                ))

              )}

            </TableBody>

          </Table>

        </TableContainer>
              <UserDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        reload={loadUsers}
      />

      <UserDetails
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      </CardContent>

    </Card>

  );

};

export default UserList;