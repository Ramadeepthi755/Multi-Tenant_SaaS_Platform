import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Pagination,
  Paper,
  Snackbar,
  Stack,
  Typography
} from "@mui/material";

import SecurityOutlinedIcon
  from "@mui/icons-material/SecurityOutlined";

import AdminPanelSettingsOutlinedIcon
  from "@mui/icons-material/AdminPanelSettingsOutlined";

import PeopleOutlinedIcon
  from "@mui/icons-material/PeopleOutlined";

import AddOutlinedIcon
  from "@mui/icons-material/AddOutlined";

import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";


/*
|--------------------------------------------------------------------------
| ROLE COMPONENTS
|--------------------------------------------------------------------------
|
| IMPORTANT:
| Actual folder is:
|
| src/components/role/
|
| NOT:
|
| src/components/roles/
|
|--------------------------------------------------------------------------
*/

import RoleStatCard
  from "../../components/role/RoleStatCard";

import RoleFilters
  from "../../components/role/RoleFilters";

import RoleTable
  from "../../components/role/RoleTable";

import RoleDialog
  from "../../components/role/RoleDialog";

import PermissionMatrix
  from "../../components/role/PermissionMatrix";

import RoleDetailsDialog
  from "../../components/role/RoleDetailsDialog";


/*
|--------------------------------------------------------------------------
| SERVICE
|--------------------------------------------------------------------------
*/

import roleService
  from "../../services/roleService";


/*
|--------------------------------------------------------------------------
| UTILITIES
|--------------------------------------------------------------------------
*/

import {
  getRoleErrorMessage,
  normalizePermissionList,
  normalizeRoleResponse
} from "../../utils/roleUtils";


/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

const RoleManagement = () => {

  const [
    roles,
    setRoles
  ] = useState([]);


  const [
    permissions,
    setPermissions
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    permissionLoading,
    setPermissionLoading
  ] = useState(true);


  const [
    saveLoading,
    setSaveLoading
  ] = useState(false);


  const [
    error,
    setError
  ] = useState("");


  const [
    searchInput,
    setSearchInput
  ] = useState("");


  const [
    search,
    setSearch
  ] = useState("");


  const [
    page,
    setPage
  ] = useState(0);


  const [
    totalPages,
    setTotalPages
  ] = useState(1);


  const [
    totalElements,
    setTotalElements
  ] = useState(0);


  const [
    roleDialogOpen,
    setRoleDialogOpen
  ] = useState(false);


  const [
    permissionDialogOpen,
    setPermissionDialogOpen
  ] = useState(false);


  const [
    detailsDialogOpen,
    setDetailsDialogOpen
  ] = useState(false);


  const [
    selectedRole,
    setSelectedRole
  ] = useState(null);


  const [
    selectedPermissions,
    setSelectedPermissions
  ] = useState([]);


  const [
    dialogError,
    setDialogError
  ] = useState("");


  const [
    toast,
    setToast
  ] = useState({
    open: false,
    message: "",
    severity: "success"
  });


  /*
  |--------------------------------------------------------------------------
  | CURRENT USER
  |--------------------------------------------------------------------------
  */

  const currentUser =
    useMemo(() => {

      try {

        const stored =
          localStorage.getItem(
            "user"
          );

        return stored
          ? JSON.parse(stored)
          : null;

      } catch {

        return null;

      }

    }, []);


  /*
  |--------------------------------------------------------------------------
  | USER PERMISSIONS
  |--------------------------------------------------------------------------
  */

  const userPermissions =
    Array.isArray(
      currentUser?.permissions
    )
      ? currentUser.permissions
      : [];


  /*
  |--------------------------------------------------------------------------
  | ROLE MANAGEMENT ACCESS
  |--------------------------------------------------------------------------
  |
  | SUPER_ADMIN and COMPANY_ADMIN
  | can manage roles.
  |
  |--------------------------------------------------------------------------
  */

  const canManageRoles =
    currentUser?.role ===
      "SUPER_ADMIN" ||
    currentUser?.role ===
      "COMPANY_ADMIN";


  /*
  |--------------------------------------------------------------------------
  | LOAD ROLES
  |--------------------------------------------------------------------------
  */

  const loadRoles =
    useCallback(
      async () => {

        setLoading(true);

        setError("");

        try {

          const response =
            await roleService
              .getRoles({

                search,

                page,

                size: 20

              });


          const normalized =
            normalizeRoleResponse(
              response
            );


          setRoles(
            normalized.content
          );


          setTotalPages(
            normalized.totalPages
          );


          setTotalElements(
            normalized.totalElements
          );

        } catch (requestError) {

          console.error(
            "Role loading failed:",
            requestError
          );


          setError(
            getRoleErrorMessage(
              requestError,
              "Unable to load roles."
            )
          );

        } finally {

          setLoading(false);

        }

      },
      [
        search,
        page
      ]
    );


  /*
  |--------------------------------------------------------------------------
  | LOAD PERMISSIONS
  |--------------------------------------------------------------------------
  */

  const loadPermissions =
    useCallback(
      async () => {

        setPermissionLoading(
          true
        );

        try {

          const response =
            await roleService
              .getPermissions();


          setPermissions(
            normalizePermissionList(
              response
            )
          );

        } catch (requestError) {

          console.error(
            "Permission loading failed:",
            requestError
          );


          /*
          |--------------------------------------------------------------------------
          | FALLBACK
          |--------------------------------------------------------------------------
          */

          const fallback =
            userPermissions.filter(
              permission =>
                typeof permission ===
                "string"
            );


          setPermissions(
            [
              ...new Set(
                fallback
              )
            ]
          );

        } finally {

          setPermissionLoading(
            false
          );

        }

      },
      [
        userPermissions
      ]
    );


  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    loadRoles();

  }, [
    loadRoles
  ]);


  useEffect(() => {

    loadPermissions();

  }, [
    loadPermissions
  ]);


  /*
  |--------------------------------------------------------------------------
  | SEARCH
  |--------------------------------------------------------------------------
  */

  const handleSearch = () => {

    setPage(0);

    setSearch(
      searchInput.trim()
    );

  };


  /*
  |--------------------------------------------------------------------------
  | CLEAR
  |--------------------------------------------------------------------------
  */

  const handleClear = () => {

    setSearchInput("");

    setSearch("");

    setPage(0);

  };


  /*
  |--------------------------------------------------------------------------
  | REFRESH
  |--------------------------------------------------------------------------
  */

  const handleRefresh =
    async () => {

      await Promise.all([
        loadRoles(),
        loadPermissions()
      ]);


      setToast({

        open: true,

        message:
          "Roles refreshed successfully.",

        severity:
          "success"

      });

    };


  /*
  |--------------------------------------------------------------------------
  | CREATE
  |--------------------------------------------------------------------------
  */

  const openCreate =
    () => {

      setSelectedRole(
        null
      );

      setDialogError("");

      setRoleDialogOpen(
        true
      );

    };


  /*
  |--------------------------------------------------------------------------
  | EDIT
  |--------------------------------------------------------------------------
  */

  const openEdit =
    role => {

      if (
        role.systemRole
      ) {

        setToast({

          open: true,

          message:
            "System roles cannot be edited.",

          severity:
            "warning"

        });

        return;

      }


      setSelectedRole(
        role
      );

      setDialogError("");

      setRoleDialogOpen(
        true
      );

    };


  /*
  |--------------------------------------------------------------------------
  | VIEW
  |--------------------------------------------------------------------------
  */

  const openView =
    role => {

      setSelectedRole(
        role
      );

      setDetailsDialogOpen(
        true
      );

    };


  /*
  |--------------------------------------------------------------------------
  | PERMISSIONS
  |--------------------------------------------------------------------------
  */

  const openPermissions =
    role => {

      setSelectedRole(
        role
      );


      setSelectedPermissions(
        role.permissions || []
      );


      setDialogError("");


      setPermissionDialogOpen(
        true
      );

    };


  /*
  |--------------------------------------------------------------------------
  | SAVE ROLE
  |--------------------------------------------------------------------------
  */

  const handleSaveRole =
    async payload => {

      setSaveLoading(
        true
      );

      setDialogError("");

      try {

        if (
          selectedRole?.id
        ) {

          await roleService
            .updateRole(
              selectedRole.id,
              payload
            );


          setToast({

            open: true,

            message:
              "Role updated successfully.",

            severity:
              "success"

          });

        } else {

          await roleService
            .createRole(
              payload
            );


          setToast({

            open: true,

            message:
              "Role created successfully.",

            severity:
              "success"

          });

        }


        setRoleDialogOpen(
          false
        );


        setSelectedRole(
          null
        );


        await loadRoles();

      } catch (requestError) {

        setDialogError(
          getRoleErrorMessage(
            requestError,
            "Unable to save role."
          )
        );

      } finally {

        setSaveLoading(
          false
        );

      }

    };


  /*
  |--------------------------------------------------------------------------
  | SAVE PERMISSIONS
  |--------------------------------------------------------------------------
  */

  const handleSavePermissions =
    async () => {

      if (
        !selectedRole?.id
      ) {

        return;

      }


      setSaveLoading(
        true
      );

      setDialogError("");


      try {

        await roleService
          .updateRolePermissions(
            selectedRole.id,
            selectedPermissions
          );


        setPermissionDialogOpen(
          false
        );


        setToast({

          open: true,

          message:
            "Role permissions updated successfully.",

          severity:
            "success"

        });


        await loadRoles();

      } catch (requestError) {

        setDialogError(
          getRoleErrorMessage(
            requestError,
            "Unable to update permissions."
          )
        );

      } finally {

        setSaveLoading(
          false
        );

      }

    };


  /*
  |--------------------------------------------------------------------------
  | STATISTICS
  |--------------------------------------------------------------------------
  */

  const activeRoles =
    roles.filter(
      role =>
        role.active
    ).length;


  const systemRoles =
    roles.filter(
      role =>
        role.systemRole
    ).length;


  /*
  |--------------------------------------------------------------------------
  | ACCESS RESTRICTION
  |--------------------------------------------------------------------------
  */

  if (
    !canManageRoles
  ) {

    return (

      <Box
        sx={{
          py: 8,
          textAlign: "center"
        }}
      >

        <SecurityOutlinedIcon
          sx={{
            fontSize: 56,
            color:
              "text.secondary"
          }}
        />


        <Typography
          variant="h5"
          fontWeight={900}
          sx={{
            mt: 2
          }}
        >
          Role Management Restricted
        </Typography>


        <Typography
          color="text.secondary"
          sx={{
            mt: 1
          }}
        >
          You do not have permission
          to manage system roles.
        </Typography>

      </Box>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | PAGE
  |--------------------------------------------------------------------------
  */

  return (

    <Box
      sx={{
        pb: 5
      }}
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <Stack
        direction={{
          xs: "column",
          md: "row"
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          md: "center"
        }}
        spacing={2}
        sx={{
          mb: 3
        }}
      >

        <Box>

          <Typography
            variant="h4"
            fontWeight={900}
            sx={{
              letterSpacing:
                "-.04em"
            }}
          >
            Roles & Permissions
          </Typography>


          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5
            }}
          >
            Control access across
            your workforce platform.
          </Typography>

        </Box>


        <Button
          variant="contained"
          startIcon={
            <AddOutlinedIcon />
          }
          onClick={
            openCreate
          }
          sx={{
            borderRadius: 2,
            fontWeight: 850
          }}
        >
          Create Role
        </Button>

      </Stack>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (

        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 3
          }}
          action={

            <Button
              size="small"
              onClick={
                loadRoles
              }
            >
              Retry
            </Button>

          }
        >
          {error}
        </Alert>

      )}


      {/* =====================================================
          STATS
      ===================================================== */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)"
          },
          gap: 2,
          mb: 2
        }}
      >

        <RoleStatCard
          title="Total Roles"
          value={
            totalElements
          }
          subtitle="Configured roles"
          icon={
            AdminPanelSettingsOutlinedIcon
          }
        />


        <RoleStatCard
          title="Active Roles"
          value={
            activeRoles
          }
          subtitle="Currently enabled"
          icon={
            SecurityOutlinedIcon
          }
        />


        <RoleStatCard
          title="System Roles"
          value={
            systemRoles
          }
          subtitle="Built-in roles"
          icon={
            AdminPanelSettingsOutlinedIcon
          }
        />


        <RoleStatCard
          title="Permissions"
          value={
            permissions.length
          }
          subtitle="Available permissions"
          icon={
            PeopleOutlinedIcon
          }
        />

      </Box>


      {/* =====================================================
          FILTERS
      ===================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 3,
          border: "1px solid",
          borderColor:
            "divider"
        }}
      >

        <RoleFilters

          search={
            searchInput
          }

          onSearchChange={
            setSearchInput
          }

          onSearch={
            handleSearch
          }

          onClear={
            handleClear
          }

          onRefresh={
            handleRefresh
          }

          hasFilters={
            Boolean(search)
          }

          loading={
            loading
          }

        />

      </Paper>


      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: 1.5
        }}
      >
        {loading
          ? "Loading roles..."
          : `${totalElements} role${
              totalElements === 1
                ? ""
                : "s"
            } found`}
      </Typography>


      {/* =====================================================
          TABLE
      ===================================================== */}

      <Box
        sx={{
          position:
            "relative"
        }}
      >

        {loading && (

          <Box
            sx={{
              position:
                "absolute",
              inset: 0,
              zIndex: 3,
              display: "flex",
              justifyContent:
                "center",
              alignItems:
                "flex-start",
              pt: 8,
              bgcolor:
                "rgba(255,255,255,.55)",
              backdropFilter:
                "blur(2px)"
            }}
          >

            <CircularProgress />

          </Box>

        )}


        <RoleTable

          roles={
            roles
          }

          onView={
            openView
          }

          onEdit={
            openEdit
          }

          onPermissions={
            openPermissions
          }

        />

      </Box>


      {/* =====================================================
          PAGINATION
      ===================================================== */}

      {totalPages > 1 && (

        <Stack
          alignItems="center"
          sx={{
            mt: 3
          }}
        >

          <Pagination
            count={
              totalPages
            }
            page={
              page + 1
            }
            onChange={(
              event,
              value
            ) => {

              setPage(
                value - 1
              );


              window.scrollTo({
                top: 0,
                behavior:
                  "smooth"
              });

            }}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />

        </Stack>

      )}


      {/* =====================================================
          CREATE / EDIT DIALOG
      ===================================================== */}

      <RoleDialog

        open={
          roleDialogOpen
        }

        role={
          selectedRole
        }

        loading={
          saveLoading
        }

        error={
          dialogError
        }

        onClose={() => {

          if (
            !saveLoading
          ) {

            setRoleDialogOpen(
              false
            );


            setSelectedRole(
              null
            );

          }

        }}

        onSave={
          handleSaveRole
        }

      />


      {/* =====================================================
          PERMISSION MATRIX
      ===================================================== */}

      <Dialog
        open={
          permissionDialogOpen
        }
        onClose={
          saveLoading
            ? undefined
            : () =>
                setPermissionDialogOpen(
                  false
                )
        }
        fullWidth
        maxWidth="md"
      >

        <DialogTitle
          sx={{
            fontWeight: 900
          }}
        >

          {selectedRole?.displayName ||
            selectedRole?.name}

          {" — Permissions"}

        </DialogTitle>


        <DialogContent
          dividers
        >

          {dialogError && (

            <Alert
              severity="error"
              sx={{
                mb: 2
              }}
            >
              {dialogError}
            </Alert>

          )}


          {permissionLoading ? (

            <Stack
              alignItems="center"
              sx={{
                py: 8
              }}
            >

              <CircularProgress />


              <Typography
                color="text.secondary"
                sx={{
                  mt: 2
                }}
              >
                Loading permissions...
              </Typography>

            </Stack>

          ) : (

            <PermissionMatrix

              permissions={
                permissions
              }

              selectedPermissions={
                selectedPermissions
              }

              onChange={
                setSelectedPermissions
              }

              disabled={
                selectedRole?.systemRole ||
                saveLoading
              }

            />

          )}

        </DialogContent>


        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={1}
          sx={{
            p: 2
          }}
        >

          <Button
            onClick={() =>
              setPermissionDialogOpen(
                false
              )
            }
            disabled={
              saveLoading
            }
            sx={{
              fontWeight: 800
            }}
          >
            Cancel
          </Button>


          <Button
            variant="contained"
            onClick={
              handleSavePermissions
            }
            disabled={
              saveLoading ||
              permissionLoading ||
              selectedRole?.systemRole
            }
            sx={{
              fontWeight: 850
            }}
          >

            {saveLoading
              ? "Saving..."
              : "Save Permissions"}

          </Button>

        </Stack>

      </Dialog>


      {/* =====================================================
          DETAILS
      ===================================================== */}

      <RoleDetailsDialog

        open={
          detailsDialogOpen
        }

        role={
          selectedRole
        }

        onClose={() =>
          setDetailsDialogOpen(
            false
          )
        }

      />


      {/* =====================================================
          TOAST
      ===================================================== */}

      <Snackbar

        open={
          toast.open
        }

        autoHideDuration={
          3500
        }

        onClose={() =>
          setToast(
            previous => ({
              ...previous,
              open: false
            })
          )
        }

        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}

      >

        <Alert
          severity={
            toast.severity
          }
          variant="filled"
          onClose={() =>
            setToast(
              previous => ({
                ...previous,
                open: false
              })
            )
          }
          sx={{
            width: "100%"
          }}
        >
          {
            toast.message
          }
        </Alert>

      </Snackbar>

    </Box>

  );

};


export default RoleManagement;