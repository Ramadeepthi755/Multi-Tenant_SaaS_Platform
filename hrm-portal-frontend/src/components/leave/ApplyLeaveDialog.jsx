import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";


import {
  useEffect,
  useState
} from "react";


import {
  calculateLeaveDays,
  LEAVE_TYPES
} from "../../utils/leaveUtils";


const ApplyLeaveDialog = ({
  open,
  employeeId,
  loading = false,
  error = "",
  onClose,
  onSubmit
}) => {

  const [
    leaveType,
    setLeaveType
  ] = useState("");


  const [
    fromDate,
    setFromDate
  ] = useState("");


  const [
    toDate,
    setToDate
  ] = useState("");


  const [
    reason,
    setReason
  ] = useState("");


  const [
    validationError,
    setValidationError
  ] = useState("");


  useEffect(() => {

    if (!open) {

      setLeaveType("");

      setFromDate("");

      setToDate("");

      setReason("");

      setValidationError("");

    }

  }, [
    open
  ]);


  const days =
    calculateLeaveDays(
      fromDate,
      toDate
    );


  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();


    if (!employeeId) {

      setValidationError(
        "Employee ID is required."
      );

      return;
    }


    if (!leaveType) {

      setValidationError(
        "Please select a leave type."
      );

      return;
    }


    if (!fromDate) {

      setValidationError(
        "Please select the start date."
      );

      return;
    }


    if (!toDate) {

      setValidationError(
        "Please select the end date."
      );

      return;
    }


    if (days <= 0) {

      setValidationError(
        "End date must be on or after start date."
      );

      return;
    }


    if (!reason.trim()) {

      setValidationError(
        "Please provide a reason."
      );

      return;
    }


    setValidationError("");


    await onSubmit({

      employeeId,

      leaveType,

      fromDate,

      toDate,

      reason:
        reason.trim()

    });

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
      maxWidth="sm"
    >

      <form
        onSubmit={
          handleSubmit
        }
      >

        <DialogTitle
          sx={{
            fontWeight: 900
          }}
        >
          Apply for Leave
        </DialogTitle>


        <DialogContent
          dividers
        >

          <Stack
            spacing={2.5}
            sx={{
              pt: 1
            }}
          >

            {(error ||
              validationError) && (

              <Alert
                severity="error"
                sx={{
                  borderRadius: 2
                }}
              >
                {
                  validationError ||
                  error
                }
              </Alert>

            )}


            <TextField
              select
              fullWidth
              label="Leave Type"
              value={
                leaveType
              }
              onChange={event =>
                setLeaveType(
                  event.target.value
                )
              }
              disabled={
                loading
              }
            >

              <MenuItem value="">
                Select leave type
              </MenuItem>


              {LEAVE_TYPES.map(
                item => (

                  <MenuItem
                    key={
                      item.value
                    }
                    value={
                      item.value
                    }
                  >
                    {
                      item.label
                    }
                  </MenuItem>

                )
              )}

            </TextField>


            <Stack
              direction={{
                xs: "column",
                sm: "row"
              }}
              spacing={2}
            >

              <TextField
                fullWidth
                type="date"
                label="From Date"
                value={
                  fromDate
                }
                onChange={event =>
                  setFromDate(
                    event.target.value
                  )
                }
                disabled={
                  loading
                }
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
              />


              <TextField
                fullWidth
                type="date"
                label="To Date"
                value={
                  toDate
                }
                onChange={event =>
                  setToDate(
                    event.target.value
                  )
                }
                disabled={
                  loading
                }
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
              />

            </Stack>


            {days > 0 && (

              <Typography
                variant="body2"
                color="primary.main"
                fontWeight={800}
              >
                Total leave days:{" "}
                {days}
              </Typography>

            )}


            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Reason"
              placeholder="Explain the reason for your leave..."
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
            type="submit"
            variant="contained"
            disabled={
              loading
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
              minWidth: 130,
              fontWeight: 850
            }}
          >
            {
              loading
                ? "Submitting..."
                : "Apply Leave"
            }
          </Button>

        </DialogActions>

      </form>

    </Dialog>
  );
};


export default ApplyLeaveDialog;