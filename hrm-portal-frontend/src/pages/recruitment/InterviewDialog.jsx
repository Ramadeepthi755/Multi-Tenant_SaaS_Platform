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
  scheduleInterview,
  updateInterview,
} from "../../services/recruitmentService";

const interviewTypes = [
  "HR",
  "TECHNICAL",
  "MANAGERIAL",
  "ONLINE",
];

const interviewStatuses = [
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
  "RESCHEDULED",
];

const initialState = {
  candidateId: "",
  interviewerId: "",
  interviewType: "HR",
  interviewDate: "",
  interviewTime: "",
  meetingLink: "",
  location: "",
  status: "SCHEDULED",
  feedback: "",
  rating: "",
};

const InterviewDialog = ({
  open,
  onClose,
  reload,
  interview,
}) => {

  const [formData, setFormData] =
    useState(initialState);

  useEffect(() => {

    if (interview) {

      setFormData({
        candidateId:
          interview.candidateId || "",
        interviewerId:
          interview.interviewerId || "",
        interviewType:
          interview.interviewType || "HR",
        interviewDate:
          interview.interviewDate || "",
        interviewTime:
          interview.interviewTime || "",
        meetingLink:
          interview.meetingLink || "",
        location:
          interview.location || "",
        status:
          interview.status || "SCHEDULED",
        feedback:
          interview.feedback || "",
        rating:
          interview.rating || "",
      });

    } else {

      setFormData(initialState);

    }

  }, [interview]);

  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const handleSubmit = async () => {

    try {

      if (interview) {

        await updateInterview(
          interview.interviewId,
          formData
        );

      } else {

        await scheduleInterview(
          formData
        );

      }

      reload();

      onClose();

    } catch (error) {

      console.error(error);

      alert("Failed to save interview.");

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

        {interview
          ? "Edit Interview"
          : "Schedule Interview"}

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
              label="Candidate ID"
              name="candidateId"
              value={formData.candidateId}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={12} md={6}>

            <TextField
              fullWidth
              label="Interviewer ID"
              name="interviewerId"
              value={formData.interviewerId}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={12} md={6}>

            <TextField
              select
              fullWidth
              label="Interview Type"
              name="interviewType"
              value={formData.interviewType}
              onChange={handleChange}
            >

              {interviewTypes.map((type) => (

                <MenuItem
                  key={type}
                  value={type}
                >
                  {type}
                </MenuItem>

              ))}

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

              {interviewStatuses.map((status) => (

                <MenuItem
                  key={status}
                  value={status}
                >
                  {status}
                </MenuItem>

              ))}

            </TextField>

          </Grid>

          <Grid item xs={12} md={6}>

            <TextField
              fullWidth
              type="date"
              label="Interview Date"
              name="interviewDate"
              value={formData.interviewDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />

          </Grid>

          <Grid item xs={12} md={6}>

            <TextField
              fullWidth
              type="time"
              label="Interview Time"
              name="interviewTime"
              value={formData.interviewTime}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />

          </Grid>

          <Grid item xs={12}>

            <TextField
              fullWidth
              label="Meeting Link"
              name="meetingLink"
              value={formData.meetingLink}
              onChange={handleChange}
              helperText="Required for online interviews"
            />

          </Grid>

          <Grid item xs={12}>

            <TextField
              fullWidth
              label="Interview Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={12}>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Feedback"
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={12} md={4}>

            <TextField
              fullWidth
              type="number"
              label="Rating (1-10)"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              inputProps={{
                min: 1,
                max: 10,
              }}
            />

          </Grid>

        </Grid>

      </DialogContent>

      <DialogActions>

        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
        >
          {interview
            ? "Update Interview"
            : "Schedule Interview"}
        </Button>

      </DialogActions>

    </Dialog>

  );

};

export default InterviewDialog;