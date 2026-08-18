import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  Add,
  Delete,
  Download,
  Search,
} from "@mui/icons-material";

import {
  deleteDocument,
  getMyDocuments,
} from "../../services/essService";

import UploadDocument from "./UploadDocument";

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

const MyDocuments = () => {

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openUpload, setOpenUpload] =
    useState(false);

  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
  });

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {

    try {

      setLoading(true);

      const response =
        await getMyDocuments(filters);

      setDocuments(response || []);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  const handleDelete = async (id) => {

    if (
      !window.confirm(
        "Delete this document?"
      )
    )
      return;

    try {

      await deleteDocument(id);

      loadDocuments();

    } catch (error) {

      console.error(error);

    }

  };

  const filteredDocuments =
    documents.filter((document) => {

      return (
        (filters.keyword === "" ||
          document.fileName
            ?.toLowerCase()
            .includes(
              filters.keyword.toLowerCase()
            )) &&
        (filters.category === "" ||
          document.category ===
            filters.category)
      );

    });

  if (loading) {

    return (

      <Box
        display="flex"
        justifyContent="center"
        mt={5}
      >
        <CircularProgress />
      </Box>

    );

  }

  return (

    <Box>

      <Typography
        variant="h4"
        mb={3}
      >
        My Documents
      </Typography>

      <Card>

        <CardHeader
          title="Document Management"
          action={
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() =>
                setOpenUpload(true)
              }
            >
              Upload Document
            </Button>
          }
        />

        <CardContent>

          <Grid
            container
            spacing={2}
            mb={3}
          >

            <Grid item xs={12} md={5}>

              <TextField
                fullWidth
                label="Search"
                value={
                  filters.keyword
                }
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    keyword:
                      e.target.value,
                  })
                }
              />

            </Grid>

            <Grid item xs={12} md={5}>

              <TextField
                fullWidth
                select
                label="Category"
                value={
                  filters.category
                }
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    category:
                      e.target.value,
                  })
                }
              >

                <MenuItem value="">
                  All
                </MenuItem>

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

            <Grid item xs={12} md={2}>

              <Button
                fullWidth
                variant="contained"
                startIcon={<Search />}
                sx={{
                  height: 56,
                }}
                onClick={
                  loadDocuments
                }
              >
                Search
              </Button>

            </Grid>

          </Grid>

          <TableContainer
            component={Paper}
          >

            <Table>

              <TableHead>

                <TableRow>

                  <TableCell>
                    File Name
                  </TableCell>

                  <TableCell>
                    Category
                  </TableCell>

                  <TableCell>
                    File Type
                  </TableCell>

                  <TableCell>
                    Size
                  </TableCell>

                  <TableCell>
                    Uploaded On
                  </TableCell>

                  <TableCell align="center">
                    Actions
                  </TableCell>

                </TableRow>

              </TableHead>

              <TableBody>

                {filteredDocuments
                  .slice(
                    page * rowsPerPage,
                    page *
                      rowsPerPage +
                      rowsPerPage
                  )
                  .map((document) => (

                    <TableRow
                      key={document.id}
                    >

                      <TableCell>
                        {
                          document.fileName
                        }
                      </TableCell>

                      <TableCell>

                        <Chip
                          label={document.category.replaceAll(
                            "_",
                            " "
                          )}
                          color="primary"
                          size="small"
                        />

                      </TableCell>

                      <TableCell>
                        {
                          document.fileType
                        }
                      </TableCell>

                      <TableCell>
                        {
                          document.fileSize
                        }
                      </TableCell>

                      <TableCell>
                        {
                          document.uploadDate
                        }
                      </TableCell>

                      <TableCell align="center">

                        <IconButton
                          color="primary"
                          component="a"
                          href={
                            document.downloadUrl
                          }
                          target="_blank"
                        >
                          <Download />
                        </IconButton>

                        <IconButton
                          color="error"
                          onClick={() =>
                            handleDelete(
                              document.id
                            )
                          }
                        >
                          <Delete />
                        </IconButton>

                      </TableCell>

                    </TableRow>

                  ))}

                {filteredDocuments.length ===
                  0 && (

                  <TableRow>

                    <TableCell
                      colSpan={6}
                      align="center"
                    >
                      No Documents Found
                    </TableCell>

                  </TableRow>

                )}

              </TableBody>

            </Table>

          </TableContainer>

          <TablePagination
            component="div"
            count={
              filteredDocuments.length
            }
            page={page}
            rowsPerPage={
              rowsPerPage
            }
            onPageChange={(
              event,
              newPage
            ) =>
              setPage(newPage)
            }
            onRowsPerPageChange={(
              event
            ) => {

              setRowsPerPage(
                parseInt(
                  event.target.value,
                  10
                )
              );

              setPage(0);

            }}
          />

        </CardContent>

      </Card>

      <UploadDocument
        open={openUpload}
        onClose={() =>
          setOpenUpload(false)
        }
        reload={loadDocuments}
      />

    </Box>

  );

};

export default MyDocuments;