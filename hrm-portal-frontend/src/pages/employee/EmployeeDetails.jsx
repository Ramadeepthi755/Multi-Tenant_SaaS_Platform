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
  Box,
} from "@mui/material";

import EmployeeDocuments from "./EmployeeDocuments";

const EmployeeDetails = ({
  open,
  onClose,
  employee,
}) => {
  if (!employee) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
    >
      {/* =====================================================
          TITLE
      ===================================================== */}

      <DialogTitle>
        <Typography
          variant="h5"
          fontWeight={700}
        >
          Employee Details
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          mt={0.5}
        >
          View employee information and documents
        </Typography>
      </DialogTitle>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <DialogContent dividers>

        {/* ===================================================
            BASIC INFORMATION
        =================================================== */}

        <Typography
          variant="h6"
          fontWeight={700}
          mb={3}
        >
          Personal Information
        </Typography>

        <Grid container spacing={3}>

          {/* Employee Code */}

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Employee Code
            </Typography>

            <Typography variant="body1">
              {employee.employeeCode || "-"}
            </Typography>
          </Grid>

          {/* Full Name */}

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Full Name
            </Typography>

            <Typography variant="body1">
              {employee.firstName || ""}{" "}
              {employee.lastName || ""}
            </Typography>
          </Grid>

          {/* Email */}

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Email
            </Typography>

            <Typography variant="body1">
              {employee.email || "-"}
            </Typography>
          </Grid>

          {/* Phone */}

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Phone
            </Typography>

            <Typography variant="body1">
              {employee.phone || "-"}
            </Typography>
          </Grid>

          {/* Gender */}

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Gender
            </Typography>

            <Typography variant="body1">
              {employee.gender || "-"}
            </Typography>
          </Grid>

          {/* DOB */}

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Date of Birth
            </Typography>

            <Typography variant="body1">
              {employee.dateOfBirth || "-"}
            </Typography>
          </Grid>

          {/* =================================================
              ORGANIZATION
          ================================================= */}

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography
              variant="h6"
              fontWeight={700}
            >
              Employment Information
            </Typography>
          </Grid>

          {/* Department */}

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Department
            </Typography>

            <Typography variant="body1">
              {employee.departmentName || "-"}
            </Typography>
          </Grid>

          {/* Designation */}

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Designation
            </Typography>

            <Typography variant="body1">
              {employee.designationName || "-"}
            </Typography>
          </Grid>

          {/* Joining Date */}

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Joining Date
            </Typography>

            <Typography variant="body1">
              {employee.joiningDate || "-"}
            </Typography>
          </Grid>

          {/* Salary */}

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Salary
            </Typography>

            <Typography variant="body1">
              {employee.salary || "-"}
            </Typography>
          </Grid>

          {/* Status */}

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Status
            </Typography>

            <Box mt={0.5}>
              <Chip
                label={
                  employee.status || "UNKNOWN"
                }
                color={
                  employee.status === "ACTIVE"
                    ? "success"
                    : "error"
                }
              />
            </Box>
          </Grid>

          {/* Employee ID */}

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Employee ID
            </Typography>

            <Typography variant="body1">
              {employee.employeeId || "-"}
            </Typography>
          </Grid>

          {/* =================================================
              ADDRESS
          ================================================= */}

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography
              variant="h6"
              fontWeight={700}
              mb={1}
            >
              Address
            </Typography>

            <Typography variant="body1">
              {employee.address || "-"}
            </Typography>
          </Grid>

          {/* =================================================
              AUDIT INFORMATION
          ================================================= */}

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography
              variant="h6"
              fontWeight={700}
              mb={3}
            >
              Record Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Created By
            </Typography>

            <Typography variant="body1">
              {employee.createdBy || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Updated By
            </Typography>

            <Typography variant="body1">
              {employee.updatedBy || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Created Date
            </Typography>

            <Typography variant="body1">
              {employee.createdAt || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Updated Date
            </Typography>

            <Typography variant="body1">
              {employee.updatedAt || "-"}
            </Typography>
          </Grid>

        </Grid>

        {/* ===================================================
            DOCUMENTS
        =================================================== */}

        <Box mt={4}>
          <Divider sx={{ mb: 4 }} />

          <EmployeeDocuments
            employeeId={employee.employeeId}
          />
        </Box>

      </DialogContent>

      {/* =====================================================
          ACTIONS
      ===================================================== */}

      <DialogActions sx={{ p: 2 }}>

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

export default EmployeeDetails;