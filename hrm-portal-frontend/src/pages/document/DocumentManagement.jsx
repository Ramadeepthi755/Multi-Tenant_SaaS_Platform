import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Pagination,
  Paper,
  Select,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography
} from "@mui/material";


import SearchOutlinedIcon
  from "@mui/icons-material/SearchOutlined";

import CloudUploadOutlinedIcon
  from "@mui/icons-material/CloudUploadOutlined";

import DescriptionOutlinedIcon
  from "@mui/icons-material/DescriptionOutlined";

import PictureAsPdfOutlinedIcon
  from "@mui/icons-material/PictureAsPdfOutlined";

import RefreshOutlinedIcon
  from "@mui/icons-material/RefreshOutlined";

import FolderOutlinedIcon
  from "@mui/icons-material/FolderOutlined";


import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";


import {
  useParams
} from "react-router-dom";


import DocumentStatCard
  from "../../components/document/DocumentStatCard";

import DocumentUploadDialog
  from "../../components/document/DocumentUploadDialog";

import DocumentTable
  from "../../components/document/DocumentTable";

import DocumentDeleteDialog from "../../components/document/DocumentDeleteDialog";

import documentService
  from "../../services/documentService";


import PermissionButton
  from "../../components/permissions/PermissionButton";


import usePermissions
  from "../../hooks/usePermissions";


import {
  DOCUMENT_CATEGORIES,
  getDocumentErrorMessage,
  normalizeDocument
} from "../../utils/documentUtils";


const DocumentManagement = () => {

  const {
    employeeId
  } = useParams();


  const {
    can
  } = usePermissions();


  // ==========================================================
  // DATA
  // ==========================================================

  const [
    documents,
    setDocuments
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState("");


  const [
    page,
    setPage
  ] = useState(0);


  const [
    totalPages,
    setTotalPages
  ] = useState(0);


  const [
    totalElements,
    setTotalElements
  ] = useState(0);


  // ==========================================================
  // FILTERS
  // ==========================================================

  const [
    searchInput,
    setSearchInput
  ] = useState("");


  const [
    search,
    setSearch
  ] = useState("");


  const [
    category,
    setCategory
  ] = useState("");


  // ==========================================================
  // UPLOAD
  // ==========================================================

  const [
    uploadOpen,
    setUploadOpen
  ] = useState(false);


  const [
    uploadLoading,
    setUploadLoading
  ] = useState(false);


  const [
    uploadProgress,
    setUploadProgress
  ] = useState(0);


  const [
    uploadError,
    setUploadError
  ] = useState("");


  // ==========================================================
  // DELETE
  // ==========================================================

  const [
    deleteOpen,
    setDeleteOpen
  ] = useState(false);


  const [
    selectedDocument,
    setSelectedDocument
  ] = useState(null);


  const [
    deleteLoading,
    setDeleteLoading
  ] = useState(false);


  const [
    deleteError,
    setDeleteError
  ] = useState("");


  // ==========================================================
  // TOAST
  // ==========================================================

  const [
    toast,
    setToast
  ] = useState({
    open: false,
    message: "",
    severity: "success"
  });


  // ==========================================================
  // LOAD DOCUMENTS
  // ==========================================================

  const loadDocuments =
    useCallback(
      async () => {

        if (!employeeId) {

          setError(
            "Employee ID is missing."
          );

          setLoading(false);

          return;
        }


        setLoading(true);

        setError("");


        try {

          const response =
            await documentService
              .getDocuments({

                employeeId,

                category,

                search,

                page,

                size: 20

              });


          const content =
            Array.isArray(
              response?.content
            )
              ? response.content
              : [];


          setDocuments(
            content.map(
              normalizeDocument
            )
          );


          setTotalElements(
            Number(
              response?.totalElements ||
              content.length
            )
          );


          setTotalPages(
            Number(
              response?.totalPages ||
              1
            )
          );

        } catch (requestError) {

          console.error(
            "Document loading failed:",
            requestError
          );


          setDocuments([]);

          setTotalElements(0);

          setTotalPages(0);


          setError(
            getDocumentErrorMessage(
              requestError,
              "Unable to load documents."
            )
          );

        } finally {

          setLoading(false);
        }

      },
      [
        employeeId,
        category,
        search,
        page
      ]
    );


  useEffect(() => {

    loadDocuments();

  }, [
    loadDocuments
  ]);


  // ==========================================================
  // STATISTICS
  // ==========================================================

  const statistics =
    useMemo(() => {

      const categories =
        new Set(
          documents.map(
            document =>
              document.category
          )
        );


      const pdfCount =
        documents.filter(
          document =>
            String(
              document.fileType
            ).toLowerCase()
              .includes("pdf")
        ).length;


      return {
        total:
          totalElements,

        categories:
          categories.size,

        pdf:
          pdfCount
      };

    }, [
      documents,
      totalElements
    ]);


  // ==========================================================
  // SEARCH
  // ==========================================================

  const handleSearch = (
    event
  ) => {

    event.preventDefault();

    setPage(0);

    setSearch(
      searchInput.trim()
    );
  };


  // ==========================================================
  // RESET
  // ==========================================================

  const clearFilters = () => {

    setSearchInput("");

    setSearch("");

    setCategory("");

    setPage(0);
  };


  // ==========================================================
  // UPLOAD
  // ==========================================================

  const openUpload = () => {

    setUploadError("");

    setUploadProgress(0);

    setUploadOpen(true);
  };


  const closeUpload = () => {

    if (uploadLoading) {
      return;
    }

    setUploadOpen(false);

    setUploadError("");

    setUploadProgress(0);
  };


  const handleUpload = async ({
    file,
    category: documentCategory,
    documentType,
    description
  }) => {

    setUploadLoading(true);

    setUploadError("");

    setUploadProgress(0);


    try {

      await documentService
        .uploadDocument({

          employeeId,

          file,

          category:
            documentCategory,

          documentType,

          description,

          onUploadProgress:
            event => {

              if (
                event.total
              ) {

                const percent =
                  Math.round(
                    (
                      event.loaded /
                      event.total
                    ) * 100
                  );


                setUploadProgress(
                  percent
                );

              }

            }

        });


      setUploadOpen(false);


      setToast({
        open: true,
        message:
          "Document uploaded successfully.",
        severity:
          "success"
      });


      await loadDocuments();

    } catch (requestError) {

      console.error(
        "Document upload failed:",
        requestError
      );


      setUploadError(
        getDocumentErrorMessage(
          requestError,
          "Unable to upload document."
        )
      );

    } finally {

      setUploadLoading(false);
    }
  };


  // ==========================================================
  // DOWNLOAD
  // ==========================================================

  const handleDownload = async (
    document
  ) => {

    if (!document?.id) {
      return;
    }


    try {

      const response =
        await documentService
          .downloadDocument(
            document.id
          );


      const blob =
        new Blob([
          response.data
        ]);


      const url =
        window.URL.createObjectURL(
          blob
        );


      const link =
        window.document
          .createElement("a");


      link.href = url;

      link.download =
        document.originalFileName ||
        document.fileName ||
        "document";


      window.document
        .body
        .appendChild(link);


      link.click();

      link.remove();


      window.URL.revokeObjectURL(
        url
      );


    } catch (requestError) {

      setToast({
        open: true,
        message:
          getDocumentErrorMessage(
            requestError,
            "Unable to download document."
          ),
        severity:
          "error"
      });

    }
  };


  // ==========================================================
  // DELETE
  // ==========================================================

  const openDelete = (
    document
  ) => {

    setSelectedDocument(
      document
    );

    setDeleteError("");

    setDeleteOpen(true);
  };


  const closeDelete = () => {

    if (deleteLoading) {
      return;
    }

    setDeleteOpen(false);

    setSelectedDocument(
      null
    );

    setDeleteError("");
  };


  const handleDelete = async () => {

    if (
      !selectedDocument?.id
    ) {
      return;
    }


    setDeleteLoading(true);

    setDeleteError("");


    try {

      await documentService
        .deleteDocument(
          selectedDocument.id
        );


      setDeleteOpen(false);

      setSelectedDocument(
        null
      );


      setToast({
        open: true,
        message:
          "Document deleted successfully.",
        severity:
          "success"
      });


      await loadDocuments();

    } catch (requestError) {

      setDeleteError(
        getDocumentErrorMessage(
          requestError,
          "Unable to delete document."
        )
      );

    } finally {

      setDeleteLoading(false);
    }
  };


  // ==========================================================
  // PAGE
  // ==========================================================

  const handlePageChange = (
    event,
    value
  ) => {

    setPage(
      value - 1
    );


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


  return (
    <Box
      sx={{
        pb: 5
      }}
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <Stack
        direction={{
          xs: "column",
          md: "row"
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          md: "center"
        }}
        spacing={2}
        sx={{
          mb: 3
        }}
      >

        <Box>

          <Typography
            variant="h4"
            fontWeight={900}
            sx={{
              letterSpacing: "-.04em"
            }}
          >
            Employee Documents
          </Typography>


          <Typography
            color="text.secondary"
            sx={{
              mt: .5
            }}
          >
            Securely manage employee
            documents and records.
          </Typography>

        </Box>


        <PermissionButton
          permission="DOCUMENT_UPLOAD"
          variant="contained"
          startIcon={
            <CloudUploadOutlinedIcon />
          }
          onClick={
            openUpload
          }
          sx={{
            borderRadius: 2,
            px: 2.5,
            py: 1.2,
            fontWeight: 850
          }}
        >
          Upload Document
        </PermissionButton>

      </Stack>


      {/* ERROR */}

      {error && (

        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 3
          }}
          action={

            <Button
              size="small"
              onClick={
                loadDocuments
              }
            >
              Retry
            </Button>

          }
        >
          {error}
        </Alert>

      )}


      {/* =====================================================
          STATS
      ===================================================== */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)"
          },
          gap: 2,
          mb: 2
        }}
      >

        <DocumentStatCard
          title="Total Documents"
          value={
            statistics.total
          }
          subtitle="Stored for this employee"
          icon={
            DescriptionOutlinedIcon
          }
        />


        <DocumentStatCard
          title="Categories"
          value={
            statistics.categories
          }
          subtitle="Document categories"
          icon={
            FolderOutlinedIcon
          }
        />


        <DocumentStatCard
          title="PDF Documents"
          value={
            statistics.pdf
          }
          subtitle="PDF files in current page"
          icon={
            PictureAsPdfOutlinedIcon
          }
        />


        <DocumentStatCard
          title="Secure Records"
          value="Active"
          subtitle="Permission controlled"
          icon={
            DescriptionOutlinedIcon
          }
        />

      </Box>


      {/* =====================================================
          FILTERS
      ===================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3
        }}
      >

        <Stack
          direction={{
            xs: "column",
            md: "row"
          }}
          spacing={1.5}
        >

          <Box
            component="form"
            onSubmit={
              handleSearch
            }
            sx={{
              flex: 1
            }}
          >

            <TextField
              fullWidth
              size="small"
              placeholder="Search documents..."
              value={
                searchInput
              }
              onChange={event =>
                setSearchInput(
                  event.target.value
                )
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment
                      position="start"
                    >
                      <SearchOutlinedIcon
                        fontSize="small"
                      />
                    </InputAdornment>
                  )
                }
              }}
            />

          </Box>


          <Select
            size="small"
            value={
              category
            }
            displayEmpty
            onChange={event => {

              setCategory(
                event.target.value
              );

              setPage(0);

            }}
            sx={{
              minWidth: 210
            }}
          >

            <MenuItem value="">
              All Categories
            </MenuItem>


            {DOCUMENT_CATEGORIES.map(
              item => (

                <MenuItem
                  key={
                    item.value
                  }
                  value={
                    item.value
                  }
                >
                  {
                    item.label
                  }
                </MenuItem>

              )
            )}

          </Select>


          {(search ||
            category) && (

            <Button
              size="small"
              onClick={
                clearFilters
              }
              sx={{
                fontWeight: 800
              }}
            >
              Clear
            </Button>

          )}


          <IconButton
            onClick={
              loadDocuments
            }
            disabled={
              loading
            }
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2
            }}
          >

            <RefreshOutlinedIcon />

          </IconButton>

        </Stack>

      </Paper>


      {/* =====================================================
          RESULT
      ===================================================== */}

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: 1.5
        }}
      >
        {loading
          ? "Loading documents..."
          : `${totalElements} document${
              totalElements === 1
                ? ""
                : "s"
            } found`}
      </Typography>


      {/* =====================================================
          TABLE
      ===================================================== */}

      <Box
        sx={{
          position: "relative"
        }}
      >

        {loading && (

          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              pt: 8,
              bgcolor:
                "rgba(255,255,255,.55)",
              backdropFilter:
                "blur(2px)"
            }}
          >

            <CircularProgress />

          </Box>

        )}


        <DocumentTable
          documents={
            documents
          }
          onDownload={
            handleDownload
          }
          onDelete={
            openDelete
          }
          canDownload={
            can(
              "DOCUMENT_DOWNLOAD"
            )
          }
          canDelete={
            can(
              "DOCUMENT_DELETE"
            )
          }
        />

      </Box>


      {/* =====================================================
          PAGINATION
      ===================================================== */}

      {totalPages > 1 && (

        <Stack
          alignItems="center"
          sx={{
            mt: 3
          }}
        >

          <Pagination
            count={
              totalPages
            }
            page={
              page + 1
            }
            onChange={
              handlePageChange
            }
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />

        </Stack>

      )}


      {/* =====================================================
          UPLOAD DIALOG
      ===================================================== */}

      <Box>

        <DocumentUploadDialog
          open={
            uploadOpen
          }
          employeeId={
            employeeId
          }
          loading={
            uploadLoading
          }
          progress={
            uploadProgress
          }
          error={
            uploadError
          }
          onClose={
            closeUpload
          }
          onSubmit={
            handleUpload
          }
        />

      </Box>


      {/* =====================================================
          DELETE DIALOG
      ===================================================== */}

     <DocumentDeleteDialog
        open={
          deleteOpen
        }
        document={
          selectedDocument
        }
        loading={
          deleteLoading
        }
        error={
          deleteError
        }
        onClose={
          closeDelete
        }
        onConfirm={
          handleDelete
        }
      />


      {/* =====================================================
          TOAST
      ===================================================== */}

      <Snackbar
        open={
          toast.open
        }
        autoHideDuration={
          3500
        }
        onClose={() =>
          setToast(
            previous => ({
              ...previous,
              open: false
            })
          )
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
      >

        <Alert
          severity={
            toast.severity
          }
          variant="filled"
          onClose={() =>
            setToast(
              previous => ({
                ...previous,
                open: false
              })
            )
          }
          sx={{
            width: "100%"
          }}
        >
          {
            toast.message
          }
        </Alert>

      </Snackbar>

    </Box>
  );
};


export default DocumentManagement;