import {
  Alert,
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField
} from "@mui/material";


import {
  useEffect,
  useState
} from "react";


import {
  emptyCompanyForm
} from "../../utils/companyUtils";


const CompanyForm = ({
  open,
  mode = "create",
  company = null,
  loading = false,
  error = "",
  onClose,
  onSubmit
}) => {

  const [
    form,
    setForm
  ] = useState(
    emptyCompanyForm
  );


  const [
    errors,
    setErrors
  ] = useState({});


  // ----------------------------------------------------------
  // INITIALIZE FORM
  // ----------------------------------------------------------

  useEffect(() => {

    if (!open) {
      return;
    }


    if (
      mode === "edit" &&
      company
    ) {

      setForm({
        companyName:
          company.companyName || "",

        companyCode:
          company.companyCode || "",

        email:
          company.email || "",

        phone:
          company.phone || "",

        status:
          company.status || "ACTIVE",

        active:
          company.active !== false
      });

    } else {

      setForm(
        emptyCompanyForm
      );
    }


    setErrors({});

  }, [
    open,
    mode,
    company
  ]);


  // ----------------------------------------------------------
  // CHANGE
  // ----------------------------------------------------------

  const handleChange = (
    event
  ) => {

    const {
      name,
      value
    } = event.target;


    setForm(
      previous => ({
        ...previous,
        [name]: value
      })
    );


    if (
      errors[name]
    ) {

      setErrors(
        previous => ({
          ...previous,
          [name]: ""
        })
      );
    }
  };


  // ----------------------------------------------------------
  // VALIDATION
  // ----------------------------------------------------------

  const validate = () => {

    const nextErrors = {};


    const name =
      form.companyName.trim();


    const code =
      form.companyCode.trim();


    const email =
      form.email.trim();


    const phone =
      form.phone.trim();


    if (!name) {

      nextErrors.companyName =
        "Company name is required.";

    } else if (
      name.length < 2
    ) {

      nextErrors.companyName =
        "Company name must contain at least 2 characters.";
    }


    if (!code) {

      nextErrors.companyCode =
        "Company code is required.";

    } else if (
      !/^[A-Za-z0-9_-]+$/.test(
        code
      )
    ) {

      nextErrors.companyCode =
        "Use only letters, numbers, hyphen or underscore.";
    }


    if (!email) {

      nextErrors.email =
        "Email is required.";

    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {

      nextErrors.email =
        "Enter a valid email address.";
    }


    if (!phone) {

      nextErrors.phone =
        "Phone number is required.";

    } else if (
      !/^[0-9]{10}$/.test(
        phone
      )
    ) {

      nextErrors.phone =
        "Phone number must contain exactly 10 digits.";
    }


    setErrors(
      nextErrors
    );


    return (
      Object.keys(
        nextErrors
      ).length === 0
    );
  };


  // ----------------------------------------------------------
  // SUBMIT
  // ----------------------------------------------------------

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();


    if (!validate()) {
      return;
    }


    await onSubmit({
      companyName:
        form.companyName.trim(),

      companyCode:
        form.companyCode.trim(),

      email:
        form.email.trim(),

      phone:
        form.phone.trim(),

      status:
        form.status,

      active:
        form.status === "ACTIVE"
    });
  };


  return (
    <Box
      component="form"
      onSubmit={
        handleSubmit
      }
    >

      <DialogTitle
        sx={{
          fontWeight: 900
        }}
      >
        {
          mode === "edit"
            ? "Edit Company"
            : "Create Company"
        }
      </DialogTitle>


      <DialogContent
        dividers
      >

        <Stack
          spacing={2}
          sx={{
            pt: 1
          }}
        >

          {error && (

            <Alert
              severity="error"
              sx={{
                borderRadius: 2
              }}
            >
              {error}
            </Alert>

          )}


          <TextField
            fullWidth
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
            autoFocus
          />


          <TextField
            fullWidth
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
              "Example: COMP001"
            }
            disabled={
              mode === "edit"
            }
          />


          <TextField
            fullWidth
            label="Company Email"
            name="email"
            type="email"
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


          <TextField
            fullWidth
            label="Phone Number"
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


          <TextField
            select
            fullWidth
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

          </TextField>

        </Stack>

      </DialogContent>


      <DialogActions
        sx={{
          p: 2
        }}
      >

        <Button
          onClick={
            onClose
          }
          disabled={
            loading
          }
          sx={{
            fontWeight: 750
          }}
        >
          Cancel
        </Button>


        <Button
          type="submit"
          variant="contained"
          disabled={
            loading
          }
          sx={{
            minWidth: 130,
            fontWeight: 850
          }}
        >

          {loading ? (

            <CircularProgress
              size={21}
              color="inherit"
            />

          ) : (

            mode === "edit"
              ? "Save Changes"
              : "Create Company"

          )}

        </Button>

      </DialogActions>

    </Box>
  );
};


export default CompanyForm;