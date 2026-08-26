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


/*
|--------------------------------------------------------------------------
| EMPTY FORM
|--------------------------------------------------------------------------
*/

const EMPTY_FORM = {
  designationName: "",
  designationCode: "",
  description: "",
  companyId: "",
  departmentId: "",
  status: "ACTIVE"
};


/*
|--------------------------------------------------------------------------
| COMPANY HELPERS
|--------------------------------------------------------------------------
*/

const getCompanyId = (
  company
) => {

  return (
    company?.companyId ??
    company?.id ??
    null
  );

};


const getCompanyName = (
  company
) => {

  return String(
    company?.companyName ??
    company?.name ??
    ""
  )
    .trim()
    .toLowerCase();

};


/*
|--------------------------------------------------------------------------
| DEPARTMENT HELPERS
|--------------------------------------------------------------------------
*/

const getDepartmentId = (
  department
) => {

  return (
    department?.departmentId ??
    department?.id ??
    null
  );

};


const getDepartmentName = (
  department
) => {

  return (
    department?.departmentName ??
    department?.name ??
    ""
  );

};


/*
 * Get company ID directly from department.
 *
 * Preferred:
 *
 * department.companyId
 * department.company.id
 *
 * Fallback:
 *
 * companyName mapping is handled separately.
 */

const getDepartmentCompanyId = (
  department
) => {

  return (
    department?.companyId ??
    department?.company?.companyId ??
    department?.company?.id ??
    null
  );

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
  ] = useState({
    ...EMPTY_FORM
  });


  const [
    errors,
    setErrors
  ] = useState({});


  /*
  |--------------------------------------------------------------------------
  | FIND COMPANY
  |--------------------------------------------------------------------------
  */

  const selectedCompany =
    useMemo(() => {

      if (!form.companyId) {
        return null;
      }

      return (
        companies.find(
          company =>
            String(
              getCompanyId(company)
            ) ===
            String(
              form.companyId
            )
        ) ?? null
      );

    }, [
      companies,
      form.companyId
    ]);


  /*
  |--------------------------------------------------------------------------
  | FILTER DEPARTMENTS
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  |
  | First use companyId.
  |
  | If department doesn't contain companyId,
  | fallback to company name.
  |
  |--------------------------------------------------------------------------
  */

  const filteredDepartments =
    useMemo(() => {

      if (
        !form.companyId
      ) {

        return [];

      }


      const selectedCompanyName =
        getCompanyName(
          selectedCompany
        );


      return departments.filter(
        department => {

          /*
           * Preferred ID comparison.
           */

          const departmentCompanyId =
            getDepartmentCompanyId(
              department
            );


          if (
            departmentCompanyId !== null &&
            departmentCompanyId !== undefined
          ) {

            return (
              String(
                departmentCompanyId
              ) ===
              String(
                form.companyId
              )
            );

          }


          /*
           * Fallback to company name.
           */

          const departmentCompanyName =
            String(
              department?.companyName ??
              department?.company?.companyName ??
              department?.company?.name ??
              ""
            )
              .trim()
              .toLowerCase();


          return (
            Boolean(
              selectedCompanyName
            ) &&
            departmentCompanyName ===
              selectedCompanyName
          );

        }
      );

    }, [
      departments,
      form.companyId,
      selectedCompany
    ]);


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
     * EDIT
     */

    if (
      mode === "edit" &&
      designation
    ) {

      const departmentId =
        designation?.departmentId ??
        designation?.department?.departmentId ??
        designation?.department?.id ??
        "";


      let companyId =
        designation?.companyId ??
        designation?.company?.companyId ??
        designation?.company?.id ??
        "";


      /*
       * If designation does not contain companyId,
       * determine company through department.
       */

      if (
        !companyId &&
        departmentId
      ) {

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


        if (department) {

          companyId =
            getDepartmentCompanyId(
              department
            ) ?? "";


          /*
           * Fallback company name.
           */

          if (
            !companyId
          ) {

            const departmentCompanyName =
              String(
                department?.companyName ??
                department?.company?.companyName ??
                department?.company?.name ??
                ""
              )
                .trim()
                .toLowerCase();


            if (
              departmentCompanyName
            ) {

              const company =
                companies.find(
                  item =>
                    getCompanyName(item) ===
                    departmentCompanyName
                );


              companyId =
                getCompanyId(
                  company
                ) ?? "";

            }

          }

        }

      }


      setForm({

        designationName:
          designation?.designationName ??
          "",

        designationCode:
          designation?.designationCode ??
          "",

        description:
          designation?.description ??
          "",

        companyId:
          companyId,

        departmentId:
          departmentId,

        status:
          designation?.status ??
          (
            designation?.active === false
              ? "INACTIVE"
              : "ACTIVE"
          )

      });

    }

    /*
     * CREATE
     */

    else {

      /*
       * If only one company exists,
       * automatically select it.
       */

      const defaultCompanyId =
        companies.length === 1
          ? getCompanyId(
              companies[0]
            )
          : "";


      setForm({

        ...EMPTY_FORM,

        companyId:
          defaultCompanyId ?? ""

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


  /*
  |--------------------------------------------------------------------------
  | COMPANY CHANGE
  |--------------------------------------------------------------------------
  */

  const handleCompanyChange = (
    event
  ) => {

    const companyId =
      event.target.value;


    setForm(
      previous => ({

        ...previous,

        companyId,

        /*
         * Changing company MUST reset department.
         */

        departmentId: ""

      })
    );


    setErrors(
      previous => ({

        ...previous,

        companyId: "",
        departmentId: ""

      })
    );

  };


  /*
  |--------------------------------------------------------------------------
  | DEPARTMENT CHANGE
  |--------------------------------------------------------------------------
  */

  const handleDepartmentChange = (
    event
  ) => {

    const departmentId =
      event.target.value;


    setForm(
      previous => ({

        ...previous,

        departmentId

      })
    );


    setErrors(
      previous => ({

        ...previous,

        departmentId: ""

      })
    );

  };


  /*
  |--------------------------------------------------------------------------
  | NORMAL FIELD CHANGE
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

        [name]: value

      })
    );


    setErrors(
      previous => ({

        ...previous,

        [name]: ""

      })
    );

  };


  /*
  |--------------------------------------------------------------------------
  | VALIDATE
  |--------------------------------------------------------------------------
  */

  const validate = () => {

    const nextErrors = {};


    /*
     * NAME
     */

    const designationName =
      String(
        form.designationName || ""
      ).trim();


    if (!designationName) {

      nextErrors.designationName =
        "Designation name is required.";

    }
    else if (
      designationName.length < 2
    ) {

      nextErrors.designationName =
        "Designation name must contain at least 2 characters.";

    }


    /*
     * CODE
     */

    const designationCode =
      String(
        form.designationCode || ""
      ).trim();


    if (!designationCode) {

      nextErrors.designationCode =
        "Designation code is required.";

    }
    else if (
      !/^[A-Za-z0-9_-]+$/.test(
        designationCode
      )
    ) {

      nextErrors.designationCode =
        "Use only letters, numbers, hyphen or underscore.";

    }


    /*
     * COMPANY
     */

    if (!form.companyId) {

      nextErrors.companyId =
        "Please select a company.";

    }


    /*
     * DEPARTMENT
     */

    const departmentId =
      Number(
        form.departmentId
      );


    if (
      !form.departmentId ||
      !Number.isInteger(
        departmentId
      ) ||
      departmentId <= 0
    ) {

      nextErrors.departmentId =
        "Please select a department.";

    }


    /*
     * DESCRIPTION
     */

    if (
      String(
        form.description || ""
      ).length > 500
    ) {

      nextErrors.description =
        "Description cannot exceed 500 characters.";

    }


    /*
     * STATUS
     */

    if (!form.status) {

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


    const departmentId =
      Number(
        form.departmentId
      );


    if (
      !Number.isInteger(
        departmentId
      ) ||
      departmentId <= 0
    ) {

      setErrors(
        previous => ({

          ...previous,

          departmentId:
            "Please select a department."

        })
      );

      return;

    }


    /*
     * IMPORTANT:
     *
     * Backend only needs departmentId.
     *
     * companyId is used by frontend for selecting
     * the correct department.
     */

    const payload = {

      designationCode:
        String(
          form.designationCode
        ).trim(),

      designationName:
        String(
          form.designationName
        ).trim(),

      description:
        String(
          form.description || ""
        ).trim(),

      status:
        form.status,

      departmentId:
        departmentId

    };


    console.log(
      "FINAL DESIGNATION PAYLOAD:",
      payload
    );


    await onSubmit(
      payload
    );

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

          {/* SERVER ERROR */}

          {error && (

            <Alert
              severity="error"
            >
              {error}
            </Alert>

          )}


          {/* NAME */}

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
            disabled={
              loading
            }
            error={
              Boolean(
                errors.designationName
              )
            }
            helperText={
              errors.designationName
            }
          />


          {/* CODE */}

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


          {/* COMPANY */}

          <TextField
            select
            fullWidth
            label="Company"
            name="companyId"
            value={
              form.companyId
            }
            onChange={
              handleCompanyChange
            }
            disabled={
              loading
            }
            error={
              Boolean(
                errors.companyId
              )
            }
            helperText={
              errors.companyId ||
              "Select a company first"
            }
          >

            <MenuItem value="">
              Select Company
            </MenuItem>


            {companies.map(
              company => {

                const id =
                  getCompanyId(
                    company
                  );


                return (

                  <MenuItem
                    key={id}
                    value={id}
                  >

                    {
                      company?.companyName ??
                      company?.name ??
                      "Unnamed Company"
                    }

                  </MenuItem>

                );

              }
            )}

          </TextField>


          {/* DEPARTMENT */}

          <TextField
            select
            fullWidth
            label="Department"
            name="departmentId"
            value={
              form.departmentId
            }
            onChange={
              handleDepartmentChange
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
                    ? "No departments found for this company."
                    : "Select a department."
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
                      getDepartmentName(
                        department
                      )
                    }

                  </MenuItem>

                );

              }
            )}

          </TextField>


          {/* DESCRIPTION */}

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
            disabled={
              loading
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
          />


          {/* STATUS */}

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
            error={
              Boolean(
                errors.status
              )
            }
            helperText={
              errors.status
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