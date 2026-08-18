import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";

const RecentEmployeesTable = ({ employees = [] }) => {
  return (
    <Paper sx={{ p: 2 }}>

      <Typography
        variant="h6"
        gutterBottom
      >
        Recent Employees
      </Typography>

      <TableContainer>

        <Table>

          <TableHead>

            <TableRow>

              <TableCell><strong>Code</strong></TableCell>

              <TableCell><strong>Name</strong></TableCell>

              <TableCell><strong>Department</strong></TableCell>

              <TableCell><strong>Designation</strong></TableCell>

              <TableCell><strong>Joining Date</strong></TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {employees.length > 0 ? (

              employees.map((employee) => (

                <TableRow key={employee.employeeId}>

                  <TableCell>

                    <Chip
                      label={employee.employeeCode}
                      color="primary"
                      size="small"
                    />

                  </TableCell>

                  <TableCell>{employee.fullName}</TableCell>

                  <TableCell>{employee.department}</TableCell>

                  <TableCell>{employee.designation}</TableCell>

                  <TableCell>

                    {employee.joiningDate
                      ? new Date(employee.joiningDate).toLocaleDateString()
                      : "-"}

                  </TableCell>

                </TableRow>

              ))

            ) : (

              <TableRow>

                <TableCell
                  colSpan={5}
                  align="center"
                >
                  No Recent Employees
                </TableCell>

              </TableRow>

            )}

          </TableBody>

        </Table>

      </TableContainer>

    </Paper>
  );
};

export default RecentEmployeesTable;