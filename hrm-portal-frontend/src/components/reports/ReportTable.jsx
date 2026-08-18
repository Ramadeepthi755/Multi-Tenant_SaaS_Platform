import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";


const ReportTable = ({
  columns,
  rows,
  rowKey = "id"
}) => {

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border:
          "1px solid",
        borderColor:
          "divider",
        borderRadius: 3,
        overflowX: "auto"
      }}
    >

      <Table
        size="small"
        sx={{
          minWidth: 900
        }}
      >

        <TableHead>

          <TableRow>

            {columns.map(
              column => (

                <TableCell
                  key={
                    column.key
                  }
                  align={
                    column.align ||
                    "left"
                  }
                  sx={{
                    fontWeight: 900,
                    whiteSpace:
                      "nowrap"
                  }}
                >
                  {
                    column.label
                  }
                </TableCell>

              )
            )}

          </TableRow>

        </TableHead>


        <TableBody>

          {rows.map(
            (row, index) => (

              <TableRow
                key={
                  row[rowKey] ??
                  index
                }
                hover
              >

                {columns.map(
                  column => (

                    <TableCell
                      key={
                        column.key
                      }
                      align={
                        column.align ||
                        "left"
                      }
                    >

                      {column.render
                        ? column.render(
                            row
                          )
                        : (
                          <Typography
                            variant="body2"
                          >
                            {
                              row[
                                column.key
                              ] ?? "-"
                            }
                          </Typography>
                        )}

                    </TableCell>

                  )
                )}

              </TableRow>

            )
          )}

        </TableBody>

      </Table>

    </TableContainer>
  );
};


export default ReportTable;