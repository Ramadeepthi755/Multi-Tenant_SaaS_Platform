import {
  Avatar,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from "@mui/material";


import VisibilityOutlinedIcon
  from "@mui/icons-material/VisibilityOutlined";

import ReceiptLongOutlinedIcon
  from "@mui/icons-material/ReceiptLongOutlined";


import PayrollStatusChip
  from "./PayrollStatusChip";


import {
  formatCurrency,
  getMonthLabel
} from "../../utils/payrollUtils";


const PayrollTable = ({
  payrolls = [],
  onView,
  onPayslip
}) => {

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "auto"
      }}
    >

      <Table
        sx={{
          minWidth: 1100
        }}
      >

        <TableHead>

          <TableRow
            sx={{
              bgcolor:
                "action.hover"
            }}
          >

            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                EMPLOYEE
              </Typography>
            </TableCell>

            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                PAY PERIOD
              </Typography>
            </TableCell>

            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                GROSS
              </Typography>
            </TableCell>

            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                DEDUCTIONS
              </Typography>
            </TableCell>

            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                NET SALARY
              </Typography>
            </TableCell>

            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                STATUS
              </Typography>
            </TableCell>

            <TableCell align="right">
              <Typography
                variant="caption"
                fontWeight={900}
              >
                ACTIONS
              </Typography>
            </TableCell>

          </TableRow>

        </TableHead>


        <TableBody>

          {payrolls.map(payroll => {

            const name =
              payroll.employeeName ||
              "Unknown Employee";

            const initials =
              name
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map(
                  part => part[0]
                )
                .join("")
                .toUpperCase();


            return (
              <TableRow
                key={payroll.id}
                hover
              >

                <TableCell>

                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                  >

                    <Avatar
                      sx={{
                        width: 38,
                        height: 38,
                        fontSize: 13,
                        fontWeight: 900
                      }}
                    >
                      {initials}
                    </Avatar>

                    <Stack>

                      <Typography
                        variant="body2"
                        fontWeight={850}
                      >
                        {name}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {
                          payroll.employeeCode ||
                          payroll.employeeId ||
                          "—"
                        }
                      </Typography>

                    </Stack>

                  </Stack>

                </TableCell>


                <TableCell>

                  <Typography
                    variant="body2"
                    fontWeight={800}
                  >
                    {
                      payroll.month
                        ? getMonthLabel(
                            payroll.month
                          )
                        : "—"
                    }
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {payroll.year || "—"}
                  </Typography>

                </TableCell>


                <TableCell>

                  <Typography
                    variant="body2"
                    fontWeight={800}
                  >
                    {
                      formatCurrency(
                        payroll.grossSalary
                      )
                    }
                  </Typography>

                </TableCell>


                <TableCell>

                  <Typography
                    variant="body2"
                    fontWeight={800}
                  >
                    {
                      formatCurrency(
                        payroll.deductions
                      )
                    }
                  </Typography>

                </TableCell>


                <TableCell>

                  <Typography
                    variant="body2"
                    fontWeight={900}
                  >
                    {
                      formatCurrency(
                        payroll.netSalary
                      )
                    }
                  </Typography>

                </TableCell>


                <TableCell>

                  <PayrollStatusChip
                    status={
                      payroll.status
                    }
                  />

                </TableCell>


                <TableCell align="right">

                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    spacing={0.5}
                  >

                    <Tooltip title="View payroll">

                      <IconButton
                        size="small"
                        onClick={() =>
                          onView(payroll)
                        }
                      >
                        <VisibilityOutlinedIcon
                          fontSize="small"
                        />
                      </IconButton>

                    </Tooltip>


                    <Tooltip title="View payslip">

                      <IconButton
                        size="small"
                        onClick={() =>
                          onPayslip(payroll)
                        }
                      >
                        <ReceiptLongOutlinedIcon
                          fontSize="small"
                        />
                      </IconButton>

                    </Tooltip>

                  </Stack>

                </TableCell>

              </TableRow>
            );
          })}


          {!payrolls.length && (

            <TableRow>

              <TableCell colSpan={7}>

                <Stack
                  alignItems="center"
                  sx={{
                    py: 8
                  }}
                >

                  <Typography
                    variant="h6"
                    fontWeight={850}
                  >
                    No payroll records found
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Try changing your
                    filters or search criteria.
                  </Typography>

                </Stack>

              </TableCell>

            </TableRow>

          )}

        </TableBody>

      </Table>

    </TableContainer>
  );
};


export default PayrollTable;