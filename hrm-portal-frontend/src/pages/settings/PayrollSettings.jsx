import {
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField
} from "@mui/material";


import PaymentsOutlinedIcon
  from "@mui/icons-material/PaymentsOutlined";


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

  currency: "INR",
  payrollFrequency: "MONTHLY",
  payrollDay: 1,
  overtimeEnabled: true,
  taxEnabled: true,
  providentFundEnabled: true,
  professionalTaxEnabled: true,
  payslipGeneration: true

};


const PayrollSettings = () => {

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
      .getPayrollSettings()
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
            "Unable to load payroll settings."
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
          .updatePayrollSettings(
            form
          );

        setSuccess(
          "Payroll settings saved successfully."
        );

      } catch (requestError) {

        setError(
          requestError?.response?.data?.message ||
          "Unable to save payroll settings."
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

        title="Payroll Settings"

        description="Configure payroll frequency and statutory processing options."

        icon={
          <PaymentsOutlinedIcon />
        }

      >

        <Stack spacing={2.5}>

          <TextField
            select
            label="Currency"
            name="currency"
            value={
              form.currency
            }
            onChange={
              change
            }
          >

            <MenuItem value="INR">
              INR — Indian Rupee
            </MenuItem>

            <MenuItem value="USD">
              USD — US Dollar
            </MenuItem>

          </TextField>


          <TextField
            select
            label="Payroll Frequency"
            name="payrollFrequency"
            value={
              form.payrollFrequency
            }
            onChange={
              change
            }
          >

            <MenuItem value="MONTHLY">
              Monthly
            </MenuItem>

            <MenuItem value="BI_WEEKLY">
              Bi-weekly
            </MenuItem>

            <MenuItem value="WEEKLY">
              Weekly
            </MenuItem>

          </TextField>


          <TextField
            type="number"
            label="Payroll Processing Day"
            name="payrollDay"
            value={
              form.payrollDay
            }
            onChange={
              change
            }
          />


          <FormControlLabel
            control={
              <Switch
                name="overtimeEnabled"
                checked={
                  Boolean(
                    form.overtimeEnabled
                  )
                }
                onChange={
                  change
                }
              />
            }
            label="Enable overtime processing"
          />


          <FormControlLabel
            control={
              <Switch
                name="taxEnabled"
                checked={
                  Boolean(
                    form.taxEnabled
                  )
                }
                onChange={
                  change
                }
              />
            }
            label="Enable tax processing"
          />


          <FormControlLabel
            control={
              <Switch
                name="providentFundEnabled"
                checked={
                  Boolean(
                    form.providentFundEnabled
                  )
                }
                onChange={
                  change
                }
              />
            }
            label="Enable provident fund processing"
          />


          <FormControlLabel
            control={
              <Switch
                name="professionalTaxEnabled"
                checked={
                  Boolean(
                    form.professionalTaxEnabled
                  )
                }
                onChange={
                  change
                }
              />
            }
            label="Enable professional tax"
          />


          <FormControlLabel
            control={
              <Switch
                name="payslipGeneration"
                checked={
                  Boolean(
                    form.payslipGeneration
                  )
                }
                onChange={
                  change
                }
              />
            }
            label="Automatically generate payslips"
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


export default PayrollSettings;