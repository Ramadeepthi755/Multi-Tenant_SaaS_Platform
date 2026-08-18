import {
  useEffect,
  useState,
} from "react";

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

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import attendanceService from "../../services/attendanceService";

function AttendanceForm() {
  const navigate = useNavigate();

  const { attendanceId } =
    useParams();

  const isEditMode =
    Boolean(attendanceId);

  // =========================================================
  // STATE
  // =========================================================

  const [employees, setEmployees] =
    useState([]);

  const [form, setForm] =
    useState({
      employeeId: "",
      attendanceDate: new Date()
        .toISOString()
        .split("T")[0],
      checkInTime: "",
      checkOutTime: "",
      status: "PRESENT",
      remarks: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [initialLoading, setInitialLoading] =
    useState(isEditMode);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [fieldErrors, setFieldErrors] =
    useState({});

  // =========================================================
  // LOAD EMPLOYEES
  // =========================================================

  useEffect(() => {
    const loadEmployees =
      async () => {
        try {
          const data =
            await attendanceService.getEmployees();

          const list =
            Array.isArray(data)
              ? data
              : data?.content || [];

          setEmployees(list);
        } catch (err) {
          console.error(
            "Failed to load employees:",
            err
          );

          setError(
            err?.response?.data?.message ||
              "Failed to load employees."
          );
        }
      };

    loadEmployees();
  }, []);

  // =========================================================
  // LOAD ATTENDANCE
  // =========================================================

  useEffect(() => {
    if (!isEditMode) {
      setInitialLoading(false);
      return;
    }

    const loadAttendance =
      async () => {
        try {
          setInitialLoading(true);

          const data =
            await attendanceService.getAttendanceById(
              attendanceId
            );

          setForm({
            employeeId:
              data?.employeeId ??
              data?.employee?.employeeId ??
              "",

            attendanceDate:
              data?.attendanceDate ||
              data?.date ||
              data?.workDate ||
              "",

            checkInTime:
              data?.checkInTime ||
              data?.checkIn ||
              "",

            checkOutTime:
              data?.checkOutTime ||
              data?.checkOut ||
              "",

            status:
              data?.status ||
              data?.attendanceStatus ||
              "PRESENT",

            remarks:
              data?.remarks || "",
          });
        } catch (err) {
          console.error(
            "Failed to load attendance:",
            err
          );

          setError(
            err?.response?.data?.message ||
              "Failed to load attendance."
          );
        } finally {
          setInitialLoading(false);
        }
      };

    loadAttendance();
  }, [
    attendanceId,
    isEditMode,
  ]);

  // =========================================================
  // CHANGE
  // =========================================================

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    setFieldErrors(
      (previous) => ({
        ...previous,
        [name]: "",
      })
    );

    setError("");
  };

  // =========================================================
  // VALIDATE
  // =========================================================

  const validate = () => {
    const errors = {};

    if (!form.employeeId) {
      errors.employeeId =
        "Employee is required.";
    }

    if (!form.attendanceDate) {
      errors.attendanceDate =
        "Attendance date is required.";
    }

    if (!form.status) {
      errors.status =
        "Attendance status is required.";
    }

    setFieldErrors(errors);

    return (
      Object.keys(errors).length === 0
    );
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (
    event
  ) => {
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

      const payload = {
        employeeId:
          Number(form.employeeId),

        attendanceDate:
          form.attendanceDate,

        checkInTime:
          form.checkInTime || null,

        checkOutTime:
          form.checkOutTime || null,

        status:
          form.status,

        remarks:
          form.remarks.trim() ||
          null,
      };

      if (isEditMode) {
        await attendanceService.updateAttendance(
          attendanceId,
          payload
        );

        setSuccess(
          "Attendance updated successfully."
        );
      } else {
        await attendanceService.markAttendance(
          payload
        );

        setSuccess(
          "Attendance marked successfully."
        );
      }

      setTimeout(() => {
        navigate("/attendance");
      }, 700);
    } catch (err) {
      console.error(
        "Attendance save error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOADING
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
            navigate(
              "/attendance"
            )
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
              ? "Edit Attendance"
              : "Mark Attendance"}
          </Typography>

          <Typography color="text.secondary">
            {isEditMode
              ? "Update attendance record."
              : "Record employee attendance."}
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
          onClose={() =>
            setError("")
          }
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
          FORM
      ===================================================== */}

      <Card
        sx={{
          maxWidth: 900,
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

              {/* EMPLOYEE */}

              <FormControl
                fullWidth
                required
                error={Boolean(
                  fieldErrors.employeeId
                )}
              >
                <InputLabel>
                  Employee
                </InputLabel>

                <Select
                  name="employeeId"
                  value={
                    form.employeeId
                  }
                  label="Employee"
                  onChange={
                    handleChange
                  }
                  disabled={
                    loading ||
                    isEditMode
                  }
                >
                  <MenuItem value="">
                    Select Employee
                  </MenuItem>

                  {employees.map(
                    (employee) => (
                      <MenuItem
                        key={
                          employee.employeeId
                        }
                        value={
                          employee.employeeId
                        }
                      >
                        {employee.fullName ||
                          `${employee.firstName || ""} ${
                            employee.lastName || ""
                          }`.trim() ||
                          employee.employeeCode ||
                          `Employee #${employee.employeeId}`}
                      </MenuItem>
                    )
                  )}
                </Select>

                <FormHelperText>
                  {
                    fieldErrors.employeeId
                  }
                </FormHelperText>
              </FormControl>

              {/* DATE */}

              <TextField
                fullWidth
                required
                type="date"
                label="Attendance Date"
                name="attendanceDate"
                value={
                  form.attendanceDate
                }
                onChange={
                  handleChange
                }
                InputLabelProps={{
                  shrink: true,
                }}
                error={Boolean(
                  fieldErrors.attendanceDate
                )}
                helperText={
                  fieldErrors.attendanceDate
                }
                disabled={loading}
              />

              {/* CHECK IN */}

              <TextField
                fullWidth
                type="time"
                label="Check In Time"
                name="checkInTime"
                value={
                  form.checkInTime
                }
                onChange={
                  handleChange
                }
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={loading}
              />

              {/* CHECK OUT */}

              <TextField
                fullWidth
                type="time"
                label="Check Out Time"
                name="checkOutTime"
                value={
                  form.checkOutTime
                }
                onChange={
                  handleChange
                }
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={loading}
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
                  value={
                    form.status
                  }
                  label="Status"
                  onChange={
                    handleChange
                  }
                  disabled={loading}
                >
                  <MenuItem value="PRESENT">
                    Present
                  </MenuItem>

                  <MenuItem value="ABSENT">
                    Absent
                  </MenuItem>

                  <MenuItem value="LATE">
                    Late
                  </MenuItem>

                  <MenuItem value="HALF_DAY">
                    Half-day
                  </MenuItem>
                </Select>

                <FormHelperText>
                  {
                    fieldErrors.status
                  }
                </FormHelperText>
              </FormControl>

              {/* REMARKS */}

              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Remarks"
                name="remarks"
                value={
                  form.remarks
                }
                onChange={
                  handleChange
                }
                disabled={loading}
              />

              {/* ACTIONS */}

              <Stack
                direction="row"
                spacing={2}
                pt={1}
              >
                <Button
                  variant="outlined"
                  onClick={() =>
                    navigate(
                      "/attendance"
                    )
                  }
                  disabled={loading}
                >
                  Cancel
                </Button>

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
                    ? "Update Attendance"
                    : "Mark Attendance"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AttendanceForm;