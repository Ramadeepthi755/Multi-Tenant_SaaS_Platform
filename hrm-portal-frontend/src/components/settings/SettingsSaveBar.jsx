import {
  Alert,
  Button,
  CircularProgress,
  Stack
} from "@mui/material";


import SaveOutlinedIcon
  from "@mui/icons-material/SaveOutlined";


import RestartAltOutlinedIcon
  from "@mui/icons-material/RestartAltOutlined";


const SettingsSaveBar = ({
  onSave,
  onReset,
  loading = false,
  success = "",
  error = ""
}) => {

  return (
    <Stack
      spacing={1.5}
      sx={{
        mt: 4
      }}
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


      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={1.5}
      >

        <Button
          variant="outlined"
          startIcon={
            <RestartAltOutlinedIcon />
          }
          onClick={onReset}
          disabled={loading}
          sx={{
            fontWeight: 800
          }}
        >
          Reset
        </Button>


        <Button
          variant="contained"
          startIcon={
            loading
              ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                />
              )
              : (
                <SaveOutlinedIcon />
              )
          }
          onClick={onSave}
          disabled={loading}
          sx={{
            fontWeight: 850
          }}
        >
          {loading
            ? "Saving..."
            : "Save Changes"}
        </Button>

      </Stack>

    </Stack>
  );
};


export default SettingsSaveBar;