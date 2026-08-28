import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography
} from "@mui/material";


import PeopleOutlinedIcon
  from "@mui/icons-material/PeopleOutlined";

import AccessTimeOutlinedIcon
  from "@mui/icons-material/AccessTimeOutlined";

import EventAvailableOutlinedIcon
  from "@mui/icons-material/EventAvailableOutlined";

import PaymentsOutlinedIcon
  from "@mui/icons-material/PaymentsOutlined";

import BusinessOutlinedIcon
  from "@mui/icons-material/BusinessOutlined";

import AssessmentOutlinedIcon
  from "@mui/icons-material/AssessmentOutlined";

import WorkOutlineOutlinedIcon
  from "@mui/icons-material/WorkOutlineOutlined";

import TrendingUpOutlinedIcon
  from "@mui/icons-material/TrendingUpOutlined";


import ArrowForwardOutlinedIcon
  from "@mui/icons-material/ArrowForwardOutlined";


import {
  useEffect,
  useState
} from "react";


import ReportPageHeader
  from "./ReportPageHeader";


import ReportSummaryCard
  from "../../components/reports/ReportSummaryCard";


import reportService
  from "../../services/reportService";


import {
  formatCurrency,
  formatNumber,
  getReportErrorMessage
} from "../../utils/reportUtils";


const ReportsDashboard = () => {

  const [
    overview,
    setOverview
  ] = useState(null);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState("");


  useEffect(() => {

    const loadOverview =
      async () => {

        setLoading(true);
        setError("");

        try {

          const response =
            await reportService
              .getWorkforceOverview();


          setOverview(
            response
          );

        } catch (requestError) {

          setError(
            getReportErrorMessage(
              requestError,
              "Unable to load workforce overview."
            )
          );

        } finally {

          setLoading(false);

        }

      };


    loadOverview();

  }, []);


  const getValue = (
    ...keys
  ) => {

    for (
      const key of keys
    ) {

      if (
        overview?.[key] !==
        undefined &&
        overview?.[key] !==
        null
      ) {

        return overview[key];

      }

    }

    return 0;

  };


  const reports = [

    {
      title:
        "Employee Report",

      description:
        "Employee directory, department, designation and status.",

      path:
        "/reports/employees",

      icon:
        <PeopleOutlinedIcon />

    },

    {
      title:
        "Attendance Report",

      description:
        "Attendance records, working hours and exceptions.",

      path:
        "/reports/attendance",

      icon:
        <AccessTimeOutlinedIcon />

    },

    {
      title:
        "Leave Report",

      description:
        "Leave requests, approvals and employee leave usage.",

      path:
        "/reports/leave",

      icon:
        <EventAvailableOutlinedIcon />

    },

    {
      title:
        "Payroll Report",

      description:
        "Payroll processing, gross salary, deductions and net salary.",

      path:
        "/reports/payroll",

      icon:
        <PaymentsOutlinedIcon />

    },

    {
      title:
        "Department Report",

      description:
        "Workforce distribution and department statistics.",

      path:
        "/reports/departments",

      icon:
        <BusinessOutlinedIcon />

    },

    {
      title:
        "Recruitment Report",

      description:
        "Candidate pipeline activity, statuses and application volume.",

      path:
        "/reports/recruitment",

      icon:
        <WorkOutlineOutlinedIcon />

    },

    {
      title:
        "Performance Report",

      description:
        "Persisted performance-review results by employee and review cycle.",

      path:
        "/reports/performance",

      icon:
        <TrendingUpOutlinedIcon />

    }

  ];


  return (
    <Box
      sx={{
        pb: 5
      }}
    >

      <ReportPageHeader

        title="Reports & Analytics"

        subtitle="Enterprise workforce insights and operational reporting."

        icon={
          <AssessmentOutlinedIcon />
        }

      />


      {error && (

        <Alert
          severity="warning"
          sx={{
            mb: 3,
            borderRadius: 3
          }}
        >
          {error}
        </Alert>

      )}


      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <Grid
        container
        spacing={2}
        sx={{
          mb: 4
        }}
      >

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3
          }}
        >

          <ReportSummaryCard

            title="Total Employees"

            value={
              loading
                ? "—"
                : formatNumber(
                    getValue(
                      "totalEmployees",
                      "employeeCount"
                    )
                  )
            }

            subtitle="Current workforce"

            icon={
              <PeopleOutlinedIcon />
            }

            color="primary"

          />

        </Grid>


        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3
          }}
        >

          <ReportSummaryCard

            title="Present Today"

            value={
              loading
                ? "—"
                : formatNumber(
                    getValue(
                      "presentToday",
                      "todayPresent"
                    )
                  )
            }

            subtitle="Attendance"

            icon={
              <AccessTimeOutlinedIcon />
            }

            color="success"

          />

        </Grid>


        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3
          }}
        >

          <ReportSummaryCard

            title="Pending Leaves"

            value={
              loading
                ? "—"
                : formatNumber(
                    getValue(
                      "pendingLeaves",
                      "pendingLeaveCount"
                    )
                  )
            }

            subtitle="Awaiting action"

            icon={
              <EventAvailableOutlinedIcon />
            }

            color="warning"

          />

        </Grid>


        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3
          }}
        >

          <ReportSummaryCard

            title="Payroll"

            value={
              loading
                ? "—"
                : formatCurrency(
                    getValue(
                      "monthlyPayroll",
                      "totalPayroll"
                    )
                  )
            }

            subtitle="Current period"

            icon={
              <PaymentsOutlinedIcon />
            }

            color="info"

          />

        </Grid>

      </Grid>


      {/* =====================================================
          REPORTS
      ===================================================== */}

      <Typography
        variant="h6"
        fontWeight={900}
        sx={{
          mb: 2
        }}
      >
        Available Reports
      </Typography>


      <Grid
        container
        spacing={2}
      >

        {reports.map(
          report => (

            <Grid
              key={
                report.path
              }
              size={{
                xs: 12,
                sm: 6,
                lg: 4
              }}
            >

              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  height: "100%",
                  border:
                    "1px solid",
                  borderColor:
                    "divider",
                  borderRadius: 3,
                  transition:
                    "transform .2s ease, box-shadow .2s ease",

                  "&:hover": {
                    transform:
                      "translateY(-3px)",
                    boxShadow:
                      4
                  }
                }}
              >

                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="flex-start"
                >

                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: 2,
                      bgcolor:
                        "action.hover",
                      color:
                        "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}
                  >
                    {report.icon}
                  </Box>


                  <Box
                    sx={{
                      flex: 1
                    }}
                  >

                    <Typography
                      fontWeight={900}
                    >
                      {
                        report.title
                      }
                    </Typography>


                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                        lineHeight: 1.6
                      }}
                    >
                      {
                        report.description
                      }
                    </Typography>


                    <Button
                      size="small"
                      endIcon={
                        <ArrowForwardOutlinedIcon />
                      }
                      onClick={() => {

                        window.location.href =
                          report.path;

                      }}
                      sx={{
                        mt: 1,
                        px: 0,
                        fontWeight: 850
                      }}
                    >
                      Open report
                    </Button>

                  </Box>

                </Stack>

              </Paper>

            </Grid>

          )
        )}

      </Grid>

    </Box>
  );
};


export default ReportsDashboard;
