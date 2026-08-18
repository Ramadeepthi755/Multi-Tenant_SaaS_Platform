import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import {
  Grid,
} from "@mui/material";

const PayrollDetails = ({
  open,
  onClose,
  payroll,
}) => {

  if (!payroll) return null;

  const statusColor = (status) => {

    switch (status) {

      case "PAID":
        return "success";

      case "PENDING":
        return "warning";

      case "GENERATED":
        return "info";

      default:
        return "default";

    }

  };

  return (

    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >

      <DialogTitle>
        Payroll Details
      </DialogTitle>

      <DialogContent dividers>

        <Paper
          elevation={0}
          sx={{ p: 3 }}
        >

          <Typography
            variant="h6"
            gutterBottom
          >
            Employee Information
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Grid
            container
            spacing={2}
          >

            <Grid size={{ xs: 12, md: 6 }}>

              <Typography>
                <strong>Employee ID :</strong>
              </Typography>

              <Typography>
                {payroll.employeeId}
              </Typography>

            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>

              <Typography>
                <strong>Employee Name :</strong>
              </Typography>

              <Typography>
                {payroll.employeeName}
              </Typography>

            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>

              <Typography>
                <strong>Department :</strong>
              </Typography>

              <Typography>
                {payroll.departmentName}
              </Typography>

            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>

              <Typography>
                <strong>Designation :</strong>
              </Typography>

              <Typography>
                {payroll.designationName}
              </Typography>

            </Grid>

          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="h6"
            gutterBottom
          >
            Salary Details
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Grid
            container
            spacing={2}
          >

            <Grid size={{ xs: 12, md: 4 }}>

              <Typography>
                <strong>Basic Salary</strong>
              </Typography>

              <Typography>
                ₹ {payroll.basicSalary}
              </Typography>

            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>

              <Typography>
                <strong>HRA</strong>
              </Typography>

              <Typography>
                ₹ {payroll.hra}
              </Typography>

            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>

              <Typography>
                <strong>DA</strong>
              </Typography>

              <Typography>
                ₹ {payroll.da}
              </Typography>

            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>

              <Typography>
                <strong>Bonus</strong>
              </Typography>

              <Typography>
                ₹ {payroll.bonus}
              </Typography>

            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>

              <Typography>
                <strong>Other Allowance</strong>
              </Typography>

              <Typography>
                ₹ {payroll.otherAllowance}
              </Typography>

            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>

              <Typography fontWeight="bold">
                Gross Salary
              </Typography>

              <Typography
                variant="h6"
                color="primary"
              >
                ₹ {payroll.grossSalary}
              </Typography>

            </Grid>

          </Grid>
                    <Divider sx={{ my: 3 }} />

          <Typography
            variant="h6"
            gutterBottom
          >
            Deductions
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Grid
            container
            spacing={2}
          >

            <Grid size={{ xs: 12, md: 4 }}>

              <Typography>
                <strong>PF</strong>
              </Typography>

              <Typography>
                ₹ {payroll.pf}
              </Typography>

            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>

              <Typography>
                <strong>ESI</strong>
              </Typography>

              <Typography>
                ₹ {payroll.esi}
              </Typography>

            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>

              <Typography>
                <strong>Professional Tax</strong>
              </Typography>

              <Typography>
                ₹ {payroll.professionalTax}
              </Typography>

            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>

              <Typography>
                <strong>Leave Deduction</strong>
              </Typography>

              <Typography>
                ₹ {payroll.leaveDeduction}
              </Typography>

            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>

              <Typography>
                <strong>Other Deduction</strong>
              </Typography>

              <Typography>
                ₹ {payroll.otherDeduction}
              </Typography>

            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>

              <Typography fontWeight="bold">
                Total Deduction
              </Typography>

              <Typography
                variant="h6"
                color="error"
              >
                ₹ {payroll.totalDeduction}
              </Typography>

            </Grid>

          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="h6"
            gutterBottom
          >
            Payroll Information
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Grid
            container
            spacing={2}
          >

            <Grid size={{ xs: 12, md: 4 }}>

              <Typography>
                <strong>Month</strong>
              </Typography>

              <Typography>
                {payroll.month}
              </Typography>

            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>

              <Typography>
                <strong>Year</strong>
              </Typography>

              <Typography>
                {payroll.year}
              </Typography>

            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>

              <Typography>
                <strong>Payment Date</strong>
              </Typography>

              <Typography>
                {payroll.paymentDate}
              </Typography>

            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>

              <Typography fontWeight="bold">
                Net Salary
              </Typography>

              <Typography
                variant="h4"
                color="success.main"
                fontWeight="bold"
              >
                ₹ {payroll.netSalary}
              </Typography>

            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>

              <Typography
                fontWeight="bold"
                gutterBottom
              >
                Payroll Status
              </Typography>

              <Chip
                label={payroll.payrollStatus}
                color={statusColor(
                  payroll.payrollStatus
                )}
                size="medium"
              />

            </Grid>

          </Grid>

        </Paper>

      </DialogContent>

      <DialogActions>

        <Button
          variant="contained"
          onClick={onClose}
        >
          Close
        </Button>

      </DialogActions>

    </Dialog>

  );

};

export default PayrollDetails;