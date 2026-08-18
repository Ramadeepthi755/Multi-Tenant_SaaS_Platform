import {
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from "@mui/material";


import MoreVertOutlinedIcon
  from "@mui/icons-material/MoreVertOutlined";

import DownloadOutlinedIcon
  from "@mui/icons-material/DownloadOutlined";

import DeleteOutlineOutlinedIcon
  from "@mui/icons-material/DeleteOutlineOutlined";


import {
  useState
} from "react";


import {
  formatDocumentDate,
  formatFileSize,
  getCategoryLabel,
  getDocumentTypeLabel,
  getFileExtension
} from "../../utils/documentUtils";


const DocumentTable = ({
  documents = [],
  onDownload,
  onDelete,
  canDownload = false,
  canDelete = false
}) => {

  const [
    anchorEl,
    setAnchorEl
  ] = useState(null);


  const [
    selectedDocument,
    setSelectedDocument
  ] = useState(null);


  const openMenu = (
    event,
    document
  ) => {

    setAnchorEl(
      event.currentTarget
    );

    setSelectedDocument(
      document
    );
  };


  const closeMenu = () => {

    setAnchorEl(null);

    setSelectedDocument(null);
  };


  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "auto"
      }}
    >

      <Table
        sx={{
          minWidth: 900
        }}
      >

        <TableHead>

          <TableRow
            sx={{
              bgcolor:
                "action.hover"
            }}
          >

            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                DOCUMENT
              </Typography>
            </TableCell>


            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                CATEGORY
              </Typography>
            </TableCell>


            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                TYPE
              </Typography>
            </TableCell>


            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                SIZE
              </Typography>
            </TableCell>


            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                UPLOADED
              </Typography>
            </TableCell>


            <TableCell>
              <Typography
                variant="caption"
                fontWeight={900}
              >
                UPLOADED BY
              </Typography>
            </TableCell>


            <TableCell align="right">
              <Typography
                variant="caption"
                fontWeight={900}
              >
                ACTIONS
              </Typography>
            </TableCell>

          </TableRow>

        </TableHead>


        <TableBody>

          {documents.map(
            document => (

              <TableRow
                key={
                  document.id
                }
                hover
              >

                <TableCell>

                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                  >

                    <Chip
                      size="small"
                      label={
                        getFileExtension(
                          document.originalFileName
                        ) || "FILE"
                      }
                      color="primary"
                      variant="outlined"
                      sx={{
                        fontWeight: 850
                      }}
                    />


                    <Typography
                      variant="body2"
                      fontWeight={800}
                      sx={{
                        maxWidth: 280,
                        overflow: "hidden",
                        textOverflow:
                          "ellipsis",
                        whiteSpace:
                          "nowrap"
                      }}
                    >
                      {
                        document.originalFileName ||
                        document.fileName ||
                        "Untitled document"
                      }
                    </Typography>

                  </Stack>

                </TableCell>


                <TableCell>

                  <Typography
                    variant="body2"
                    fontWeight={700}
                  >
                    {
                      getCategoryLabel(
                        document.category
                      )
                    }
                  </Typography>

                </TableCell>


                <TableCell>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {
                      getDocumentTypeLabel(
                        document.documentType
                      )
                    }
                  </Typography>

                </TableCell>


                <TableCell>

                  <Typography
                    variant="body2"
                  >
                    {
                      formatFileSize(
                        document.fileSize
                      )
                    }
                  </Typography>

                </TableCell>


                <TableCell>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {
                      formatDocumentDate(
                        document.uploadedDate
                      )
                    }
                  </Typography>

                </TableCell>


                <TableCell>

                  <Typography
                    variant="body2"
                    fontWeight={650}
                  >
                    {
                      document.uploadedBy ||
                      "—"
                    }
                  </Typography>

                </TableCell>


                <TableCell align="right">

                  <Tooltip
                    title="More actions"
                  >

                    <IconButton
                      onClick={event =>
                        openMenu(
                          event,
                          document
                        )
                      }
                    >

                      <MoreVertOutlinedIcon />

                    </IconButton>

                  </Tooltip>

                </TableCell>

              </TableRow>

            )
          )}


          {!documents.length && (

            <TableRow>

              <TableCell
                colSpan={7}
              >

                <Stack
                  alignItems="center"
                  sx={{
                    py: 9
                  }}
                >

                  <Typography
                    variant="h6"
                    fontWeight={850}
                  >
                    No documents found
                  </Typography>


                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: .5
                    }}
                  >
                    Upload employee documents
                    to see them here.
                  </Typography>

                </Stack>

              </TableCell>

            </TableRow>

          )}

        </TableBody>

      </Table>


      {/* =====================================================
          ACTION MENU
      ===================================================== */}

      <Menu
        anchorEl={
          anchorEl
        }
        open={
          Boolean(anchorEl)
        }
        onClose={
          closeMenu
        }
      >

        {canDownload && (

          <MenuItem
            onClick={() => {

              onDownload(
                selectedDocument
              );

              closeMenu();

            }}
          >

            <DownloadOutlinedIcon
              fontSize="small"
              sx={{
                mr: 1.5
              }}
            />

            Download

          </MenuItem>

        )}


        {canDelete && (

          <MenuItem
            sx={{
              color:
                "error.main"
            }}
            onClick={() => {

              onDelete(
                selectedDocument
              );

              closeMenu();

            }}
          >

            <DeleteOutlineOutlinedIcon
              fontSize="small"
              sx={{
                mr: 1.5
              }}
            />

            Delete

          </MenuItem>

        )}

      </Menu>

    </TableContainer>
  );
};


export default DocumentTable;