import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";

import { useNavigate, useParams } from "react-router-dom";

import employeeService from "../../services/employeeService";

import PermissionGate from "../../components/auth/PermissionGate";

import {
  PERMISSIONS,
} from "../../config/permissions";


function EmployeeView() {
  const navigate = useNavigate();

  const { employeeId } = useParams();

  const [employee, setEmployee] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =====================================================
  // LOAD EMPLOYEE
  // =====================================================

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await employeeService.getEmployeeById(
            employeeId
          );

        setEmployee(data);

      } catch (err) {
        console.error(
          "Failed to load employee:",
          err
        );

        setError(
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load employee."
        );

      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      loadEmployee();
    }
  }, [employeeId]);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>

        <Button
          startIcon={
            <ArrowBackRoundedIcon />
          }
          onClick={() =>
            navigate("/employees")
          }
        >
          Back to Employees
        </Button>
      </Box>
    );
  }


  // =====================================================
  // NOT FOUND
  // =====================================================

  if (!employee) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
        >
          Employee not found.
        </Alert>

        <Button
          startIcon={
            <ArrowBackRoundedIcon />
          }
          onClick={() =>
            navigate("/employees")
          }
        >
          Back to Employees
        </Button>
      </Box>
    );
  }


  // =====================================================
  // NORMALIZE DATA
  // =====================================================

  const employeeName =
    employee.fullName ||
    employee.employeeName ||
    employee.name ||
    "-";

  const employeeCode =
    employee.employeeCode ||
    employee.code ||
    "-";

  const email =
    employee.email ||
    "-";

  const phone =
    employee.phone ||
    employee.phoneNumber ||
    "-";

  const department =
    employee.departmentName ||
    employee.department?.departmentName ||
    employee.department?.name ||
    "-";

  const designation =
    employee.designationName ||
    employee.designation?.designationName ||
    employee.designation?.name ||
    "-";

  const company =
    employee.companyName ||
    employee.company?.companyName ||
    employee.company?.name ||
    "-";

  const gender =
    employee.gender ||
    "-";

  const dateOfBirth =
    employee.dateOfBirth ||
    "-";

  const joiningDate =
    employee.joiningDate ||
    employee.dateOfJoining ||
    "-";

  const address =
    employee.address ||
    "-";

  const status =
    employee.status ||
    (typeof employee.active === "boolean"
      ? employee.active
        ? "ACTIVE"
        : "INACTIVE"
      : "UNKNOWN");

  const normalizedStatus =
    String(status).toUpperCase();


  const isActive =
    normalizedStatus === "ACTIVE";


  // =====================================================
  // PAGE
  // =====================================================

  return (
    <Box sx={{ p: 3 }}>

      {/* ================================================= */}
      {/* HEADER                                            */}
      {/* ================================================= */}

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        spacing={2}
        mb={3}
      >

        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
        >

          <Button
            startIcon={
              <ArrowBackRoundedIcon />
            }
            onClick={() =>
              navigate("/employees")
            }
          >
            Back
          </Button>

          <Box>

            <Typography
              variant="h4"
              fontWeight={800}
            >
              Employee Details
            </Typography>

            <Typography
              color="text.secondary"
            >
              View employee information.
            </Typography>

          </Box>

        </Stack>


        {/* ================================================= */}
        {/* EDIT BUTTON                                       */}
        {/* ================================================= */}

        <PermissionGate
          permission={
            PERMISSIONS.EMPLOYEE_UPDATE
          }
        >
          <Button
            variant="contained"
            startIcon={
              <EditRoundedIcon />
            }
            onClick={() =>
              navigate(
                `/employees/edit/${employeeId}`
              )
            }
          >
            Edit Employee
          </Button>
        </PermissionGate>

      </Stack>


      {/* ================================================= */}
      {/* EMPLOYEE HEADER CARD                               */}
      {/* ================================================= */}

      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
          mb: 3,
        }}
      >

        <CardContent sx={{ p: 3 }}>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            alignItems={{
              xs: "flex-start",
              sm: "center",
            }}
          >

            {/* PROFILE ICON */}

            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor:
                  "rgba(37, 99, 235, 0.08)",
                color: "primary.main",
              }}
            >
              <PersonRoundedIcon
                sx={{
                  fontSize: 34,
                }}
              />
            </Box>


            {/* NAME */}

            <Box>

              <Typography
                variant="h5"
                fontWeight={800}
              >
                {employeeName}
              </Typography>

              <Typography
                color="text.secondary"
              >
                {employeeCode}
              </Typography>

            </Box>


            {/* STATUS */}

            <Box
              sx={{
                ml: {
                  sm: "auto",
                },
              }}
            >
              <Chip
                label={
                  normalizedStatus
                }
                color={
                  isActive
                    ? "success"
                    : "default"
                }
              />
            </Box>

          </Stack>

        </CardContent>

      </Card>


      {/* ================================================= */}
      {/* BASIC INFORMATION                                 */}
      {/* ================================================= */}

      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
          mb: 3,
        }}
      >

        <CardContent sx={{ p: 3 }}>

          <Typography
            variant="h6"
            fontWeight={800}
            mb={2}
          >
            Basic Information
          </Typography>

          <Divider sx={{ mb: 3 }} />


          <Grid
            container
            spacing={3}
          >

            {/* EMPLOYEE ID */}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
            >

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Employee ID
              </Typography>

              <Typography
                fontWeight={600}
                mt={0.5}
              >
                {employee.employeeId ??
                  employee.id ??
                  "-"}
              </Typography>

            </Grid>


            {/* EMPLOYEE CODE */}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
            >

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Employee Code
              </Typography>

              <Typography
                fontWeight={600}
                mt={0.5}
              >
                {employeeCode}
              </Typography>

            </Grid>


            {/* GENDER */}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
            >

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Gender
              </Typography>

              <Typography
                fontWeight={600}
                mt={0.5}
              >
                {gender}
              </Typography>

            </Grid>


            {/* DATE OF BIRTH */}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
            >

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Date of Birth
              </Typography>

              <Typography
                fontWeight={600}
                mt={0.5}
              >
                {dateOfBirth}
              </Typography>

            </Grid>


            {/* EMAIL */}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
            >

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Email
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                mt={0.5}
              >

                <EmailRoundedIcon
                  fontSize="small"
                  color="action"
                />

                <Typography
                  fontWeight={600}
                >
                  {email}
                </Typography>

              </Stack>

            </Grid>


            {/* PHONE */}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
            >

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Phone
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                mt={0.5}
              >

                <PhoneRoundedIcon
                  fontSize="small"
                  color="action"
                />

                <Typography
                  fontWeight={600}
                >
                  {phone}
                </Typography>

              </Stack>

            </Grid>

          </Grid>

        </CardContent>

      </Card>


      {/* ================================================= */}
      {/* ORGANIZATION INFORMATION                           */}
      {/* ================================================= */}

      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
          mb: 3,
        }}
      >

        <CardContent sx={{ p: 3 }}>

          <Typography
            variant="h6"
            fontWeight={800}
            mb={2}
          >
            Organization Information
          </Typography>

          <Divider sx={{ mb: 3 }} />


          <Grid
            container
            spacing={3}
          >

            {/* COMPANY */}

            <Grid
              item
              xs={12}
              sm={6}
            >

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Company
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                mt={0.5}
              >

                <BusinessRoundedIcon
                  fontSize="small"
                  color="action"
                />

                <Typography
                  fontWeight={600}
                >
                  {company}
                </Typography>

              </Stack>

            </Grid>


            {/* DEPARTMENT */}

            <Grid
              item
              xs={12}
              sm={6}
            >

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Department
              </Typography>

              <Typography
                fontWeight={600}
                mt={0.5}
              >
                {department}
              </Typography>

            </Grid>


            {/* DESIGNATION */}

            <Grid
              item
              xs={12}
              sm={6}
            >

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Designation
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                mt={0.5}
              >

                <WorkRoundedIcon
                  fontSize="small"
                  color="action"
                />

                <Typography
                  fontWeight={600}
                >
                  {designation}
                </Typography>

              </Stack>

            </Grid>


            {/* JOINING DATE */}

            <Grid
              item
              xs={12}
              sm={6}
            >

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Joining Date
              </Typography>

              <Typography
                fontWeight={600}
                mt={0.5}
              >
                {joiningDate}
              </Typography>

            </Grid>


            {/* STATUS */}

            <Grid
              item
              xs={12}
              sm={6}
            >

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Employment Status
              </Typography>

              <Box mt={0.5}>

                <Chip
                  label={
                    normalizedStatus
                  }
                  size="small"
                  color={
                    isActive
                      ? "success"
                      : "default"
                  }
                />

              </Box>

            </Grid>

          </Grid>

        </CardContent>

      </Card>


      {/* ================================================= */}
      {/* ADDRESS                                           */}
      {/* ================================================= */}

      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
        }}
      >

        <CardContent sx={{ p: 3 }}>

          <Typography
            variant="h6"
            fontWeight={800}
            mb={2}
          >
            Address
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Typography
            fontWeight={600}
          >
            {address}
          </Typography>

        </CardContent>

      </Card>

    </Box>
  );
}

export default EmployeeView;