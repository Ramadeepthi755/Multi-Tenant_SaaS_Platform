import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  MenuItem,
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

import BusinessOutlinedIcon
  from "@mui/icons-material/BusinessOutlined";

import EditOutlinedIcon
  from "@mui/icons-material/EditOutlined";

import DeleteOutlineOutlinedIcon
  from "@mui/icons-material/DeleteOutlineOutlined";


import departmentService
  from "../../services/departmentService";

import companyService
  from "../../services/companyService";

import usePermissions
  from "../../hooks/usePermissions";

import PermissionButton
  from "../../components/permissions/PermissionButton";


const DepartmentList = () => {

  const {
    can
  } = usePermissions();


  /*
  |--------------------------------------------------------------------------
  | DATA
  |--------------------------------------------------------------------------
  */

  const [
    departments,
    setDepartments
  ] = useState([]);


  const [
    companies,
    setCompanies
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    companyLoading,
    setCompanyLoading
  ] = useState(false);


  const [
    error,
    setError
  ] = useState("");


  /*
  |--------------------------------------------------------------------------
  | FILTERS
  |--------------------------------------------------------------------------
  */

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


  /*
  |--------------------------------------------------------------------------
  | FORM
  |--------------------------------------------------------------------------
  */

  const [
    formOpen,
    setFormOpen
  ] = useState(false);


  const [
    formMode,
    setFormMode
  ] = useState("create");


  const [
    selectedDepartment,
    setSelectedDepartment
  ] = useState(null);


  const [
    formLoading,
    setFormLoading
  ] = useState(false);


  const [
    formError,
    setFormError
  ] = useState("");


  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */

  const [
    deleteOpen,
    setDeleteOpen
  ] = useState(false);


  const [
    deleteDepartment,
    setDeleteDepartment
  ] = useState(null);


  const [
    deleteLoading,
    setDeleteLoading
  ] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | TOAST
  |--------------------------------------------------------------------------
  */

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
  | LOAD COMPANIES
  |--------------------------------------------------------------------------
  */

  const loadCompanies =
    useCallback(
      async () => {

        setCompanyLoading(true);

        try {

          const response =
            await companyService
              .getCompanies({
                page: 0,
                size: 100,
                sortBy: "id",
                sortDirection: "asc"
              });


          setCompanies(
            Array.isArray(
              response?.content
            )
              ? response.content
              : []
          );

        } catch (requestError) {

          console.error(
            "Company loading failed:",
            requestError
          );

          setCompanies([]);

        } finally {

          setCompanyLoading(false);

        }

      },
      []
    );


  /*
  |--------------------------------------------------------------------------
  | LOAD DEPARTMENTS
  |--------------------------------------------------------------------------
  */

  const loadDepartments =
    useCallback(
      async () => {

        setLoading(true);
        setError("");


        try {

          const response =
            await departmentService
              .getDepartments();


          setDepartments(
            Array.isArray(response)
              ? response
              : []
          );

        } catch (requestError) {

          console.error(
            "Department loading failed:",
            requestError
          );


          setDepartments([]);


          setError(
            requestError
              ?.response
              ?.data
              ?.message ||
            "Unable to load departments."
          );

        } finally {

          setLoading(false);

        }

      },
      []
    );


  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    loadDepartments();

    loadCompanies();

  }, [
    loadDepartments,
    loadCompanies
  ]);


  /*
  |--------------------------------------------------------------------------
  | FILTERED DATA
  |--------------------------------------------------------------------------
  */

  const filteredDepartments =
    useMemo(() => {

      const normalizedSearch =
        search
          .trim()
          .toLowerCase();


      return departments.filter(
        department => {

          const matchesSearch =
            !normalizedSearch ||
            String(
              department.departmentName || ""
            )
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            String(
              department.departmentCode || ""
            )
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            String(
              department.companyName || ""
            )
              .toLowerCase()
              .includes(
                normalizedSearch
              );


          const matchesStatus =
            !status ||
            String(
              department.status || ""
            ).toUpperCase() ===
              status;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

    }, [
      departments,
      search,
      status
    ]);


  /*
  |--------------------------------------------------------------------------
  | STATISTICS
  |--------------------------------------------------------------------------
  */

  const statistics =
    useMemo(() => {

      const active =
        departments.filter(
          department =>
            String(
              department.status
            ).toUpperCase() ===
            "ACTIVE"
        ).length;


      const inactive =
        departments.filter(
          department =>
            String(
              department.status
            ).toUpperCase() ===
            "INACTIVE"
        ).length;


      return {
        total: departments.length,
        active,
        inactive
      };

    }, [
      departments
    ]);


  /*
  |--------------------------------------------------------------------------
  | SEARCH
  |--------------------------------------------------------------------------
  */

  const handleSearch = (
    event
  ) => {

    event.preventDefault();

    setSearch(
      searchInput.trim()
    );

  };


  /*
  |--------------------------------------------------------------------------
  | RESET
  |--------------------------------------------------------------------------
  */

  const resetFilters = () => {

    setSearchInput("");

    setSearch("");

    setStatus("");

    setCompanyId("");

  };


  /*
  |--------------------------------------------------------------------------
  | OPEN CREATE
  |--------------------------------------------------------------------------
  */

  const openCreate = () => {

    setFormMode("create");

    setSelectedDepartment(null);

    setFormError("");

    setFormOpen(true);

  };


  /*
  |--------------------------------------------------------------------------
  | OPEN EDIT
  |--------------------------------------------------------------------------
  */

  const openEdit = (
    department
  ) => {

    setFormMode("edit");

    setSelectedDepartment(
      department
    );

    setFormError("");

    setFormOpen(true);

  };


  /*
  |--------------------------------------------------------------------------
  | CLOSE FORM
  |--------------------------------------------------------------------------
  */

  const closeForm = () => {

    if (formLoading) {
      return;
    }

    setFormOpen(false);

    setSelectedDepartment(null);

    setFormError("");

  };


  /*
  |--------------------------------------------------------------------------
  | SAVE
  |--------------------------------------------------------------------------
  */

  const handleSave = async (
    event
  ) => {

    event.preventDefault();

    const formData =
      new FormData(event.currentTarget);


    const payload = {

      departmentCode:
        String(
          formData.get(
            "departmentCode"
          ) || ""
        ).trim(),

      departmentName:
        String(
          formData.get(
            "departmentName"
          ) || ""
        ).trim(),

      description:
        String(
          formData.get(
            "description"
          ) || ""
        ).trim(),

      status:
        String(
          formData.get(
            "status"
          ) || "ACTIVE"
        ).toUpperCase(),

      companyId:
        Number(
          formData.get(
            "companyId"
          )
        )

    };


    if (
      !payload.departmentCode ||
      !payload.departmentName ||
      !payload.companyId
    ) {

      setFormError(
        "Department code, name and company are required."
      );

      return;
    }


    setFormLoading(true);

    setFormError("");


    try {

      if (
        formMode === "create"
      ) {

        await departmentService
          .createDepartment(
            payload
          );

        setToast({
          open: true,
          message:
            "Department created successfully.",
          severity:
            "success"
        });

      } else {

        await departmentService
          .updateDepartment(
            selectedDepartment.departmentId,
            payload
          );

        setToast({
          open: true,
          message:
            "Department updated successfully.",
          severity:
            "success"
        });

      }


      closeForm();

      await loadDepartments();

    } catch (requestError) {

      console.error(
        "Department save failed:",
        requestError
      );


      setFormError(
        requestError
          ?.response
          ?.data
          ?.message ||
        "Unable to save department."
      );

    } finally {

      setFormLoading(false);

    }

  };


  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */

  const openDelete = (
    department
  ) => {

    setDeleteDepartment(
      department
    );

    setDeleteOpen(true);

  };


  const closeDelete = () => {

    if (deleteLoading) {
      return;
    }

    setDeleteOpen(false);

    setDeleteDepartment(null);

  };


  const handleDelete = async () => {

    if (
      !deleteDepartment?.departmentId
    ) {
      return;
    }


    setDeleteLoading(true);


    try {

      await departmentService
        .deleteDepartment(
          deleteDepartment.departmentId
        );


      setToast({
        open: true,
        message:
          "Department deleted successfully.",
        severity:
          "success"
      });


      closeDelete();

      await loadDepartments();

    } catch (requestError) {

      console.error(
        "Department delete failed:",
        requestError
      );


      setToast({
        open: true,
        message:
          requestError
            ?.response
            ?.data
            ?.message ||
          "Unable to delete department.",
        severity:
          "error"
      });

    } finally {

      setDeleteLoading(false);

    }

  };


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (

    <Box
      sx={{
        pb: 4
      }}
    >

      {/* HEADER */}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          mb: 3
        }}
      >

        <Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700
            }}
          >
            Departments
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5
            }}
          >
            Manage organizational departments and structure.
          </Typography>

        </Box>


        {can("DEPARTMENT_CREATE") && (

          <PermissionButton
            permission="DEPARTMENT_CREATE"
            variant="contained"
            startIcon={
              <AddOutlinedIcon />
            }
            onClick={openCreate}
          >
            Add Department
          </PermissionButton>

        )}

      </Stack>


      {/* STATISTICS */}

      <Stack
        direction={{
          xs: "column",
          sm: "row"
        }}
        spacing={2}
        sx={{
          mb: 3
        }}
      >

        <Paper
          sx={{
            p: 2.5,
            flex: 1
          }}
        >

          <Typography
            color="text.secondary"
            variant="body2"
          >
            Total Departments
          </Typography>

          <Typography
            variant="h4"
            sx={{
              mt: 1,
              fontWeight: 700
            }}
          >
            {statistics.total}
          </Typography>

        </Paper>


        <Paper
          sx={{
            p: 2.5,
            flex: 1
          }}
        >

          <Typography
            color="text.secondary"
            variant="body2"
          >
            Active
          </Typography>

          <Typography
            variant="h4"
            sx={{
              mt: 1,
              fontWeight: 700
            }}
          >
            {statistics.active}
          </Typography>

        </Paper>


        <Paper
          sx={{
            p: 2.5,
            flex: 1
          }}
        >

          <Typography
            color="text.secondary"
            variant="body2"
          >
            Inactive
          </Typography>

          <Typography
            variant="h4"
            sx={{
              mt: 1,
              fontWeight: 700
            }}
          >
            {statistics.inactive}
          </Typography>

        </Paper>

      </Stack>


      {/* FILTER BAR */}

      <Paper
        sx={{
          p: 2,
          mb: 2
        }}
      >

        <Stack
          direction={{
            xs: "column",
            md: "row"
          }}
          spacing={1.5}
        >

          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: "flex",
              flex: 1
            }}
          >

            <TextField
              fullWidth
              size="small"
              placeholder="Search departments..."
              value={searchInput}
              onChange={
                event =>
                  setSearchInput(
                    event.target.value
                  )
              }
              InputProps={{
                startAdornment:
                  <SearchOutlinedIcon
                    sx={{
                      mr: 1,
                      color:
                        "text.secondary"
                    }}
                  />
              }}
            />

          </Box>


          <Select
            size="small"
            value={status}
            displayEmpty
            onChange={
              event =>
                setStatus(
                  event.target.value
                )
            }
            sx={{
              minWidth: 150
            }}
          >

            <MenuItem value="">
              All Statuses
            </MenuItem>

            <MenuItem value="ACTIVE">
              Active
            </MenuItem>

            <MenuItem value="INACTIVE">
              Inactive
            </MenuItem>

          </Select>


          <Select
            size="small"
            value={companyId}
            displayEmpty
            onChange={
              event =>
                setCompanyId(
                  event.target.value
                )
            }
            sx={{
              minWidth: 190
            }}
          >

            <MenuItem value="">
              All Companies
            </MenuItem>

            {companies.map(
              company => (

                <MenuItem
                  key={company.id}
                  value={company.id}
                >
                  {company.companyName}
                </MenuItem>

              )
            )}

          </Select>


          <Button
            variant="outlined"
            onClick={resetFilters}
          >
            Reset
          </Button>


          <IconButton
            onClick={loadDepartments}
            disabled={loading}
          >
            <RefreshOutlinedIcon />
          </IconButton>

        </Stack>

      </Paper>


      {/* ERROR */}

      {error && (

        <Alert
          severity="error"
          sx={{
            mb: 2
          }}
        >
          {error}
        </Alert>

      )}


      {/* TABLE */}

      <Paper
        sx={{
          overflow: "hidden"
        }}
      >

        {loading ? (

          <Stack
            alignItems="center"
            justifyContent="center"
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
              Loading departments...
            </Typography>

          </Stack>

        ) : (

          <Box
            sx={{
              overflowX: "auto"
            }}
          >

            <Box
              component="table"
              sx={{
                width: "100%",
                borderCollapse:
                  "collapse"
              }}
            >

              <Box
                component="thead"
                sx={{
                  backgroundColor:
                    "grey.50"
                }}
              >

                <Box
                  component="tr"
                >

                  <Box
                    component="th"
                    sx={{
                      p: 2,
                      textAlign: "left"
                    }}
                  >
                    Department
                  </Box>

                  <Box
                    component="th"
                    sx={{
                      p: 2,
                      textAlign: "left"
                    }}
                  >
                    Code
                  </Box>

                  <Box
                    component="th"
                    sx={{
                      p: 2,
                      textAlign: "left"
                    }}
                  >
                    Company
                  </Box>

                  <Box
                    component="th"
                    sx={{
                      p: 2,
                      textAlign: "left"
                    }}
                  >
                    Description
                  </Box>

                  <Box
                    component="th"
                    sx={{
                      p: 2,
                      textAlign: "left"
                    }}
                  >
                    Status
                  </Box>

                  <Box
                    component="th"
                    sx={{
                      p: 2,
                      textAlign: "right"
                    }}
                  >
                    Actions
                  </Box>

                </Box>

              </Box>


              <Box
                component="tbody"
              >

                {filteredDepartments.length === 0 ? (

                  <Box
                    component="tr"
                  >

                    <Box
                      component="td"
                      colSpan={6}
                      sx={{
                        p: 6,
                        textAlign: "center"
                      }}
                    >

                      <BusinessOutlinedIcon
                        sx={{
                          fontSize: 42,
                          color:
                            "text.secondary"
                        }}
                      />

                      <Typography
                        sx={{
                          mt: 1
                        }}
                      >
                        No departments found.
                      </Typography>

                    </Box>

                  </Box>

                ) : (

                  filteredDepartments.map(
                    department => (

                      <Box
                        component="tr"
                        key={
                          department.departmentId
                        }
                        sx={{
                          borderTop:
                            "1px solid",
                          borderColor:
                            "divider"
                        }}
                      >

                        <Box
                          component="td"
                          sx={{
                            p: 2
                          }}
                        >

                          <Typography
                            fontWeight={600}
                          >
                            {
                              department.departmentName
                            }
                          </Typography>

                        </Box>


                        <Box
                          component="td"
                          sx={{
                            p: 2
                          }}
                        >
                          {
                            department.departmentCode
                          }
                        </Box>


                        <Box
                          component="td"
                          sx={{
                            p: 2
                          }}
                        >
                          {
                            department.companyName ||
                            "—"
                          }
                        </Box>


                        <Box
                          component="td"
                          sx={{
                            p: 2,
                            maxWidth: 280
                          }}
                        >
                          {
                            department.description ||
                            "—"
                          }
                        </Box>


                        <Box
                          component="td"
                          sx={{
                            p: 2
                          }}
                        >

                          <Box
                            component="span"
                            sx={{
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 2,
                              fontSize: 12,
                              fontWeight: 600,
                              backgroundColor:
                                String(
                                  department.status
                                ).toUpperCase() ===
                                "ACTIVE"
                                  ? "success.light"
                                  : "error.light",
                              color:
                                String(
                                  department.status
                                ).toUpperCase() ===
                                "ACTIVE"
                                  ? "success.dark"
                                  : "error.dark"
                            }}
                          >
                            {
                              department.status
                            }
                          </Box>

                        </Box>


                        <Box
                          component="td"
                          sx={{
                            p: 2,
                            textAlign: "right"
                          }}
                        >

                          {can(
                            "DEPARTMENT_UPDATE"
                          ) && (

                            <IconButton
                              size="small"
                              onClick={() =>
                                openEdit(
                                  department
                                )
                              }
                            >
                              <EditOutlinedIcon
                                fontSize="small"
                              />
                            </IconButton>

                          )}


                          {can(
                            "DEPARTMENT_DELETE"
                          ) && (

                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                openDelete(
                                  department
                                )
                              }
                            >
                              <DeleteOutlineOutlinedIcon
                                fontSize="small"
                              />
                            </IconButton>

                          )}

                        </Box>

                      </Box>

                    )
                  )

                )}

              </Box>

            </Box>

          </Box>

        )}

      </Paper>


      {/* CREATE / EDIT DIALOG */}

      <Dialog
        open={formOpen}
        onClose={closeForm}
        maxWidth="sm"
        fullWidth
      >

        <Box
          component="form"
          onSubmit={handleSave}
          sx={{
            p: 3
          }}
        >

          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              mb: 2
            }}
          >
            {
              formMode === "create"
                ? "Add Department"
                : "Edit Department"
            }
          </Typography>


          {formError && (

            <Alert
              severity="error"
              sx={{
                mb: 2
              }}
            >
              {formError}
            </Alert>

          )}


          <Stack spacing={2}>

            <TextField
              name="departmentCode"
              label="Department Code"
              fullWidth
              required
              defaultValue={
                selectedDepartment
                  ?.departmentCode ||
                ""
              }
            />


            <TextField
              name="departmentName"
              label="Department Name"
              fullWidth
              required
              defaultValue={
                selectedDepartment
                  ?.departmentName ||
                ""
              }
            />


            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              minRows={3}
              defaultValue={
                selectedDepartment
                  ?.description ||
                ""
              }
            />


            <TextField
              name="companyId"
              label="Company"
              select
              fullWidth
              required
              defaultValue={
                selectedDepartment
                  ? companies.find(
                      company =>
                        company.companyName ===
                        selectedDepartment.companyName
                    )?.id || ""
                  : ""
              }
            >

              {companyLoading ? (

                <MenuItem disabled>
                  Loading companies...
                </MenuItem>

              ) : (

                companies.map(
                  company => (

                    <MenuItem
                      key={company.id}
                      value={company.id}
                    >
                      {
                        company.companyName
                      }
                    </MenuItem>

                  )
                )

              )}

            </TextField>


            <TextField
              name="status"
              label="Status"
              select
              fullWidth
              defaultValue={
                selectedDepartment
                  ?.status ||
                "ACTIVE"
              }
            >

              <MenuItem value="ACTIVE">
                Active
              </MenuItem>

              <MenuItem value="INACTIVE">
                Inactive
              </MenuItem>

            </TextField>


            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={1}
            >

              <Button
                onClick={closeForm}
                disabled={formLoading}
              >
                Cancel
              </Button>


              <Button
                type="submit"
                variant="contained"
                disabled={formLoading}
              >

                {formLoading
                  ? "Saving..."
                  : "Save Department"}

              </Button>

            </Stack>

          </Stack>

        </Box>

      </Dialog>


      {/* DELETE DIALOG */}

      <Dialog
        open={deleteOpen}
        onClose={closeDelete}
        maxWidth="xs"
        fullWidth
      >

        <Box
          sx={{
            p: 3
          }}
        >

          <Typography
            variant="h6"
            fontWeight={700}
          >
            Delete Department
          </Typography>


          <Typography
            color="text.secondary"
            sx={{
              mt: 1
            }}
          >
            Are you sure you want to delete{" "}
            <strong>
              {
                deleteDepartment
                  ?.departmentName
              }
            </strong>
            ?
          </Typography>


          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={1}
            sx={{
              mt: 3
            }}
          >

            <Button
              onClick={closeDelete}
              disabled={deleteLoading}
            >
              Cancel
            </Button>


            <Button
              color="error"
              variant="contained"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {
                deleteLoading
                  ? "Deleting..."
                  : "Delete"
              }
            </Button>

          </Stack>

        </Box>

      </Dialog>


      {/* TOAST */}

      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
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
          severity={toast.severity}
          variant="filled"
          onClose={() =>
            setToast(
              previous => ({
                ...previous,
                open: false
              })
            )
          }
        >
          {toast.message}
        </Alert>

      </Snackbar>

    </Box>

  );

};


export default DepartmentList;