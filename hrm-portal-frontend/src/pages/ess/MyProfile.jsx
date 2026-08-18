import { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import Grid from "@mui/material/Grid";

import {
  Edit,
  Lock,
  CloudUpload,
  Email,
  Phone,
  Business,
  Badge,
  Home,
  Cake,
} from "@mui/icons-material";

import {
  getMyProfile,
  uploadProfilePhoto,
} from "../../services/essService";

import EditMyProfile from "./EditMyProfile";

const MyProfile = () => {

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {

    loadProfile();

  }, []);

  const loadProfile = async () => {

    try {

      const response = await getMyProfile();

      setProfile(response);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  const handlePhotoUpload = async (event) => {

    const file = event.target.files[0];

    if (!file) return;

    try {

      await uploadProfilePhoto(file);

      loadProfile();

    } catch (error) {

      console.error(error);

      alert("Profile photo upload failed.");

    }

  };

  if (loading) {

    return (

      <Box
        display="flex"
        justifyContent="center"
        mt={5}
      >
        <CircularProgress />
      </Box>

    );

  }

  return (

    <Box>

      <Typography
        variant="h4"
        mb={3}
      >
        My Profile
      </Typography>

      <Grid container spacing={3}>

        {/* Left Card */}

        <Grid item xs={12} md={4}>

          <Card>

            <CardContent>

              <Stack
                spacing={2}
                alignItems="center"
              >

                <Avatar
                  src={profile?.photoUrl}
                  sx={{
                    width: 140,
                    height: 140,
                  }}
                >
                  {profile?.fullName?.charAt(0)}
                </Avatar>

                <Typography
                  variant="h5"
                >
                  {profile?.fullName}
                </Typography>

                <Chip
                  label={profile?.role}
                  color="primary"
                />

                <Typography
                  color="text.secondary"
                >
                  Employee ID:
                  {profile?.employeeCode}
                </Typography>

                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                >

                  Upload Photo

                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />

                </Button>

                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  fullWidth
                  onClick={() =>
                    setOpenEdit(true)
                  }
                >
                  Edit Profile
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Lock />}
                  fullWidth
                >
                  Change Password
                </Button>

              </Stack>

            </CardContent>

          </Card>

        </Grid>

        {/* Right Card */}

        <Grid item xs={12} md={8}>

          <Card>

            <CardHeader
              title="Employee Information"
            />

            <Divider />

            <CardContent>

              <Grid
                container
                spacing={3}
              >

                <Grid item xs={12} md={6}>

                  <Stack spacing={2}>

                    <Typography>

                      <Email
                        color="primary"
                        sx={{ mr: 1 }}
                      />

                      {profile?.email}

                    </Typography>

                    <Typography>

                      <Phone
                        color="primary"
                        sx={{ mr: 1 }}
                      />

                      {profile?.phone}

                    </Typography>

                    <Typography>

                      <Business
                        color="primary"
                        sx={{ mr: 1 }}
                      />

                      {profile?.department}

                    </Typography>

                    <Typography>

                      <Badge
                        color="primary"
                        sx={{ mr: 1 }}
                      />

                      {profile?.designation}

                    </Typography>

                  </Stack>

                </Grid>

                <Grid item xs={12} md={6}>

                  <Stack spacing={2}>

                    <Typography>

                      <Home
                        color="primary"
                        sx={{ mr: 1 }}
                      />

                      {profile?.address}

                    </Typography>

                    <Typography>

                      <Cake
                        color="primary"
                        sx={{ mr: 1 }}
                      />

                      {profile?.dateOfBirth}

                    </Typography>

                    <Typography>

                      Gender:
                      {profile?.gender}

                    </Typography>

                    <Typography>

                      Joining Date:
                      {profile?.joiningDate}

                    </Typography>

                  </Stack>

                </Grid>

              </Grid>

            </CardContent>

          </Card>

        </Grid>

      </Grid>

      <EditMyProfile
        open={openEdit}
        onClose={() =>
          setOpenEdit(false)
        }
        reload={loadProfile}
        profile={profile}
      />

    </Box>

  );

};

export default MyProfile;