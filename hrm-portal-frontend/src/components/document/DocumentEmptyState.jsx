import {
  Box,
  Button,
  Typography
} from "@mui/material";


import FolderOpenOutlinedIcon
  from "@mui/icons-material/FolderOpenOutlined";


const DocumentEmptyState = ({
  onUpload
}) => {

  return (
    <Box
      sx={{
        py: 8,
        px: 3,
        textAlign: "center"
      }}
    >

      <Box
        sx={{
          width: 64,
          height: 64,
          mx: "auto",
          mb: 2,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "action.hover",
          color: "text.secondary"
        }}
      >

        <FolderOpenOutlinedIcon
          fontSize="large"
        />

      </Box>


      <Typography
        variant="h6"
        fontWeight={900}
      >
        No documents found
      </Typography>


      <Typography
        color="text.secondary"
        sx={{
          mt: 0.5,
          mb: 2.5
        }}
      >
        Upload employee or company documents
        to manage them securely in one place.
      </Typography>


      {onUpload && (

        <Button
          variant="contained"
          onClick={
            onUpload
          }
          sx={{
            fontWeight: 850
          }}
        >
          Upload Document
        </Button>

      )}

    </Box>
  );
};


export default DocumentEmptyState;