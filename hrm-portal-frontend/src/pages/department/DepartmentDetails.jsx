import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Divider,
    Chip,
    Box
} from "@mui/material";

const DetailItem = ({ label, value }) => (

    <Grid item xs={12} md={6}>

        <Typography
            variant="subtitle2"
            color="text.secondary"
        >
            {label}
        </Typography>

        <Typography
            variant="body1"
            sx={{ mt: 0.5 }}
        >
            {value || "-"}
        </Typography>

    </Grid>

);

const DepartmentDetails = ({
    open,
    onClose,
    department
}) => {

    if (!department) return null;

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >

            <DialogTitle>

                Department Details

            </DialogTitle>

            <DialogContent dividers>

                <Box mb={2}>

                    <Typography
                        variant="h5"
                        fontWeight={600}
                    >
                        {department.departmentName}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Department Information
                    </Typography>

                </Box>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>

                    <DetailItem
                        label="Department ID"
                        value={department.departmentId}
                    />

                    <DetailItem
                        label="Department Code"
                        value={department.departmentCode}
                    />

                    <DetailItem
                        label="Department Name"
                        value={department.departmentName}
                    />

                    <DetailItem
                        label="Company"
                        value={department.companyName}
                    />

                    <Grid item xs={12} md={6}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Status
                        </Typography>

                        <Chip
                            sx={{ mt: 1 }}
                            label={department.status}
                            color={
                                department.status === "ACTIVE"
                                    ? "success"
                                    : "error"
                            }
                        />

                    </Grid>

                    <Grid item xs={12}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Description
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{ mt: 1 }}
                        >
                            {department.description || "-"}
                        </Typography>

                    </Grid>

                    <DetailItem
                        label="Created By"
                        value={department.createdBy}
                    />

                    <DetailItem
                        label="Last Updated By"
                        value={department.updatedBy}
                    />

                    <DetailItem
                        label="Created Date"
                        value={department.createdAt}
                    />

                    <DetailItem
                        label="Last Updated"
                        value={department.updatedAt}
                    />

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

export default DepartmentDetails;