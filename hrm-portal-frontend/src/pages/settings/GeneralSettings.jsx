import {
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  FormControlLabel
} from "@mui/material";


import TuneOutlinedIcon
  from "@mui/icons-material/TuneOutlined";


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


const defaultSettings = {

  language: "en",
  timezone: "Asia/Kolkata",
  dateFormat: "DD/MM/YYYY",
  currency: "INR",
  weekStartDay: "MONDAY",
  compactMode: false

};


const GeneralSettings = () => {

  const [
    form,
    setForm
  ] = useState(
    defaultSettings
  );


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
      .getGeneralSettings()
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
            "Unable to load general settings."
          );

        }
      );

  }, []);


  const handleChange =
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
          .updateGeneralSettings(
            form
          );

        setSuccess(
          "General settings saved successfully."
        );

      } catch (requestError) {

        setError(
          requestError?.response?.data?.message ||
          "Unable to save general settings."
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

        title="General Settings"

        description="Configure regional and application-wide preferences."

        icon={
          <TuneOutlinedIcon />
        }

      >

        <Stack spacing={2.5}>

          <TextField
            select
            fullWidth
            label="Language"
            name="language"
            value={
              form.language
            }
            onChange={
              handleChange
            }
          >

            <MenuItem value="en">
              English
            </MenuItem>

          </TextField>


          <TextField
            select
            fullWidth
            label="Timezone"
            name="timezone"
            value={
              form.timezone
            }
            onChange={
              handleChange
            }
          >

            <MenuItem value="Asia/Kolkata">
              India — Asia/Kolkata
            </MenuItem>

            <MenuItem value="UTC">
              UTC
            </MenuItem>

            <MenuItem value="Asia/Dubai">
              Dubai — Asia/Dubai
            </MenuItem>

          </TextField>


          <TextField
            select
            fullWidth
            label="Date Format"
            name="dateFormat"
            value={
              form.dateFormat
            }
            onChange={
              handleChange
            }
          >

            <MenuItem value="DD/MM/YYYY">
              DD/MM/YYYY
            </MenuItem>

            <MenuItem value="MM/DD/YYYY">
              MM/DD/YYYY
            </MenuItem>

            <MenuItem value="YYYY-MM-DD">
              YYYY-MM-DD
            </MenuItem>

          </TextField>


          <TextField
            select
            fullWidth
            label="Currency"
            name="currency"
            value={
              form.currency
            }
            onChange={
              handleChange
            }
          >

            <MenuItem value="INR">
              INR — Indian Rupee
            </MenuItem>

            <MenuItem value="USD">
              USD — US Dollar
            </MenuItem>

            <MenuItem value="EUR">
              EUR — Euro
            </MenuItem>

          </TextField>


          <TextField
            select
            fullWidth
            label="Week Starts On"
            name="weekStartDay"
            value={
              form.weekStartDay
            }
            onChange={
              handleChange
            }
          >

            <MenuItem value="MONDAY">
              Monday
            </MenuItem>

            <MenuItem value="SUNDAY">
              Sunday
            </MenuItem>

          </TextField>


          <FormControlLabel
            control={
              <Switch
                checked={
                  Boolean(
                    form.compactMode
                  )
                }
                onChange={
                  handleChange
                }
                name="compactMode"
              />
            }
            label="Use compact interface"
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


export default GeneralSettings;