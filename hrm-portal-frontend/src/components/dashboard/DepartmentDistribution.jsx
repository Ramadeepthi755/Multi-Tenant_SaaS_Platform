import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography
} from "@mui/material";


const DepartmentDistribution = ({
  departments = []
}) => {

  const normalized =
    departments
      .map(item => ({
        name:
          item.departmentName ||
          item.name ||
          "Department",

        count:
          Number(
            item.employeeCount ??
            item.count ??
            item.totalEmployees ??
            0
          )
      }))
      .sort(
        (a, b) =>
          b.count - a.count
      )
      .slice(0, 8);


  const maximum =
    Math.max(
      ...normalized.map(
        item => item.count
      ),
      1
    );


  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor:
          "divider",
        borderRadius: 3,
        height: "100%"
      }}
    >

      <CardContent
        sx={{
          p: 2.5
        }}
      >

        <Stack
          spacing={2}
        >

          <Box>

            <Typography
              fontWeight={850}
            >
              Department Workforce
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Employees by department
            </Typography>

          </Box>


          {normalized.length === 0 ? (

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                py: 3
              }}
            >
              Department distribution
              is not available yet.
            </Typography>

          ) : (

            normalized.map(
              department => {

                const width =
                  Math.max(
                    4,
                    (
                      department.count /
                      maximum
                    ) * 100
                  );


                return (
                  <Box
                    key={
                      department.name
                    }
                  >

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{
                        mb: 0.75
                      }}
                    >

                      <Typography
                        variant="body2"
                        fontWeight={700}
                      >
                        {
                          department.name
                        }
                      </Typography>

                      <Typography
                        variant="body2"
                        fontWeight={850}
                      >
                        {
                          department.count
                        }
                      </Typography>

                    </Stack>


                    <Box
                      sx={{
                        height: 8,
                        bgcolor:
                          "action.hover",
                        borderRadius: 10,
                        overflow: "hidden"
                      }}
                    >

                      <Box
                        sx={{
                          width:
                            `${width}%`,
                          height: "100%",
                          bgcolor:
                            "primary.main",
                          borderRadius: 10
                        }}
                      />

                    </Box>

                  </Box>
                );

              }
            )

          )}

        </Stack>

      </CardContent>

    </Card>
  );
};


export default DepartmentDistribution;