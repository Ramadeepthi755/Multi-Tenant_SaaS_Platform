import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography
} from "@mui/material";


import DeleteOutlineOutlinedIcon
  from "@mui/icons-material/DeleteOutlineOutlined";


const DocumentDeleteDialog = ({
  open,
  document,
  loading = false,
  onClose,
  onConfirm
}) => {

  const fileName =
    document?.fileName ||
    document?.name ||
    "this document";


  return (
    <Dialog
      open={
        open
      }
      onClose={
        loading
          ? undefined
          : onClose
      }
      maxWidth="xs"
      fullWidth
    >

      <DialogTitle
        sx={{
          fontWeight: 900
        }}
      >
        Delete Document
      </DialogTitle>


      <DialogContent>

        <Stack
          spacing={2}
        >

          <Alert
            severity="warning"
            sx={{
              borderRadius: 2
            }}
          >
            This action cannot be undone.
          </Alert>


          <Typography>
            Are you sure you want to delete:
          </Typography>


          <Typography
            fontWeight={850}
            sx={{
              wordBreak: "break-word"
            }}
          >
            {fileName}
          </Typography>

        </Stack>

      </DialogContent>


      <DialogActions
        sx={{
          px: 3,
          pb: 2.5
        }}
      >

        <Button
          onClick={
            onClose
          }
          disabled={
            loading
          }
        >
          Cancel
        </Button>


        <Button
          variant="contained"
          color="error"
          startIcon={
            <DeleteOutlineOutlinedIcon />
          }
          onClick={
            onConfirm
          }
          disabled={
            loading
          }
          sx={{
            fontWeight: 850
          }}
        >
          {loading
            ? "Deleting..."
            : "Delete"}
        </Button>

      </DialogActions>

    </Dialog>
  );
};


export default DocumentDeleteDialog;