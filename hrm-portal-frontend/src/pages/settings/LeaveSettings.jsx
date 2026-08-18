import {
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField
} from "@mui/material";


import EventAvailableOutlinedIcon
  from "@mui/icons-material/EventAvailableOutlined";


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

  casualLeavePerYear: 12,
  sickLeavePerYear: 12,
  earnedLeavePerYear: 15,
  carryForward: true,
  maxCarryForwardDays: 30,
  approvalRequired: true,
  allowHalfDay: true,
  allowNegativeBalance: false

};


const LeaveSettings = () => {

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
      .getLeaveSettings()
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
            "Unable to load leave settings."
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
          .updateLeaveSettings(
            form
          );

        setSuccess(
          "Leave settings saved successfully."
        );

      } catch (requestError) {

        setError(
          requestError?.response?.data?.message ||
          "Unable to save leave settings."
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

        title="Leave Settings"

        description="Configure leave balances, approvals and carry-forward rules."

        icon={
          <EventAvailableOutlinedIcon />
        }

      >

        <Stack spacing={2.5}>

          <TextField
            type="number"
            label="Casual Leave Per Year"
            name="casualLeavePerYear"
            value={
              form.casualLeavePerYear
            }
            onChange={
              change
            }
          />


          <TextField
            type="number"
            label="Sick Leave Per Year"
            name="sickLeavePerYear"
            value={
              form.sickLeavePerYear
            }
            onChange={
              change
            }
          />


          <TextField
            type="number"
            label="Earned Leave Per Year"
            name="earnedLeavePerYear"
            value={
              form.earnedLeavePerYear
            }
            onChange={
              change
            }
          />


          <FormControlLabel
            control={
              <Switch
                name="carryForward"
                checked={
                  Boolean(
                    form.carryForward
                  )
                }
                onChange={
                  change
                }
              />
            }
            label="Allow leave carry-forward"
          />


          {form.carryForward && (

            <TextField
              type="number"
              label="Maximum Carry Forward Days"
              name="maxCarryForwardDays"
              value={
                form.maxCarryForwardDays
              }
              onChange={
                change
              }
            />

          )}


          <FormControlLabel
            control={
              <Switch
                name="approvalRequired"
                checked={
                  Boolean(
                    form.approvalRequired
                  )
                }
                onChange={
                  change
                }
              />
            }
            label="Require manager/HR approval"
          />


          <FormControlLabel
            control={
              <Switch
                name="allowHalfDay"
                checked={
                  Boolean(
                    form.allowHalfDay
                  )
                }
                onChange={
                  change
                }
              />
            }
            label="Allow half-day leave"
          />


          <FormControlLabel
            control={
              <Switch
                name="allowNegativeBalance"
                checked={
                  Boolean(
                    form.allowNegativeBalance
                  )
                }
                onChange={
                  change
                }
              />
            }
            label="Allow negative leave balance"
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


export default LeaveSettings;