import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Chip,
  Divider,
} from "@mui/material";

const DesignationDetails = ({ open, onClose, designation }) => {
  if (!designation) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        Designation Details
      </DialogTitle>

      <DialogContent dividers>

        <Grid container spacing={3}>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Designation Code
            </Typography>

            <Typography variant="body1">
              {designation.designationCode}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Designation Name
            </Typography>

            <Typography variant="body1">
              {designation.designationName}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Department
            </Typography>

            <Typography variant="body1">
              {designation.departmentName || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>

            <Chip
              label={designation.status}
              color={
                designation.status === "ACTIVE"
                  ? "success"
                  : "error"
              }
            />
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Description
            </Typography>

            <Typography variant="body1">
              {designation.description || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Created By
            </Typography>

            <Typography variant="body1">
              {designation.createdBy || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Updated By
            </Typography>

            <Typography variant="body1">
              {designation.updatedBy || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Created Date
            </Typography>

            <Typography variant="body1">
              {designation.createdAt || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Updated Date
            </Typography>

            <Typography variant="body1">
              {designation.updatedAt || "-"}
            </Typography>
          </Grid>

        </Grid>

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

export default DesignationDetails;