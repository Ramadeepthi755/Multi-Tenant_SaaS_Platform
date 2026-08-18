import {
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField
} from "@mui/material";


import AccessTimeOutlinedIcon
  from "@mui/icons-material/AccessTimeOutlined";


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

  workStartTime: "09:00",
  workEndTime: "18:00",
  lateThresholdMinutes: 15,
  halfDayHours: 4,
  workingHoursPerDay: 8,
  enableOvertime: true,
  requireCheckInOut: true,
  allowSelfAttendance: true

};


const AttendanceSettings = () => {

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
      .getAttendanceSettings()
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
            "Unable to load attendance settings."
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
          .updateAttendanceSettings(
            form
          );

        setSuccess(
          "Attendance settings saved successfully."
        );

      } catch (requestError) {

        setError(
          requestError?.response?.data?.message ||
          "Unable to save attendance settings."
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

        title="Attendance Settings"

        description="Configure working hours, late thresholds and attendance rules."

        icon={
          <AccessTimeOutlinedIcon />
        }

      >

        <Stack spacing={2.5}>

          <TextField
            type="time"
            label="Work Start Time"
            name="workStartTime"
            value={
              form.workStartTime
            }
            onChange={
              change
            }
            slotProps={{
              inputLabel: {
                shrink: true
              }
            }}
          />


          <TextField
            type="time"
            label="Work End Time"
            name="workEndTime"
            value={
              form.workEndTime
            }
            onChange={
              change
            }
            slotProps={{
              inputLabel: {
                shrink: true
              }
            }}
          />


          <TextField
            type="number"
            label="Late Threshold (minutes)"
            name="lateThresholdMinutes"
            value={
              form.lateThresholdMinutes
            }
            onChange={
              change
            }
            inputProps={{
              min: 0
            }}
          />


          <TextField
            type="number"
            label="Half Day Hours"
            name="halfDayHours"
            value={
              form.halfDayHours
            }
            onChange={
              change
            }
            inputProps={{
              min: 0
            }}
          />


          <TextField
            type="number"
            label="Working Hours Per Day"
            name="workingHoursPerDay"
            value={
              form.workingHoursPerDay
            }
            onChange={
              change
            }
            inputProps={{
              min: 1
            }}
          />


          <FormControlLabel
            control={
              <Switch
                name="enableOvertime"
                checked={
                  Boolean(
                    form.enableOvertime
                  )
                }
                onChange={
                  change
                }
              />
            }
            label="Enable overtime tracking"
          />


          <FormControlLabel
            control={
              <Switch
                name="requireCheckInOut"
                checked={
                  Boolean(
                    form.requireCheckInOut
                  )
                }
                onChange={
                  change
                }
              />
            }
            label="Require check-in and check-out"
          />


          <FormControlLabel
            control={
              <Switch
                name="allowSelfAttendance"
                checked={
                  Boolean(
                    form.allowSelfAttendance
                  )
                }
                onChange={
                  change
                }
              />
            }
            label="Allow employees to record their own attendance"
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


export default AttendanceSettings;