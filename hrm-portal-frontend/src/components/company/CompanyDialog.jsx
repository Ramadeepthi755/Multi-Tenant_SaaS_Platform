import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

const initialState = {
  companyName: "",
  companyCode: "",
  email: "",
  phone: "",
  address: "",
  website: "",
  status: "ACTIVE",
};

const CompanyDialog = ({
  open,
  onClose,
  onSave,
  company,
}) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (company) {
      setFormData({
        ...initialState,
        ...company,
      });
    } else {
      setFormData(initialState);
    }

    setErrors({});
  }, [company, open]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validate = () => {
    let temp = {};

    if (!formData.companyName.trim())
      temp.companyName = "Company Name is required";

    if (!formData.companyCode.trim())
      temp.companyCode = "Company Code is required";

    if (!formData.email.trim()) {
      temp.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        formData.email
      )
    ) {
      temp.email = "Invalid Email";
    }

    if (!formData.phone.trim()) {
      temp.phone = "Phone Number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      temp.phone = "Phone must contain 10 digits";
    }

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSave(formData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {company ? "Edit Company" : "Add Company"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={2}>
          <TextField
            label="Company Name"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            error={!!errors.companyName}
            helperText={errors.companyName}
            fullWidth
          />

          <TextField
            label="Company Code"
            name="companyCode"
            value={formData.companyCode}
            onChange={handleChange}
            error={!!errors.companyCode}
            helperText={errors.companyCode}
            fullWidth
          />

          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
          />

          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
            fullWidth
          />

          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />

          <TextField
            label="Website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="ACTIVE">
              ACTIVE
            </MenuItem>

            <MenuItem value="INACTIVE">
              INACTIVE
            </MenuItem>
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
        >
          {company ? "Update Company" : "Save Company"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompanyDialog;