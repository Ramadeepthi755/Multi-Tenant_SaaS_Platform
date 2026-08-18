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

import leaveService from "../../services/leaveService";

function LeaveForm() {
  const navigate = useNavigate();

  const { leaveId } = useParams();

  const isEdit = Boolean(leaveId);

  const [loading, setLoading] = useState(false);

  const [pageLoading, setPageLoading] =
    useState(isEdit);

  const [employees, setEmployees] =
    useState([]);

  const [leaveTypes, setLeaveTypes] =
    useState([]);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [form, setForm] = useState({
    employeeId: "",
    leaveTypeId: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  // =========================================================
  // NORMALIZE LIST
  // =========================================================

  const normalizeList = (response) => {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.content)) {
      return response.content;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    return [];
  };

  // =========================================================
  // LOAD EMPLOYEES
  // =========================================================

  const loadEmployees = async () => {
    try {
      const data =
        await leaveService.getEmployees();

      setEmployees(
        normalizeList(data)
      );
    } catch (err) {
      console.error(
        "Failed to load employees:",
        err
      );
    }
  };

  // =========================================================
  // LOAD LEAVE TYPES
  // =========================================================

  const loadLeaveTypes = async () => {
    try {
      const data =
        await leaveService.getLeaveTypes();

      setLeaveTypes(
        normalizeList(data)
      );
    } catch (err) {
      console.error(
        "Failed to load leave types:",
        err
      );
    }
  };

  // =========================================================
  // LOAD LEAVE FOR EDIT
  // =========================================================

  const loadLeave = async () => {
    if (!leaveId) {
      return;
    }

    try {
      setPageLoading(true);
      setError("");

      const data =
        await leaveService.getLeaveById(
          leaveId
        );

      setForm({
        employeeId:
          data?.employeeId ??
          data?.employee?.employeeId ??
          "",
        leaveTypeId:
          data?.leaveTypeId ??
          data?.leaveType?.leaveTypeId ??
          "",
        startDate:
          data?.startDate ||
          data?.fromDate ||
          "",
        endDate:
          data?.endDate ||
          data?.toDate ||
          "",
        reason:
          data?.reason ||
          "",
      });
    } catch (err) {
      console.error(
        "Failed to load leave:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load leave."
      );
    } finally {
      setPageLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadEmployees();
    loadLeaveTypes();
    loadLeave();
  }, [leaveId]);

  // =========================================================
  // CHANGE
  // =========================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =========================================================
  // VALIDATION
  // =========================================================

  const validate = () => {
    if (!form.employeeId) {
      return "Please select an employee.";
    }

    if (!form.leaveTypeId) {
      return "Please select a leave type.";
    }

    if (!form.startDate) {
      return "Please select start date.";
    }

    if (!form.endDate) {
      return "Please select end date.";
    }

    if (
      form.endDate <
      form.startDate
    ) {
      return "End date cannot be before start date.";
    }

    if (!form.reason.trim()) {
      return "Please enter a reason.";
    }

    return "";
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError =
      validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const payload = {
        employeeId: Number(
          form.employeeId
        ),

        leaveTypeId: Number(
          form.leaveTypeId
        ),

        startDate:
          form.startDate,

        endDate:
          form.endDate,

        reason:
          form.reason.trim(),
      };

      console.log(
        "LEAVE PAYLOAD:",
        payload
      );

      if (isEdit) {
        await leaveService.updateLeave(
          leaveId,
          payload
        );
      } else {
        await leaveService.applyLeave(
          payload
        );
      }

      setSuccess(
        isEdit
          ? "Leave updated successfully."
          : "Leave applied successfully."
      );

      setTimeout(() => {
        navigate("/leave");
      }, 700);
    } catch (err) {
      console.error(
        "Leave save error:",
        err
      );

      const backendMessage =
        err?.response?.data?.message;

      const backendErrors =
        err?.response?.data?.errors;

      if (
        backendErrors &&
        typeof backendErrors ===
          "object"
      ) {
        const firstError =
          Object.values(
            backendErrors
          )[0];

        setError(
          Array.isArray(firstError)
            ? firstError[0]
            : String(firstError)
        );
      } else {
        setError(
          backendMessage ||
            "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (pageLoading) {
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
            navigate("/leave")
          }
        >
          Back
        </Button>

        <Box>
          <Typography
            variant="h4"
            fontWeight={800}
          >
            {isEdit
              ? "Edit Leave"
              : "Apply Leave"}
          </Typography>

          <Typography color="text.secondary">
            {isEdit
              ? "Update leave request."
              : "Create a new leave request."}
          </Typography>
        </Box>
      </Stack>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() =>
            setError("")
          }
        >
          {error}
        </Alert>
      )}

      {/* =====================================================
          SUCCESS
      ===================================================== */}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
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
        <CardContent
          sx={{
            p: {
              xs: 2,
              md: 3,
            },
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            <Stack spacing={3}>

              {/* EMPLOYEE */}

              <FormControl fullWidth>
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
                        {employee.firstName ||
                          employee.fullName ||
                          employee.name ||
                          "Employee"}{" "}
                        {employee.lastName ||
                          ""}
                        {employee.employeeCode
                          ? ` (${employee.employeeCode})`
                          : ""}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>

              {/* LEAVE TYPE */}

              <FormControl fullWidth>
                <InputLabel>
                  Leave Type
                </InputLabel>

                <Select
                  name="leaveTypeId"
                  value={
                    form.leaveTypeId
                  }
                  label="Leave Type"
                  onChange={
                    handleChange
                  }
                >
                  <MenuItem value="">
                    Select Leave Type
                  </MenuItem>

                  {leaveTypes.map(
                    (type) => (
                      <MenuItem
                        key={
                          type.leaveTypeId ??
                          type.id
                        }
                        value={
                          type.leaveTypeId ??
                          type.id
                        }
                      >
                        {type.leaveTypeName ||
                          type.name ||
                          type.typeName ||
                          "Leave Type"}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>

              {/* START DATE */}

              <TextField
                fullWidth
                label="Start Date"
                name="startDate"
                type="date"
                value={
                  form.startDate
                }
                onChange={
                  handleChange
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />

              {/* END DATE */}

              <TextField
                fullWidth
                label="End Date"
                name="endDate"
                type="date"
                value={
                  form.endDate
                }
                onChange={
                  handleChange
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />

              {/* REASON */}

              <TextField
                fullWidth
                label="Reason"
                name="reason"
                value={
                  form.reason
                }
                onChange={
                  handleChange
                }
                multiline
                minRows={4}
                placeholder="Enter reason for leave"
              />

              {/* BUTTONS */}

              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
              >
                <Button
                  variant="outlined"
                  onClick={() =>
                    navigate(
                      "/leave"
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
                    : isEdit
                    ? "Update Leave"
                    : "Apply Leave"}
                </Button>
              </Stack>

            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LeaveForm;