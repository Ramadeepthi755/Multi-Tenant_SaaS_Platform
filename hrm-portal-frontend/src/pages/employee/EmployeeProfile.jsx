import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Link,
  Snackbar,
  Stack,
  Typography
} from "@mui/material";

import ArrowBackOutlinedIcon
  from "@mui/icons-material/ArrowBackOutlined";

import NavigateNextOutlinedIcon
  from "@mui/icons-material/NavigateNextOutlined";

import RefreshOutlinedIcon
  from "@mui/icons-material/RefreshOutlined";


import {
  useCallback,
  useEffect,
  useState
} from "react";


import {
  Link as RouterLink,
  useNavigate,
  useParams
} from "react-router-dom";


import EmployeeProfileHeader
  from "../../components/employee/EmployeeProfileHeader";

import EmployeeInfoCard
  from "../../components/employee/EmployeeInfoCard";

import EmployeeTimeline
  from "../../components/employee/EmployeeTimeline";


import employeeService
  from "../../services/employeeService";


import usePermissions
  from "../../hooks/usePermissions";


import {
  getEmployeeErrorMessage
} from "../../utils/employeeUtils";


// ============================================================
// EMPLOYEE PROFILE
// ============================================================

const EmployeeProfile = () => {

  const {
    employeeId
  } = useParams();


  const navigate =
    useNavigate();


  const {
    can
  } = usePermissions();


  // ==========================================================
  // STATE
  // ==========================================================

  const [
    employee,
    setEmployee
  ] = useState(null);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState("");


  const [
    statusLoading,
    setStatusLoading
  ] = useState(false);


  const [
    snackbar,
    setSnackbar
  ] = useState({
    open: false,
    message: "",
    severity: "success"
  });


  // ==========================================================
  // LOAD EMPLOYEE
  // ==========================================================

  const loadEmployee =
    useCallback(
      async () => {

        if (!employeeId) {

          setError(
            "Employee ID is missing."
          );

          setLoading(false);

          return;
        }


        setLoading(true);

        setError("");


        try {

          const response =
            await employeeService
              .getEmployeeById(
                employeeId
              );


          setEmployee(
            response
          );

        } catch (requestError) {

          console.error(
            "Employee profile loading failed:",
            requestError
          );


          setEmployee(null);


          setError(
            getEmployeeErrorMessage(
              requestError,
              "Unable to load employee profile."
            )
          );

        } finally {

          setLoading(false);

        }

      },
      [
        employeeId
      ]
    );


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {

    loadEmployee();

  }, [
    loadEmployee
  ]);


  // ==========================================================
  // STATUS CHANGE
  // ==========================================================

  const handleStatusChange =
    async () => {

      if (!employee?.id) {
        return;
      }


      const isCurrentlyActive =
        employee.active === true ||
        String(
          employee.status || ""
        ).toUpperCase() === "ACTIVE";


      const nextStatus =
        isCurrentlyActive
          ? "INACTIVE"
          : "ACTIVE";


      setStatusLoading(true);


      try {

        const response =
          await employeeService
            .updateStatus(
              employee.id,
              nextStatus
            );


        /*
         * Some backends return the updated
         * employee and some return a message.
         *
         * So we support both safely.
         */

        if (
          response &&
          typeof response ===
            "object" &&
          !Array.isArray(response) &&
          (
            response.id ||
            response.employeeId
          )
        ) {

          setEmployee(
            response
          );

        } else {

          await loadEmployee();

        }


        setSnackbar({
          open: true,
          message:
            nextStatus === "ACTIVE"
              ? "Employee activated successfully."
              : "Employee deactivated successfully.",
          severity:
            "success"
        });

      } catch (requestError) {

        console.error(
          "Employee status update failed:",
          requestError
        );


        setSnackbar({
          open: true,
          message:
            getEmployeeErrorMessage(
              requestError,
              "Unable to update employee status."
            ),
          severity:
            "error"
        });

      } finally {

        setStatusLoading(false);

      }

    };


  // ==========================================================
  // EDIT EMPLOYEE
  // ==========================================================

  const handleEdit = () => {

    if (!employee?.id) {
      return;
    }


    navigate(
      `/employees/${employee.id}/edit`
    );

  };


  // ==========================================================
  // DOCUMENTS
  // ==========================================================

  const handleDocuments = () => {

    if (!employee?.id) {
      return;
    }


    navigate(
      `/employees/${employee.id}/documents`
    );

  };


  // ==========================================================
  // BACK
  // ==========================================================

  const handleBack = () => {

    navigate(
      "/employees"
    );

  };


  // ==========================================================
  // CLOSE SNACKBAR
  // ==========================================================

  const handleSnackbarClose = () => {

    setSnackbar(
      previous => ({
        ...previous,
        open: false
      })
    );

  };


  // ==========================================================
  // LOADING SCREEN
  // ==========================================================

  if (loading) {

    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >

        <Stack
          spacing={2}
          alignItems="center"
        >

          <CircularProgress
            size={42}
          />


          <Typography
            color="text.secondary"
            fontWeight={650}
          >
            Loading employee profile...
          </Typography>

        </Stack>

      </Box>
    );

  }


  // ==========================================================
  // ERROR SCREEN
  // ==========================================================

  if (error || !employee) {

    return (
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          py: 5
        }}
      >

        <Alert
          severity="error"
          sx={{
            borderRadius: 3,
            mb: 2
          }}
        >
          {
            error ||
            "Employee profile could not be found."
          }
        </Alert>


        <Stack
          direction="row"
          spacing={1.5}
        >

          <Button
            variant="contained"
            startIcon={
              <ArrowBackOutlinedIcon />
            }
            onClick={
              handleBack
            }
            sx={{
              fontWeight: 800
            }}
          >
            Back to Employees
          </Button>


          <Button
            variant="outlined"
            startIcon={
              <RefreshOutlinedIcon />
            }
            onClick={
              loadEmployee
            }
            sx={{
              fontWeight: 800
            }}
          >
            Retry
          </Button>

        </Stack>

      </Box>
    );

  }


  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <Box
      sx={{
        pb: 5
      }}
    >

      {/* ======================================================
          BREADCRUMBS
      ====================================================== */}

      <Breadcrumbs
        separator={
          <NavigateNextOutlinedIcon
            fontSize="small"
          />
        }

        sx={{
          mb: 2
        }}
      >

        <Link
          component={
            RouterLink
          }
          to="/dashboard"
          underline="hover"
          color="text.secondary"
          fontWeight={650}
        >
          Dashboard
        </Link>


        <Link
          component={
            RouterLink
          }
          to="/employees"
          underline="hover"
          color="text.secondary"
          fontWeight={650}
        >
          Employees
        </Link>


        <Typography
          color="text.primary"
          fontWeight={750}
        >
          Profile
        </Typography>

      </Breadcrumbs>



      {/* ======================================================
          MOBILE BACK BUTTON
      ====================================================== */}

      <Button
        variant="text"
        startIcon={
          <ArrowBackOutlinedIcon />
        }
        onClick={
          handleBack
        }
        sx={{
          mb: 1.5,
          px: 0,
          fontWeight: 800,
          display: {
            xs: "inline-flex",
            md: "none"
          }
        }}
      >
        Back to Employees
      </Button>



      {/* ======================================================
          PROFILE HEADER
      ====================================================== */}

      <EmployeeProfileHeader
        employee={
          employee
        }

        onBack={
          handleBack
        }

        onEdit={
          handleEdit
        }

        onStatusChange={
          handleStatusChange
        }

        onDocuments={
          handleDocuments
        }

        canUpdate={
          can(
            "EMPLOYEE_UPDATE"
          )
        }

        canDocuments={
          can(
            "DOCUMENT_DOWNLOAD"
          ) ||
          can(
            "DOCUMENT_UPLOAD"
          ) ||
          can(
            "DOCUMENT_DELETE"
          )
        }

        statusLoading={
          statusLoading
        }
      />



      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <Box
        sx={{
          mt: 2
        }}
      >

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 1.6fr) minmax(300px, .8fr)"
            },

            gap: 2
          }}
        >

          {/* ==================================================
              LEFT COLUMN
          ================================================== */}

          <Stack
            spacing={2}
          >

            {/* =================================================
                PERSONAL / CONTACT / EMPLOYMENT INFORMATION
            ================================================= */}

            <EmployeeInfoCard
              employee={
                employee
              }
            />



            {/* =================================================
                EMPLOYEE TIMELINE
            ================================================= */}

            <EmployeeTimeline
              employee={
                employee
              }
            />

          </Stack>



          {/* ==================================================
              RIGHT COLUMN
          ================================================== */}

          <Stack
            spacing={2}
          >

            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <Box
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper"
              }}
            >

              <Typography
                variant="h6"
                fontWeight={900}
                sx={{
                  mb: 2
                }}
              >
                Quick Actions
              </Typography>


              <Stack
                spacing={1.25}
              >

                {/* DOCUMENTS */}

                {(can(
                  "DOCUMENT_DOWNLOAD"
                ) ||
                  can(
                    "DOCUMENT_UPLOAD"
                  ) ||
                  can(
                    "DOCUMENT_DELETE"
                  )) && (

                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={
                      <RefreshOutlinedIcon
                        sx={{
                          transform:
                            "rotate(90deg)"
                        }}
                      />
                    }
                    onClick={
                      handleDocuments
                    }
                    sx={{
                      justifyContent:
                        "flex-start",
                      minHeight: 46,
                      fontWeight: 800,
                      borderRadius: 2
                    }}
                  >
                    Manage Documents
                  </Button>

                )}



                {/* EDIT */}

                {can(
                  "EMPLOYEE_UPDATE"
                ) && (

                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={
                      <RefreshOutlinedIcon />
                    }
                    onClick={
                      handleEdit
                    }
                    sx={{
                      justifyContent:
                        "flex-start",
                      minHeight: 46,
                      fontWeight: 800,
                      borderRadius: 2
                    }}
                  >
                    Edit Employee
                  </Button>

                )}



                {/* REFRESH */}

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={
                    <RefreshOutlinedIcon />
                  }
                  onClick={
                    loadEmployee
                  }
                  disabled={
                    loading
                  }
                  sx={{
                    justifyContent:
                      "flex-start",
                    minHeight: 46,
                    fontWeight: 800,
                    borderRadius: 2
                  }}
                >
                  Refresh Profile
                </Button>

              </Stack>

            </Box>



            {/* =================================================
                ACCOUNT INFORMATION
            ================================================= */}

            <Box
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper"
              }}
            >

              <Typography
                variant="h6"
                fontWeight={900}
                sx={{
                  mb: 2
                }}
              >
                Account Information
              </Typography>


              <Stack
                spacing={1.75}
              >

                {/* STATUS */}

                <Box>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={750}
                  >
                    STATUS
                  </Typography>


                  <Typography
                    variant="body2"
                    fontWeight={800}
                    sx={{
                      mt: .35,
                      color:
                        employee.active === true ||
                        String(
                          employee.status || ""
                        ).toUpperCase() ===
                          "ACTIVE"
                          ? "success.main"
                          : "text.secondary"
                    }}
                  >
                    {
                      employee.active === true ||
                      String(
                        employee.status || ""
                      ).toUpperCase() ===
                        "ACTIVE"
                        ? "Active"
                        : (
                          employee.status ||
                          "Inactive"
                        )
                    }
                  </Typography>

                </Box>



                {/* EMAIL */}

                <Box>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={750}
                  >
                    EMAIL
                  </Typography>


                  <Typography
                    variant="body2"
                    fontWeight={750}
                    sx={{
                      mt: .35,
                      wordBreak:
                        "break-word"
                    }}
                  >
                    {
                      employee.email ||
                      employee.personalEmail ||
                      "Not available"
                    }
                  </Typography>

                </Box>



                {/* PHONE */}

                <Box>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={750}
                  >
                    PHONE
                  </Typography>


                  <Typography
                    variant="body2"
                    fontWeight={750}
                    sx={{
                      mt: .35
                    }}
                  >
                    {
                      employee.phone ||
                      employee.mobile ||
                      employee.mobileNumber ||
                      "Not available"
                    }
                  </Typography>

                </Box>



                {/* JOINING DATE */}

                <Box>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={750}
                  >
                    JOINING DATE
                  </Typography>


                  <Typography
                    variant="body2"
                    fontWeight={750}
                    sx={{
                      mt: .35
                    }}
                  >
                    {
                      employee.joiningDate ||
                      employee.dateOfJoining ||
                      "Not available"
                    }
                  </Typography>

                </Box>

              </Stack>

            </Box>

          </Stack>

        </Box>

      </Box>



      {/* ======================================================
          SNACKBAR
      ====================================================== */}

      <Snackbar
        open={
          snackbar.open
        }

        autoHideDuration={
          4000
        }

        onClose={
          handleSnackbarClose
        }

        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
      >

        <Alert
          severity={
            snackbar.severity
          }

          variant="filled"

          onClose={
            handleSnackbarClose
          }

          sx={{
            width: "100%"
          }}
        >
          {
            snackbar.message
          }
        </Alert>

      </Snackbar>

    </Box>
  );
};


export default EmployeeProfile;