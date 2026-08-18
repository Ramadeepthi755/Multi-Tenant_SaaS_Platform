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


/*
|--------------------------------------------------------------------------
| DEFAULT FORM
|--------------------------------------------------------------------------
|
| designationUtils.js does not exist in the project.
| Keep the default form state here.
|
|--------------------------------------------------------------------------
*/

const emptyDesignationForm = {
  designationName: "",
  designationCode: "",
  description: "",
  companyId: "",
  departmentId: "",
  status: "ACTIVE",
  active: true
};


/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

const DesignationForm = ({
  open,
  mode = "create",
  designation = null,
  companies = [],
  departments = [],
  loading = false,
  error = "",
  onClose,
  onSubmit
}) => {

  const [
    form,
    setForm
  ] = useState(
    emptyDesignationForm
  );


  const [
    errors,
    setErrors
  ] = useState({});


  /*
  |--------------------------------------------------------------------------
  | INITIALIZE FORM
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (!open) {
      return;
    }


    /*
    |--------------------------------------------------------------------------
    | EDIT MODE
    |--------------------------------------------------------------------------
    */

    if (
      mode === "edit" &&
      designation
    ) {

      setForm({

        designationName:
          designation.designationName ||
          "",

        designationCode:
          designation.designationCode ||
          "",

        description:
          designation.description ||
          "",

        companyId:
          designation.companyId ??
          designation.company?.id ??
          "",

        departmentId:
          designation.departmentId ??
          designation.department?.id ??
          "",

        status:
          designation.status ||
          (
            designation.active === false
              ? "INACTIVE"
              : "ACTIVE"
          ),

        active:
          designation.active !== false

      });

    } else {

      /*
      |--------------------------------------------------------------------------
      | CREATE MODE
      |--------------------------------------------------------------------------
      */

      setForm({

        ...emptyDesignationForm,

        /*
         * If only one company exists,
         * select it automatically.
         */

        companyId:
          companies.length === 1
            ? companies[0].id
            : "",

        departmentId:
          ""
      });

    }


    setErrors({});

  }, [
    open,
    mode,
    designation,
    companies
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
      value
    } = event.target;


   setForm(
  previous => ({
    ...previous,

    [name]: value,

    ...(name === "companyId"
      ? {
          departmentId: ""
        }
      : {})
  })
);


    /*
    |--------------------------------------------------------------------------
    | CLEAR FIELD ERROR
    |--------------------------------------------------------------------------
    */

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


  /*
  |--------------------------------------------------------------------------
  | FILTER DEPARTMENTS
  |--------------------------------------------------------------------------
  */

  const filteredDepartments =
    form.companyId
      ? departments.filter(
          department => {

            const departmentCompanyId =
              department.companyId ??
              department.company?.id;


            return (
              String(
                departmentCompanyId
              ) ===
              String(
                form.companyId
              )
            );

          }
        )
      : [];


  /*
  |--------------------------------------------------------------------------
  | VALIDATION
  |--------------------------------------------------------------------------
  */

  const validate = () => {

    const nextErrors = {};


    /*
    |--------------------------------------------------------------------------
    | DESIGNATION NAME
    |--------------------------------------------------------------------------
    */

    const name =
      String(
        form.designationName || ""
      ).trim();


    /*
    |--------------------------------------------------------------------------
    | DESIGNATION CODE
    |--------------------------------------------------------------------------
    */

    const code =
      String(
        form.designationCode || ""
      ).trim();


    if (!name) {

      nextErrors.designationName =
        "Designation name is required.";

    } else if (
      name.length < 2
    ) {

      nextErrors.designationName =
        "Designation name must contain at least 2 characters.";

    }


    /*
    |--------------------------------------------------------------------------
    | CODE
    |--------------------------------------------------------------------------
    */

    if (!code) {

      nextErrors.designationCode =
        "Designation code is required.";

    } else if (
      !/^[A-Za-z0-9_-]+$/.test(
        code
      )
    ) {

      nextErrors.designationCode =
        "Use only letters, numbers, hyphen or underscore.";

    }


    /*
    |--------------------------------------------------------------------------
    | COMPANY
    |--------------------------------------------------------------------------
    */

    if (
      companies.length > 0 &&
      !form.companyId
    ) {

      nextErrors.companyId =
        "Please select a company.";

    }


    /*
    |--------------------------------------------------------------------------
    | DEPARTMENT
    |--------------------------------------------------------------------------
    */

    if (
      departments.length > 0 &&
      form.companyId &&
      filteredDepartments.length > 0 &&
      !form.departmentId
    ) {

      nextErrors.departmentId =
        "Please select a department.";

    }


    /*
    |--------------------------------------------------------------------------
    | DESCRIPTION
    |--------------------------------------------------------------------------
    */

    const description =
      String(
        form.description || ""
      );


    if (
      description.length >
      500
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


    await onSubmit({

      designationName:
        String(
          form.designationName || ""
        ).trim(),

      designationCode:
        String(
          form.designationCode || ""
        ).trim(),

      description:
        String(
          form.description || ""
        ).trim(),

      companyId:
        form.companyId
          ? Number(
              form.companyId
            )
          : null,

      departmentId:
        form.departmentId
          ? Number(
              form.departmentId
            )
          : null,

      status:
        form.status,

      active:
        form.status ===
        "ACTIVE"

    });

  };


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (

    <form
      onSubmit={
        handleSubmit
      }
    >

      {/* =====================================================
          TITLE
      ===================================================== */}

      <DialogTitle
        sx={{
          fontWeight: 900
        }}
      >

        {
          mode === "edit"
            ? "Edit Designation"
            : "Create Designation"
        }

      </DialogTitle>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <DialogContent
        dividers
      >

        <Stack
          spacing={2}
          sx={{
            pt: 1
          }}
        >

          {/* =================================================
              ERROR
          ================================================= */}

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


          {/* =================================================
              DESIGNATION NAME
          ================================================= */}

          <TextField
            fullWidth
            autoFocus
            label="Designation Name"
            name="designationName"
            value={
              form.designationName
            }
            onChange={
              handleChange
            }
            error={
              Boolean(
                errors.designationName
              )
            }
            helperText={
              errors.designationName
            }
            disabled={
              loading
            }
          />


          {/* =================================================
              DESIGNATION CODE
          ================================================= */}

          <TextField
            fullWidth
            label="Designation Code"
            name="designationCode"
            value={
              form.designationCode
            }
            onChange={
              handleChange
            }
            disabled={
              loading ||
              mode === "edit"
            }
            error={
              Boolean(
                errors.designationCode
              )
            }
            helperText={
              errors.designationCode ||
              "Example: SENIOR_DEVELOPER"
            }
          />


          {/* =================================================
              COMPANY
          ================================================= */}

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
              loading ||
              (
                mode === "edit" &&
                Boolean(
                  designation?.companyId ||
                  designation?.company?.id
                )
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


          {/* =================================================
              DEPARTMENT
          ================================================= */}

          <TextField
            select
            fullWidth
            label="Department"
            name="departmentId"
            value={
              form.departmentId
            }
            onChange={
              handleChange
            }
            disabled={
              loading ||
              !form.companyId ||
              filteredDepartments.length === 0
            }
            error={
              Boolean(
                errors.departmentId
              )
            }
            helperText={
              errors.departmentId ||
              (
                !form.companyId
                  ? "Select a company first."
                  : filteredDepartments.length === 0
                    ? "No departments available for this company."
                    : ""
              )
            }
          >

            <MenuItem
              value=""
            >
              Select Department
            </MenuItem>


            {filteredDepartments.map(
              department => {

                const departmentId =
                  department.id ??
                  department.departmentId;


                return (

                  <MenuItem
                    key={
                      departmentId
                    }
                    value={
                      departmentId
                    }
                  >
                    {
                      department.departmentName
                    }
                  </MenuItem>

                );

              }
            )}

          </TextField>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

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
              `${
                String(
                  form.description || ""
                ).length
              }/500`
            }
            disabled={
              loading
            }
          />


          {/* =================================================
              STATUS
          ================================================= */}

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
            disabled={
              loading
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


      {/* =====================================================
          ACTIONS
      ===================================================== */}

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
            minWidth: 160,
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
              : "Create Designation"

          )}

        </Button>

      </DialogActions>

    </form>

  );

};


export default DesignationForm;