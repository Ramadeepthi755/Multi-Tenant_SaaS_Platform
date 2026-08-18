import { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import HolidayForm from "./HolidayForm";

import {
  createHoliday,
  updateHoliday,
} from "../../services/holidayService";

const HolidayDialog = ({
  open,
  onClose,
  holiday,
  reload,
}) => {

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {

    try {

      setLoading(true);

      if (holiday) {

        await updateHoliday(
          holiday.holidayId,
          data
        );

      } else {

        await createHoliday(data);

      }

      reload();

      onClose();

    } catch (error) {

      console.error(
        "Error saving holiday:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to save holiday."
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
      scroll="paper"
    >

      <DialogTitle>

        {holiday
          ? "Edit Holiday"
          : "Add Holiday"}

      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          maxHeight: "75vh",
        }}
      >

        <HolidayForm
          holiday={holiday}
          onSubmit={handleSubmit}
        />

      </DialogContent>

      <DialogActions>

        <Button
          color="inherit"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          form="holiday-form"
          variant="contained"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : holiday
            ? "Update"
            : "Save"}
        </Button>

      </DialogActions>

    </Dialog>

  );

};

export default HolidayDialog;