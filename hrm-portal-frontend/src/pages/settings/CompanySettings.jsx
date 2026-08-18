import {
  Alert,
  Box,
  Grid,
  Paper,
  Stack,
  TextField
} from "@mui/material";


import BusinessOutlinedIcon
  from "@mui/icons-material/BusinessOutlined";


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

  companyName: "",
  companyCode: "",
  email: "",
  phone: "",
  website: "",
  address: "",
  city: "",
  state: "",
  country: "India",
  postalCode: "",
  taxNumber: "",
  registrationNumber: ""

};


const CompanySettings = () => {

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
    initialLoading,
    setInitialLoading
  ] = useState(true);


  const [
    success,
    setSuccess
  ] = useState("");


  const [
    error,
    setError
  ] = useState("");


  useEffect(() => {

    const load =
      async () => {

        try {

          const response =
            await settingsService
              .getCompanySettings();


          setForm(
            previous => ({
              ...previous,
              ...(response || {})
            })
          );

        } catch (requestError) {

          setError(
            requestError?.response?.data?.message ||
            "Unable to load company settings."
          );

        } finally {

          setInitialLoading(
            false
          );

        }

      };


    load();

  }, []);


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


  const handleSave =
    async () => {

      setLoading(true);
      setSuccess("");
      setError("");

      try {

        const response =
          await settingsService
            .updateCompanySettings(
              form
            );


        if (response) {

          setForm(
            previous => ({
              ...previous,
              ...(response || {})
            })
          );

        }


        setSuccess(
          "Company settings saved successfully."
        );

      } catch (requestError) {

        setError(
          requestError?.response?.data?.message ||
          "Unable to save company settings."
        );

      } finally {

        setLoading(false);

      }

    };


  const handleReset =
    () => {

      window.location.reload();

    };


  if (initialLoading) {

    return (
      <Alert
        severity="info"
        sx={{
          borderRadius: 2
        }}
      >
        Loading company settings...
      </Alert>
    );

  }


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

        title="Company Information"

        description="Manage your organization's core information."

        icon={
          <BusinessOutlinedIcon />
        }

      >

        <Box>

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
                label="Company Name"
                name="companyName"
                value={
                  form.companyName
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
                label="Company Code"
                name="companyCode"
                value={
                  form.companyCode
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
                label="Company Email"
                name="email"
                value={
                  form.email
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
                label="Phone"
                name="phone"
                value={
                  form.phone
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
                label="Website"
                name="website"
                value={
                  form.website
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
                  form.address
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}
            >

              <TextField
                fullWidth
                label="City"
                name="city"
                value={
                  form.city
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}
            >

              <TextField
                fullWidth
                label="State"
                name="state"
                value={
                  form.state
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}
            >

              <TextField
                fullWidth
                label="Postal Code"
                name="postalCode"
                value={
                  form.postalCode
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
                label="Tax Number"
                name="taxNumber"
                value={
                  form.taxNumber
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
                label="Registration Number"
                name="registrationNumber"
                value={
                  form.registrationNumber
                }
                onChange={
                  handleChange
                }
              />

            </Grid>

          </Grid>


          <SettingsSaveBar
            onSave={
              handleSave
            }
            onReset={
              handleReset
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

        </Box>

      </SettingsSection>

    </Paper>
  );
};


export default CompanySettings;