import {
  FormControlLabel,
  Paper,
  Stack,
  Switch
} from "@mui/material";


import NotificationsNoneOutlinedIcon
  from "@mui/icons-material/NotificationsNoneOutlined";


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

  emailNotifications: true,
  leaveNotifications: true,
  attendanceNotifications: true,
  payrollNotifications: true,
  documentNotifications: true,
  systemNotifications: true,
  pushNotifications: true

};


const NotificationSettings = () => {

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
      .getNotificationSettings()
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
            "Unable to load notification settings."
          );

        }
      );

  }, []);


  const change =
    event => {

      const {
        name,
        checked
      } = event.target;


      setForm(
        previous => ({
          ...previous,
          [name]: checked
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
          .updateNotificationSettings(
            form
          );

        setSuccess(
          "Notification settings saved successfully."
        );

      } catch (requestError) {

        setError(
          requestError?.response?.data?.message ||
          "Unable to save notification settings."
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

        title="Notification Preferences"

        description="Choose which HR events should generate notifications."

        icon={
          <NotificationsNoneOutlinedIcon />
        }

      >

        <Stack spacing={1}>

          <FormControlLabel
            control={
              <Switch
                name="emailNotifications"
                checked={
                  Boolean(
                    form.emailNotifications
                  )
                }
                onChange={
                  change
                }
              />
            }
            label="Email notifications"
          />


          <FormControlLabel
            control={
              <Switch
                name="pushNotifications"
                checked={
                  Boolean(
                    form.pushNotifications
                  )
                }
                onChange={
                  change
                }
              />
            }
            label="In-app push notifications"
          />


          <FormControlLabel
            control={
              <Switch
                name="leaveNotifications"
                checked={
                  Boolean(
                    form.leaveNotifications
                  )
                }
                onChange={
                  change
                }
              />
            }
            label="Leave updates"
          />


          <FormControlLabel
            control={
              <Switch
                name="attendanceNotifications"
                checked={
                  Boolean(
                    form.attendanceNotifications
                  )
                }
                onChange={
                  change
                }
              />
            }
            label="Attendance alerts"
          />


          <FormControlLabel
            control={
              <Switch
                name="payrollNotifications"
                checked={
                  Boolean(
                    form.payrollNotifications
                  )
                }
                onChange={
                  change
                }
              />
            }
            label="Payroll notifications"
          />


          <FormControlLabel
            control={
              <Switch
                name="documentNotifications"
                checked={
                  Boolean(
                    form.documentNotifications
                  )
                }
                onChange={
                  change
                }
              />
            }
            label="Document notifications"
          />


          <FormControlLabel
            control={
              <Switch
                name="systemNotifications"
                checked={
                  Boolean(
                    form.systemNotifications
                  )
                }
                onChange={
                  change
                }
              />
            }
            label="System notifications"
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


export default NotificationSettings;