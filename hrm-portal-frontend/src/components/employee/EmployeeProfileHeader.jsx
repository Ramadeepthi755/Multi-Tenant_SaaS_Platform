import {
  Avatar,
  Box,
  Button,
  Chip,
  Stack,
  Typography
} from "@mui/material";

import ArrowBackOutlinedIcon
  from "@mui/icons-material/ArrowBackOutlined";

import EditOutlinedIcon
  from "@mui/icons-material/EditOutlined";

import PowerSettingsNewOutlinedIcon
  from "@mui/icons-material/PowerSettingsNewOutlined";

import FolderOutlinedIcon
  from "@mui/icons-material/FolderOutlined";

import BusinessOutlinedIcon
  from "@mui/icons-material/BusinessOutlined";

import BadgeOutlinedIcon
  from "@mui/icons-material/BadgeOutlined";


import {
  getEmployeeInitials,
  getEmployeeName
} from "../../utils/employeeUtils";

import EmployeeStatusChip
  from "./EmployeeStatusChip";


// ============================================================
// EMPLOYEE PROFILE HEADER
// ============================================================

const EmployeeProfileHeader = ({
  employee,

  onBack,

  onEdit,

  onStatusChange,

  onDocuments,

  canUpdate = false,

  canDocuments = false,

  statusLoading = false
}) => {

  // ==========================================================
  // SAFETY CHECK
  // ==========================================================

  if (!employee) {
    return null;
  }


  // ==========================================================
  // EMPLOYEE BASIC INFORMATION
  // ==========================================================

  const employeeName =
    getEmployeeName(employee);


  const employeeCode =
    employee.employeeCode ||
    employee.employeeNumber ||
    employee.empCode ||
    (
      employee.id
        ? `EMP-${String(
            employee.id
          ).padStart(4, "0")}`
        : "EMP-—"
    );


  const designation =
    employee.designationName ||
    employee.designation?.name ||
    employee.designation ||
    "Employee";


  const department =
    employee.departmentName ||
    employee.department?.name ||
    employee.department ||
    "Department not assigned";


  const companyName =
    employee.companyName ||
    employee.company?.companyName ||
    employee.company?.name ||
    "";


  // ==========================================================
  // STATUS
  // ==========================================================

  const isActive =
    employee.active === true ||
    String(
      employee.status || ""
    ).toUpperCase() === "ACTIVE";


  // ==========================================================
  // PROFILE PHOTO
  // ==========================================================

  const profilePhoto =
    employee.profilePhoto ||
    employee.profilePhotoUrl ||
    employee.photoUrl ||
    employee.imageUrl ||
    undefined;


  // ==========================================================
  // SAFE HANDLERS
  // ==========================================================

  const handleBack = () => {

    if (
      typeof onBack ===
      "function"
    ) {
      onBack();
    }

  };


  const handleEdit = () => {

    if (
      typeof onEdit ===
      "function"
    ) {
      onEdit();
    }

  };


  const handleStatusChange = () => {

    if (
      typeof onStatusChange ===
      "function"
    ) {
      onStatusChange();
    }

  };


  const handleDocuments = () => {

    if (
      typeof onDocuments ===
      "function"
    ) {
      onDocuments();
    }

  };


  return (
    <Box
      sx={{
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        overflow: "hidden",
        boxShadow:
          "0 8px 30px rgba(15, 23, 42, 0.05)"
      }}
    >

      {/* ======================================================
          COVER AREA
      ====================================================== */}

      <Box
        sx={{
          height: {
            xs: 115,
            sm: 135,
            md: 155
          },

          position: "relative",

          background:
            "linear-gradient(135deg, rgba(25,118,210,.18) 0%, rgba(99,102,241,.14) 50%, rgba(14,165,233,.10) 100%)",

          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 85% 20%, rgba(255,255,255,.75), transparent 30%)"
          }
        }}
      />



      {/* ======================================================
          PROFILE CONTENT
      ====================================================== */}

      <Box
        sx={{
          px: {
            xs: 2,
            sm: 3,
            md: 4
          },

          pb: {
            xs: 2.5,
            md: 3.5
          },

          mt: {
            xs: -6,
            md: -6.5
          },

          position: "relative",
          zIndex: 2
        }}
      >

        <Stack
          direction={{
            xs: "column",
            lg: "row"
          }}

          alignItems={{
            xs: "flex-start",
            lg: "flex-end"
          }}

          justifyContent="space-between"

          spacing={2.5}
        >

          {/* ==================================================
              LEFT PROFILE SECTION
          ================================================== */}

          <Stack
            direction={{
              xs: "column",
              sm: "row"
            }}

            spacing={{
              xs: 1.5,
              sm: 2.5
            }}

            alignItems={{
              xs: "flex-start",
              sm: "flex-end"
            }}

            sx={{
              minWidth: 0
            }}
          >

            {/* =================================================
                AVATAR
            ================================================= */}

            <Avatar
              src={
                profilePhoto
              }

              alt={
                employeeName
              }

              imgProps={{
                loading: "lazy"
              }}

              sx={{
                width: {
                  xs: 100,
                  sm: 112,
                  md: 120
                },

                height: {
                  xs: 100,
                  sm: 112,
                  md: 120
                },

                border:
                  "5px solid",

                borderColor:
                  "background.paper",

                bgcolor:
                  "primary.main",

                color:
                  "primary.contrastText",

                fontSize: {
                  xs: 28,
                  sm: 32,
                  md: 36
                },

                fontWeight: 900,

                flexShrink: 0,

                boxShadow:
                  "0 6px 20px rgba(15,23,42,.14)"
              }}
            >

              {
                getEmployeeInitials(
                  employee
                )
              }

            </Avatar>



            {/* =================================================
                EMPLOYEE INFORMATION
            ================================================= */}

            <Box
              sx={{
                minWidth: 0,
                pb: {
                  xs: 0,
                  sm: .5
                }
              }}
            >

              {/* NAME + STATUS */}

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
                useFlexGap
              >

                <Typography
                  variant="h4"
                  fontWeight={900}
                  sx={{
                    letterSpacing:
                      "-.04em",

                    fontSize: {
                      xs: "1.7rem",
                      sm: "2rem",
                      md: "2.25rem"
                    },

                    lineHeight: 1.15
                  }}
                >
                  {
                    employeeName ||
                    "Employee"
                  }
                </Typography>


                <EmployeeStatusChip
                  status={
                    employee.status
                  }

                  active={
                    employee.active
                  }
                />

              </Stack>



              {/* DESIGNATION */}

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  mt: .75
                }}
              >

                <BadgeOutlinedIcon
                  sx={{
                    fontSize: 19,
                    color:
                      "text.secondary"
                  }}
                />


                <Typography
                  variant="body1"
                  color="text.secondary"
                  fontWeight={650}
                >
                  {
                    designation
                  }
                </Typography>

              </Stack>



              {/* EMPLOYEE META */}

              <Stack
                direction="row"
                spacing={1}
                mt={1.25}
                flexWrap="wrap"
                useFlexGap
              >

                {/* EMPLOYEE CODE */}

                <Chip
                  size="small"
                  icon={
                    <BadgeOutlinedIcon />
                  }

                  label={
                    employeeCode
                  }

                  sx={{
                    fontWeight: 800,

                    "& .MuiChip-icon": {
                      fontSize: 17
                    }
                  }}
                />


                {/* DEPARTMENT */}

                {department && (

                  <Chip
                    size="small"
                    variant="outlined"

                    icon={
                      <BusinessOutlinedIcon />
                    }

                    label={
                      department
                    }

                    sx={{
                      fontWeight: 750,

                      "& .MuiChip-icon": {
                        fontSize: 17
                      }
                    }}
                  />

                )}


                {/* COMPANY */}

                {companyName && (

                  <Chip
                    size="small"
                    variant="outlined"

                    label={
                      companyName
                    }

                    sx={{
                      fontWeight: 750
                    }}
                  />

                )}

              </Stack>

            </Box>

          </Stack>



          {/* ==================================================
              ACTION BUTTONS
          ================================================== */}

          <Stack
            direction={{
              xs: "column",
              sm: "row"
            }}

            spacing={1}

            sx={{
              width: {
                xs: "100%",
                lg: "auto"
              },

              flexWrap: {
                sm: "wrap"
              },

              justifyContent: {
                sm: "flex-end"
              }
            }}
          >

            {/* =================================================
                BACK
            ================================================= */}

            <Button
              variant="outlined"

              startIcon={
                <ArrowBackOutlinedIcon />
              }

              onClick={
                handleBack
              }

              sx={{
                minHeight: 42,
                px: 2,
                fontWeight: 800,
                borderRadius: 2
              }}
            >
              Back
            </Button>



            {/* =================================================
                DOCUMENTS
            ================================================= */}

            {canDocuments &&
              typeof onDocuments ===
                "function" && (

              <Button
                variant="outlined"

                startIcon={
                  <FolderOutlinedIcon />
                }

                onClick={
                  handleDocuments
                }

                sx={{
                  minHeight: 42,
                  px: 2,
                  fontWeight: 800,
                  borderRadius: 2
                }}
              >
                Documents
              </Button>

            )}



            {/* =================================================
                EDIT
            ================================================= */}

            {canUpdate && (

              <Button
                variant="outlined"

                startIcon={
                  <EditOutlinedIcon />
                }

                onClick={
                  handleEdit
                }

                disabled={
                  statusLoading
                }

                sx={{
                  minHeight: 42,
                  px: 2,
                  fontWeight: 800,
                  borderRadius: 2
                }}
              >
                Edit
              </Button>

            )}



            {/* =================================================
                ACTIVATE / DEACTIVATE
            ================================================= */}

            {canUpdate && (

              <Button
                variant={
                  isActive
                    ? "outlined"
                    : "contained"
                }

                color={
                  isActive
                    ? "warning"
                    : "success"
                }

                startIcon={
                  <PowerSettingsNewOutlinedIcon />
                }

                onClick={
                  handleStatusChange
                }

                disabled={
                  statusLoading
                }

                sx={{
                  minHeight: 42,
                  px: 2,
                  fontWeight: 850,
                  borderRadius: 2
                }}
              >

                {
                  statusLoading
                    ? "Updating..."
                    : isActive
                      ? "Deactivate"
                      : "Activate"
                }

              </Button>

            )}

          </Stack>

        </Stack>



        {/* ======================================================
            QUICK INFORMATION STRIP
        ====================================================== */}

        <Box
          sx={{
            mt: 3,

            pt: 2.5,

            borderTop:
              "1px solid",

            borderColor:
              "divider",

            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)"
            },

            gap: {
              xs: 2,
              md: 0
            }
          }}
        >

          {/* =================================================
              EMPLOYEE ID
          ================================================= */}

          <Box
            sx={{
              px: {
                xs: 0,
                md: 2
              },

              borderRight: {
                md:
                  "1px solid"
              },

              borderColor:
                "divider"
            }}
          >

            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={750}
            >
              EMPLOYEE ID
            </Typography>


            <Typography
              variant="body2"
              fontWeight={850}
              sx={{
                mt: .35
              }}
            >
              {
                employeeCode
              }
            </Typography>

          </Box>



          {/* =================================================
              DEPARTMENT
          ================================================= */}

          <Box
            sx={{
              px: {
                xs: 0,
                md: 2
              },

              borderRight: {
                md:
                  "1px solid"
              },

              borderColor:
                "divider"
            }}
          >

            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={750}
            >
              DEPARTMENT
            </Typography>


            <Typography
              variant="body2"
              fontWeight={850}
              sx={{
                mt: .35
              }}
            >
              {
                department
              }
            </Typography>

          </Box>



          {/* =================================================
              DESIGNATION
          ================================================= */}

          <Box
            sx={{
              px: {
                xs: 0,
                md: 2
              },

              borderRight: {
                md:
                  "1px solid"
              },

              borderColor:
                "divider"
            }}
          >

            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={750}
            >
              DESIGNATION
            </Typography>


            <Typography
              variant="body2"
              fontWeight={850}
              sx={{
                mt: .35
              }}
            >
              {
                designation
              }
            </Typography>

          </Box>



          {/* =================================================
              STATUS
          ================================================= */}

          <Box
            sx={{
              px: {
                xs: 0,
                md: 2
              }
            }}
          >

            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={750}
            >
              ACCOUNT STATUS
            </Typography>


            <Typography
              variant="body2"
              fontWeight={850}
              sx={{
                mt: .35,

                color:
                  isActive
                    ? "success.main"
                    : "text.secondary"
              }}
            >
              {
                isActive
                  ? "Active"
                  : "Inactive"
              }
            </Typography>

          </Box>

        </Box>

      </Box>

    </Box>
  );
};


export default EmployeeProfileHeader;