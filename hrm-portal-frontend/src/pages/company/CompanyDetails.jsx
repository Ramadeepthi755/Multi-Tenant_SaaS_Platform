import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Chip,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BusinessIcon from "@mui/icons-material/Business";

import { getCompanyById } from "../../services/companyService";

const CompanyDetails = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const [company, setCompany] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompany();
  }, []);

  const loadCompany = async () => {
    try {
      const data = await getCompanyById(id);
      setCompany(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        mt={8}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!company) {
    return (
      <Typography variant="h6">
        Company Not Found
      </Typography>
    );
  }

  return (
    <Box>

      <Button
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
        onClick={() => navigate("/companies")}
      >
        Back
      </Button>

      <Card sx={{ borderRadius: 3 }}>

        <CardContent>

          <Box
            display="flex"
            alignItems="center"
            mb={3}
          >
            <BusinessIcon
              color="primary"
              sx={{ mr: 2 }}
            />

            <Typography
              variant="h4"
              fontWeight={700}
            >
              {company.companyName}
            </Typography>

          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>

            <Grid item xs={12} md={6}>
              <Typography color="text.secondary">
                Company Code
              </Typography>

              <Typography fontWeight={600}>
                {company.companyCode}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography color="text.secondary">
                Email
              </Typography>

              <Typography fontWeight={600}>
                {company.email}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography color="text.secondary">
                Phone
              </Typography>

              <Typography fontWeight={600}>
                {company.phone}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography color="text.secondary">
                Active
              </Typography>

              <Chip
                label={
                  company.isActive
                    ? "Active"
                    : "Inactive"
                }
                color={
                  company.isActive
                    ? "success"
                    : "error"
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography color="text.secondary">
                Status
              </Typography>

              <Typography fontWeight={600}>
                {company.status}
              </Typography>
            </Grid>

          </Grid>

        </CardContent>

      </Card>

    </Box>
  );

};

export default CompanyDetails;