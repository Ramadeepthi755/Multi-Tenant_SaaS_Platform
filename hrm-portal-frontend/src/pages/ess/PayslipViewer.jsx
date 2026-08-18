import React from "react";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import {
  Download,
  Print,
  Close,
} from "@mui/icons-material";

const PayslipViewer = ({
  open,
  onClose,
  payroll,
}) => {

  if (!payroll) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount) => {
    return `₹ ${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Payslip Preview
      </DialogTitle>

      <DialogContent>

        <Paper
          elevation={2}
          sx={{
            p: 4,
            mt: 1,
          }}
        >

          {/* Company */}

          <Box
            textAlign="center"
            mb={3}
          >

            <Typography variant="h4">
              ABC Technologies Pvt Ltd
            </Typography>

            <Typography color="text.secondary">
              Employee Salary Payslip
            </Typography>

          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Employee Details */}

          <Grid
            container
            spacing={2}
          >

            <Grid item xs={6}>

              <Typography>
                <strong>Name:</strong>{" "}
                {payroll.employeeName}
              </Typography>

              <Typography>
                <strong>Employee ID:</strong>{" "}
                {payroll.employeeCode}
              </Typography>

              <Typography>
                <strong>Department:</strong>{" "}
                {payroll.department}
              </Typography>

            </Grid>

            <Grid item xs={6}>

              <Typography>
                <strong>Designation:</strong>{" "}
                {payroll.designation}
              </Typography>

              <Typography>
                <strong>Month:</strong>{" "}
                {payroll.month}
              </Typography>

              <Typography>
                <strong>Year:</strong>{" "}
                {payroll.year}
              </Typography>

            </Grid>

          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Earnings */}

          <Typography
            variant="h6"
            gutterBottom
          >
            Earnings
          </Typography>

          <Grid
            container
            spacing={2}
            mb={2}
          >

            <Grid item xs={8}>
              Basic Salary
            </Grid>

            <Grid item xs={4}>
              {formatCurrency(
                payroll.basicSalary
              )}
            </Grid>

            <Grid item xs={8}>
              HRA
            </Grid>

            <Grid item xs={4}>
              {formatCurrency(
                payroll.hra
              )}
            </Grid>

            <Grid item xs={8}>
              Special Allowance
            </Grid>

            <Grid item xs={4}>
              {formatCurrency(
                payroll.allowances
              )}
            </Grid>

            <Grid item xs={8}>
              Bonus
            </Grid>

            <Grid item xs={4}>
              {formatCurrency(
                payroll.bonus
              )}
            </Grid>

          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Deductions */}

          <Typography
            variant="h6"
            gutterBottom
          >
            Deductions
          </Typography>

          <Grid
            container
            spacing={2}
            mb={2}
          >

            <Grid item xs={8}>
              Provident Fund
            </Grid>

            <Grid item xs={4}>
              {formatCurrency(
                payroll.pf
              )}
            </Grid>

            <Grid item xs={8}>
              Professional Tax
            </Grid>

            <Grid item xs={4}>
              {formatCurrency(
                payroll.professionalTax
              )}
            </Grid>

            <Grid item xs={8}>
              Income Tax
            </Grid>

            <Grid item xs={4}>
              {formatCurrency(
                payroll.incomeTax
              )}
            </Grid>

            <Grid item xs={8}>
              Other Deductions
            </Grid>

            <Grid item xs={4}>
              {formatCurrency(
                payroll.deductions
              )}
            </Grid>

          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Summary */}

          <Paper
            elevation={1}
            sx={{
              p: 3,
              backgroundColor: "#f8f9fa",
            }}
          >

            <Grid container spacing={2}>

              <Grid item xs={6}>
                <Typography variant="h6">
                  Gross Salary
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography
                  variant="h6"
                  align="right"
                >
                  {formatCurrency(
                    payroll.grossSalary
                  )}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h6">
                  Total Deductions
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography
                  variant="h6"
                  align="right"
                >
                  {formatCurrency(
                    payroll.totalDeductions
                  )}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={6}>
                <Typography
                  variant="h5"
                  color="primary"
                >
                  Net Salary
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography
                  variant="h5"
                  align="right"
                  color="primary"
                >
                  {formatCurrency(
                    payroll.netSalary
                  )}
                </Typography>
              </Grid>

            </Grid>

          </Paper>

          <Box
            mt={4}
            textAlign="center"
          >

            <Typography
              variant="body2"
              color="text.secondary"
            >
              This is a system-generated payslip and
              does not require a signature.
            </Typography>

          </Box>

        </Paper>

      </DialogContent>

      <DialogActions>

        <Button
          startIcon={<Print />}
          onClick={handlePrint}
        >
          Print
        </Button>

        <Button
          startIcon={<Download />}
        >
          Download
        </Button>

        <Button
          startIcon={<Close />}
          onClick={onClose}
        >
          Close
        </Button>

      </DialogActions>

    </Dialog>
  );

};

export default PayslipViewer;