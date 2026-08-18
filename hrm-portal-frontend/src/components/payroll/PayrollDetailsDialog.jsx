import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography
} from "@mui/material";


import CloseOutlinedIcon
  from "@mui/icons-material/CloseOutlined";


import PayrollStatusChip
  from "./PayrollStatusChip";


import {
  formatCurrency,
  formatDate,
  getMonthLabel
} from "../../utils/payrollUtils";


const Detail = ({
  label,
  value
}) => {

  return (
    <Box>

      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={750}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        fontWeight={800}
        sx={{
          mt: 0.3
        }}
      >
        {value || "—"}
      </Typography>

    </Box>
  );
};


const PayrollDetailsDialog = ({
  open,
  payroll,
  onClose
}) => {

  if (!payroll) {
    return null;
  }


  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
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
              Payroll Details
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {payroll.employeeName}
            </Typography>

          </Box>

          <IconButton
            onClick={onClose}
          >
            <CloseOutlinedIcon />
          </IconButton>

        </Stack>

      </DialogTitle>


      <DialogContent dividers>

        <Stack spacing={3}>

          <Stack
            direction={{
              xs: "column",
              sm: "row"
            }}
            justifyContent="space-between"
            spacing={2}
          >

            <Box>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Pay Period
              </Typography>

              <Typography
                variant="h6"
                fontWeight={900}
              >
                {
                  payroll.month
                    ? getMonthLabel(
                        payroll.month
                      )
                    : "—"
                }{" "}
                {payroll.year || ""}
              </Typography>

            </Box>


            <PayrollStatusChip
              status={
                payroll.status
              }
            />

          </Stack>


          <Divider />


          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)"
              },
              gap: 2.5
            }}
          >

            <Detail
              label="Employee"
              value={
                payroll.employeeName
              }
            />

            <Detail
              label="Employee Code"
              value={
                payroll.employeeCode ||
                payroll.employeeId
              }
            />

            <Detail
              label="Department"
              value={
                payroll.department
              }
            />

            <Detail
              label="Designation"
              value={
                payroll.designation
              }
            />

            <Detail
              label="Working Days"
              value={
                payroll.workingDays
              }
            />

            <Detail
              label="Paid Days"
              value={
                payroll.paidDays
              }
            />

          </Box>


          <Box
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor:
                "action.hover"
            }}
          >

            <Typography
              variant="subtitle1"
              fontWeight={900}
              sx={{
                mb: 2
              }}
            >
              Salary Breakdown
            </Typography>


            <Stack spacing={1.5}>

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
                  fontWeight={900}
                >
                  {
                    formatCurrency(
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
                  Tax
                </Typography>

                <Typography
                  fontWeight={800}
                >
                  {
                    formatCurrency(
                      payroll.tax
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
                  Provident Fund
                </Typography>

                <Typography
                  fontWeight={800}
                >
                  {
                    formatCurrency(
                      payroll.providentFund
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
                  Other Deductions
                </Typography>

                <Typography
                  fontWeight={800}
                >
                  {
                    formatCurrency(
                      payroll.otherDeductions
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
                  variant="subtitle1"
                  fontWeight={900}
                >
                  Net Salary
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={900}
                  color="primary.main"
                >
                  {
                    formatCurrency(
                      payroll.netSalary
                    )
                  }
                </Typography>

              </Stack>

            </Stack>

          </Box>


          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr"
              },
              gap: 2
            }}
          >

            <Detail
              label="Payment Date"
              value={
                formatDate(
                  payroll.paymentDate
                )
              }
            />

            <Detail
              label="Created Date"
              value={
                formatDate(
                  payroll.createdDate
                )
              }
            />

          </Box>

        </Stack>

      </DialogContent>

    </Dialog>
  );
};


export default PayrollDetailsDialog;