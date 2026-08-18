import { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import LeaveForm from "./LeaveForm";

import {
  createLeave,
  updateLeave,
} from "../../services/leaveService";

const LeaveDialog = ({
  open,
  onClose,
  leave,
  reload,
}) => {

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {

    try {

      setLoading(true);

      if (leave) {

       const payload = {
  ...data,
  employee: {
    employeeId: Number(data.employeeId),
  },
};

await updateLeave(leave.leaveId, payload);

      } else {

const payload = {
  ...data,
  employee: {
    employeeId: Number(data.employeeId),
  },
};
console.log("Payload:", payload);
await createLeave(payload);
      }

      reload();

      onClose();

    } catch (error) {

      console.error(
        "Error saving leave:",
        error
      );

      alert(
        "Failed to save leave request."
      );

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

        {leave
          ? "Edit Leave Request"
          : "Apply Leave"}

      </DialogTitle>

      <DialogContent dividers>

        <LeaveForm
          leave={leave}
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
          form="leave-form"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : leave
            ? "Update"
            : "Apply"}
        </Button>

      </DialogActions>

    </Dialog>

  );

};

export default LeaveDialog;