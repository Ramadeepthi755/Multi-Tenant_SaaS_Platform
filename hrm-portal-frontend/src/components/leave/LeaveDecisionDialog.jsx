import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from "@mui/material";


import {
  useEffect,
  useState
} from "react";


const LeaveDecisionDialog = ({
  open,
  mode = "APPROVE",
  leave,
  loading = false,
  error = "",
  onClose,
  onConfirm
}) => {

  const [
    reason,
    setReason
  ] = useState("");


  useEffect(() => {

    if (!open) {
      setReason("");
    }

  }, [
    open
  ]);


  const isReject =
    mode === "REJECT";


  const handleConfirm = () => {

    if (
      isReject &&
      !reason.trim()
    ) {
      return;
    }


    onConfirm(
      reason.trim()
    );
  };


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
      fullWidth
      maxWidth="xs"
    >

      <DialogTitle
        sx={{
          fontWeight: 900
        }}
      >
        {
          isReject
            ? "Reject Leave Request"
            : "Approve Leave Request"
        }
      </DialogTitle>


      <DialogContent>

        <Stack
          spacing={2}
          sx={{
            pt: 1
          }}
        >

          {error && (

            <Alert
              severity="error"
              sx={{
                borderRadius: 2
              }}
            >
              {error}
            </Alert>

          )}


          <Typography
            variant="body2"
            color="text.secondary"
          >
            You are about to{" "}
            <strong>
              {
                isReject
                  ? "reject"
                  : "approve"
              }
            </strong>{" "}
            the leave request submitted by{" "}

            <strong>
              {
                leave?.employeeName ||
                "this employee"
              }
            </strong>
            .
          </Typography>


          {isReject && (

            <TextField
              fullWidth
              multiline
              minRows={3}
              required
              label="Rejection Reason"
              placeholder="Enter reason for rejection..."
              value={
                reason
              }
              onChange={event =>
                setReason(
                  event.target.value
                )
              }
              disabled={
                loading
              }
            />

          )}

        </Stack>

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
          sx={{
            fontWeight: 800
          }}
        >
          Cancel
        </Button>


        <Button
          variant="contained"
          color={
            isReject
              ? "error"
              : "success"
          }
          onClick={
            handleConfirm
          }
          disabled={
            loading ||
            (
              isReject &&
              !reason.trim()
            )
          }
          startIcon={
            loading ? (
              <CircularProgress
                size={18}
                color="inherit"
              />
            ) : null
          }
          sx={{
            minWidth: 110,
            fontWeight: 850
          }}
        >
          {
            loading
              ? "Processing..."
              : isReject
                ? "Reject"
                : "Approve"
          }
        </Button>

      </DialogActions>

    </Dialog>
  );
};


export default LeaveDecisionDialog;