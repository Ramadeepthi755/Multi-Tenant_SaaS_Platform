import {
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import departmentService from "../../services/departmentService";

import PermissionGate from "../../components/auth/PermissionGate";

import {
  PERMISSIONS,
} from "../../config/permissions";

function DepartmentView() {
  const navigate = useNavigate();

  const { departmentId } =
    useParams();

  const [department, setDepartment] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadDepartment =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await departmentService.getDepartmentById(
              departmentId
            );

          setDepartment(data);
        } catch (err) {
          console.error(
            "Failed to load department:",
            err
          );

          setError(
            err?.response?.data?.message ||
              "Failed to load department."
          );
        } finally {
          setLoading(false);
        }
      };

    loadDepartment();
  }, [departmentId]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error">
          {error}
        </Alert>

        <Button
          sx={{ mt: 2 }}
          startIcon={
            <ArrowBackRoundedIcon />
          }
          onClick={() =>
            navigate(
              "/departments"
            )
          }
        >
          Back to Departments
        </Button>
      </Box>
    );
  }

  if (!department) {
    return (
      <Alert severity="warning">
        Department not found.
      </Alert>
    );
  }

  const status =
    department.status ||
    "ACTIVE";

  const id =
    department.departmentId ??
    department.id;

  return (
    <Box>
      {/* HEADER */}

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        spacing={2}
        mb={3}
      >
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
        >
          <Button
            startIcon={
              <ArrowBackRoundedIcon />
            }
            onClick={() =>
              navigate(
                "/departments"
              )
            }
          >
            Back
          </Button>

          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
            >
              Department Details
            </Typography>

            <Typography color="text.secondary">
              View department information.
            </Typography>
          </Box>
        </Stack>

        <PermissionGate
          permission={
            PERMISSIONS.DEPARTMENT_UPDATE
          }
        >
          <Button
            variant="contained"
            startIcon={
              <EditRoundedIcon />
            }
            onClick={() =>
              navigate(
                `/departments/${id}/edit`
              )
            }
          >
            Edit Department
          </Button>
        </PermissionGate>
      </Stack>

      {/* CARD */}

      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            mb={3}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor:
                  "rgba(37, 99, 235, 0.08)",
                color: "primary.main",
              }}
            >
              <ApartmentRoundedIcon />
            </Box>

            <Box>
              <Typography
                variant="h5"
                fontWeight={800}
              >
                {
                  department.departmentName
                }
              </Typography>

              <Typography color="text.secondary">
                {
                  department.departmentCode
                }
              </Typography>
            </Box>

            <Box sx={{ ml: "auto" }}>
              <Chip
                label={status}
                color={
                  status === "ACTIVE"
                    ? "success"
                    : "default"
                }
              />
            </Box>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
              sm={6}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Department ID
              </Typography>

              <Typography
                fontWeight={600}
                mt={0.5}
              >
                {id ?? "-"}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Department Name
              </Typography>

              <Typography
                fontWeight={600}
                mt={0.5}
              >
                {
                  department.departmentName ||
                  "-"
                }
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Department Code
              </Typography>

              <Typography
                fontWeight={600}
                mt={0.5}
              >
                {
                  department.departmentCode ||
                  "-"
                }
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Company
              </Typography>

              <Typography
                fontWeight={600}
                mt={0.5}
              >
                {
                  department.companyName ||
                  department.company?.companyName ||
                  "-"
                }
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Status
              </Typography>

              <Box mt={0.5}>
                <Chip
                  label={status}
                  size="small"
                  color={
                    status === "ACTIVE"
                      ? "success"
                      : "default"
                  }
                />
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Department Head
              </Typography>

              <Typography
                fontWeight={600}
                mt={0.5}
              >
                {
                  department.departmentHeadName ||
                  department.headName ||
                  "Not assigned"
                }
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default DepartmentView;