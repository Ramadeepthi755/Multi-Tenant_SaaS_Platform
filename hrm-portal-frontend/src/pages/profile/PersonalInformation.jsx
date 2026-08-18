import {
  Alert,
  Grid,
  Paper,
  Stack,
  TextField
} from "@mui/material";


import PersonOutlineOutlinedIcon
  from "@mui/icons-material/PersonOutlineOutlined";


import {
  useEffect,
  useState
} from "react";


import profileService
  from "../../services/profileService";


import ProfileSection
  from "../../components/profile/ProfileSection";


const PersonalInformation = ({
  profile,
  onUpdated
}) => {

  const [
    form,
    setForm
  ] = useState({

    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    postalCode: ""

  });


  const [
    loading,
    setLoading
  ] = useState(false);


  const [
    success,
    setSuccess
  ] = useState("");


  const [
    error,
    setError
  ] = useState("");


  useEffect(() => {

    setForm(
      previous => ({
        ...previous,
        ...(
          profile || {}
        )
      })
    );

  }, [profile]);


  const handleChange =
    event => {

      const {
        name,
        value
      } = event.target;


      setForm(
        previous => ({
          ...previous,
          [name]: value
        })
      );

      setSuccess("");
      setError("");

    };


  const save =
    async event => {

      event.preventDefault();

      setLoading(true);
      setSuccess("");
      setError("");

      try {

        const response =
          await profileService
            .updateMyProfile(
              form
            );


        onUpdated?.(
          response
        );


        setSuccess(
          "Profile information updated successfully."
        );

      } catch (requestError) {

        setError(
          requestError?.response?.data?.message ||
          "Unable to update profile."
        );

      } finally {

        setLoading(false);

      }

    };


  return (
    <Paper
      elevation={0}
      sx={{
        p: {
          xs: 2,
          md: 3
        },
        border:
          "1px solid",
        borderColor:
          "divider",
        borderRadius: 3
      }}
    >

      <ProfileSection

        title="Personal Information"

        description="Update the information associated with your account."

        icon={
          <PersonOutlineOutlinedIcon />
        }

      >

        <form
          onSubmit={
            save
          }
        >

          <Stack
            spacing={2}
          >

            {success && (

              <Alert
                severity="success"
                sx={{
                  borderRadius: 2
                }}
              >
                {success}
              </Alert>

            )}


            {error && (

              <Alert
                severity="error"
                sx={{
                  borderRadius: 2
                }}
              >
                {error}
              </Alert>

            )}


            <Grid
              container
              spacing={2}
            >

              <Grid
                size={{
                  xs: 12,
                  md: 6
                }}
              >

                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={
                    form.fullName ||
                    ""
                  }
                  onChange={
                    handleChange
                  }
                />

              </Grid>


              <Grid
                size={{
                  xs: 12,
                  md: 6
                }}
              >

                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  name="email"
                  value={
                    form.email ||
                    ""
                  }
                  disabled
                />

              </Grid>


              <Grid
                size={{
                  xs: 12,
                  md: 6
                }}
              >

                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={
                    form.phone ||
                    ""
                  }
                  onChange={
                    handleChange
                  }
                />

              </Grid>


              <Grid
                size={{
                  xs: 12,
                  md: 6
                }}
              >

                <TextField
                  fullWidth
                  type="date"
                  label="Date of Birth"
                  name="dateOfBirth"
                  value={
                    form.dateOfBirth ||
                    ""
                  }
                  onChange={
                    handleChange
                  }
                  slotProps={{
                    inputLabel: {
                      shrink: true
                    }
                  }}
                />

              </Grid>


              <Grid
                size={{
                  xs: 12,
                  md: 6
                }}
              >

                <TextField
                  fullWidth
                  label="Gender"
                  name="gender"
                  value={
                    form.gender ||
                    ""
                  }
                  onChange={
                    handleChange
                  }
                />

              </Grid>


              <Grid
                size={{
                  xs: 12
                }}
              >

                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Address"
                  name="address"
                  value={
                    form.address ||
                    ""
                  }
                  onChange={
                    handleChange
                  }
                />

              </Grid>


              <Grid
                size={{
                  xs: 12,
                  sm: 4
                }}
              >

                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={
                    form.city ||
                    ""
                  }
                  onChange={
                    handleChange
                  }
                />

              </Grid>


              <Grid
                size={{
                  xs: 12,
                  sm: 4
                }}
              >

                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={
                    form.state ||
                    ""
                  }
                  onChange={
                    handleChange
                  }
                />

              </Grid>


              <Grid
                size={{
                  xs: 12,
                  sm: 4
                }}
              >

                <TextField
                  fullWidth
                  label="Postal Code"
                  name="postalCode"
                  value={
                    form.postalCode ||
                    ""
                  }
                  onChange={
                    handleChange
                  }
                />

              </Grid>

            </Grid>


            <Stack
              direction="row"
              justifyContent="flex-end"
              sx={{
                pt: 1
              }}
            >

              <button
                type="submit"
                disabled={
                  loading
                }
                style={{
                  border: "none",
                  borderRadius: "10px",
                  padding:
                    "11px 22px",
                  fontWeight: 800,
                  cursor:
                    loading
                      ? "not-allowed"
                      : "pointer"
                }}
              >
                {loading
                  ? "Saving..."
                  : "Save Profile"}
              </button>

            </Stack>

          </Stack>

        </form>

      </ProfileSection>

    </Paper>
  );
};


export default PersonalInformation;