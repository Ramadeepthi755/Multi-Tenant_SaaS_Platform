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
  Grid,
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

import companyService from "../../services/companyService";

function CompanyForm() {
  const navigate =
    useNavigate();

  const { companyId } =
    useParams();

  const isEdit =
    Boolean(companyId);

  const [form, setForm] =
    useState({
      companyName: "",
      companyCode: "",
      email: "",
      phone: "",
      address: "",
    });

  const [errors, setErrors] =
    useState({});

  const [loading, setLoading] =
    useState(false);

  const [initialLoading, setInitialLoading] =
    useState(isEdit);

  const [error, setError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | LOAD COMPANY FOR EDIT
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    const loadCompany =
      async () => {
        try {
          setInitialLoading(true);

          const data =
            await companyService.getCompanyById(
              companyId
            );

          setForm({
            companyName:
              data?.companyName ||
              "",
            companyCode:
              data?.companyCode ||
              "",
            email:
              data?.email || "",
            phone:
              data?.phone || "",
            address:
              data?.address ||
              "",
          });
        } catch (err) {
          console.error(
            err
          );

          setError(
            err?.response?.data
              ?.message ||
              "Failed to load company."
          );
        } finally {
          setInitialLoading(
            false
          );
        }
      };

    loadCompany();
  }, [
    companyId,
    isEdit,
  ]);

  /*
  |--------------------------------------------------------------------------
  | HANDLE CHANGE
  |--------------------------------------------------------------------------
  */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (current) => ({
        ...current,
        [name]: value,
      })
    );

    setErrors(
      (current) => ({
        ...current,
        [name]: "",
      })
    );
  };

  /*
  |--------------------------------------------------------------------------
  | VALIDATION
  |--------------------------------------------------------------------------
  */

  const validate = () => {
    const newErrors = {};

    if (
      !form.companyName.trim()
    ) {
      newErrors.companyName =
        "Company name is required.";
    } else if (
      form.companyName.trim()
        .length < 2
    ) {
      newErrors.companyName =
        "Company name must contain at least 2 characters.";
    }

    if (
      !form.companyCode.trim()
    ) {
      newErrors.companyCode =
        "Company code is required.";
    }

    if (
      !form.email.trim()
    ) {
      newErrors.email =
        "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    if (
      form.phone &&
      !/^[0-9+\-\s()]{7,20}$/.test(
        form.phone
      )
    ) {
      newErrors.phone =
        "Enter a valid phone number.";
    }

    setErrors(
      newErrors
    );

    return (
      Object.keys(
        newErrors
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

      const payload = {
        companyName:
          form.companyName.trim(),

        companyCode:
          form.companyCode
            .trim()
            .toUpperCase(),

        email:
          form.email.trim(),

        phone:
          form.phone.trim(),

        address:
          form.address.trim(),
      };

      if (isEdit) {
        await companyService.updateCompany(
          companyId,
          payload
        );
      } else {
        await companyService.createCompany(
          payload
        );
      }

      navigate(
        "/companies"
      );
    } catch (err) {
      console.error(
        "Save company failed:",
        err
      );

      /*
       * Spring Boot validation errors
       */

      const backendErrors =
        err?.response?.data
          ?.errors;

      if (
        backendErrors &&
        typeof backendErrors ===
          "object"
      ) {
        setErrors(
          backendErrors
        );
      }

      setError(
        err?.response?.data
          ?.message ||
          "Failed to save company."
      );
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Box
        sx={{
          minHeight: 400,
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* ====================================================== */}
      {/* HEADER                                                 */}
      {/* ====================================================== */}

      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        mb={3}
      >
        <Button
          startIcon={
            <ArrowBackRoundedIcon />
          }
          onClick={() =>
            navigate(
              "/companies"
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
              ? "Edit Company"
              : "Add Company"}
          </Typography>

          <Typography
            color="text.secondary"
          >
            {isEdit
              ? "Update company information."
              : "Create a new company in the HRM portal."}
          </Typography>
        </Box>
      </Stack>

      {/* ====================================================== */}
      {/* ERROR                                                  */}
      {/* ====================================================== */}

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

      {/* ====================================================== */}
      {/* FORM                                                   */}
      {/* ====================================================== */}

      <Card
        sx={{
          maxWidth: 1000,
          borderRadius: 3,
          border: "1px solid",
          borderColor:
            "divider",
          boxShadow: "none",
        }}
      >
        <CardContent
          sx={{ p: 3 }}
        >
          <Box
            component="form"
            onSubmit={
              handleSubmit
            }
          >
            <Grid
              container
              spacing={2.5}
            >
              {/* Company Name */}

              <Grid
                item
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  required
                  label="Company Name"
                  name="companyName"
                  value={
                    form.companyName
                  }
                  onChange={
                    handleChange
                  }
                  error={
                    Boolean(
                      errors.companyName
                    )
                  }
                  helperText={
                    errors.companyName
                  }
                />
              </Grid>

              {/* Company Code */}

              <Grid
                item
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  required
                  label="Company Code"
                  name="companyCode"
                  value={
                    form.companyCode
                  }
                  onChange={
                    handleChange
                  }
                  error={
                    Boolean(
                      errors.companyCode
                    )
                  }
                  helperText={
                    errors.companyCode ||
                    "Example: ACME01"
                  }
                  inputProps={{
                    maxLength: 20,
                  }}
                />
              </Grid>

              {/* Email */}

              <Grid
                item
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  required
                  type="email"
                  label="Company Email"
                  name="email"
                  value={
                    form.email
                  }
                  onChange={
                    handleChange
                  }
                  error={
                    Boolean(
                      errors.email
                    )
                  }
                  helperText={
                    errors.email
                  }
                />
              </Grid>

              {/* Phone */}

              <Grid
                item
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={
                    form.phone
                  }
                  onChange={
                    handleChange
                  }
                  error={
                    Boolean(
                      errors.phone
                    )
                  }
                  helperText={
                    errors.phone
                  }
                />
              </Grid>

              {/* Address */}

              <Grid
                item
                xs={12}
              >
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Address"
                  name="address"
                  value={
                    form.address
                  }
                  onChange={
                    handleChange
                  }
                  error={
                    Boolean(
                      errors.address
                    )
                  }
                  helperText={
                    errors.address
                  }
                />
              </Grid>
            </Grid>

            {/* Actions */}

            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={1.5}
              mt={3}
            >
              <Button
                variant="outlined"
                onClick={() =>
                  navigate(
                    "/companies"
                  )
                }
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
                {isEdit
                  ? "Update Company"
                  : "Create Company"}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default CompanyForm;