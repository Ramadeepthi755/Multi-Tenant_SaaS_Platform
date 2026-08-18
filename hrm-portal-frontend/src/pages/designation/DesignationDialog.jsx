import { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import DesignationForm from "./DesignationForm";

import {
  createDesignation,
  updateDesignation,
} from "../../services/designationService";

const DesignationDialog = ({
  open,
  onClose,
  designation,
  reload,
}) => {

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {

    try {

      setLoading(true);

      if (designation) {

        await updateDesignation(
          designation.designationId,
          data
        );

      } else {

        await createDesignation(data);

      }

      reload();
      onClose();

    } catch (error) {

      console.error("Error saving designation:", error);
      alert("Failed to save designation.");

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

        {designation
          ? "Update Designation"
          : "Add Designation"}

      </DialogTitle>

      <DialogContent>

        <DesignationForm
          designation={designation}
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
          type="submit"
          form="designation-form"
          variant="contained"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : designation
            ? "Update"
            : "Save"}
        </Button>

      </DialogActions>

    </Dialog>

  );
};

export default DesignationDialog;