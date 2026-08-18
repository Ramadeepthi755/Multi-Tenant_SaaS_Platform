import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography
} from "@mui/material";


import DownloadOutlinedIcon
  from "@mui/icons-material/DownloadOutlined";


import CloseOutlinedIcon
  from "@mui/icons-material/CloseOutlined";


import IconButton
  from "@mui/material/IconButton";


import {
  formatCurrency,
  formatDate,
  getMonthLabel
} from "../../utils/payrollUtils";


const PayrollPayslipDialog = ({
  open,
  payroll,
  payslip,
  loading = false,
  error = "",
  onClose,
  onDownload
}) => {

  if (!payroll) {
    return null;
  }


  const source =
    payslip || payroll;


  return (
    <Dialog
      open={open}
      onClose={
        loading
          ? undefined
          : onClose
      }
      fullWidth
      maxWidth="sm"
    >

      <DialogTitle>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >

          <Box>

            <Typography
              variant="h6"
              fontWeight={900}
            >
              Payslip
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {
                payroll.employeeName
              }
            </Typography>

          </Box>

          <IconButton
            onClick={onClose}
            disabled={loading}
          >
            <CloseOutlinedIcon />
          </IconButton>

        </Stack>

      </DialogTitle>


      <DialogContent dividers>

        <Stack spacing={2.5}>

          {error && (

            <Alert severity="error">
              {error}
            </Alert>

          )}


          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor:
                "divider"
            }}
          >

            <Stack
              alignItems="center"
              spacing={0.5}
              sx={{
                mb: 3
              }}
            >

              <Typography
                variant="h5"
                fontWeight={950}
              >
                PAYSLIP
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {
                  payroll.month
                    ? getMonthLabel(
                        payroll.month
                      )
                    : "Pay Period"
                }{" "}
                {payroll.year || ""}
              </Typography>

            </Stack>


            <Divider
              sx={{
                mb: 2.5
              }}
            />


            <Stack spacing={1.5}>

              <Stack
                direction="row"
                justifyContent="space-between"
              >

                <Typography
                  color="text.secondary"
                >
                  Employee
                </Typography>

                <Typography
                  fontWeight={800}
                >
                  {
                    source.employeeName ||
                    payroll.employeeName
                  }
                </Typography>

              </Stack>


              <Stack
                direction="row"
                justifyContent="space-between"
              >

                <Typography
                  color="text.secondary"
                >
                  Employee Code
                </Typography>

                <Typography
                  fontWeight={800}
                >
                  {
                    source.employeeCode ||
                    payroll.employeeCode ||
                    "—"
                  }
                </Typography>

              </Stack>


              <Stack
                direction="row"
                justifyContent="space-between"
              >

                <Typography
                  color="text.secondary"
                >
                  Basic Salary
                </Typography>

                <Typography
                  fontWeight={800}
                >
                  {
                    formatCurrency(
                      source.basicSalary ??
                      payroll.basicSalary
                    )
                  }
                </Typography>

              </Stack>


              <Stack
                direction="row"
                justifyContent="space-between"
              >

                <Typography
                  color="text.secondary"
                >
                  Allowances
                </Typography>

                <Typography
                  fontWeight={800}
                >
                  {
                    formatCurrency(
                      source.allowances ??
                      payroll.allowances
                    )
                  }
                </Typography>

              </Stack>


              <Stack
                direction="row"
                justifyContent="space-between"
              >

                <Typography
                  color="text.secondary"
                >
                  Gross Salary
                </Typography>

                <Typography
                  fontWeight={850}
                >
                  {
                    formatCurrency(
                      source.grossSalary ??
                      payroll.grossSalary
                    )
                  }
                </Typography>

              </Stack>


              <Divider />


              <Stack
                direction="row"
                justifyContent="space-between"
              >

                <Typography
                  color="text.secondary"
                >
                  Deductions
                </Typography>

                <Typography
                  fontWeight={800}
                >
                  {
                    formatCurrency(
                      source.deductions ??
                      payroll.deductions
                    )
                  }
                </Typography>

              </Stack>


              <Divider />


              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{
                  mt: 1
                }}
              >

                <Typography
                  variant="subtitle1"
                  fontWeight={950}
                >
                  NET PAY
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={950}
                  color="primary.main"
                >
                  {
                    formatCurrency(
                      source.netSalary ??
                      payroll.netSalary
                    )
                  }
                </Typography>

              </Stack>


              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{
                  mt: 1
                }}
              >

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Payment Date
                </Typography>

                <Typography
                  variant="caption"
                  fontWeight={800}
                >
                  {
                    formatDate(
                      source.paymentDate ??
                      payroll.paymentDate
                    )
                  }
                </Typography>

              </Stack>

            </Stack>

          </Box>

        </Stack>

      </DialogContent>


      <DialogActions
        sx={{
          p: 2
        }}
      >

        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            fontWeight: 800
          }}
        >
          Close
        </Button>


        <Button
          variant="contained"
          startIcon={
            loading
              ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                />
              )
              : (
                <DownloadOutlinedIcon />
              )
          }
          onClick={onDownload}
          disabled={loading}
          sx={{
            fontWeight: 850
          }}
        >
          {loading
            ? "Preparing..."
            : "Download Payslip"}
        </Button>

      </DialogActions>

    </Dialog>
  );
};


export default PayrollPayslipDialog;