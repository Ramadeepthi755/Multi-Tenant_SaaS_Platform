import {
  Alert,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";


import {
  useEffect,
  useState
} from "react";


import {
  emptyEmployeeForm
} from "../../utils/employeeUtils";


const EmployeeForm = ({
  open,
  mode = "create",
  employee = null,
  companies = [],
  departments = [],
  designations = [],
  employees = [],
  loading = false,
  error = "",
  onClose,
  onSubmit
}) => {

  const [
    form,
    setForm
  ] = useState(
    emptyEmployeeForm
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
      employee
    ) {

      setForm({

        employeeCode:
          employee.employeeCode ||
          "",

        firstName:
          employee.firstName ||
          "",

        lastName:
          employee.lastName ||
          "",

        email:
          employee.email ||
          "",

        phone:
          employee.phone ||
          "",

        gender:
          employee.gender ||
          "",

        dateOfBirth:
          employee.dateOfBirth ||
          "",

        joiningDate:
          employee.joiningDate ||
          "",

        companyId:
          employee.companyId ||
          "",

        departmentId:
          employee.departmentId ||
          "",

        designationId:
          employee.designationId ||
          "",

        reportingManagerId:
          employee.reportingManagerId ||
          "",

        employmentType:
          employee.employmentType ||
          "FULL_TIME",

        status:
          employee.status ||
          "ACTIVE",

        address:
          employee.address ||
          "",

        city:
          employee.city ||
          "",

        state:
          employee.state ||
          "",

        country:
          employee.country ||
          "India",

        postalCode:
          employee.postalCode ||
          ""

      });

    } else {

      setForm({
        ...emptyEmployeeForm,

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
    employee,
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
      previous => {

        const next = {
          ...previous,
          [name]: value
        };


        if (
          name === "companyId"
        ) {

          next.departmentId =
            "";

          next.designationId =
            "";

          next.reportingManagerId =
            "";
        }


        if (
          name === "departmentId"
        ) {

          next.designationId =
            "";
        }


        return next;
      }
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
  // DEPENDENT DATA
  // ==========================================================

  const filteredDepartments =
    form.companyId
      ? departments.filter(
          department =>
            String(
              department.companyId
            ) ===
            String(
              form.companyId
            )
        )
      : [];


  const filteredDesignations =
    form.departmentId
      ? designations.filter(
          designation =>
            String(
              designation.departmentId
            ) ===
            String(
              form.departmentId
            )
        )
      : [];


  const availableManagers =
    employees.filter(
      manager => {

        if (
          employee?.id &&
          String(
            manager.id
          ) ===
          String(
            employee.id
          )
        ) {

          return false;
        }


        if (
          !form.companyId
        ) {

          return true;
        }


        return String(
          manager.companyId
        ) ===
        String(
          form.companyId
        );
      }
    );


  // ==========================================================
  // VALIDATE
  // ==========================================================

  const validate = () => {

    const next = {};


    if (
      !form.firstName.trim()
    ) {

      next.firstName =
        "First name is required.";
    }


    if (
      !form.lastName.trim()
    ) {

      next.lastName =
        "Last name is required.";
    }


    if (
      !form.email.trim()
    ) {

      next.email =
        "Email is required.";

    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {

      next.email =
        "Enter a valid email address.";
    }


    if (
      form.phone.trim() &&
      !/^[0-9+\-\s]{7,15}$/.test(
        form.phone.trim()
      )
    ) {

      next.phone =
        "Enter a valid phone number.";
    }


    if (
      !form.joiningDate
    ) {

      next.joiningDate =
        "Joining date is required.";
    }


    if (
      !form.companyId
    ) {

      next.companyId =
        "Company is required.";
    }


    if (
      !form.departmentId
    ) {

      next.departmentId =
        "Department is required.";
    }


    if (
      !form.designationId
    ) {

      next.designationId =
        "Designation is required.";
    }


    if (
      form.postalCode &&
      !/^[0-9A-Za-z\s-]{3,10}$/.test(
        form.postalCode
      )
    ) {

      next.postalCode =
        "Enter a valid postal code.";
    }


    setErrors(next);

    return (
      Object.keys(next).length === 0
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

      employeeCode:
        form.employeeCode.trim(),

      firstName:
        form.firstName.trim(),

      lastName:
        form.lastName.trim(),

      email:
        form.email.trim(),

      phone:
        form.phone.trim(),

      gender:
        form.gender || null,

      dateOfBirth:
        form.dateOfBirth || null,

      joiningDate:
        form.joiningDate,

      companyId:
        Number(form.companyId),

      departmentId:
        Number(form.departmentId),

      designationId:
        Number(form.designationId),

      reportingManagerId:
        form.reportingManagerId
          ? Number(
              form.reportingManagerId
            )
          : null,

      employmentType:
        form.employmentType,

      status:
        form.status,

      address:
        form.address.trim(),

      city:
        form.city.trim(),

      state:
        form.state.trim(),

      country:
        form.country.trim(),

      postalCode:
        form.postalCode.trim()

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
            ? "Edit Employee"
            : "Add New Employee"
        }
      </DialogTitle>


      <DialogContent
        dividers
      >

        <Stack
          spacing={2.5}
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


          {/* BASIC */}

          <Typography
            variant="subtitle1"
            fontWeight={900}
          >
            Basic Information
          </Typography>


          <Stack
            direction={{
              xs: "column",
              sm: "row"
            }}
            spacing={2}
          >

            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={
                form.firstName
              }
              onChange={
                handleChange
              }
              error={
                Boolean(
                  errors.firstName
                )
              }
              helperText={
                errors.firstName
              }
            />


            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={
                form.lastName
              }
              onChange={
                handleChange
              }
              error={
                Boolean(
                  errors.lastName
                )
              }
              helperText={
                errors.lastName
              }
            />

          </Stack>


          <Stack
            direction={{
              xs: "column",
              sm: "row"
            }}
            spacing={2}
          >

            <TextField
              fullWidth
              label="Employee ID"
              name="employeeCode"
              value={
                form.employeeCode
              }
              onChange={
                handleChange
              }
              disabled={
                mode === "edit"
              }
              helperText={
                mode === "create"
                  ? "Leave blank if backend generates it."
                  : ""
              }
            />


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

          </Stack>


          <TextField
            fullWidth
            type="email"
            label="Email"
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


          <Stack
            direction={{
              xs: "column",
              sm: "row"
            }}
            spacing={2}
          >

            <TextField
              select
              fullWidth
              label="Gender"
              name="gender"
              value={
                form.gender
              }
              onChange={
                handleChange
              }
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

            </TextField>


            <TextField
              fullWidth
              type="date"
              label="Date of Birth"
              name="dateOfBirth"
              value={
                form.dateOfBirth
              }
              onChange={
                handleChange
              }
              slotProps={{
                inputLabel: {
                  shrink: true
                }
              }}
            />

          </Stack>


          <Divider />


          {/* ORGANIZATION */}

          <Typography
            variant="subtitle1"
            fontWeight={900}
          >
            Organization
          </Typography>


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
          >

            <MenuItem value="">
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
              !form.companyId
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
                  ? "Select company first."
                  : ""
              )
            }
          >

            <MenuItem value="">
              Select Department
            </MenuItem>


            {filteredDepartments.map(
              department => (

                <MenuItem
                  key={
                    department.id
                  }
                  value={
                    department.id
                  }
                >
                  {
                    department.departmentName
                  }
                </MenuItem>

              )
            )}

          </TextField>


          <TextField
            select
            fullWidth
            label="Designation"
            name="designationId"
            value={
              form.designationId
            }
            onChange={
              handleChange
            }
            disabled={
              !form.departmentId
            }
            error={
              Boolean(
                errors.designationId
              )
            }
            helperText={
              errors.designationId ||
              (
                !form.departmentId
                  ? "Select department first."
                  : ""
              )
            }
          >

            <MenuItem value="">
              Select Designation
            </MenuItem>


            {filteredDesignations.map(
              designation => (

                <MenuItem
                  key={
                    designation.id
                  }
                  value={
                    designation.id
                  }
                >
                  {
                    designation.designationName
                  }
                </MenuItem>

              )
            )}

          </TextField>


          <TextField
            select
            fullWidth
            label="Reporting Manager"
            name="reportingManagerId"
            value={
              form.reportingManagerId
            }
            onChange={
              handleChange
            }
            disabled={
              !form.companyId
            }
          >

            <MenuItem value="">
              No Reporting Manager
            </MenuItem>


            {availableManagers.map(
              manager => (

                <MenuItem
                  key={
                    manager.id
                  }
                  value={
                    manager.id
                  }
                >
                  {
                    manager.fullName ||
                    `${manager.firstName || ""} ${manager.lastName || ""}`
                  }
                </MenuItem>

              )
            )}

          </TextField>


          <Stack
            direction={{
              xs: "column",
              sm: "row"
            }}
            spacing={2}
          >

            <TextField
              fullWidth
              type="date"
              label="Joining Date"
              name="joiningDate"
              value={
                form.joiningDate
              }
              onChange={
                handleChange
              }
              slotProps={{
                inputLabel: {
                  shrink: true
                }
              }}
              error={
                Boolean(
                  errors.joiningDate
                )
              }
              helperText={
                errors.joiningDate
              }
            />


            <TextField
              select
              fullWidth
              label="Employment Type"
              name="employmentType"
              value={
                form.employmentType
              }
              onChange={
                handleChange
              }
            >

              <MenuItem value="FULL_TIME">
                Full Time
              </MenuItem>

              <MenuItem value="PART_TIME">
                Part Time
              </MenuItem>

              <MenuItem value="CONTRACT">
                Contract
              </MenuItem>

              <MenuItem value="INTERN">
                Intern
              </MenuItem>

              <MenuItem value="TEMPORARY">
                Temporary
              </MenuItem>

            </TextField>

          </Stack>


          <Divider />


          {/* ADDRESS */}

          <Typography
            variant="subtitle1"
            fontWeight={900}
          >
            Address
          </Typography>


          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Address"
            name="address"
            value={
              form.address
            }
            onChange={
              handleChange
            }
          />


          <Stack
            direction={{
              xs: "column",
              sm: "row"
            }}
            spacing={2}
          >

            <TextField
              fullWidth
              label="City"
              name="city"
              value={
                form.city
              }
              onChange={
                handleChange
              }
            />


            <TextField
              fullWidth
              label="State"
              name="state"
              value={
                form.state
              }
              onChange={
                handleChange
              }
            />

          </Stack>


          <Stack
            direction={{
              xs: "column",
              sm: "row"
            }}
            spacing={2}
          >

            <TextField
              fullWidth
              label="Country"
              name="country"
              value={
                form.country
              }
              onChange={
                handleChange
              }
            />


            <TextField
              fullWidth
              label="Postal Code"
              name="postalCode"
              value={
                form.postalCode
              }
              onChange={
                handleChange
              }
              error={
                Boolean(
                  errors.postalCode
                )
              }
              helperText={
                errors.postalCode
              }
            />

          </Stack>


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
              : "Create Employee"

          )}

        </Button>

      </DialogActions>

    </form>
  );
};


export default EmployeeForm;