import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

import { useNavigate, useParams } from "react-router-dom";

import employeeService from "../../services/employeeService";

import PermissionGate from "../../components/auth/PermissionGate";

import { PERMISSIONS } from "../../config/permissions";

function EmployeeForm() {
  const navigate = useNavigate();
  const { employeeId } = useParams();

  const isEditMode = Boolean(employeeId);

  // =========================================================
  // TODAY
  // =========================================================

  const today = new Date().toISOString().split("T")[0];

  // =========================================================
  // FORM STATE
  // =========================================================

  const [form, setForm] = useState({
    employeeCode: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    joiningDate: today,
    salary: "",
    status: "ACTIVE",
    resignationDate: "",
    departmentId: "",
    designationId: "",
  });

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] =
    useState(isEditMode);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [fieldErrors, setFieldErrors] = useState({});

  // =========================================================
  // LOAD DEPARTMENTS
  // =========================================================

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const data =
          await employeeService.getDepartments();

        const departmentList = Array.isArray(data)
          ? data
          : data?.content || [];

        setDepartments(departmentList);
      } catch (err) {
        console.error(
          "Failed to load departments:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Failed to load departments."
        );
      }
    };

    loadDepartments();
  }, []);

  // =========================================================
  // LOAD EMPLOYEE FOR EDIT
  // =========================================================

  useEffect(() => {
    if (!isEditMode) {
      setInitialLoading(false);
      return;
    }

    const loadEmployee = async () => {
      try {
        setInitialLoading(true);
        setError("");

        const employee =
          await employeeService.getEmployeeById(
            employeeId
          );

        const departmentId =
          employee?.department?.departmentId ??
          employee?.departmentId ??
          "";

        const designationId =
          employee?.designation?.designationId ??
          employee?.designationId ??
          "";

        setForm({
          employeeCode:
            employee?.employeeCode || "",

          firstName:
            employee?.firstName || "",

          lastName:
            employee?.lastName || "",

          email:
            employee?.email || "",

          phone:
            employee?.phone || "",

          gender:
            employee?.gender || "",

          dateOfBirth:
            employee?.dateOfBirth || "",

          joiningDate:
            employee?.joiningDate || "",

          salary:
            employee?.salary ?? "",

          status:
            employee?.status || "ACTIVE",

          resignationDate:
            employee?.resignationDate || "",

          departmentId,

          designationId,
        });

        // Load designations
        if (departmentId) {
          const data =
            await employeeService
              .getDesignationsByDepartment(
                departmentId
              );

          setDesignations(
            Array.isArray(data)
              ? data
              : data?.content || []
          );
        }
      } catch (err) {
        console.error(
          "Failed to load employee:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Failed to load employee."
        );
      } finally {
        setInitialLoading(false);
      }
    };

    loadEmployee();
  }, [employeeId, isEditMode]);

  // =========================================================
  // NORMAL INPUT CHANGE
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFieldErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setError("");
  };

  // =========================================================
  // DEPARTMENT CHANGE
  // =========================================================

  const handleDepartmentChange = async (event) => {
    const departmentId = event.target.value;

    setForm((previous) => ({
      ...previous,
      departmentId,
      designationId: "",
    }));

    setDesignations([]);

    setFieldErrors((previous) => ({
      ...previous,
      departmentId: "",
      designationId: "",
    }));

    setError("");

    if (!departmentId) {
      return;
    }

    try {
      const data =
        await employeeService
          .getDesignationsByDepartment(
            departmentId
          );

      setDesignations(
        Array.isArray(data)
          ? data
          : data?.content || []
      );
    } catch (err) {
      console.error(
        "Failed to load designations:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load designations."
      );
    }
  };

  // =========================================================
  // VALIDATION
  // =========================================================

  const validate = () => {
    const errors = {};

    if (!form.employeeCode.trim()) {
      errors.employeeCode =
        "Employee code is required.";
    }

    if (!form.firstName.trim()) {
      errors.firstName =
        "First name is required.";
    }

    if (!form.email.trim()) {
      errors.email =
        "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      errors.email =
        "Enter a valid email.";
    }

    if (!form.joiningDate) {
      errors.joiningDate =
        "Joining date is required.";
    }

    if (!form.status) {
      errors.status =
        "Employee status is required.";
    }

    if (!form.departmentId) {
      errors.departmentId =
        "Department is required.";
    }

    if (!form.designationId) {
      errors.designationId =
        "Designation is required.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      setError(
        "Please correct the highlighted fields."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // =====================================================
      // COMMON PAYLOAD
      // =====================================================

      const payload = {
        employeeCode:
          form.employeeCode.trim(),

        firstName:
          form.firstName.trim(),

        lastName:
          form.lastName.trim() || null,

        email:
          form.email.trim(),

        phone:
          form.phone.trim() || null,

        gender:
          form.gender || null,

        dateOfBirth:
          form.dateOfBirth || null,

        joiningDate:
          form.joiningDate,

        salary:
          form.salary === ""
            ? null
            : Number(form.salary),

        status:
          form.status,

        departmentId:
          Number(form.departmentId),

        designationId:
          Number(form.designationId),
      };

      // =====================================================
      // RESIGNATION DATE
      // =====================================================
      //
      // IMPORTANT:
      // EmployeeRequestDTO currently does not contain
      // resignationDate.
      //
      // Therefore do NOT send it to backend here.
      //
      // =====================================================

      console.log(
        isEditMode
          ? "UPDATE EMPLOYEE PAYLOAD:"
          : "CREATE EMPLOYEE PAYLOAD:",
        payload
      );

      // =====================================================
      // CREATE
      // =====================================================

      if (!isEditMode) {
        await employeeService.createEmployee(
          payload
        );
      }

      // =====================================================
      // UPDATE
      // =====================================================

      else {
        await employeeService.updateEmployee(
          employeeId,
          payload
        );
      }

      // =====================================================
      // SUCCESS
      // =====================================================

      setSuccess(
        isEditMode
          ? "Employee updated successfully."
          : "Employee created successfully."
      );

      setTimeout(() => {
        navigate("/employees");
      }, 700);
    } catch (err) {
      console.error(
        "Employee save error:",
        err
      );

      const backendMessage =
        err?.response?.data?.message;

      const validationErrors =
        err?.response?.data?.errors;

      if (
        validationErrors &&
        typeof validationErrors === "object"
      ) {
        setFieldErrors(
          validationErrors
        );
      }

      setError(
        backendMessage ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOADING
  // =========================================================

  if (initialLoading) {
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

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <Box
      sx={{
        p: {
          xs: 2,
          md: 3,
        },
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

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
        mb={3}
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
            {isEditMode
              ? "Edit Employee"
              : "Add Employee"}
          </Typography>

          <Typography
            color="text.secondary"
          >
            {isEditMode
              ? "Update employee information."
              : "Create a new employee."}
          </Typography>
        </Box>
      </Stack>

      {/* =====================================================
          ALERTS
      ===================================================== */}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
        >
          {success}
        </Alert>
      )}

      {/* =====================================================
          FORM CARD
      ===================================================== */}

      <Card
        sx={{
          maxWidth: 1000,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            <Stack spacing={3}>
              {/* =================================================
                  BASIC INFORMATION
              ================================================= */}

              <Typography
                variant="h6"
                fontWeight={800}
              >
                Basic Information
              </Typography>

              {/* EMPLOYEE CODE */}

              <TextField
                fullWidth
                required
                label="Employee Code"
                name="employeeCode"
                value={form.employeeCode}
                onChange={handleChange}
                error={Boolean(
                  fieldErrors.employeeCode
                )}
                helperText={
                  fieldErrors.employeeCode
                }
                disabled={loading}
              />

              {/* FIRST NAME */}

              <TextField
                fullWidth
                required
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                error={Boolean(
                  fieldErrors.firstName
                )}
                helperText={
                  fieldErrors.firstName
                }
                disabled={loading}
              />

              {/* LAST NAME */}

              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                disabled={loading}
              />

              {/* EMAIL */}

              <TextField
                fullWidth
                required
                type="email"
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                error={Boolean(
                  fieldErrors.email
                )}
                helperText={
                  fieldErrors.email
                }
                disabled={loading}
              />

              {/* PHONE */}

              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                disabled={loading}
              />

              {/* GENDER */}

              <FormControl fullWidth>
                <InputLabel>
                  Gender
                </InputLabel>

                <Select
                  name="gender"
                  value={form.gender}
                  label="Gender"
                  onChange={handleChange}
                  disabled={loading}
                >
                  <MenuItem value="">
                    Select Gender
                  </MenuItem>

                  <MenuItem value="MALE">
                    Male
                  </MenuItem>

                  <MenuItem value="FEMALE">
                    Female
                  </MenuItem>

                  <MenuItem value="OTHER">
                    Other
                  </MenuItem>
                </Select>
              </FormControl>

              {/* DATE OF BIRTH */}

              <TextField
                fullWidth
                type="date"
                label="Date of Birth"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={loading}
              />

              {/* =================================================
                  EMPLOYMENT INFORMATION
              ================================================= */}

              <Typography
                variant="h6"
                fontWeight={800}
                sx={{ pt: 1 }}
              >
                Employment Information
              </Typography>

              {/* JOINING DATE */}

              <TextField
                fullWidth
                required
                type="date"
                label="Joining Date"
                name="joiningDate"
                value={form.joiningDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                error={Boolean(
                  fieldErrors.joiningDate
                )}
                helperText={
                  fieldErrors.joiningDate
                }
                disabled={loading}
              />

              {/* SALARY */}

              <TextField
                fullWidth
                type="number"
                label="Salary"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                disabled={loading}
                inputProps={{
                  min: 0,
                }}
              />

              {/* STATUS */}

              <FormControl
                fullWidth
                required
                error={Boolean(
                  fieldErrors.status
                )}
              >
                <InputLabel>
                  Status
                </InputLabel>

                <Select
                  name="status"
                  value={form.status}
                  label="Status"
                  onChange={handleChange}
                  disabled={loading}
                >
                  <MenuItem value="ACTIVE">
                    Active
                  </MenuItem>

                  <MenuItem value="INACTIVE">
                    Inactive
                  </MenuItem>

                  <MenuItem value="RESIGNED">
                    Resigned
                  </MenuItem>

                  <MenuItem value="TERMINATED">
                    Terminated
                  </MenuItem>
                </Select>

                <FormHelperText>
                  {fieldErrors.status}
                </FormHelperText>
              </FormControl>

              {/* =================================================
                  ORGANIZATION
              ================================================= */}

              <Typography
                variant="h6"
                fontWeight={800}
                sx={{ pt: 1 }}
              >
                Organization
              </Typography>

              {/* DEPARTMENT */}

              <FormControl
                fullWidth
                required
                error={Boolean(
                  fieldErrors.departmentId
                )}
              >
                <InputLabel>
                  Department
                </InputLabel>

                <Select
                  value={form.departmentId}
                  label="Department"
                  onChange={
                    handleDepartmentChange
                  }
                  disabled={loading}
                >
                  <MenuItem value="">
                    Select Department
                  </MenuItem>

                  {departments.map(
                    (department) => (
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

                <FormHelperText>
                  {
                    fieldErrors.departmentId
                  }
                </FormHelperText>
              </FormControl>

              {/* DESIGNATION */}

              <FormControl
                fullWidth
                required
                error={Boolean(
                  fieldErrors.designationId
                )}
              >
                <InputLabel>
                  Designation
                </InputLabel>

                <Select
                  value={form.designationId}
                  label="Designation"
                  onChange={(event) => {
                    setForm((previous) => ({
                      ...previous,
                      designationId:
                        event.target.value,
                    }));

                    setFieldErrors(
                      (previous) => ({
                        ...previous,
                        designationId: "",
                      })
                    );

                    setError("");
                  }}
                  disabled={
                    loading ||
                    !form.departmentId
                  }
                >
                  <MenuItem value="">
                    Select Designation
                  </MenuItem>

                  {designations.map(
                    (designation) => (
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

                <FormHelperText>
                  {
                    fieldErrors.designationId
                  }
                </FormHelperText>
              </FormControl>

              {/* =================================================
                  RESIGNATION DATE
              ================================================= */}

              {isEditMode &&
                form.status === "RESIGNED" && (
                  <TextField
                    fullWidth
                    type="date"
                    label="Resignation Date"
                    name="resignationDate"
                    value={
                      form.resignationDate
                    }
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={loading}
                  />
                )}

              {/* =================================================
                  ACTIONS
              ================================================= */}

              <Stack
                direction="row"
                spacing={2}
                pt={2}
              >
                <Button
                  variant="outlined"
                  onClick={() =>
                    navigate("/employees")
                  }
                  disabled={loading}
                >
                  Cancel
                </Button>

                <PermissionGate
                  permission={
                    isEditMode
                      ? PERMISSIONS.EMPLOYEE_UPDATE
                      : PERMISSIONS.EMPLOYEE_CREATE
                  }
                >
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={
                      loading ? (
                        <CircularProgress
                          size={18}
                          color="inherit"
                        />
                      ) : (
                        <SaveRoundedIcon />
                      )
                    }
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : isEditMode
                      ? "Update Employee"
                      : "Create Employee"}
                  </Button>
                </PermissionGate>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default EmployeeForm;