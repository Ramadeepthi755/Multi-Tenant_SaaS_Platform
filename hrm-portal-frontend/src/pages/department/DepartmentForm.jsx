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
  Grid,
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

import departmentService from "../../services/departmentService";

import { useAuth } from "../../context/AuthContext";

function DepartmentForm() {
  const navigate = useNavigate();

  const { departmentId } = useParams();

  const {
    user,
    role,
  } = useAuth();

  const isEdit =
    Boolean(departmentId);

  const [form, setForm] = useState({
    departmentName: "",
    departmentCode: "",
    companyId: "",
    status: "ACTIVE",
  });

  const [errors, setErrors] =
    useState({});

  const [loading, setLoading] =
    useState(false);

  const [
    initialLoading,
    setInitialLoading,
  ] = useState(isEdit);

  const [error, setError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | CURRENT COMPANY
  |--------------------------------------------------------------------------
  */

  const currentCompanyId =
    user?.companyId ??
    user?.company?.companyId ??
    user?.company?.id ??
    "";

  /*
  |--------------------------------------------------------------------------
  | LOAD FOR EDIT
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    const loadDepartment =
      async () => {
        try {
          setInitialLoading(true);
          setError("");

          const data =
            await departmentService.getDepartmentById(
              departmentId
            );

          setForm({
            departmentName:
              data?.departmentName || "",

            departmentCode:
              data?.departmentCode || "",

            companyId:
              data?.companyId ??
              data?.company?.companyId ??
              data?.company?.id ??
              "",

            status:
              data?.status || "ACTIVE",
          });
        } catch (err) {
          console.error(
            "Failed to load department:",
            err
          );

          setError(
            err?.response?.data?.message ||
              "Failed to load department."
          );
        } finally {
          setInitialLoading(false);
        }
      };

    loadDepartment();
  }, [
    isEdit,
    departmentId,
  ]);

  /*
  |--------------------------------------------------------------------------
  | CHANGE
  |--------------------------------------------------------------------------
  */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setError("");
  };

  /*
  |--------------------------------------------------------------------------
  | VALIDATION
  |--------------------------------------------------------------------------
  */

  const validate = () => {
    const validationErrors = {};

    if (
      !form.departmentName.trim()
    ) {
      validationErrors.departmentName =
        "Department name is required.";
    }

    if (
      !form.departmentCode.trim()
    ) {
      validationErrors.departmentCode =
        "Department code is required.";
    }

    if (
      role === "SUPER_ADMIN" &&
      !form.companyId
    ) {
      validationErrors.companyId =
        "Company ID is required.";
    }

    if (
      form.status !== "ACTIVE" &&
      form.status !== "INACTIVE"
    ) {
      validationErrors.status =
        "Invalid department status.";
    }

    setErrors(
      validationErrors
    );

    return (
      Object.keys(
        validationErrors
      ).length === 0
    );
  };

  /*
  |--------------------------------------------------------------------------
  | SUBMIT
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      /*
       * Backend company isolation:
       *
       * SUPER_ADMIN:
       * use selected company.
       *
       * Other users:
       * use logged-in company.
       */

      const companyId =
        role === "SUPER_ADMIN"
          ? Number(form.companyId)
          : currentCompanyId
          ? Number(currentCompanyId)
          : null;

      if (!companyId) {
        setError(
          "Company information is missing for this user."
        );

        setLoading(false);

        return;
      }

      /*
       * IMPORTANT
       *
       * status MUST be "ACTIVE"/"INACTIVE".
       * Never send HTTP status 400 here.
       */

      const payload = {
        departmentName:
          form.departmentName.trim(),

        departmentCode:
          form.departmentCode.trim(),

        companyId,

        status:
          form.status || "ACTIVE",
      };

      console.log(
        "DEPARTMENT REQUEST:",
        payload
      );

      if (isEdit) {
        await departmentService.updateDepartment(
          departmentId,
          payload
        );
      } else {
        await departmentService.createDepartment(
          payload
        );
      }

      /*
       * After success go back to list.
       */

      navigate(
        "/departments",
        {
          replace: true,
        }
      );
    } catch (err) {
      console.error(
        "Department save error:",
        err
      );

      /*
       * Show backend validation details.
       */

      const responseData =
        err?.response?.data;

      let message =
        responseData?.message ||
        "Failed to save department.";

      if (
        responseData?.errors
      ) {
        if (
          Array.isArray(
            responseData.errors
          )
        ) {
          message =
            responseData.errors
              .map(
                (item) =>
                  item?.message ||
                  item
              )
              .join(", ");
        } else if (
          typeof responseData.errors ===
          "object"
        ) {
          message = Object.entries(
            responseData.errors
          )
            .map(
              ([field, value]) =>
                `${field}: ${value}`
            )
            .join(", ");
        }
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | PAGE
  |--------------------------------------------------------------------------
  */

  return (
    <Box>
      {/* HEADER */}

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
              "/departments"
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
            {isEdit
              ? "Edit Department"
              : "Add Department"}
          </Typography>

          <Typography
            color="text.secondary"
          >
            {isEdit
              ? "Update department information."
              : "Create a new department."}
          </Typography>
        </Box>
      </Stack>

      {/* ERROR */}

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

      {/* FORM */}

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
          component="form"
          onSubmit={handleSubmit}
          sx={{ p: 3 }}
        >
          <Grid
            container
            spacing={3}
          >
            {/* NAME */}

            <Grid
              item
              xs={12}
              md={6}
            >
              <TextField
                fullWidth
                required
                label="Department Name"
                name="departmentName"
                value={
                  form.departmentName
                }
                onChange={
                  handleChange
                }
                error={Boolean(
                  errors.departmentName
                )}
                helperText={
                  errors.departmentName
                }
              />
            </Grid>

            {/* CODE */}

            <Grid
              item
              xs={12}
              md={6}
            >
              <TextField
                fullWidth
                required
                label="Department Code"
                name="departmentCode"
                value={
                  form.departmentCode
                }
                onChange={
                  handleChange
                }
                error={Boolean(
                  errors.departmentCode
                )}
                helperText={
                  errors.departmentCode
                }
              />
            </Grid>

            {/* COMPANY */}

            {role ===
              "SUPER_ADMIN" ? (
              <Grid
                item
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Company ID"
                  name="companyId"
                  value={
                    form.companyId
                  }
                  onChange={
                    handleChange
                  }
                  error={Boolean(
                    errors.companyId
                  )}
                  helperText={
                    errors.companyId ||
                    "Enter the company ID."
                  }
                />
              </Grid>
            ) : (
              <Grid
                item
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Company ID"
                  value={
                    currentCompanyId ||
                    ""
                  }
                  disabled
                  helperText="Your department will belong to your company."
                />
              </Grid>
            )}

            {/* STATUS */}

            <Grid
              item
              xs={12}
              md={6}
            >
              <FormControl
                fullWidth
                error={Boolean(
                  errors.status
                )}
              >
                <InputLabel>
                  Status
                </InputLabel>

                <Select
                  label="Status"
                  name="status"
                  value={
                    form.status
                  }
                  onChange={
                    handleChange
                  }
                >
                  <MenuItem value="ACTIVE">
                    Active
                  </MenuItem>

                  <MenuItem value="INACTIVE">
                    Inactive
                  </MenuItem>
                </Select>

                {errors.status && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{
                      mt: 0.5,
                      ml: 1.5,
                    }}
                  >
                    {
                      errors.status
                    }
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* INFO */}

            <Grid
              item
              xs={12}
            >
              <Alert severity="info">
                Department status is stored
                as ACTIVE or INACTIVE.
              </Alert>
            </Grid>

            {/* BUTTONS */}

            <Grid
              item
              xs={12}
            >
              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
              >
                <Button
                  variant="outlined"
                  disabled={loading}
                  onClick={() =>
                    navigate(
                      "/departments"
                    )
                  }
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
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
                >
                  {loading
                    ? "Saving..."
                    : isEdit
                    ? "Update Department"
                    : "Create Department"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default DepartmentForm;