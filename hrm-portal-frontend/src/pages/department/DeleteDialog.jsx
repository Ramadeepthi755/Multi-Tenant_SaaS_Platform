import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

const DeleteDialog = ({ open, onClose, onConfirm, department }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Department</DialogTitle>

      <DialogContent>
        <Typography>
          Are you sure you want to delete{" "}
          <strong>{department?.departmentName}</strong>?
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button
          color="error"
          variant="contained"
          onClick={onConfirm}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;