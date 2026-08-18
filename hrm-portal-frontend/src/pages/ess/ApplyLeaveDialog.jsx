import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";

import { applyLeave } from "../../services/essService";

const leaveTypes = [
  "CASUAL_LEAVE",
  "SICK_LEAVE",
  "EARNED_LEAVE",
  "MATERNITY_LEAVE",
  "PATERNITY_LEAVE",
  "LOSS_OF_PAY",
];

const initialState = {
  leaveType: "",
  fromDate: "",
  toDate: "",
  reason: "",
};

const ApplyLeaveDialog = ({
  open,
  onClose,
  reload,
}) => {

  const [formData, setFormData] =
    useState(initialState);

  useEffect(() => {

    if (open) {

      setFormData(initialState);

    }

  }, [open]);

  const handleChange = (event) => {

    const { name, value } =
      event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const calculateDays = () => {

    if (
      !formData.fromDate ||
      !formData.toDate
    ) {
      return 0;
    }

    const from = new Date(
      formData.fromDate
    );

    const to = new Date(
      formData.toDate
    );

    const difference =
      Math.ceil(
        (to - from) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    return difference > 0
      ? difference
      : 0;

  };

  const validate = () => {

    if (!formData.leaveType) {
      alert("Select Leave Type");
      return false;
    }

    if (!formData.fromDate) {
      alert("Select From Date");
      return false;
    }

    if (!formData.toDate) {
      alert("Select To Date");
      return false;
    }

    if (
      new Date(formData.toDate) <
      new Date(formData.fromDate)
    ) {

      alert(
        "To Date cannot be before From Date"
      );

      return false;

    }

    if (!formData.reason.trim()) {

      alert("Reason is required");

      return false;

    }

    return true;

  };

  const handleSubmit =
    async () => {

      if (!validate()) return;

      try {

        await applyLeave({
          ...formData,
          numberOfDays:
            calculateDays(),
        });

        reload();

        onClose();

      } catch (error) {

        console.error(error);

        alert(
          "Unable to apply leave."
        );

      }

    };

  return (

    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >

      <DialogTitle>
        Apply Leave
      </DialogTitle>

      <DialogContent>

        <Grid
          container
          spacing={2}
          sx={{ mt: 1 }}
        >

          <Grid item xs={12}>

            <TextField
              fullWidth
              select
              label="Leave Type"
              name="leaveType"
              value={
                formData.leaveType
              }
              onChange={
                handleChange
              }
            >

              {leaveTypes.map(
                (type) => (

                  <MenuItem
                    key={type}
                    value={type}
                  >
                    {type.replaceAll(
                      "_",
                      " "
                    )}
                  </MenuItem>

                )
              )}

            </TextField>

          </Grid>

          <Grid item xs={12} sm={6}>

            <TextField
              fullWidth
              type="date"
              label="From Date"
              name="fromDate"
              value={
                formData.fromDate
              }
              onChange={
                handleChange
              }
              InputLabelProps={{
                shrink: true,
              }}
            />

          </Grid>

          <Grid item xs={12} sm={6}>

            <TextField
              fullWidth
              type="date"
              label="To Date"
              name="toDate"
              value={
                formData.toDate
              }
              onChange={
                handleChange
              }
              InputLabelProps={{
                shrink: true,
              }}
            />

          </Grid>

          <Grid item xs={12}>

            <TextField
              fullWidth
              label="Number of Days"
              value={
                calculateDays()
              }
              InputProps={{
                readOnly: true,
              }}
            />

          </Grid>

          <Grid item xs={12}>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Reason"
              name="reason"
              value={
                formData.reason
              }
              onChange={
                handleChange
              }
            />

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
          onClick={
            handleSubmit
          }
        >
          Apply Leave
        </Button>

      </DialogActions>

    </Dialog>

  );

};

export default ApplyLeaveDialog;