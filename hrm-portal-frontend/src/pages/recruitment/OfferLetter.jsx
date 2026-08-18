import { useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import Grid from "@mui/material/Grid";

import {
  Download,
  Print,
  Description,
} from "@mui/icons-material";

import {
  generateOfferLetter,
  downloadOfferLetter,
} from "../../services/recruitmentService";

const initialState = {
  candidateId: "",
  candidateName: "",
  designation: "",
  department: "",
  joiningDate: "",
  salary: "",
  companyName: "ABC Technologies Pvt Ltd",
  hrName: "HR Manager",
};

const OfferLetter = () => {

  const [offer, setOffer] =
    useState(initialState);

  const handleChange = (event) => {

    const { name, value } = event.target;

    setOffer((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const handleGenerate = async () => {

    try {

      await generateOfferLetter(offer);

      alert("Offer Letter Generated Successfully");

    } catch (error) {

      console.error(error);

      alert("Failed to generate offer letter");

    }

  };

  const handleDownload = async () => {

    try {

      const blob =
        await downloadOfferLetter(
          offer.candidateId
        );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `OfferLetter_${offer.candidateName}.pdf`;

      link.click();

      window.URL.revokeObjectURL(url);

    } catch (error) {

      console.error(error);

    }

  };

  return (

    <Box>

      <Typography
        variant="h4"
        mb={3}
      >
        Offer Letter
      </Typography>

      <Grid
        container
        spacing={3}
      >

        {/* Form */}

        <Grid
          item
          xs={12}
          md={4}
        >

          <Card>

            <CardHeader
              title="Offer Details"
            />

            <CardContent>

              <Stack spacing={2}>

                <TextField
                  label="Candidate ID"
                  name="candidateId"
                  value={offer.candidateId}
                  onChange={handleChange}
                  fullWidth
                />

                <TextField
                  label="Candidate Name"
                  name="candidateName"
                  value={offer.candidateName}
                  onChange={handleChange}
                  fullWidth
                />

                <TextField
                  label="Designation"
                  name="designation"
                  value={offer.designation}
                  onChange={handleChange}
                  fullWidth
                />

                <TextField
                  label="Department"
                  name="department"
                  value={offer.department}
                  onChange={handleChange}
                  fullWidth
                />

                <TextField
                  type="date"
                  label="Joining Date"
                  name="joiningDate"
                  value={offer.joiningDate}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                />

                <TextField
                  label="Annual CTC"
                  name="salary"
                  value={offer.salary}
                  onChange={handleChange}
                  fullWidth
                />

                <Button
                  variant="contained"
                  startIcon={<Description />}
                  onClick={handleGenerate}
                >
                  Generate
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleDownload}
                >
                  Download PDF
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Print />}
                  onClick={() =>
                    window.print()
                  }
                >
                  Print
                </Button>

              </Stack>

            </CardContent>

          </Card>

        </Grid>

        {/* Preview */}

        <Grid
          item
          xs={12}
          md={8}
        >

          <Paper
            elevation={3}
            sx={{
              p: 5,
              minHeight: 800,
            }}
          >

            <Typography
              variant="h4"
              align="center"
              gutterBottom
            >
              {offer.companyName}
            </Typography>

            <Divider sx={{ mb: 4 }} />

            <Typography
              align="right"
              gutterBottom
            >
              Date:{" "}
              {new Date().toLocaleDateString()}
            </Typography>

            <Typography
              variant="h5"
              gutterBottom
            >
              Offer Letter
            </Typography>

            <Typography paragraph>

              Dear{" "}

              <strong>
                {offer.candidateName ||
                  "Candidate"}
              </strong>

              ,

            </Typography>

            <Typography paragraph>

              We are pleased to offer you the
              position of{" "}

              <strong>
                {offer.designation ||
                  "Software Engineer"}
              </strong>

              {" "}in the{" "}

              <strong>
                {offer.department ||
                  "IT"}
              </strong>

              {" "}department at{" "}

              <strong>
                {offer.companyName}
              </strong>

              .

            </Typography>

            <Typography paragraph>

              Your annual compensation will be{" "}

              <strong>
                ₹
                {offer.salary ||
                  "0"}
              </strong>

              .

            </Typography>

            <Typography paragraph>

              Your expected joining date is{" "}

              <strong>
                {offer.joiningDate ||
                  "Not Selected"}
              </strong>

              .

            </Typography>

            <Typography paragraph>

              We believe your skills and
              experience will be a valuable
              addition to our organization.

            </Typography>

            <Typography paragraph>

              Please sign and return this
              letter as confirmation of your
              acceptance.

            </Typography>

            <Box mt={8}>

              <Typography>
                Regards,
              </Typography>

              <Typography
                fontWeight="bold"
              >
                {offer.hrName}
              </Typography>

              <Typography>
                Human Resources
              </Typography>

              <Typography>
                {offer.companyName}
              </Typography>

            </Box>

          </Paper>

        </Grid>

      </Grid>

    </Box>

  );

};

export default OfferLetter;