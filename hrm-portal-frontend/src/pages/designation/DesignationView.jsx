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
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import designationService from "../../services/designationService";

import PermissionGate from "../../components/auth/PermissionGate";

import {
  PERMISSIONS,
} from "../../config/permissions";

function DesignationView() {
  const navigate = useNavigate();

  const { designationId } =
    useParams();

  const [designation, setDesignation] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================================================
  // LOAD DESIGNATION
  // =========================================================

  useEffect(() => {
    const loadDesignation =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await designationService
              .getDesignationById(
                designationId
              );

          setDesignation(data);
        } catch (err) {
          console.error(
            "Failed to load designation:",
            err
          );

          setError(
            err?.response?.data?.message ||
              "Failed to load designation."
          );
        } finally {
          setLoading(false);
        }
      };

    loadDesignation();
  }, [designationId]);

  // =========================================================
  // LOADING
  // =========================================================

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

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
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
              "/designations"
            )
          }
        >
          Back to Designations
        </Button>
      </Box>
    );
  }

  // =========================================================
  // NOT FOUND
  // =========================================================

  if (!designation) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h6"
          color="text.secondary"
        >
          Designation not found.
        </Typography>

        <Button
          sx={{ mt: 2 }}
          startIcon={
            <ArrowBackRoundedIcon />
          }
          onClick={() =>
            navigate(
              "/designations"
            )
          }
        >
          Back to Designations
        </Button>
      </Box>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <Box
      sx={{
        p: {
          xs: 2,
          md: 3,
        },
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

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
                "/designations"
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
              Designation Details
            </Typography>

            <Typography color="text.secondary">
              View designation information.
            </Typography>
          </Box>
        </Stack>

        <PermissionGate
          permission={
            PERMISSIONS.DESIGNATION_UPDATE
          }
        >
          <Button
            variant="contained"
            startIcon={
              <EditRoundedIcon />
            }
            onClick={() =>
              navigate(
                `/designations/${designationId}/edit`
              )
            }
          >
            Edit Designation
          </Button>
        </PermissionGate>
      </Stack>

      {/* =====================================================
          CARD
      ===================================================== */}

      <Card
        sx={{
          maxWidth: 900,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* HEADER */}

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
              <WorkRoundedIcon />
            </Box>

            <Box>
              <Typography
                variant="h5"
                fontWeight={800}
              >
                {
                  designation.designationName
                }
              </Typography>

              <Typography color="text.secondary">
                {
                  designation.designationCode
                }
              </Typography>
            </Box>

            <Box sx={{ ml: "auto" }}>
              <Chip
                label={
                  designation.status ||
                  "UNKNOWN"
                }
                color={
                  designation.status ===
                  "ACTIVE"
                    ? "success"
                    : "default"
                }
              />
            </Box>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* INFORMATION */}

          <Stack spacing={3}>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Designation ID
              </Typography>

              <Typography fontWeight={600}>
                {
                  designation.designationId
                }
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Designation Code
              </Typography>

              <Typography fontWeight={600}>
                {
                  designation.designationCode ||
                  "-"
                }
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Designation Name
              </Typography>

              <Typography fontWeight={600}>
                {
                  designation.designationName ||
                  "-"
                }
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Department
              </Typography>

              <Typography fontWeight={600}>
                {
                  designation.departmentName ||
                  "-"
                }
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Description
              </Typography>

              <Typography fontWeight={600}>
                {
                  designation.description ||
                  "-"
                }
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Status
              </Typography>

              <Box mt={0.5}>
                <Chip
                  size="small"
                  label={
                    designation.status ||
                    "UNKNOWN"
                  }
                  color={
                    designation.status ===
                    "ACTIVE"
                      ? "success"
                      : "default"
                  }
                />
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default DesignationView;