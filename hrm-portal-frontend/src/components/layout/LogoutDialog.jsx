import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@mui/material";


const LogoutDialog = ({
  open,
  loading = false,
  onClose,
  onConfirm
}) => {

  return (
    <Dialog
      open={
        open
      }
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
        Sign out
      </DialogTitle>


      <DialogContent>

        <Typography
          color="text.secondary"
          sx={{
            lineHeight: 1.7
          }}
        >
          Are you sure you want to sign out
          of your HRM Portal account?
        </Typography>

      </DialogContent>


      <DialogActions
        sx={{
          px: 3,
          pb: 2.5
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
          variant="contained"
          color="error"
          onClick={
            onConfirm
          }
          disabled={
            loading
          }
          sx={{
            fontWeight: 850
          }}
        >
          {loading
            ? "Signing out..."
            : "Sign Out"}
        </Button>

      </DialogActions>

    </Dialog>
  );
};


export default LogoutDialog;