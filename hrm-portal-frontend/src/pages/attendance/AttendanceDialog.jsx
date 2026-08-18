import { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import AttendanceForm from "./AttendanceForm";

import {
  createAttendance,
  updateAttendance,
} from "../../services/attendanceService";

const AttendanceDialog = ({
  open,
  onClose,
  attendance,
  reload,
}) => {

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {

    try {

      setLoading(true);

      if (attendance) {

        await updateAttendance(
          attendance.attendanceId,
          data
        );

      } else {

        await createAttendance(data);

      }

      reload();

      onClose();

    } catch (error) {

      console.error("Error saving attendance:", error);

      alert("Failed to save attendance.");

    } finally {

      setLoading(false);

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

        {attendance
          ? "Edit Attendance"
          : "Add Attendance"}

      </DialogTitle>

      <DialogContent dividers>

        <AttendanceForm
          attendance={attendance}
          onSubmit={handleSubmit}
        />

      </DialogContent>

      <DialogActions>

        <Button
          onClick={onClose}
          color="inherit"
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          type="submit"
          form="attendance-form"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : attendance
              ? "Update"
              : "Save"}
        </Button>

      </DialogActions>

    </Dialog>

  );

};

export default AttendanceDialog;