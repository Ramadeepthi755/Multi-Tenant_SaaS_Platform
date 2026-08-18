import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import CloseIcon from "@mui/icons-material/Close";

import {
  getEmployeeDocuments,
  uploadDocument,
  downloadDocument,
  deleteDocument,
} from "../../services/documentService";

import { useAuth } from "../../context/AuthContext";

const EmployeeDocuments = ({ employeeId }) => {
  const { hasPermission } = useAuth();

  const [documents, setDocuments] = useState([]);

  const [loading, setLoading] = useState(false);

  const [uploadOpen, setUploadOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const [documentType, setDocumentType] = useState("RESUME");

  const [uploading, setUploading] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // ======================================================
  // LOAD DOCUMENTS
  // ======================================================

  const loadDocuments = async () => {
    if (!employeeId) return;

    try {
      setLoading(true);
      setError("");

      const data = await getEmployeeDocuments(employeeId);

      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Document loading error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load employee documents."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [employeeId]);

  // ======================================================
  // OPEN UPLOAD
  // ======================================================

  const handleOpenUpload = () => {
    setSelectedFile(null);
    setDocumentType("RESUME");
    setError("");
    setSuccess("");

    setUploadOpen(true);
  };

  // ======================================================
  // CLOSE UPLOAD
  // ======================================================

  const handleCloseUpload = () => {
    if (uploading) return;

    setUploadOpen(false);
    setSelectedFile(null);
  };

  // ======================================================
  // FILE SELECT
  // ======================================================

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
    setError("");
  };

  // ======================================================
  // UPLOAD
  // ======================================================

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      await uploadDocument(
        employeeId,
        documentType,
        selectedFile
      );

      setSuccess("Document uploaded successfully.");

      setUploadOpen(false);
      setSelectedFile(null);

      await loadDocuments();
    } catch (err) {
      console.error("Document upload error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to upload document."
      );
    } finally {
      setUploading(false);
    }
  };

  // ======================================================
  // DOWNLOAD
  // ======================================================

  const handleDownload = async (document) => {
    try {
      setError("");

      const response = await downloadDocument(
        document.documentId
      );

      const blob = new Blob(
        [response.data],
        {
          type:
            document.fileType ||
            "application/octet-stream",
        }
      );

      const url = window.URL.createObjectURL(blob);

      const link = window.document.createElement("a");

      link.href = url;

      link.download =
        document.originalFileName ||
        document.fileName ||
        "document";

      window.document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Document download error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to download document."
      );
    }
  };

  // ======================================================
  // DELETE
  // ======================================================

  const handleDelete = async (documentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(documentId);
      setError("");
      setSuccess("");

      await deleteDocument(documentId);

      setSuccess("Document deleted successfully.");

      await loadDocuments();
    } catch (err) {
      console.error("Document delete error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete document."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ======================================================
  // FORMAT FILE SIZE
  // ======================================================

  const formatFileSize = (bytes) => {
    if (!bytes) return "-";

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ======================================================
  // FORMAT DATE
  // ======================================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* HEADER */}

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          flexDirection={{
            xs: "column",
            sm: "row",
          }}
          gap={2}
          mb={3}
        >
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
            >
              Employee Documents
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              mt={0.5}
            >
              Manage employee resumes and other
              documents.
            </Typography>
          </Box>

          {hasPermission("DOCUMENT_UPLOAD") && (
            <Button
              variant="contained"
              startIcon={<UploadFileIcon />}
              onClick={handleOpenUpload}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Upload Document
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* ALERTS */}

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setSuccess("")}
          >
            {success}
          </Alert>
        )}

        {/* LOADING */}

        {loading ? (
          <Box
            sx={{
              py: 8,
              textAlign: "center",
            }}
          >
            <Typography color="text.secondary">
              Loading documents...
            </Typography>
          </Box>
        ) : documents.length === 0 ? (
          /* EMPTY */

          <Box
            sx={{
              py: 8,
              textAlign: "center",
            }}
          >
            <DescriptionIcon
              sx={{
                fontSize: 60,
                color: "text.disabled",
                mb: 2,
              }}
            />

            <Typography
              variant="h6"
              fontWeight={600}
            >
              No documents found
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              mt={1}
            >
              Upload a document to get started.
            </Typography>
          </Box>
        ) : (
          /* TABLE */

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Document</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Type</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Size</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Uploaded</strong>
                  </TableCell>

                  <TableCell align="right">
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {documents.map((document) => (
                  <TableRow
                    key={document.documentId}
                    hover
                  >
                    {/* FILE */}

                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                      >
                        <DescriptionIcon
                          color="primary"
                        />

                        <Box>
                          <Typography
                            fontWeight={600}
                            fontSize={14}
                          >
                            {document.originalFileName ||
                              document.fileName}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {document.fileType}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    {/* TYPE */}

                    <TableCell>
                      <Chip
                        label={
                          document.documentType ||
                          "DOCUMENT"
                        }
                        size="small"
                        sx={{
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>

                    {/* SIZE */}

                    <TableCell>
                      {formatFileSize(
                        document.fileSize
                      )}
                    </TableCell>

                    {/* DATE */}

                    <TableCell>
                      {formatDate(
                        document.uploadDate
                      )}
                    </TableCell>

                    {/* ACTIONS */}

                    <TableCell align="right">
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={0.5}
                      >
                        {hasPermission(
                          "DOCUMENT_DOWNLOAD"
                        ) && (
                          <Tooltip title="Download">
                            <IconButton
                              color="primary"
                              onClick={() =>
                                handleDownload(
                                  document
                                )
                              }
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        )}

                        {hasPermission(
                          "DOCUMENT_DELETE"
                        ) && (
                          <Tooltip title="Delete">
                            <span>
                              <IconButton
                                color="error"
                                disabled={
                                  deletingId ===
                                  document.documentId
                                }
                                onClick={() =>
                                  handleDelete(
                                    document.documentId
                                  )
                                }
                              >
                               <DeleteIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>

      {/* ==================================================
          UPLOAD DIALOG
      ================================================== */}

      <Dialog
        open={uploadOpen}
        onClose={handleCloseUpload}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h6"
              fontWeight={700}
            >
              Upload Document
            </Typography>

            <IconButton
              onClick={handleCloseUpload}
              disabled={uploading}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3}>
            {/* DOCUMENT TYPE */}

            <FormControl fullWidth>
              <InputLabel>
                Document Type
              </InputLabel>

              <Select
                value={documentType}
                label="Document Type"
                onChange={(e) =>
                  setDocumentType(e.target.value)
                }
              >
                <MenuItem value="RESUME">
                  Resume
                </MenuItem>

                <MenuItem value="AADHAAR">
                  Aadhaar
                </MenuItem>

                <MenuItem value="PAN">
                  PAN
                </MenuItem>

                <MenuItem value="CERTIFICATE">
                  Certificate
                </MenuItem>

                <MenuItem value="OFFER_LETTER">
                  Offer Letter
                </MenuItem>

                <MenuItem value="OTHER">
                  Other
                </MenuItem>
              </Select>
            </FormControl>

            {/* FILE */}

            <Box>
              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadFileIcon />}
                fullWidth
                sx={{
                  height: 54,
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                Choose File

                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>

              {selectedFile && (
                <Box mt={2}>
                  <Typography
                    fontWeight={600}
                  >
                    {selectedFile.name}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {formatFileSize(
                      selectedFile.size
                    )}
                  </Typography>
                </Box>
              )}
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseUpload}
            disabled={uploading}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={
              uploading || !selectedFile
            }
            startIcon={<UploadFileIcon />}
          >
            {uploading
              ? "Uploading..."
              : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default EmployeeDocuments;