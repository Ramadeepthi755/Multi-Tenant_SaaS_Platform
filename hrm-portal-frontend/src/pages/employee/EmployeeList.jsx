import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography
} from "@mui/material";


import SearchOutlinedIcon
  from "@mui/icons-material/SearchOutlined";

import AddOutlinedIcon
  from "@mui/icons-material/AddOutlined";

import RefreshOutlinedIcon
  from "@mui/icons-material/RefreshOutlined";

import GroupsOutlinedIcon
  from "@mui/icons-material/GroupsOutlined";

import CheckCircleOutlineOutlinedIcon
  from "@mui/icons-material/CheckCircleOutlineOutlined";

import BlockOutlinedIcon
  from "@mui/icons-material/BlockOutlined";

import EventBusyOutlinedIcon
  from "@mui/icons-material/EventBusyOutlined";


import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";


import EmployeeStatCard
  from "../../components/employee/EmployeeStatCard";

import EmployeeTable
  from "../../components/employee/EmployeeTable";

import EmployeeForm
  from "../../components/employee/EmployeeForm";

import EmployeeViewDrawer
  from "../../components/employee/EmployeeViewDrawer";

import DeleteEmployeeDialog
  from "../../components/employee/DeleteEmployeeDialog";


import employeeService
  from "../../services/employeeService";

import companyService
  from "../../services/companyService";

import departmentService
  from "../../services/departmentService";

import designationService
  from "../../services/designationService";


import {
  normalizeEmployeePage,
  normalizeEmployee,
  getEmployeeErrorMessage
} from "../../utils/employeeUtils";


import PermissionButton
  from "../../components/permissions/PermissionButton";

import usePermissions
  from "../../hooks/usePermissions";


const EmployeeList = () => {

  const {
    can
  } = usePermissions();


  // ==========================================================
  // DATA
  // ==========================================================

  const [
    employees,
    setEmployees
  ] = useState([]);


  const [
    companies,
    setCompanies
  ] = useState([]);


  const [
    departments,
    setDepartments
  ] = useState([]);


  const [
    designations,
    setDesignations
  ] = useState([]);


  const [
    page,
    setPage
  ] = useState(0);


  const [
    totalPages,
    setTotalPages
  ] = useState(0);


  const [
    totalElements,
    setTotalElements
  ] = useState(0);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState("");


  // ==========================================================
  // FILTERS
  // ==========================================================

  const [
    searchInput,
    setSearchInput
  ] = useState("");


  const [
    search,
    setSearch
  ] = useState("");


  const [
    status,
    setStatus
  ] = useState("");


  const [
    companyId,
    setCompanyId
  ] = useState("");


  const [
    departmentId,
    setDepartmentId
  ] = useState("");


  const [
    designationId,
    setDesignationId
  ] = useState("");


  const [
    sortBy,
    setSortBy
  ] = useState("id");


  const [
    direction,
    setDirection
  ] = useState("asc");


  // ==========================================================
  // FORM
  // ==========================================================

  const [
    formOpen,
    setFormOpen
  ] = useState(false);


  const [
    formMode,
    setFormMode
  ] = useState("create");


  const [
    selectedEmployee,
    setSelectedEmployee
  ] = useState(null);


  const [
    formLoading,
    setFormLoading
  ] = useState(false);


  const [
    formError,
    setFormError
  ] = useState("");


  // ==========================================================
  // VIEW
  // ==========================================================

  const [
    viewOpen,
    setViewOpen
  ] = useState(false);


  const [
    viewEmployee,
    setViewEmployee
  ] = useState(null);


  // ==========================================================
  // DELETE
  // ==========================================================

  const [
    deleteOpen,
    setDeleteOpen
  ] = useState(false);


  const [
    deleteEmployee,
    setDeleteEmployee
  ] = useState(null);


  const [
    deleteLoading,
    setDeleteLoading
  ] = useState(false);


  const [
    deleteError,
    setDeleteError
  ] = useState("");


  // ==========================================================
  // TOAST
  // ==========================================================

  const [
    toast,
    setToast
  ] = useState({
    open: false,
    message: "",
    severity: "success"
  });


  // ==========================================================
  // LOAD REFERENCE DATA
  // ==========================================================

  const loadReferenceData =
    useCallback(
      async () => {

        try {

          const [
            companiesResponse,
            departmentsResponse,
            designationsResponse
          ] = await Promise.all([

            companyService.getCompanies({
              page: 0,
              size: 100,
              sortBy:
                "companyName",
              direction:
                "asc"
            }),

            departmentService.getDepartments({
              page: 0,
              size: 100,
              sortBy:
                "departmentName",
              direction:
                "asc"
            }),

            designationService.getDesignations({
              page: 0,
              size: 100,
              sortBy:
                "designationName",
              direction:
                "asc"
            })

          ]);


          setCompanies(
            Array.isArray(
              companiesResponse?.content
            )
              ? companiesResponse.content
              : []
          );


          setDepartments(
            Array.isArray(
              departmentsResponse
            )
              ? departmentsResponse
              : Array.isArray(departmentsResponse?.content)
                ? departmentsResponse.content
                : []
          );


          setDesignations(
            Array.isArray(designationsResponse)
              ? designationsResponse
              : Array.isArray(designationsResponse?.content)
                ? designationsResponse.content
                : []
          );

        } catch (requestError) {

          console.error(
            "Reference data loading failed:",
            requestError
          );

        }

      },
      []
    );


  // ==========================================================
  // LOAD EMPLOYEES
  // ==========================================================

  const loadEmployees =
    useCallback(
      async () => {

        setLoading(true);
        setError("");


        try {

          const response =
            await employeeService
              .getEmployees({

                page,

                size: 20,

                sortBy,

                direction,

                search,

                status,

                companyId,

                departmentId,

                designationId

              });


          const normalized =
            normalizeEmployeePage(
              response
            );


          setEmployees(
            normalized.content
          );

          setTotalElements(
            normalized.totalElements
          );

          setTotalPages(
            normalized.totalPages
          );

        } catch (requestError) {

          console.error(
            "Employee loading failed:",
            requestError
          );


          setEmployees([]);

          setTotalElements(0);

          setTotalPages(0);


          setError(
            getEmployeeErrorMessage(
              requestError,
              "Unable to load employees."
            )
          );

        } finally {

          setLoading(false);
        }

      },
      [
        page,
        sortBy,
        direction,
        search,
        status,
        companyId,
        departmentId,
        designationId
      ]
    );


  useEffect(() => {

    loadEmployees();

  }, [
    loadEmployees
  ]);


  useEffect(() => {

    loadReferenceData();

  }, [
    loadReferenceData
  ]);


  // ==========================================================
  // STATS
  // ==========================================================

  const statistics =
    useMemo(() => {

      const active =
        employees.filter(
          employee =>
            String(
              employee.status
            ).toUpperCase() ===
              "ACTIVE" &&
            employee.active !== false
        ).length;


      const inactive =
        employees.filter(
          employee =>
            String(
              employee.status
            ).toUpperCase() ===
              "INACTIVE" ||
            employee.active === false
        ).length;


      const onLeave =
        employees.filter(
          employee =>
            String(
              employee.status
            ).toUpperCase() ===
            "ON_LEAVE"
        ).length;


      return {
        active,
        inactive,
        onLeave
      };

    }, [
      employees
    ]);


  // ==========================================================
  // SEARCH
  // ==========================================================

  const handleSearch = (
    event
  ) => {

    event.preventDefault();

    setPage(0);

    setSearch(
      searchInput.trim()
    );
  };


  // ==========================================================
  // RESET
  // ==========================================================

  const resetFilters = () => {

    setSearchInput("");

    setSearch("");

    setStatus("");

    setCompanyId("");

    setDepartmentId("");

    setDesignationId("");

    setSortBy("id");

    setDirection("asc");

    setPage(0);
  };


  // ==========================================================
  // CREATE
  // ==========================================================

  const openCreate = () => {

    setSelectedEmployee(
      null
    );

    setFormMode(
      "create"
    );

    setFormError("");

    setFormOpen(true);
  };


  // ==========================================================
  // EDIT
  // ==========================================================

  const openEdit = (
    employee
  ) => {

    setSelectedEmployee(
      employee
    );

    setFormMode(
      "edit"
    );

    setFormError("");

    setFormOpen(true);
  };


  // ==========================================================
  // VIEW
  // ==========================================================

  const openView = async (
    employee
  ) => {

    try {

      if (
        employee?.id
      ) {

        const response =
          await employeeService
            .getEmployeeById(
              employee.id
            );

        setViewEmployee(
          normalizeEmployee(
            response
          )
        );

      } else {

        setViewEmployee(
          employee
        );
      }


      setViewOpen(true);

    } catch (requestError) {

      setViewEmployee(
        employee
      );

      setViewOpen(true);

    }
  };


  // ==========================================================
  // CLOSE FORM
  // ==========================================================

  const closeForm = () => {

    if (formLoading) {
      return;
    }

    setFormOpen(false);

    setFormError("");
  };


  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (
    payload
  ) => {

    setFormLoading(true);

    setFormError("");


    try {

      if (
        formMode === "edit"
      ) {

        await employeeService
          .updateEmployee(
            selectedEmployee.id,
            payload
          );


        setToast({
          open: true,
          message:
            "Employee updated successfully.",
          severity:
            "success"
        });

      } else {

        await employeeService
          .createEmployee(
            payload
          );


        setToast({
          open: true,
          message:
            "Employee created successfully.",
          severity:
            "success"
        });

      }


      setFormOpen(false);

      await loadEmployees();

    } catch (requestError) {

      console.error(
        "Employee save failed:",
        requestError
      );


      setFormError(
        getEmployeeErrorMessage(
          requestError,
          "Unable to save employee."
        )
      );

    } finally {

      setFormLoading(false);
    }
  };


  // ==========================================================
  // DELETE
  // ==========================================================

  const openDelete = (
    employee
  ) => {

    setDeleteEmployee(
      employee
    );

    setDeleteError("");

    setDeleteOpen(true);
  };


  const closeDelete = () => {

    if (deleteLoading) {
      return;
    }

    setDeleteOpen(false);

    setDeleteEmployee(
      null
    );

    setDeleteError("");
  };


  const handleDelete = async () => {

    if (
      !deleteEmployee?.id
    ) {
      return;
    }


    setDeleteLoading(true);

    setDeleteError("");


    try {

      await employeeService
        .deleteEmployee(
          deleteEmployee.id
        );


      setToast({
        open: true,
        message:
          "Employee deactivated successfully.",
        severity:
          "success"
      });


      setDeleteOpen(false);

      await loadEmployees();

    } catch (requestError) {

      console.error(
        "Employee delete failed:",
        requestError
      );


      setDeleteError(
        getEmployeeErrorMessage(
          requestError,
          "Unable to deactivate employee."
        )
      );

    } finally {

      setDeleteLoading(false);
    }
  };


  // ==========================================================
  // STATUS
  // ==========================================================

  const handleStatusChange = async (
    employee
  ) => {

    if (!employee?.id) {
      return;
    }


    const nextStatus =
      employee.active
        ? "INACTIVE"
        : "ACTIVE";


    try {

      await employeeService
        .updateStatus(
          employee.id,
          nextStatus
        );


      setToast({
        open: true,
        message:
          `Employee ${
            nextStatus === "ACTIVE"
              ? "activated"
              : "deactivated"
          } successfully.`,
        severity:
          "success"
      });


      await loadEmployees();

    } catch (requestError) {

      setToast({
        open: true,
        message:
          getEmployeeErrorMessage(
            requestError,
            "Unable to update employee status."
          ),
        severity:
          "error"
      });

    }
  };


  // ==========================================================
  // PAGINATION
  // ==========================================================

  const handlePageChange = (
    event,
    value
  ) => {

    setPage(
      value - 1
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


  // ==========================================================
  // FILTERED DEPARTMENTS
  // ==========================================================

  const filteredDepartments =
    companyId
      ? departments.filter(
          department =>
            String(
              department.companyId
            ) ===
            String(
              companyId
            )
        )
      : departments;


  // ==========================================================
  // FILTERED DESIGNATIONS
  // ==========================================================

  const filteredDesignations =
    departmentId
      ? designations.filter(
          designation =>
            String(
              designation.departmentId
            ) ===
            String(
              departmentId
            )
        )
      : companyId
        ? designations.filter(
            designation =>
              String(
                designation.companyId
              ) ===
              String(
                companyId
              )
          )
        : designations;


  return (
    <Box
      sx={{
        pb: 4
      }}
    >

      {/* HEADER */}

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
            Employees
          </Typography>


          <Typography
            color="text.secondary"
            sx={{
              mt: .5
            }}
          >
            Manage your workforce,
            organization structure and
            employment information.
          </Typography>

        </Box>


        <PermissionButton
          permission="EMPLOYEE_CREATE"
          variant="contained"
          startIcon={
            <AddOutlinedIcon />
          }
          onClick={
            openCreate
          }
          sx={{
            borderRadius: 2,
            px: 2.5,
            py: 1.2,
            fontWeight: 850
          }}
        >
          Add Employee
        </PermissionButton>

      </Stack>


      {/* ERROR */}

      {error && (

        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 2
          }}
          action={

            <Button
              size="small"
              onClick={
                loadEmployees
              }
            >
              Retry
            </Button>

          }
        >
          {error}
        </Alert>

      )}


      {/* STATS */}

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

        <EmployeeStatCard
          title="Total Employees"
          value={
            loading
              ? "—"
              : totalElements
          }
          subtitle="Employees in this view"
          icon={
            GroupsOutlinedIcon
          }
          loading={
            loading
          }
        />


        <EmployeeStatCard
          title="Active"
          value={
            loading
              ? "—"
              : statistics.active
          }
          subtitle="Currently active"
          icon={
            CheckCircleOutlineOutlinedIcon
          }
          loading={
            loading
          }
        />


        <EmployeeStatCard
          title="Inactive"
          value={
            loading
              ? "—"
              : statistics.inactive
          }
          subtitle="Currently inactive"
          icon={
            BlockOutlinedIcon
          }
          loading={
            loading
          }
        />


        <EmployeeStatCard
          title="On Leave"
          value={
            loading
              ? "—"
              : statistics.onLeave
          }
          subtitle="Current leave status"
          icon={
            EventBusyOutlinedIcon
          }
          loading={
            loading
          }
        />

      </Box>


      {/* FILTERS */}

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          border:
            "1px solid",
          borderColor:
            "divider",
          borderRadius: 3
        }}
      >

        <Stack
          direction={{
            xs: "column",
            lg: "row"
          }}
          spacing={1.5}
        >

          <Box
            component="form"
            onSubmit={
              handleSearch
            }
            sx={{
              flex: 1,
              minWidth: 220
            }}
          >

            <TextField
              fullWidth
              size="small"
              placeholder="Search employees..."
              value={
                searchInput
              }
              onChange={event =>
                setSearchInput(
                  event.target.value
                )
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment
                      position="start"
                    >
                      <SearchOutlinedIcon
                        fontSize="small"
                      />
                    </InputAdornment>
                  )
                }
              }}
            />

          </Box>


          <Select
            size="small"
            value={
              status
            }
            displayEmpty
            onChange={event => {

              setStatus(
                event.target.value
              );

              setPage(0);

            }}
            sx={{
              minWidth: 145
            }}
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

            <MenuItem value="ON_LEAVE">
              On Leave
            </MenuItem>

          </Select>


          <Select
            size="small"
            value={
              companyId
            }
            displayEmpty
            onChange={event => {

              setCompanyId(
                event.target.value
              );

              setDepartmentId("");

              setDesignationId("");

              setPage(0);

            }}
            sx={{
              minWidth: 180
            }}
          >

            <MenuItem value="">
              All Companies
            </MenuItem>


            {companies.map(
              company => (

                <MenuItem
                  key={
                    company.id
                  }
                  value={
                    company.id
                  }
                >
                  {
                    company.companyName
                  }
                </MenuItem>

              )
            )}

          </Select>


          <Select
            size="small"
            value={
              departmentId
            }
            displayEmpty
            disabled={
              !companyId
            }
            onChange={event => {

              setDepartmentId(
                event.target.value
              );

              setDesignationId("");

              setPage(0);

            }}
            sx={{
              minWidth: 180
            }}
          >

            <MenuItem value="">
              All Departments
            </MenuItem>


            {filteredDepartments.map(
              department => (

                <MenuItem
                  key={
                    department.departmentId
                  }
                  value={
                    department.departmentId
                  }
                >
                  {
                    department.departmentName
                  }
                </MenuItem>

              )
            )}

          </Select>


          <Select
            size="small"
            value={
              designationId
            }
            displayEmpty
            disabled={
              !departmentId
            }
            onChange={event => {

              setDesignationId(
                event.target.value
              );

              setPage(0);

            }}
            sx={{
              minWidth: 180
            }}
          >

            <MenuItem value="">
              All Designations
            </MenuItem>


            {filteredDesignations.map(
              designation => (

                <MenuItem
                  key={
                    designation.designationId
                  }
                  value={
                    designation.designationId
                  }
                >
                  {
                    designation.designationName
                  }
                </MenuItem>

              )
            )}

          </Select>


          <Select
            size="small"
            value={
              sortBy
            }
            onChange={event => {

              setSortBy(
                event.target.value
              );

              setPage(0);

            }}
            sx={{
              minWidth: 140
            }}
          >

            <MenuItem value="id">
              Sort: ID
            </MenuItem>

            <MenuItem value="firstName">
              Sort: Name
            </MenuItem>

            <MenuItem value="joiningDate">
              Sort: Joining
            </MenuItem>

          </Select>


          <Button
            variant="outlined"
            size="small"
            onClick={() => {

              setDirection(
                previous =>
                  previous ===
                  "asc"
                    ? "desc"
                    : "asc"
              );

              setPage(0);

            }}
            sx={{
              minWidth: 90,
              fontWeight: 800
            }}
          >
            {
              direction === "asc"
                ? "A → Z"
                : "Z → A"
            }
          </Button>


          <IconButton
            onClick={
              loadEmployees
            }
            disabled={
              loading
            }
            sx={{
              border:
                "1px solid",
              borderColor:
                "divider",
              borderRadius: 2
            }}
          >

            <RefreshOutlinedIcon />

          </IconButton>


          {(search ||
            status ||
            companyId ||
            departmentId ||
            designationId) && (

            <Button
              size="small"
              onClick={
                resetFilters
              }
              sx={{
                fontWeight: 800
              }}
            >
              Clear
            </Button>

          )}

        </Stack>

      </Paper>


      {/* RESULT */}

      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          mb: 1.5
        }}
      >

        <Typography
          variant="body2"
          color="text.secondary"
        >
          {loading
            ? "Loading employees..."
            : `${totalElements} employee${
                totalElements === 1
                  ? ""
                  : "s"
              } found`}
        </Typography>

      </Stack>


      {/* TABLE */}

      <Box
        sx={{
          position: "relative"
        }}
      >

        {loading && (

          <Box
            sx={{
              position:
                "absolute",
              inset: 0,
              zIndex: 2,
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


        <EmployeeTable
          employees={
            employees
          }
          onView={
            openView
          }
          onEdit={
            openEdit
          }
          onDelete={
            openDelete
          }
          onStatusChange={
            handleStatusChange
          }
          canUpdate={
            can(
              "EMPLOYEE_UPDATE"
            )
          }
          canDelete={
            can(
              "EMPLOYEE_DELETE"
            )
          }
        />

      </Box>


      {/* PAGINATION */}

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
            onChange={
              handlePageChange
            }
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />

        </Stack>

      )}


      {/* FORM */}

      <Dialog
        open={
          formOpen
        }
        onClose={
          closeForm
        }
        maxWidth="md"
        fullWidth
        scroll="paper"
      >

        <EmployeeForm
          open={
            formOpen
          }
          mode={
            formMode
          }
          employee={
            selectedEmployee
          }
          companies={
            companies
          }
          departments={
            departments
          }
          designations={
            designations
          }
          employees={
            employees
          }
          loading={
            formLoading
          }
          error={
            formError
          }
          onClose={
            closeForm
          }
          onSubmit={
            handleSubmit
          }
        />

      </Dialog>


      {/* VIEW */}

      <EmployeeViewDrawer
        open={
          viewOpen
        }
        employee={
          viewEmployee
        }
        onClose={() => {

          setViewOpen(false);

          setViewEmployee(null);

        }}
      />


      {/* DELETE */}

      <DeleteEmployeeDialog
        open={
          deleteOpen
        }
        employee={
          deleteEmployee
        }
        loading={
          deleteLoading
        }
        error={
          deleteError
        }
        onClose={
          closeDelete
        }
        onConfirm={
          handleDelete
        }
      />


      {/* TOAST */}

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
          {toast.message}
        </Alert>

      </Snackbar>

    </Box>
  );
};


export default EmployeeList;
