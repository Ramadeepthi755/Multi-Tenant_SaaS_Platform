import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@mui/material";


const DeleteDesignationDialog = ({
  open,
  designation,
  loading = false,
  error = "",
  onClose,
  onConfirm
}) => {

  return (
    <Dialog
      open={open}
      onClose={
        loading
          ? undefined
          : onClose
      }
      maxWidth="xs"
      fullWidth
    >

      <DialogTitle
        sx={{
          fontWeight: 900
        }}
      >
        Delete Designation?
      </DialogTitle>


      <DialogContent>

        {error && (

          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: 2
            }}
          >
            {error}
          </Alert>

        )}


        <Typography
          color="text.secondary"
        >
          Are you sure you want to permanently
          delete{" "}
          <strong>
            {
              designation?.designationName
            }
          </strong>
          ?
        </Typography>


        <Typography
          variant="caption"
          color="error.main"
          sx={{
            display: "block",
            mt: 1.5
          }}
        >
          Make sure no active employees are
          dependent on this designation.
        </Typography>

      </DialogContent>


      <DialogActions
        sx={{
          p: 2
        }}
      >

        <Button
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>


        <Button
          color="error"
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          sx={{
            minWidth: 100,
            fontWeight: 850
          }}
        >

          {loading ? (

            <CircularProgress
              size={20}
              color="inherit"
            />

          ) : (
            "Delete"
          )}

        </Button>

      </DialogActions>

    </Dialog>
  );
};


export default DeleteDesignationDialog;