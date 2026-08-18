import {
  Box,
  Stack,
  Typography
} from "@mui/material";


import AssessmentOutlinedIcon
  from "@mui/icons-material/AssessmentOutlined";


const ReportEmptyState = ({
  title = "No report data",
  message =
    "There is no data available for the selected filters."
}) => {

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        py: 8,
        px: 3,
        textAlign: "center"
      }}
    >

      <Box
        sx={{
          width: 68,
          height: 68,
          borderRadius: "50%",
          bgcolor:
            "action.hover",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2
        }}
      >

        <AssessmentOutlinedIcon
          sx={{
            fontSize: 34,
            color:
              "text.secondary"
          }}
        />

      </Box>


      <Typography
        variant="h6"
        fontWeight={900}
      >
        {title}
      </Typography>


      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mt: 0.5,
          maxWidth: 460
        }}
      >
        {message}
      </Typography>

    </Stack>
  );
};


export default ReportEmptyState;