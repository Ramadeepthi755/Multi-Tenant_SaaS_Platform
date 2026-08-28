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
  createJob,
  updateJob,
} from "../../services/recruitmentService";

import departmentService
  from "../../services/departmentService";

const employmentTypes = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
];

const jobStatuses = [
  "OPEN",
  "CLOSED",
];

const initialState = {
  jobTitle: "",
  departmentId: "",
  description: "",
  requiredSkills: "",
  experience: "",
  salary: "",
  vacancies: 1,
  employmentType: "FULL_TIME",
  status: "OPEN",
};

const JobDialog = ({
  open,
  onClose,
  reload,
  job,
}) => {

  const [formData, setFormData] =
    useState(initialState);

  const [departments, setDepartments] =
    useState([]);

  const [departmentError, setDepartmentError] =
    useState("");

  useEffect(() => {

    if (job) {

      setFormData({
        jobTitle: job.jobTitle || "",
        departmentId:
          job.departmentId || "",
        description:
          job.description || "",
        requiredSkills:
          job.requiredSkills || "",
        experience:
          job.experience || "",
        salary:
          job.salary || "",
        vacancies:
          job.vacancies || 1,
        employmentType:
          job.employmentType ||
          "FULL_TIME",
        status:
          job.status || "OPEN",
      });

    } else {

      setFormData(initialState);

    }

  }, [job]);

  useEffect(() => {

    const loadDepartments = async () => {

      try {

        setDepartmentError("");

        const response =
          await departmentService
            .getDepartments();

        setDepartments(
          Array.isArray(response)
            ? response
            : response?.content || []
        );

      } catch (error) {

        setDepartmentError(
          error?.response?.data?.message ||
          "Unable to load departments."
        );

      }

    };

    if (open) {
      loadDepartments();
    }

  }, [open]);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const handleSubmit = async () => {

    try {

      if (job) {

        await updateJob(
          job.jobId,
          formData
        );

      } else {

        await createJob(formData);

      }

      reload();

      onClose();

    } catch (error) {

      console.error(error);

      alert("Failed to save job.");

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

        {job
          ? "Edit Job"
          : "Add Job"}

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
              label="Job Title"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={12} md={6}>

            <TextField
              select
              fullWidth
              label="Department"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              error={Boolean(departmentError)}
              helperText={departmentError}
            >

              <MenuItem value="">
                No department
              </MenuItem>

              {departments.map(
                department => (

                  <MenuItem
                    key={department.departmentId}
                    value={department.departmentId}
                  >
                    {department.departmentName}
                  </MenuItem>

                )
              )}

            </TextField>

          </Grid>

          <Grid item xs={12}>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={12}>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Required Skills"
              name="requiredSkills"
              value={formData.requiredSkills}
              onChange={handleChange}
              helperText="Example: Java, Spring Boot, React, MySQL"
            />

          </Grid>

          <Grid item xs={12} md={4}>

            <TextField
              fullWidth
              label="Experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              helperText="Example: 2-4 Years"
            />

          </Grid>

          <Grid item xs={12} md={4}>

            <TextField
              fullWidth
              type="number"
              label="Salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={12} md={4}>

            <TextField
              fullWidth
              type="number"
              label="Vacancies"
              name="vacancies"
              value={formData.vacancies}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={12} md={6}>

            <TextField
              select
              fullWidth
              label="Employment Type"
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
            >

              {employmentTypes.map(
                (type) => (

                  <MenuItem
                    key={type}
                    value={type}
                  >
                    {type.replace(
                      "_",
                      " "
                    )}
                  </MenuItem>

                )
              )}

            </TextField>

          </Grid>

          <Grid item xs={12} md={6}>

            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >

              {jobStatuses.map(
                (status) => (

                  <MenuItem
                    key={status}
                    value={status}
                  >
                    {status}
                  </MenuItem>

                )
              )}

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
          {job
            ? "Update Job"
            : "Create Job"}
        </Button>

      </DialogActions>

    </Dialog>

  );

};

export default JobDialog;
