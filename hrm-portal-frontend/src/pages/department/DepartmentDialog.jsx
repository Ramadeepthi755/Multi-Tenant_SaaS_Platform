import { useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress
} from "@mui/material";

import DepartmentForm from "./DepartmentForm";

import {
    createDepartment,
    updateDepartment
} from "../../services/departmentService";

const DepartmentDialog = ({
    open,
    onClose,
    department,
    reload
}) => {

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData) => {

        try {

            setLoading(true);

            if (department) {

                await updateDepartment(
                    department.departmentId,
                    formData
                );

            } else {

                await createDepartment(formData);

            }

            reload();

            onClose();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to save department."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <Dialog
            open={open}
            onClose={loading ? null : onClose}
            fullWidth
            maxWidth="md"
        >

            <DialogTitle>

                {department
                    ? "Edit Department"
                    : "Add Department"}

            </DialogTitle>

            <DialogContent>

                <DepartmentForm
                    department={department}
                    onSubmit={handleSubmit}
                    loading={loading}
                />

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    form="department-form"
                    variant="contained"
                    disabled={loading}
                >

                    {
                        loading
                            ? <CircularProgress size={22} color="inherit" />
                            : department
                                ? "Update"
                                : "Save"
                    }

                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default DepartmentDialog;