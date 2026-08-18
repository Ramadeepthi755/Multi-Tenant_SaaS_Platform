import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";

import Grid from "@mui/material/Grid";

import {
  createCandidate,
  updateCandidate,
} from "../../services/recruitmentService";

const candidateStatuses = [
  "APPLIED",
  "SHORTLISTED",
  "INTERVIEW_SCHEDULED",
  "SELECTED",
  "REJECTED",
  "JOINED",
];

const initialState = {
  fullName: "",
  email: "",
  phone: "",
  experience: "",
  skills: "",
  currentCompany: "",
  expectedSalary: "",
  noticePeriod: "",
  status: "APPLIED",
};

const CandidateDialog = ({
  open,
  onClose,
  reload,
  candidate,
}) => {

  const [formData, setFormData] =
    useState(initialState);

  useEffect(() => {

    if (candidate) {

      setFormData({
        fullName:
          candidate.fullName || "",
        email:
          candidate.email || "",
        phone:
          candidate.phone || "",
        experience:
          candidate.experience || "",
        skills:
          candidate.skills || "",
        currentCompany:
          candidate.currentCompany || "",
        expectedSalary:
          candidate.expectedSalary || "",
        noticePeriod:
          candidate.noticePeriod || "",
        status:
          candidate.status || "APPLIED",
      });

    } else {

      setFormData(initialState);

    }

  }, [candidate]);

  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const handleSubmit = async () => {

    try {

      if (candidate) {

        await updateCandidate(
          candidate.candidateId,
          formData
        );

      } else {

        await createCandidate(formData);

      }

      reload();

      onClose();

    } catch (error) {

      console.error(error);

      alert("Failed to save candidate.");

    }

  };

  return (

    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >

      <DialogTitle>

        {candidate
          ? "Edit Candidate"
          : "Add Candidate"}

      </DialogTitle>

      <DialogContent>

        <Grid
          container
          spacing={2}
          sx={{ mt: 1 }}
        >

          <Grid item xs={12} md={6}>

            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={12} md={6}>

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={12} md={6}>

            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={12} md={6}>

            <TextField
              fullWidth
              label="Experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              helperText="Example: 3 Years"
            />

          </Grid>

          <Grid item xs={12}>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              helperText="Example: Java, Spring Boot, React"
            />

          </Grid>

          <Grid item xs={12} md={6}>

            <TextField
              fullWidth
              label="Current Company"
              name="currentCompany"
              value={formData.currentCompany}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={12} md={3}>

            <TextField
              fullWidth
              type="number"
              label="Expected Salary"
              name="expectedSalary"
              value={formData.expectedSalary}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={12} md={3}>

            <TextField
              fullWidth
              label="Notice Period"
              name="noticePeriod"
              value={formData.noticePeriod}
              onChange={handleChange}
              helperText="Example: 30 Days"
            />

          </Grid>

          <Grid item xs={12}>

            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >

              {candidateStatuses.map((status) => (

                <MenuItem
                  key={status}
                  value={status}
                >
                  {status.replaceAll("_", " ")}
                </MenuItem>

              ))}

            </TextField>

          </Grid>

        </Grid>

      </DialogContent>

      <DialogActions>

        <Button
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
        >
          {candidate
            ? "Update Candidate"
            : "Create Candidate"}
        </Button>

      </DialogActions>

    </Dialog>

  );

};

export default CandidateDialog;