import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography
} from "@mui/material";


import CloseOutlinedIcon
  from "@mui/icons-material/CloseOutlined";


import LeaveStatusChip
  from "./LeaveStatusChip";


import {
  formatLeaveDate,
  getLeaveTypeLabel
} from "../../utils/leaveUtils";


const Detail = ({
  label,
  value
}) => {

  return (
    <Box>

      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={750}
      >
        {label}
      </Typography>


      <Typography
        variant="body2"
        fontWeight={800}
        sx={{
          mt: .3
        }}
      >
        {value || "—"}
      </Typography>

    </Box>
  );
};


const LeaveDetailsDialog = ({
  open,
  leave,
  onClose
}) => {

  if (!leave) {
    return null;
  }


  return (
    <Dialog
      open={
        open
      }
      onClose={
        onClose
      }
      fullWidth
      maxWidth="sm"
    >

      <DialogTitle
        sx={{
          pr: 6
        }}
      >

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >

          <Box>

            <Typography
              variant="h6"
              fontWeight={900}
            >
              Leave Request
            </Typography>


            <Typography
              variant="caption"
              color="text.secondary"
            >
              {
                leave.employeeName
              }
            </Typography>

          </Box>


          <IconButton
            onClick={
              onClose
            }
          >
            <CloseOutlinedIcon />
          </IconButton>

        </Stack>

      </DialogTitle>


      <DialogContent
        dividers
      >

        <Stack
          spacing={2.5}
        >

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Current Status
            </Typography>


            <LeaveStatusChip
              status={
                leave.status
              }
            />

          </Stack>


          <Divider />


          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr"
              },
              gap: 2.5
            }}
          >

            <Detail
              label="Employee"
              value={
                leave.employeeName
              }
            />


            <Detail
              label="Employee ID"
              value={
                leave.employeeCode ||
                leave.employeeId
              }
            />


            <Detail
              label="Department"
              value={
                leave.department
              }
            />


            <Detail
              label="Designation"
              value={
                leave.designation
              }
            />


            <Detail
              label="Leave Type"
              value={
                getLeaveTypeLabel(
                  leave.leaveType
                )
              }
            />


            <Detail
              label="Number of Days"
              value={
                leave.days
              }
            />


            <Detail
              label="From Date"
              value={
                formatLeaveDate(
                  leave.fromDate
                )
              }
            />


            <Detail
              label="To Date"
              value={
                formatLeaveDate(
                  leave.toDate
                )
              }
            />


            <Detail
              label="Applied Date"
              value={
                formatLeaveDate(
                  leave.appliedDate
                )
              }
            />

          </Box>


          <Box
            sx={{
              p: 2,
              bgcolor:
                "action.hover",
              borderRadius: 2
            }}
          >

            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={750}
            >
              Reason
            </Typography>


            <Typography
              variant="body2"
              sx={{
                mt: .5,
                lineHeight: 1.65
              }}
            >
              {
                leave.reason ||
                "No reason provided."
              }
            </Typography>

          </Box>


          {leave.rejectionReason && (

            <Box
              sx={{
                p: 2,
                bgcolor:
                  "error.50",
                borderRadius: 2
              }}
            >

              <Typography
                variant="caption"
                color="error.main"
                fontWeight={800}
              >
                Rejection Reason
              </Typography>


              <Typography
                variant="body2"
                sx={{
                  mt: .5
                }}
              >
                {
                  leave.rejectionReason
                }
              </Typography>

            </Box>

          )}

        </Stack>

      </DialogContent>

    </Dialog>
  );
};


export default LeaveDetailsDialog;