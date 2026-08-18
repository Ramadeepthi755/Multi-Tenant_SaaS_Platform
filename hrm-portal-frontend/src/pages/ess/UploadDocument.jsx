import { useEffect, useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  LinearProgress,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import {
  CloudUpload,
} from "@mui/icons-material";

import { uploadDocument } from "../../services/essService";

const categories = [
  "AADHAAR",
  "PAN",
  "PASSPORT",
  "RESUME",
  "OFFER_LETTER",
  "MARKSHEET",
  "CERTIFICATE",
  "EXPERIENCE_LETTER",
  "OTHER",
];

const initialState = {
  category: "",
  description: "",
};

const UploadDocument = ({
  open,
  onClose,
  reload,
}) => {

  const [formData, setFormData] =
    useState(initialState);

  const [file, setFile] =
    useState(null);

  const [uploading, setUploading] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  useEffect(() => {

    if (open) {

      setFormData(initialState);
      setFile(null);
      setProgress(0);

    }

  }, [open]);

  const handleChange = (event) => {

    const { name, value } =
      event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const handleFileChange = (event) => {

    const selectedFile =
      event.target.files[0];

    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];

    if (
      !allowedTypes.includes(
        selectedFile.type
      )
    ) {

      alert(
        "Only PDF, DOC, DOCX, JPG and PNG files are allowed."
      );

      return;

    }

    if (
      selectedFile.size >
      10 * 1024 * 1024
    ) {

      alert(
        "Maximum file size is 10 MB."
      );

      return;

    }

    setFile(selectedFile);

  };

  const validate = () => {

    if (!formData.category) {

      alert("Select category.");

      return false;

    }

    if (!file) {

      alert("Choose a file.");

      return false;

    }

    return true;

  };

  const handleUpload =
    async () => {

      if (!validate()) return;

      try {

        setUploading(true);

        setProgress(30);

        await uploadDocument({
          file,
          category:
            formData.category,
          description:
            formData.description,
        });

        setProgress(100);

        reload();

        onClose();

      } catch (error) {

        console.error(error);

        alert(
          "Document upload failed."
        );

      } finally {

        setUploading(false);

      }

    };

  return (

    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >

      <DialogTitle>
        Upload Document
      </DialogTitle>

      <DialogContent>

        <Grid
          container
          spacing={2}
          sx={{ mt: 1 }}
        >

          <Grid item xs={12}>

            <TextField
              fullWidth
              select
              label="Document Category"
              name="category"
              value={
                formData.category
              }
              onChange={
                handleChange
              }
            >

              {categories.map(
                (category) => (

                  <MenuItem
                    key={category}
                    value={category}
                  >
                    {category.replaceAll(
                      "_",
                      " "
                    )}
                  </MenuItem>

                )
              )}

            </TextField>

          </Grid>

          <Grid item xs={12}>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              name="description"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
            />

          </Grid>

          <Grid item xs={12}>

            <Button
              component="label"
              variant="outlined"
              fullWidth
              startIcon={
                <CloudUpload />
              }
            >

              Choose File

              <input
                hidden
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={
                  handleFileChange
                }
              />

            </Button>

          </Grid>

          {file && (

            <Grid item xs={12}>

              <Typography
                color="primary"
              >
                {file.name}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {(
                  file.size /
                  1024 /
                  1024
                ).toFixed(2)}
                {" MB"}
              </Typography>

            </Grid>

          )}

          {uploading && (

            <Grid item xs={12}>

              <Box>

                <LinearProgress
                  variant="determinate"
                  value={progress}
                />

                <Typography
                  mt={1}
                >
                  Uploading...
                </Typography>

              </Box>

            </Grid>

          )}

        </Grid>

      </DialogContent>

      <DialogActions>

        <Button
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={
            handleUpload
          }
          disabled={uploading}
          startIcon={
            uploading ? (
              <CircularProgress
                size={18}
              />
            ) : (
              <CloudUpload />
            )
          }
        >
          {uploading
            ? "Uploading..."
            : "Upload"}
        </Button>

      </DialogActions>

    </Dialog>

  );

};

export default UploadDocument;