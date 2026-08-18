import {
  Alert,
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
  emptyDepartmentForm
} from "../../utils/departmentUtils";


const DepartmentForm = ({
  open,
  mode = "create",
  department = null,
  companies = [],
  loading = false,
  error = "",
  onClose,
  onSubmit
}) => {

  const [
    form,
    setForm
  ] = useState(
    emptyDepartmentForm
  );


  const [
    errors,
    setErrors
  ] = useState({});


  // ==========================================================
  // INITIALIZE
  // ==========================================================

  useEffect(() => {

    if (!open) {
      return;
    }


    if (
      mode === "edit" &&
      department
    ) {

      setForm({

        departmentName:
          department.departmentName ||
          "",

        departmentCode:
          department.departmentCode ||
          "",

        description:
          department.description ||
          "",

        companyId:
          department.companyId ||
          "",

        status:
          department.status ||
          "ACTIVE",

        active:
          department.active !== false

      });

    } else {

      setForm({
        ...emptyDepartmentForm,

        companyId:
          companies.length === 1
            ? companies[0].id
            : ""
      });
    }


    setErrors({});

  }, [
    open,
    mode,
    department,
    companies
  ]);


  // ==========================================================
  // CHANGE
  // ==========================================================

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


  // ==========================================================
  // VALIDATE
  // ==========================================================

  const validate = () => {

    const nextErrors = {};


    const name =
      form.departmentName.trim();


    const code =
      form.departmentCode.trim();


    if (!name) {

      nextErrors.departmentName =
        "Department name is required.";

    } else if (
      name.length < 2
    ) {

      nextErrors.departmentName =
        "Department name must contain at least 2 characters.";
    }


    if (!code) {

      nextErrors.departmentCode =
        "Department code is required.";

    } else if (
      !/^[A-Za-z0-9_-]+$/.test(
        code
      )
    ) {

      nextErrors.departmentCode =
        "Use only letters, numbers, hyphen or underscore.";
    }


    if (
      companies.length > 0 &&
      !form.companyId
    ) {

      nextErrors.companyId =
        "Please select a company.";
    }


    if (
      form.description &&
      form.description.length > 500
    ) {

      nextErrors.description =
        "Description cannot exceed 500 characters.";
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


  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();


    if (!validate()) {
      return;
    }


    await onSubmit({

      departmentName:
        form.departmentName.trim(),

      departmentCode:
        form.departmentCode.trim(),

      description:
        form.description.trim(),

      companyId:
        form.companyId
          ? Number(
              form.companyId
            )
          : null,

      status:
        form.status,

      active:
        form.status === "ACTIVE"

    });
  };


  return (
    <form
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
            ? "Edit Department"
            : "Create Department"
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
            label="Department Name"
            name="departmentName"
            value={
              form.departmentName
            }
            onChange={
              handleChange
            }
            error={
              Boolean(
                errors.departmentName
              )
            }
            helperText={
              errors.departmentName
            }
            autoFocus
          />


          <TextField
            fullWidth
            label="Department Code"
            name="departmentCode"
            value={
              form.departmentCode
            }
            onChange={
              handleChange
            }
            error={
              Boolean(
                errors.departmentCode
              )
            }
            helperText={
              errors.departmentCode ||
              "Example: HR, IT, FINANCE"
            }
            disabled={
              mode === "edit"
            }
          />


          <TextField
            select
            fullWidth
            label="Company"
            name="companyId"
            value={
              form.companyId
            }
            onChange={
              handleChange
            }
            error={
              Boolean(
                errors.companyId
              )
            }
            helperText={
              errors.companyId
            }
            disabled={
              mode === "edit" &&
              Boolean(
                department?.companyId
              )
            }
          >

            <MenuItem
              value=""
            >
              Select Company
            </MenuItem>


            {companies.map(
              company => (

                <MenuItem
                  key={
                    company.id
                  }
                  value={
                    company.id
                  }
                >
                  {
                    company.companyName
                  }
                </MenuItem>

              )
            )}

          </TextField>


          <TextField
            fullWidth
            multiline
            minRows={3}
            maxRows={6}
            label="Description"
            name="description"
            value={
              form.description
            }
            onChange={
              handleChange
            }
            error={
              Boolean(
                errors.description
              )
            }
            helperText={
              errors.description ||
              `${form.description.length}/500`
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

            <MenuItem
              value="ACTIVE"
            >
              Active
            </MenuItem>

            <MenuItem
              value="INACTIVE"
            >
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
            minWidth: 150,
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
              : "Create Department"

          )}

        </Button>

      </DialogActions>

    </form>
  );
};


export default DepartmentForm;