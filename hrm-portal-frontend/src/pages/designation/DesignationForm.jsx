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
  useMemo,
  useState
} from "react";


const emptyDesignationForm = {
  designationName: "",
  designationCode: "",
  description: "",
  companyId: "",
  departmentId: "",
  status: "ACTIVE"
};


const getDesignationId = (
  designation
) => {

  return (
    designation?.designationId ??
    designation?.id ??
    null
  );
};


const getDepartmentId = (
  department
) => {

  return (
    department?.departmentId ??
    department?.id ??
    null
  );
};


const getCompanyId = (
  department
) => {

  return (
    department?.companyId ??
    department?.company?.id ??
    null
  );
};


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


  // ==========================================================
  // INITIALIZE
  // ==========================================================

  useEffect(() => {

    if (!open) {
      return;
    }


    if (
      mode === "edit" &&
      designation
    ) {

      const departmentId =
        designation.departmentId ??
        designation.department?.id ??
        "";


      const department =
        departments.find(
          item =>
            String(
              getDepartmentId(item)
            ) ===
            String(
              departmentId
            )
        );


      const derivedCompanyId =
        designation.companyId ??
        designation.company?.id ??
        getCompanyId(department) ??
        "";


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
          derivedCompanyId,

        departmentId:
          departmentId,

        status:
          designation.status ||
          "ACTIVE"

      });

    } else {

      setForm({

        ...emptyDesignationForm,

        companyId:
          companies.length === 1
            ? (
                companies[0].id ??
                companies[0].companyId
              )
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
    companies,
    departments
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

        [name]: value,

        ...(name === "companyId"
          ? {
              departmentId: ""
            }
          : {})
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
  // FILTER DEPARTMENTS
  // ==========================================================

  const filteredDepartments =
    useMemo(() => {

      if (!form.companyId) {
        return departments;
      }


      return departments.filter(
        department => {

          const departmentCompanyId =
            getCompanyId(
              department
            );


          return (
            String(
              departmentCompanyId
            ) ===
            String(
              form.companyId
            )
          );

        }
      );

    }, [
      departments,
      form.companyId
    ]);


  // ==========================================================
  // VALIDATE
  // ==========================================================

  const validate = () => {

    const nextErrors = {};


    const name =
      String(
        form.designationName || ""
      ).trim();


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
     * Department is REQUIRED by backend.
     */
    if (
      !form.departmentId
    ) {

      nextErrors.departmentId =
        "Please select a department.";

    }


    const description =
      String(
        form.description || ""
      );


    if (
      description.length > 500
    ) {

      nextErrors.description =
        "Description cannot exceed 500 characters.";

    }


    if (
      !form.status
    ) {

      nextErrors.status =
        "Status is required.";

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


    const payload = {

      designationName:
        String(
          form.designationName
        ).trim(),

      designationCode:
        String(
          form.designationCode
        ).trim(),

      description:
        String(
          form.description || ""
        ).trim(),

      status:
        form.status,

      departmentId:
        Number(
          form.departmentId
        )

    };


    await onSubmit(
      payload
    );
  };


  // ==========================================================
  // RENDER
  // ==========================================================

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
            ? "Edit Designation"
            : "Create Designation"
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
              COMPANY — UI ONLY
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
            disabled={
              loading
            }
          >

            <MenuItem value="">
              Select Company
            </MenuItem>


            {companies.map(
              company => {

                const id =
                  company.id ??
                  company.companyId;


                return (

                  <MenuItem
                    key={id}
                    value={id}
                  >
                    {
                      company.companyName
                    }
                  </MenuItem>

                );

              }
            )}

          </TextField>


          {/* =================================================
              DEPARTMENT — ACTUAL BACKEND FIELD
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
                filteredDepartments.length === 0
                  ? "No departments available."
                  : ""
              )
            }
          >

            <MenuItem value="">
              Select Department
            </MenuItem>


            {filteredDepartments.map(
              department => {

                const id =
                  getDepartmentId(
                    department
                  );


                return (

                  <MenuItem
                    key={id}
                    value={id}
                  >
                    {
                      department.departmentName
                    }
                  </MenuItem>

                );

              }
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
            error={
              Boolean(
                errors.status
              )
            }
            helperText={
              errors.status
            }
            disabled={
              loading
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