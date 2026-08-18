import {
  Alert,
  Button,
  Chip,
  Paper,
  Stack,
  Typography
} from "@mui/material";


import SecurityOutlinedIcon
  from "@mui/icons-material/SecurityOutlined";


import {
  useState
} from "react";


import profileService
  from "../../services/profileService";


import ProfileSection
  from "../../components/profile/ProfileSection";


const SecurityOverview = () => {

  const [
    loading,
    setLoading
  ] = useState(false);


  const [
    message,
    setMessage
  ] = useState("");


  const [
    error,
    setError
  ] = useState("");


  const logoutOtherSessions =
    async () => {

      setLoading(true);
      setMessage("");
      setError("");

      try {

        await profileService
          .logoutOtherSessions();


        setMessage(
          "Other active sessions have been signed out."
        );

      } catch (requestError) {

        setError(
          requestError?.response?.data?.message ||
          "Unable to terminate other sessions."
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

        title="Security"

        description="Review your account security and active sessions."

        icon={
          <SecurityOutlinedIcon />
        }

      >

        <Stack
          spacing={2.5}
        >

          {message && (

            <Alert
              severity="success"
              sx={{
                borderRadius: 2
              }}
            >
              {message}
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


          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >

            <BoxText
              title="Password"
              description="Your password is protected by the server."
            />


            <Chip
              label="Protected"
              color="success"
              variant="outlined"
              size="small"
            />

          </Stack>


          <Stack
            direction={{
              xs: "column",
              sm: "row"
            }}
            justifyContent="space-between"
            alignItems={{
              xs: "flex-start",
              sm: "center"
            }}
            spacing={2}
          >

            <BoxText
              title="Other sessions"
              description="Sign out sessions from other devices."
            />


            <Button
              variant="outlined"
              color="error"
              onClick={
                logoutOtherSessions
              }
              disabled={
                loading
              }
              sx={{
                fontWeight: 800
              }}
            >
              {loading
                ? "Signing out..."
                : "Sign Out Other Sessions"}
            </Button>

          </Stack>

        </Stack>

      </ProfileSection>

    </Paper>
  );
};


const BoxText = ({
  title,
  description
}) => {

  return (
    <Stack
      spacing={0.35}
    >

      <Typography
        fontWeight={850}
      >
        {title}
      </Typography>


      <Typography
        variant="body2"
        color="text.secondary"
      >
        {description}
      </Typography>

    </Stack>
  );
};


export default SecurityOverview;