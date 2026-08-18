import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography
} from "@mui/material";


import CloseOutlinedIcon
  from "@mui/icons-material/CloseOutlined";


import {
  useEffect,
  useState
} from "react";


import {
  isImageFile,
  getFileExtension
} from "../../utils/documentUtils";


import documentService
  from "../../services/documentService";


const DocumentPreviewDialog = ({
  open,
  document,
  onClose
}) => {

  const [
    loading,
    setLoading
  ] = useState(false);


  const [
    previewUrl,
    setPreviewUrl
  ] = useState("");


  const [
    error,
    setError
  ] = useState("");


  useEffect(() => {

    let objectUrl = null;


    const load =
      async () => {

        if (
          !open ||
          !document?.id
        ) {
          return;
        }


        setLoading(true);
        setError("");
        setPreviewUrl("");


        try {

          const blob =
            await documentService
              .previewDocument(
                document.id
              );


          objectUrl =
            window.URL.createObjectURL(
              blob
            );


          setPreviewUrl(
            objectUrl
          );

        } catch (requestError) {

          setError(
            requestError?.response?.data?.message ||
            "Unable to preview this document."
          );

        } finally {

          setLoading(false);

        }

      };


    load();


    return () => {

      if (objectUrl) {

        window.URL.revokeObjectURL(
          objectUrl
        );

      }

    };

  }, [
    open,
    document?.id
  ]);


  const fileName =
    document?.fileName ||
    document?.name ||
    "Document";


  const extension =
    getFileExtension(
      fileName
    );


  const image =
    isImageFile({
      fileName,
      contentType:
        document?.contentType
    });


  return (
    <Dialog
      open={
        open
      }
      onClose={
        onClose
      }
      maxWidth="lg"
      fullWidth
    >

      <DialogTitle
        sx={{
          pr: 7
        }}
      >

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >

          <Typography
            fontWeight={900}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {fileName}
          </Typography>


          <IconButton
            onClick={
              onClose
            }
            sx={{
              position: "absolute",
              right: 12,
              top: 12
            }}
          >

            <CloseOutlinedIcon />

          </IconButton>

        </Stack>

      </DialogTitle>


      <DialogContent
        sx={{
          minHeight: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2
        }}
      >

        {loading && (

          <CircularProgress />

        )}


        {!loading && error && (

          <Typography
            color="error"
            textAlign="center"
          >
            {error}
          </Typography>

        )}


        {!loading &&
          !error &&
          previewUrl &&
          image && (

            <Box
              component="img"
              src={
                previewUrl
              }
              alt={
                fileName
              }
              sx={{
                maxWidth: "100%",
                maxHeight: "75vh",
                objectFit: "contain"
              }}
            />

          )}


        {!loading &&
          !error &&
          previewUrl &&
          extension === ".pdf" && (

            <Box
              component="iframe"
              src={
                previewUrl
              }
              title={
                fileName
              }
              sx={{
                width: "100%",
                height: "70vh",
                border: 0,
                borderRadius: 1
              }}
            />

          )}


        {!loading &&
          !error &&
          previewUrl &&
          !image &&
          extension !== ".pdf" && (

            <Typography
              color="text.secondary"
              textAlign="center"
            >
              Preview is not available for this
              file type. Please download the document.
            </Typography>

          )}

      </DialogContent>

    </Dialog>
  );
};


export default DocumentPreviewDialog;