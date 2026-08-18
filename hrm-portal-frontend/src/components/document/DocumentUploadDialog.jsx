import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";


import CloudUploadOutlinedIcon
  from "@mui/icons-material/CloudUploadOutlined";


import {
  useRef,
  useState
} from "react";


import documentService
  from "../../services/documentService";


import {
  formatFileSize,
  validateDocumentFile
} from "../../utils/documentUtils";


const DocumentUploadDialog = ({
  open,
  onClose,
  onUploaded
}) => {

  const inputRef =
    useRef(null);


  const [
    file,
    setFile
  ] = useState(null);


  const [
    category,
    setCategory
  ] = useState("OTHER");


  const [
    description,
    setDescription
  ] = useState("");


  const [
    progress,
    setProgress
  ] = useState(0);


  const [
    uploading,
    setUploading
  ] = useState(false);


  const [
    error,
    setError
  ] = useState("");


  const [
    success,
    setSuccess
  ] = useState("");


  const reset =
    () => {

      setFile(null);
      setCategory("OTHER");
      setDescription("");
      setProgress(0);
      setUploading(false);
      setError("");
      setSuccess("");

    };


  const close =
    () => {

      if (uploading) {
        return;
      }


      reset();

      onClose?.();

    };


  const selectFile =
    event => {

      const selected =
        event.target.files?.[0];


      if (!selected) {
        return;
      }


      const validation =
        validateDocumentFile(
          selected
        );


      if (
        !validation.valid
      ) {

        setFile(null);

        setError(
          validation.message
        );

        return;

      }


      setError("");
      setSuccess("");
      setFile(
        selected
      );


      event.target.value = "";

    };


  const upload =
    async () => {

      if (!file) {

        setError(
          "Please select a file."
        );

        return;

      }


      const validation =
        validateDocumentFile(
          file
        );


      if (
        !validation.valid
      ) {

        setError(
          validation.message
        );

        return;

      }


      setUploading(true);
      setProgress(0);
      setError("");
      setSuccess("");


      try {

        const response =
          await documentService
            .uploadDocument(

              file,

              {
                category,
                description
              },

              percentage => {

                setProgress(
                  percentage
                );

              }

            );


        setSuccess(
          "Document uploaded successfully."
        );


        onUploaded?.(
          response
        );


        setTimeout(
          () => {

            reset();
            onClose?.();

          },
          700
        );

      } catch (requestError) {

        setError(
          requestError?.response?.data?.message ||
          "Unable to upload document."
        );

      } finally {

        setUploading(false);

      }

    };


  return (
    <Dialog
      open={
        open
      }
      onClose={
        close
      }
      maxWidth="sm"
      fullWidth
    >

      <DialogTitle
        sx={{
          fontWeight: 900
        }}
      >
        Upload Document
      </DialogTitle>


      <DialogContent>

        <Stack
          spacing={2.5}
          sx={{
            pt: 1
          }}
        >

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


          <Button
            variant="outlined"
            component="label"
            startIcon={
              <CloudUploadOutlinedIcon />
            }
            disabled={
              uploading
            }
            sx={{
              minHeight: 100,
              borderStyle: "dashed",
              fontWeight: 850
            }}
          >
            {file
              ? "Change File"
              : "Choose File"}

            <input
              ref={
                inputRef
              }
              type="file"
              hidden
              onChange={
                selectFile
              }
            />

          </Button>


          {file && (

            <Stack
              spacing={0.5}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor:
                  "action.hover"
              }}
            >

              <Typography
                fontWeight={850}
                sx={{
                  wordBreak: "break-word"
                }}
              >
                {file.name}
              </Typography>


              <Typography
                variant="body2"
                color="text.secondary"
              >
                {formatFileSize(
                  file.size
                )}
              </Typography>

            </Stack>

          )}


          <TextField
            select
            fullWidth
            label="Document Category"
            value={
              category
            }
            onChange={
              event =>
                setCategory(
                  event.target.value
                )
            }
            disabled={
              uploading
            }
          >

            <MenuItem value="EMPLOYEE">
              Employee Document
            </MenuItem>

            <MenuItem value="CONTRACT">
              Contract
            </MenuItem>

            <MenuItem value="IDENTITY">
              Identity
            </MenuItem>

            <MenuItem value="PAYROLL">
              Payroll
            </MenuItem>

            <MenuItem value="LEAVE">
              Leave
            </MenuItem>

            <MenuItem value="OTHER">
              Other
            </MenuItem>

          </TextField>


          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Description"
            value={
              description
            }
            onChange={
              event =>
                setDescription(
                  event.target.value
                )
            }
            disabled={
              uploading
            }
          />


          {uploading && (

            <Stack
              spacing={1}
            >

              <Stack
                direction="row"
                justifyContent="space-between"
              >

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Uploading...
                </Typography>


                <Typography
                  variant="body2"
                  fontWeight={800}
                >
                  {progress}%
                </Typography>

              </Stack>


              <LinearProgress
                variant="determinate"
                value={
                  progress
                }
                sx={{
                  height: 8,
                  borderRadius: 10
                }}
              />

            </Stack>

          )}


          <Typography
            variant="caption"
            color="text.secondary"
          >
            Maximum file size: 10 MB.
            Supported: PDF, images, Word,
            Excel and text files.
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
            close
          }
          disabled={
            uploading
          }
        >
          Cancel
        </Button>


        <Button
          variant="contained"
          startIcon={
            <CloudUploadOutlinedIcon />
          }
          onClick={
            upload
          }
          disabled={
            uploading ||
            !file
          }
          sx={{
            fontWeight: 850
          }}
        >
          {uploading
            ? "Uploading..."
            : "Upload"}
        </Button>

      </DialogActions>

    </Dialog>
  );
};


export default DocumentUploadDialog;