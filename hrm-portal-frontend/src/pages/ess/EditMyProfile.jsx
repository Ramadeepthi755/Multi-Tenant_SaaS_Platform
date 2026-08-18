import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";

import Grid from "@mui/material/Grid";

import { updateMyProfile } from "../../services/essService";

const genders = [
  "MALE",
  "FEMALE",
  "OTHER",
];

const initialState = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  dateOfBirth: "",
  gender: "",
  emergencyContact: "",
};

const EditMyProfile = ({
  open,
  onClose,
  reload,
  profile,
}) => {

  const [formData, setFormData] =
    useState(initialState);

  useEffect(() => {

    if (profile) {

      setFormData({
        fullName:
          profile.fullName || "",
        email:
          profile.email || "",
        phone:
          profile.phone || "",
        address:
          profile.address || "",
        dateOfBirth:
          profile.dateOfBirth || "",
        gender:
          profile.gender || "",
        emergencyContact:
          profile.emergencyContact || "",
      });

    } else {

      setFormData(initialState);

    }

  }, [profile]);

  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const validate = () => {

    if (!formData.fullName.trim()) {
      alert("Full Name is required.");
      return false;
    }

    if (!formData.email.trim()) {
      alert("Email is required.");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Invalid email address.");
      return false;
    }

    if (!formData.phone.trim()) {
      alert("Phone number is required.");
      return false;
    }

    return true;

  };

  const handleSubmit = async () => {

    if (!validate()) return;

    try {

      await updateMyProfile(formData);

      reload();

      onClose();

    } catch (error) {

      console.error(error);

      alert("Failed to update profile.");

    }

  };

  return (

    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >

      <DialogTitle>
        Edit My Profile
      </DialogTitle>

      <DialogContent>

        <Grid
          container
          spacing={2}
          sx={{ mt: 1 }}
        >

          <Grid item xs={12} md={6}>

            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

          </Grid>

          <Grid item xs={12} md={6}>

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </Grid>

          <Grid item xs={12} md={6}>

            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={12} md={6}>

            <TextField
              select
              fullWidth
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >

              {genders.map((gender) => (

                <MenuItem
                  key={gender}
                  value={gender}
                >
                  {gender}
                </MenuItem>

              ))}

            </TextField>

          </Grid>

          <Grid item xs={12} md={6}>

            <TextField
              fullWidth
              type="date"
              label="Date of Birth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />

          </Grid>

          <Grid item xs={12} md={6}>

            <TextField
              fullWidth
              label="Emergency Contact"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={12}>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />

          </Grid>

        </Grid>

      </DialogContent>

      <DialogActions>

        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
        >
          Update Profile
        </Button>

      </DialogActions>

    </Dialog>

  );

};

export default EditMyProfile;