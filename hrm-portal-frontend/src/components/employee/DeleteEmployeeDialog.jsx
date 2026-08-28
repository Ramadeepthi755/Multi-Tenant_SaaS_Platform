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


import {
  getEmployeeName
} from "../../utils/employeeUtils";


const DeleteEmployeeDialog = ({
  open,
  employee,
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
        Deactivate Employee?
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
          Are you sure you want to deactivate{" "}
          <strong>
            {
              getEmployeeName(
                employee
              )
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
          The employee will remain in the system and can be reactivated later.
        </Typography>

      </DialogContent>


      <DialogActions
        sx={{
          p: 2
        }}
      >

        <Button
          onClick={
            onClose
          }
          disabled={
            loading
          }
        >
          Cancel
        </Button>


        <Button
          color="error"
          variant="contained"
          onClick={
            onConfirm
          }
          disabled={
            loading
          }
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
            "Deactivate"
          )}

        </Button>

      </DialogActions>

    </Dialog>
  );
};


export default DeleteEmployeeDialog;
