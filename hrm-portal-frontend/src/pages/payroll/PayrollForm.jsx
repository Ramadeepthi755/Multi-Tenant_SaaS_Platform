import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

const MONTHS = [
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
  "DECEMBER",
];

const STATUS = [
  "PENDING",
  "PAID",
];

const PayrollForm = ({
  payroll,
  onSubmit,
}) => {

  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({

    employeeId: "",

    basicSalary: "",

    hra: "",

    da: "",

    bonus: "",

    otherAllowance: "",

    pf: "",

    esi: "",

    professionalTax: "",

    leaveDeduction: "",

    otherDeduction: "",

    payrollMonth: "",

    payrollYear: currentYear,

    paymentDate: "",

    status: "PENDING",

  });

  useEffect(() => {

    if (payroll) {

      setFormData((prev) => ({
        ...prev,
        ...payroll,
      }));

    }

  }, [payroll]);

  const handleChange = (e) => {

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  };

  const grossSalary = useMemo(() => {

    return (
      Number(formData.basicSalary || 0) +
      Number(formData.hra || 0) +
      Number(formData.da || 0) +
      Number(formData.bonus || 0) +
      Number(formData.otherAllowance || 0)
    );

  }, [formData]);

  const totalDeduction = useMemo(() => {

    return (
      Number(formData.pf || 0) +
      Number(formData.esi || 0) +
      Number(formData.professionalTax || 0) +
      Number(formData.leaveDeduction || 0) +
      Number(formData.otherDeduction || 0)
    );

  }, [formData]);

  const netSalary = grossSalary - totalDeduction;

 const handleSubmit = (e) => {

  e.preventDefault();

  onSubmit({
    ...formData,
    grossSalary,
    totalDeduction,
    netSalary,
  });

};

return (

<form
  id="payroll-form"
  onSubmit={handleSubmit}
>

<Box>
      {/* Employee Information */}

      <Card
        variant="outlined"
        sx={{ mb: 3 }}
      >

        <CardContent>

          <Typography
            variant="h6"
            fontWeight={700}
          >
            Employee Information
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>

            <Grid item xs={12} md={6}>

              <TextField
                fullWidth
                required
                label="Employee ID"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
              />

            </Grid>

          </Grid>

        </CardContent>

      </Card>

      {/* Earnings */}

      <Card
        variant="outlined"
        sx={{ mb: 3 }}
      >

        <CardContent>

          <Typography
            variant="h6"
            fontWeight={700}
          >
            Earnings
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>

            <Grid item xs={12} md={6}>

              <TextField
                fullWidth
                required
                type="number"
                label="Basic Salary"
                name="basicSalary"
                value={formData.basicSalary}
                onChange={handleChange}
              />

            </Grid>

            <Grid item xs={12} md={6}>

              <TextField
                fullWidth
                type="number"
                label="HRA"
                name="hra"
                value={formData.hra}
                onChange={handleChange}
              />

            </Grid>

            <Grid item xs={12} md={6}>

              <TextField
                fullWidth
                type="number"
                label="DA"
                name="da"
                value={formData.da}
                onChange={handleChange}
              />

            </Grid>

            <Grid item xs={12} md={6}>

              <TextField
                fullWidth
                type="number"
                label="Bonus"
                name="bonus"
                value={formData.bonus}
                onChange={handleChange}
              />

            </Grid>

            <Grid item xs={12} md={6}>

              <TextField
                fullWidth
                type="number"
                label="Other Allowance"
                name="otherAllowance"
                value={formData.otherAllowance}
                onChange={handleChange}
              />

            </Grid>

          </Grid>

        </CardContent>

      </Card>
            {/* Deductions */}

      <Card
        variant="outlined"
        sx={{ mb: 3 }}
      >

        <CardContent>

          <Typography
            variant="h6"
            fontWeight={700}
          >
            Deductions
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>

            <Grid item xs={12} md={6}>

              <TextField
                fullWidth
                type="number"
                label="PF"
                name="pf"
                value={formData.pf}
                onChange={handleChange}
              />

            </Grid>

            <Grid item xs={12} md={6}>

              <TextField
                fullWidth
                type="number"
                label="ESI"
                name="esi"
                value={formData.esi}
                onChange={handleChange}
              />

            </Grid>

            <Grid item xs={12} md={6}>

              <TextField
                fullWidth
                type="number"
                label="Professional Tax"
                name="professionalTax"
                value={formData.professionalTax}
                onChange={handleChange}
              />

            </Grid>

            <Grid item xs={12} md={6}>

              <TextField
                fullWidth
                type="number"
                label="Leave Deduction"
                name="leaveDeduction"
                value={formData.leaveDeduction}
                onChange={handleChange}
              />

            </Grid>

            <Grid item xs={12} md={6}>

              <TextField
                fullWidth
                type="number"
                label="Other Deduction"
                name="otherDeduction"
                value={formData.otherDeduction}
                onChange={handleChange}
              />

            </Grid>

          </Grid>

        </CardContent>

      </Card>

      {/* Payroll Information */}

      <Card
        variant="outlined"
        sx={{ mb: 3 }}
      >

        <CardContent>

          <Typography
            variant="h6"
            fontWeight={700}
          >
            Payroll Information
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>

            <Grid item xs={12} md={6}>

              <TextField
                select
                fullWidth
                required
                label="Payroll Month"
                name="payrollMonth"
                value={formData.payrollMonth}
                onChange={handleChange}
              >

                {MONTHS.map((month) => (

                  <MenuItem
                    key={month}
                    value={month}
                  >
                    {month.replaceAll("_", " ")}
                  </MenuItem>

                ))}

              </TextField>

            </Grid>

            <Grid item xs={12} md={6}>

              <TextField
                fullWidth
                required
                type="number"
                label="Payroll Year"
                name="payrollYear"
                value={formData.payrollYear}
                onChange={handleChange}
              />

            </Grid>

            <Grid item xs={12} md={6}>

              <TextField
                fullWidth
                type="date"
                label="Payment Date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />

            </Grid>

            <Grid item xs={12} md={6}>

              <TextField
                select
                fullWidth
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >

                {STATUS.map((status) => (

                  <MenuItem
                    key={status}
                    value={status}
                  >
                    {status}
                  </MenuItem>

                ))}

              </TextField>

            </Grid>

          </Grid>

        </CardContent>

      </Card>

      {/* Salary Summary */}

      <Card
        elevation={2}
        sx={{
          mb: 3,
          backgroundColor: "#f8fafc",
        }}
      >

        <CardContent>

          <Typography
            variant="h6"
            fontWeight={700}
          >
            Salary Summary
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>

            <Grid item xs={12} md={6}>

              <TextField
                fullWidth
                label="Gross Salary"
                value={grossSalary}
                InputProps={{
                  readOnly: true,
                }}
              />

            </Grid>

            <Grid item xs={12} md={6}>

              <TextField
                fullWidth
                label="Total Deduction"
                value={totalDeduction}
                InputProps={{
                  readOnly: true,
                }}
              />

            </Grid>

            <Grid item xs={12} md={6}>

              <TextField
                fullWidth
                label="Net Salary"
                value={netSalary}
                InputProps={{
                  readOnly: true,
                }}
              />

            </Grid>

          </Grid>

        </CardContent>

      </Card>
            {/* End of Form */}

       </Box>

</form>

);

};

export default PayrollForm;