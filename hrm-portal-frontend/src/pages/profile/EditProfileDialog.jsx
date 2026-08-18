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

import {
  updateProfile,
} from "../../services/profileService";

const genders = [
  "MALE",
  "FEMALE",
  "OTHER",
];

const EditProfileDialog = ({
  open,
  onClose,
  profile,
  reload,
}) => {

  const initialState = {
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    emergencyContact: "",
  };

  const [formData, setFormData] =
    useState(initialState);

  useEffect(() => {

    if (profile) {

      setFormData({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phoneNumber:
          profile.phoneNumber || "",
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

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const handleSubmit = async () => {

    try {

      await updateProfile(formData);

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
      maxWidth="md"
      fullWidth
    >

      <DialogTitle>

        Edit Profile

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
            />

          </Grid>

          <Grid item xs={12} md={6}>

            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={12} md={6}>

            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
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
              rows={3}
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />

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

        </Grid>

      </DialogContent>

      <DialogActions>

        <Button
          onClick={onClose}
        >
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

export default EditProfileDialog;