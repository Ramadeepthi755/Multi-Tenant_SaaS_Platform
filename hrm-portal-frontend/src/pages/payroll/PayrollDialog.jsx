import {
  useEffect,
  useState
} from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Grid
} from "@mui/material";

import {
  createPayroll
} from "../../services/payrollService";


const initialState = {

  employeeId: "",

  month: "",

  year:
    new Date().getFullYear(),

  basicSalary: "",

  hra: "",

  da: "",

  bonus: "",

  otherAllowance: "",

  pf: "",

  esi: "",

  professionalTax: "",

  leaveDeduction: "",

  otherDeduction: ""

};


const PayrollDialog = ({
  open,
  onClose,
  payroll,
  reload
}) => {

  const [
    formData,
    setFormData
  ] = useState({
    ...initialState
  });


  const [
    loading,
    setLoading
  ] = useState(false);


  // =========================================================
  // INITIALIZE FORM
  // =========================================================

  useEffect(() => {

    if (!open) {
      return;
    }


    if (payroll) {

      setFormData({

        employeeId:
          payroll.employeeId || "",

        month:
          payroll.month || "",

        year:
          payroll.year ||
          new Date().getFullYear(),

        basicSalary:
          payroll.basicSalary ?? "",

        hra: "",

        da: "",

        bonus: "",

        otherAllowance:
          payroll.allowances ?? "",

        pf: "",

        esi: "",

        professionalTax: "",

        leaveDeduction: "",

        otherDeduction:
          payroll.deductions ?? ""

      });

    } else {

      setFormData({
        ...initialState
      });

    }

  }, [
    payroll,
    open
  ]);


  // =========================================================
  // HANDLE CHANGE
  // =========================================================

  const handleChange = (
    event
  ) => {

    const {
      name,
      value
    } = event.target;


    setFormData(
      previous => ({
        ...previous,
        [name]: value
      })
    );

  };


  // =========================================================
  // NUMBER VALUE
  // =========================================================

  const numberValue = (
    value
  ) => {

    const number =
      Number(value);


    return Number.isFinite(
      number
    )
      ? number
      : 0;

  };


  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit =
    async () => {

      /*
       * Current backend supports
       * payroll generation.
       *
       * There is currently no
       * PUT /api/payroll/{id}.
       */

      if (payroll) {

        alert(
          "Editing an existing payroll is not supported by the current backend."
        );

        return;

      }


      if (
        !formData.employeeId
      ) {

        alert(
          "Employee ID is required."
        );

        return;

      }


      if (
        !formData.month
      ) {

        alert(
          "Month is required."
        );

        return;

      }


      if (
        !formData.basicSalary
      ) {

        alert(
          "Basic salary is required."
        );

        return;

      }


      try {

        setLoading(true);


        const basicSalary =
          numberValue(
            formData.basicSalary
          );


        const allowances =

          numberValue(
            formData.hra
          ) +

          numberValue(
            formData.da
          ) +

          numberValue(
            formData.bonus
          ) +

          numberValue(
            formData.otherAllowance
          );


        const deductions =

          numberValue(
            formData.pf
          ) +

          numberValue(
            formData.esi
          ) +

          numberValue(
            formData.professionalTax
          ) +

          numberValue(
            formData.leaveDeduction
          ) +

          numberValue(
            formData.otherDeduction
          );


        const payload = {

          employeeId:
            Number(
              formData.employeeId
            ),

          month:
            formData.month,

          year:
            Number(
              formData.year
            ),

          basicSalary:
            basicSalary,

          allowances:
            allowances,

          deductions:
            deductions

        };


        console.log(
          "========== PAYROLL CREATE =========="
        );

        console.log(
          "PAYLOAD:",
          payload
        );


        await createPayroll(
          payload
        );


        if (reload) {

          await reload();

        }


        onClose();

      } catch (error) {

        console.error(
          "Payroll Save Error:",
          error
        );


        console.error(
          "Response:",
          error?.response?.data
        );


        alert(
          error?.response?.data?.message ||
          "Unable to generate payroll."
        );

      } finally {

        setLoading(false);

      }

    };


  return (

    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
    >

      <DialogTitle>

        {payroll
          ? "View Payroll"
          : "Generate Payroll"}

      </DialogTitle>


      <DialogContent
        dividers
      >

        <Grid
          container
          spacing={2}
          sx={{
            mt: 1
          }}
        >

          {/* EMPLOYEE ID */}

          <Grid
            size={{
              xs: 12,
              md: 4
            }}
          >

            <TextField
              fullWidth
              required
              type="number"
              label="Employee ID"
              name="employeeId"
              value={
                formData.employeeId
              }
              onChange={
                handleChange
              }
              disabled={
                Boolean(payroll)
              }
            />

          </Grid>


          {/* MONTH */}

          <Grid
            size={{
              xs: 12,
              md: 4
            }}
          >

            <TextField
              select
              fullWidth
              required
              label="Month"
              name="month"
              value={
                formData.month
              }
              onChange={
                handleChange
              }
              disabled={
                Boolean(payroll)
              }
            >

              {[
                "JANUARY",
                "FEBRUARY",
                "MARCH",
                "APRIL",
                "MAY",
                "JUNE",
                "JULY",
                "AUGUST",
                "SEPTEMBER",
                "OCTOBER",
                "NOVEMBER",
                "DECEMBER"
              ].map(
                month => (

                  <MenuItem
                    key={month}
                    value={month}
                  >
                    {month}
                  </MenuItem>

                )
              )}

            </TextField>

          </Grid>


          {/* YEAR */}

          <Grid
            size={{
              xs: 12,
              md: 4
            }}
          >

            <TextField
              fullWidth
              required
              type="number"
              label="Year"
              name="year"
              value={
                formData.year
              }
              onChange={
                handleChange
              }
              disabled={
                Boolean(payroll)
              }
            />

          </Grid>


          {/* BASIC SALARY */}

          <Grid
            size={{
              xs: 12,
              md: 4
            }}
          >

            <TextField
              fullWidth
              required
              type="number"
              label="Basic Salary"
              name="basicSalary"
              value={
                formData.basicSalary
              }
              onChange={
                handleChange
              }
              disabled={
                Boolean(payroll)
              }
            />

          </Grid>


          {/* HRA */}

          <Grid
            size={{
              xs: 12,
              md: 4
            }}
          >

            <TextField
              fullWidth
              type="number"
              label="HRA"
              name="hra"
              value={
                formData.hra
              }
              onChange={
                handleChange
              }
              disabled={
                Boolean(payroll)
              }
            />

          </Grid>


          {/* DA */}

          <Grid
            size={{
              xs: 12,
              md: 4
            }}
          >

            <TextField
              fullWidth
              type="number"
              label="DA"
              name="da"
              value={
                formData.da
              }
              onChange={
                handleChange
              }
              disabled={
                Boolean(payroll)
              }
            />

          </Grid>


          {/* BONUS */}

          <Grid
            size={{
              xs: 12,
              md: 4
            }}
          >

            <TextField
              fullWidth
              type="number"
              label="Bonus"
              name="bonus"
              value={
                formData.bonus
              }
              onChange={
                handleChange
              }
              disabled={
                Boolean(payroll)
              }
            />

          </Grid>


          {/* OTHER ALLOWANCE */}

          <Grid
            size={{
              xs: 12,
              md: 4
            }}
          >

            <TextField
              fullWidth
              type="number"
              label="Other Allowance"
              name="otherAllowance"
              value={
                formData.otherAllowance
              }
              onChange={
                handleChange
              }
              disabled={
                Boolean(payroll)
              }
            />

          </Grid>


          {/* PF */}

          <Grid
            size={{
              xs: 12,
              md: 4
            }}
          >

            <TextField
              fullWidth
              type="number"
              label="PF"
              name="pf"
              value={
                formData.pf
              }
              onChange={
                handleChange
              }
              disabled={
                Boolean(payroll)
              }
            />

          </Grid>


          {/* ESI */}

          <Grid
            size={{
              xs: 12,
              md: 4
            }}
          >

            <TextField
              fullWidth
              type="number"
              label="ESI"
              name="esi"
              value={
                formData.esi
              }
              onChange={
                handleChange
              }
              disabled={
                Boolean(payroll)
              }
            />

          </Grid>


          {/* PROFESSIONAL TAX */}

          <Grid
            size={{
              xs: 12,
              md: 4
            }}
          >

            <TextField
              fullWidth
              type="number"
              label="Professional Tax"
              name="professionalTax"
              value={
                formData.professionalTax
              }
              onChange={
                handleChange
              }
              disabled={
                Boolean(payroll)
              }
            />

          </Grid>


          {/* LEAVE DEDUCTION */}

          <Grid
            size={{
              xs: 12,
              md: 4
            }}
          >

            <TextField
              fullWidth
              type="number"
              label="Leave Deduction"
              name="leaveDeduction"
              value={
                formData.leaveDeduction
              }
              onChange={
                handleChange
              }
              disabled={
                Boolean(payroll)
              }
            />

          </Grid>


          {/* OTHER DEDUCTION */}

          <Grid
            size={{
              xs: 12,
              md: 4
            }}
          >

            <TextField
              fullWidth
              type="number"
              label="Other Deduction"
              name="otherDeduction"
              value={
                formData.otherDeduction
              }
              onChange={
                handleChange
              }
              disabled={
                Boolean(payroll)
              }
            />

          </Grid>

        </Grid>

      </DialogContent>


      <DialogActions
        sx={{
          px: 3,
          py: 2
        }}
      >

        <Button
          variant="outlined"
          color="inherit"
          onClick={
            onClose
          }
          disabled={
            loading
          }
        >
          Close
        </Button>


        {!payroll && (

          <Button
            variant="contained"
            onClick={
              handleSubmit
            }
            disabled={
              loading
            }
          >
            {loading
              ? "Generating..."
              : "Generate Payroll"}
          </Button>

        )}

      </DialogActions>

    </Dialog>

  );

};


export default PayrollDialog;
