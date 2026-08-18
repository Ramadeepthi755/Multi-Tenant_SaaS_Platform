import { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import EmployeeForm from "./EmployeeForm";

import {
  createEmployee,
  updateEmployee,
} from "../../services/employeeService";

const EmployeeDialog = ({
  open,
  onClose,
  employee,
  reload,
}) => {

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {

    try {

      setLoading(true);

      if (employee) {

        await updateEmployee(
          employee.employeeId,
          data
        );

      } else {

        await createEmployee(data);

      }

      reload();

      onClose();

    } catch (error) {

      console.error("Error saving employee:", error);

      alert("Failed to save employee.");

    } finally {

      setLoading(false);

    }

  };

  return (

    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
    >

      <DialogTitle>

        {employee
          ? "Update Employee"
          : "Add Employee"}

      </DialogTitle>

      <DialogContent dividers>

        <EmployeeForm
          employee={employee}
          onSubmit={handleSubmit}
        />

      </DialogContent>

      <DialogActions>

        <Button
          onClick={onClose}
          color="inherit"
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          type="submit"
          form="employee-form"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : employee
            ? "Update"
            : "Save"}
        </Button>

      </DialogActions>

    </Dialog>

  );

};

export default EmployeeDialog;