import {
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Paper,
  Typography,
} from "@mui/material";

import Grid from "@mui/material/Grid";

const UserDetails = ({
  open,
  onClose,
  user,
}) => {

  if (!user) return null;

  return (

    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >

      <DialogTitle>
        User Details
      </DialogTitle>

      <DialogContent>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            mt: 1,
            borderRadius: 2,
            border: "1px solid #e0e0e0",
          }}
        >

          <Grid
            container
            spacing={3}
          >

            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
            >

              <Avatar
                src={user.profilePhoto}
                sx={{
                  width: 110,
                  height: 110,
                  fontSize: 40,
                }}
              >
                {user.fullName?.charAt(0)}
              </Avatar>

            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} md={6}>

              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Full Name
              </Typography>

              <Typography variant="body1">
                {user.fullName}
              </Typography>

            </Grid>

            <Grid item xs={12} md={6}>

              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Email
              </Typography>

              <Typography variant="body1">
                {user.email}
              </Typography>

            </Grid>

            <Grid item xs={12} md={6}>

              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Phone Number
              </Typography>

              <Typography variant="body1">
                {user.phoneNumber}
              </Typography>

            </Grid>

            <Grid item xs={12} md={6}>

              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Role
              </Typography>

              <Chip
                label={user.role}
                color="primary"
              />

            </Grid>

            <Grid item xs={12} md={6}>

              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Company
              </Typography>

              <Typography variant="body1">
                {user.companyName}
              </Typography>

            </Grid>

            <Grid item xs={12} md={6}>

              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Department
              </Typography>

              <Typography variant="body1">
                {user.departmentName}
              </Typography>

            </Grid>

            <Grid item xs={12} md={6}>

              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Designation
              </Typography>

              <Typography variant="body1">
                {user.designationName}
              </Typography>

            </Grid>

            <Grid item xs={12} md={6}>

              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Status
              </Typography>

              <Chip
                label={user.status}
                color={
                  user.status === "ACTIVE"
                    ? "success"
                    : "error"
                }
              />

            </Grid>

            <Grid item xs={12} md={6}>

              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Created Date
              </Typography>

              <Typography variant="body1">
                {user.createdAt || "-"}
              </Typography>

            </Grid>

            <Grid item xs={12} md={6}>

              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Last Login
              </Typography>

              <Typography variant="body1">
                {user.lastLogin || "-"}
              </Typography>

            </Grid>

          </Grid>

        </Paper>

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

export default UserDetails;