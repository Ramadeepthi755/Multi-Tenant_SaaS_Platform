import {
  Alert,
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField
} from "@mui/material";


import SecurityOutlinedIcon
  from "@mui/icons-material/SecurityOutlined";


import {
  useEffect,
  useState
} from "react";


import SettingsSection
  from "../../components/settings/SettingsSection";


import SettingsSaveBar
  from "../../components/settings/SettingsSaveBar";


import settingsService
  from "../../services/settingsService";


const defaults = {

  sessionTimeoutMinutes: 30,
  maxLoginAttempts: 5,
  passwordExpiryDays: 90,
  minimumPasswordLength: 8,
  requireUppercase: true,
  requireNumber: true,
  requireSpecialCharacter: true,
  twoFactorAuthentication: false

};


const SecuritySettings = () => {

  const [
    form,
    setForm
  ] = useState(defaults);


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

    settingsService
      .getSecuritySettings()
      .then(response => {

        setForm(
          previous => ({
            ...previous,
            ...(response || {})
          })
        );

      })
      .catch(
        requestError => {

          setError(
            requestError?.response?.data?.message ||
            "Unable to load security settings."
          );

        }
      );

  }, []);


  const change =
    event => {

      const {
        name,
        value,
        checked,
        type
      } = event.target;


      setForm(
        previous => ({
          ...previous,
          [name]:
            type === "checkbox"
              ? checked
              : value
        })
      );

      setSuccess("");
      setError("");

    };


  const save =
    async () => {

      setLoading(true);
      setSuccess("");
      setError("");

      try {

        await settingsService
          .updateSecuritySettings(
            form
          );

        setSuccess(
          "Security settings saved successfully."
        );

      } catch (requestError) {

        setError(
          requestError?.response?.data?.message ||
          "Unable to save security settings."
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

      <SettingsSection

        title="Security Settings"

        description="Configure authentication and account security policies."

        icon={
          <SecurityOutlinedIcon />
        }

      >

        <Stack spacing={2.5}>

          <Alert
            severity="info"
            sx={{
              borderRadius: 2
            }}
          >
            Security policies should also be enforced
            by the backend. These controls only manage
            the HRM configuration.
          </Alert>


          <TextField
            type="number"
            label="Session Timeout (minutes)"
            name="sessionTimeoutMinutes"
            value={
              form.sessionTimeoutMinutes
            }
            onChange={
              change
            }
          />


          <TextField
            type="number"
            label="Maximum Login Attempts"
            name="maxLoginAttempts"
            value={
              form.maxLoginAttempts
            }
            onChange={
              change
            }
          />


          <TextField
            type="number"
            label="Password Expiry (days)"
            name="passwordExpiryDays"
            value={
              form.passwordExpiryDays
            }
            onChange={
              change
            }
          />


          <TextField
            type="number"
            label="Minimum Password Length"
            name="minimumPasswordLength"
            value={
              form.minimumPasswordLength
            }
            onChange={
              change
            }
          />


          <FormControlLabel
            control={
              <Switch
                name="requireUppercase"
                checked={
                  Boolean(
                    form.requireUppercase
                  )
                }
                onChange={
                  change
                }
              />
            }
            label="Require uppercase character"
          />


          <FormControlLabel
            control={
              <Switch
                name="requireNumber"
                checked={
                  Boolean(
                    form.requireNumber
                  )
                }
                onChange={
                  change
                }
              />
            }
            label="Require number"
          />


          <FormControlLabel
            control={
              <Switch
                name="requireSpecialCharacter"
                checked={
                  Boolean(
                    form.requireSpecialCharacter
                  )
                }
                onChange={
                  change
                }
              />
            }
            label="Require special character"
          />


          <FormControlLabel
            control={
              <Switch
                name="twoFactorAuthentication"
                checked={
                  Boolean(
                    form.twoFactorAuthentication
                  )
                }
                onChange={
                  change
                }
              />
            }
            label="Enable two-factor authentication"
          />

        </Stack>


        <SettingsSaveBar
          onSave={save}
          onReset={() =>
            window.location.reload()
          }
          loading={
            loading
          }
          success={
            success
          }
          error={
            error
          }
        />

      </SettingsSection>

    </Paper>
  );
};


export default SecuritySettings;