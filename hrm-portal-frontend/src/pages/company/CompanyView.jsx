import { useEffect, useState } from "react";

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
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";

import { useNavigate, useParams } from "react-router-dom";

import companyService from "../../services/companyService";

import PermissionGate from "../../components/auth/PermissionGate";

import { PERMISSIONS } from "../../config/permissions";

function CompanyView() {
  const navigate = useNavigate();
  const { companyId } = useParams();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | LOAD COMPANY
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadCompany = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await companyService.getCompanyById(
          companyId
        );

        setCompany(data);
      } catch (err) {
        console.error("Failed to load company:", err);

        setError(
          err?.response?.data?.message ||
            "Failed to load company."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, [companyId]);

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>

        <Button
          sx={{ mt: 2 }}
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate("/companies")}
        >
          Back to Companies
        </Button>
      </Box>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | COMPANY NOT FOUND
  |--------------------------------------------------------------------------
  */

  if (!company) {
    return (
      <Box>
        <Alert severity="warning">
          Company not found.
        </Alert>

        <Button
          sx={{ mt: 2 }}
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate("/companies")}
        >
          Back to Companies
        </Button>
      </Box>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | COMPANY STATUS
  |--------------------------------------------------------------------------
  */

  const active =
    typeof company.active === "boolean"
      ? company.active
      : company.status === "ACTIVE";

  /*
  |--------------------------------------------------------------------------
  | PAGE
  |--------------------------------------------------------------------------
  */

  return (
    <Box>
      {/* ====================================================== */}
      {/* HEADER                                                 */}
      {/* ====================================================== */}

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
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate("/companies")}
          >
            Back
          </Button>

          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
            >
              Company Details
            </Typography>

            <Typography color="text.secondary">
              View company information.
            </Typography>
          </Box>
        </Stack>

        {/* EDIT */}

        <PermissionGate
          permission={PERMISSIONS.COMPANY_UPDATE}
        >
          <Button
            variant="contained"
            startIcon={<EditRoundedIcon />}
            onClick={() =>
              navigate(
                `/companies/${companyId}/edit`
              )
            }
          >
            Edit Company
          </Button>
        </PermissionGate>
      </Stack>

      {/* ====================================================== */}
      {/* COMPANY CARD                                           */}
      {/* ====================================================== */}

      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* COMPANY HEADER */}

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
              <BusinessRoundedIcon />
            </Box>

            <Box>
              <Typography
                variant="h5"
                fontWeight={800}
              >
                {company.companyName || "-"}
              </Typography>

              <Typography color="text.secondary">
                {company.companyCode || "-"}
              </Typography>
            </Box>

            <Box sx={{ ml: "auto" }}>
              <Chip
                label={active ? "ACTIVE" : "INACTIVE"}
                color={active ? "success" : "default"}
              />
            </Box>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* ================================================== */}
          {/* COMPANY INFORMATION                                */}
          {/* ================================================== */}

          <Grid container spacing={3}>
            {/* COMPANY ID */}

            <Grid item xs={12} sm={6}>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Company ID
              </Typography>

              <Typography
                fontWeight={600}
                mt={0.5}
              >
                {company.companyId ?? "-"}
              </Typography>
            </Grid>

            {/* COMPANY CODE */}

            <Grid item xs={12} sm={6}>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Company Code
              </Typography>

              <Typography
                fontWeight={600}
                mt={0.5}
              >
                {company.companyCode || "-"}
              </Typography>
            </Grid>

            {/* EMAIL */}

            <Grid item xs={12} sm={6}>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Email
              </Typography>

              <Typography
                fontWeight={600}
                mt={0.5}
              >
                {company.email || "-"}
              </Typography>
            </Grid>

            {/* PHONE */}

            <Grid item xs={12} sm={6}>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Phone
              </Typography>

              <Typography
                fontWeight={600}
                mt={0.5}
              >
                {company.phone || "-"}
              </Typography>
            </Grid>

            {/* ADDRESS */}

            <Grid item xs={12}>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Address
              </Typography>

              <Typography
                fontWeight={600}
                mt={0.5}
              >
                {company.address || "-"}
              </Typography>
            </Grid>

            {/* STATUS */}

            <Grid item xs={12} sm={6}>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Status
              </Typography>

              <Box mt={0.5}>
                <Chip
                  label={
                    active ? "ACTIVE" : "INACTIVE"
                  }
                  size="small"
                  color={
                    active ? "success" : "default"
                  }
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default CompanyView;