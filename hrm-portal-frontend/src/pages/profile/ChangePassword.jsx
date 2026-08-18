import {
  Alert,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField
} from "@mui/material";

import LockOutlinedIcon
  from "@mui/icons-material/LockOutlined";

import VisibilityOutlinedIcon
  from "@mui/icons-material/VisibilityOutlined";

import VisibilityOffOutlinedIcon
  from "@mui/icons-material/VisibilityOffOutlined";

import {
  useState
} from "react";

import profileService
  from "../../services/profileService";

import ProfileSection
  from "../../components/profile/ProfileSection";


const ChangePassword = () => {

  const [
    form,
    setForm
  ] = useState({

    currentPassword: "",
    newPassword: "",
    confirmPassword: ""

  });


  const [
    showCurrent,
    setShowCurrent
  ] = useState(false);


  const [
    showNew,
    setShowNew
  ] = useState(false);


  const [
    showConfirm,
    setShowConfirm
  ] = useState(false);


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


  const change =
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


  const submit =
    async event => {

      event.preventDefault();

      setSuccess("");
      setError("");


      if (
        !form.currentPassword ||
        !form.newPassword ||
        !form.confirmPassword
      ) {

        setError(
          "Please complete all password fields."
        );

        return;

      }


      if (
        form.newPassword !==
        form.confirmPassword
      ) {

        setError(
          "New password and confirmation do not match."
        );

        return;

      }


      if (
        form.newPassword.length < 8
      ) {

        setError(
          "New password must contain at least 8 characters."
        );

        return;

      }


      setLoading(true);


      try {

        await profileService
          .changePassword({

            oldPassword:
              form.currentPassword,

            newPassword:
              form.newPassword

          });


        setForm({

          currentPassword: "",
          newPassword: "",
          confirmPassword: ""

        });


        setSuccess(
          "Password changed successfully."
        );


      } catch (requestError) {

        setError(

          requestError
            ?.response
            ?.data
            ?.message ||

          "Unable to change password."

        );


      } finally {

        setLoading(false);

      }

    };


  const passwordAdornment =
    (
      visible,
      setVisible
    ) => (

      <InputAdornment
        position="end"
      >

        <IconButton
          edge="end"
          onClick={() =>
            setVisible(
              previous =>
                !previous
            )
          }
          aria-label="Toggle password visibility"
        >

          {visible
            ? (
              <VisibilityOffOutlinedIcon />
            )
            : (
              <VisibilityOutlinedIcon />
            )}

        </IconButton>

      </InputAdornment>

    );


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

        title="Change Password"

        description={
          "Use a strong password that you do not reuse elsewhere."
        }

        icon={
          <LockOutlinedIcon />
        }

      >

        <form
          onSubmit={
            submit
          }
        >

          <Stack
            spacing={2.5}
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


            <TextField
              fullWidth
              label="Current Password"
              name="currentPassword"
              type={
                showCurrent
                  ? "text"
                  : "password"
              }
              value={
                form.currentPassword
              }
              onChange={
                change
              }
              slotProps={{
                input: {
                  endAdornment:
                    passwordAdornment(
                      showCurrent,
                      setShowCurrent
                    )
                }
              }}
            />


            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type={
                showNew
                  ? "text"
                  : "password"
              }
              value={
                form.newPassword
              }
              onChange={
                change
              }
              helperText={
                "Minimum 8 characters"
              }
              slotProps={{
                input: {
                  endAdornment:
                    passwordAdornment(
                      showNew,
                      setShowNew
                    )
                }
              }}
            />


            <TextField
              fullWidth
              label="Confirm New Password"
              name="confirmPassword"
              type={
                showConfirm
                  ? "text"
                  : "password"
              }
              value={
                form.confirmPassword
              }
              onChange={
                change
              }
              slotProps={{
                input: {
                  endAdornment:
                    passwordAdornment(
                      showConfirm,
                      setShowConfirm
                    )
                }
              }}
            />


            <Button
              type="submit"
              variant="contained"
              disabled={
                loading
              }
              sx={{
                alignSelf:
                  "flex-end",
                fontWeight: 850,
                px: 3
              }}
            >

              {loading
                ? "Changing..."
                : "Change Password"}

            </Button>

          </Stack>

        </form>

      </ProfileSection>

    </Paper>

  );

};


export default ChangePassword;