import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  Chip,
} from "@mui/material";

const HolidayDetails = ({
  open,
  onClose,
  holiday,
}) => {

  if (!holiday) return null;

  return (

    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >

      <DialogTitle>
        Holiday Details
      </DialogTitle>

      <DialogContent dividers>

        <Card variant="outlined">

          <CardContent>

            <Typography
              variant="h6"
              fontWeight={700}
            >
              Holiday Information
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Grid
              container
              spacing={3}
            >

              <Grid item xs={12} md={6}>
                <Typography color="text.secondary">
                  Holiday Name
                </Typography>

                <Typography fontWeight={600}>
                  {holiday.holidayName}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography color="text.secondary">
                  Holiday Date
                </Typography>

                <Typography fontWeight={600}>
                  {holiday.holidayDate}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography color="text.secondary">
                  Holiday Type
                </Typography>

                <Typography fontWeight={600}>
                  {holiday.holidayType}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography color="text.secondary">
                  Year
                </Typography>

                <Typography fontWeight={600}>
                  {holiday.year}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography color="text.secondary">
                  Status
                </Typography>

                <Chip
                  label={holiday.status}
                  color={
                    holiday.status === "ACTIVE"
                      ? "success"
                      : "default"
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography color="text.secondary">
                  Day
                </Typography>

                <Typography fontWeight={600}>
                  {holiday.day || "-"}
                </Typography>
              </Grid>

            </Grid>

          </CardContent>

        </Card>

      </DialogContent>

      <DialogActions>

        <Button
          variant="contained"
          onClick={onClose}
        >
          Close
        </Button>

      </DialogActions>

    </Dialog>

  );

};

export default HolidayDetails;