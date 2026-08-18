import { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import CompanyForm from "./CompanyForm";

import {
  createCompany,
  updateCompany,
} from "../../services/companyService";

const CompanyDialog = ({
  open,
  handleClose,
  company = null,
  refreshCompanies,
}) => {

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {

    try {

      setLoading(true);

      if (company) {

        await updateCompany(company.id, data);

      } else {

        await createCompany(data);

      }

      refreshCompanies();

      handleClose();

    } catch (error) {

      console.error("Error saving company:", error);

      alert("Failed to save company.");

    } finally {

      setLoading(false);

    }

  };

  return (

    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
    >

      <DialogTitle>

        {company
          ? "Edit Company"
          : "Add Company"}

      </DialogTitle>

      <DialogContent dividers>

        <CompanyForm
          initialValues={company}
          onSubmit={handleSubmit}
          loading={loading}
        />

      </DialogContent>

      <DialogActions>

        <Button
          onClick={handleClose}
        >
          Cancel
        </Button>

      </DialogActions>

    </Dialog>

  );

};

export default CompanyDialog;