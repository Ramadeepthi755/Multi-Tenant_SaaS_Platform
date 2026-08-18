import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography
} from "@mui/material";


import WarningAmberOutlinedIcon
  from "@mui/icons-material/WarningAmberOutlined";


const ConfirmDialog = ({
  open = false,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  severity = "primary",
  loading = false,
  onConfirm,
  onClose
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

        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
        >

          <WarningAmberOutlinedIcon
            color={
              severity === "error"
                ? "error"
                : "warning"
            }
          />

          <Typography
            fontWeight={900}
          >
            {title}
          </Typography>

        </Stack>

      </DialogTitle>


      <DialogContent>

        <Typography
          color="text.secondary"
          sx={{
            lineHeight: 1.7
          }}
        >
          {message}
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
          sx={{
            fontWeight: 750
          }}
        >
          {cancelText}
        </Button>


        <Button
          variant="contained"
          color={
            severity
          }
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
            ? "Processing..."
            : confirmText}
        </Button>

      </DialogActions>

    </Dialog>
  );
};


export default ConfirmDialog;