import {
  useMemo,
  useState
} from "react";


import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";


import SearchOutlinedIcon
  from "@mui/icons-material/SearchOutlined";

import UploadFileOutlinedIcon
  from "@mui/icons-material/UploadFileOutlined";

import DescriptionOutlinedIcon
  from "@mui/icons-material/DescriptionOutlined";

import PictureAsPdfOutlinedIcon
  from "@mui/icons-material/PictureAsPdfOutlined";

import ArticleOutlinedIcon
  from "@mui/icons-material/ArticleOutlined";

import TableChartOutlinedIcon
  from "@mui/icons-material/TableChartOutlined";

import DownloadOutlinedIcon
  from "@mui/icons-material/DownloadOutlined";

import DeleteOutlineOutlinedIcon
  from "@mui/icons-material/DeleteOutlineOutlined";

import VisibilityOutlinedIcon
  from "@mui/icons-material/VisibilityOutlined";

import FolderOutlinedIcon
  from "@mui/icons-material/FolderOutlined";


/*
=========================================================
SAMPLE DOCUMENT DATA
=========================================================

This is UI fallback data.

When your document API is connected,
replace this section with documentService calls.
=========================================================
*/

const initialDocuments = [
  {
    id: 1,
    name: "Employee Resume.pdf",
    category: "Resume",
    employee: "Employee",
    type: "PDF",
    size: "1.8 MB",
    uploadedAt: "Aug 09, 2026",
    status: "ACTIVE"
  },
  {
    id: 2,
    name: "Employment Agreement.pdf",
    category: "Employment",
    employee: "Employee",
    type: "PDF",
    size: "2.4 MB",
    uploadedAt: "Aug 08, 2026",
    status: "ACTIVE"
  },
  {
    id: 3,
    name: "Salary Statement.pdf",
    category: "Payroll",
    employee: "Employee",
    type: "PDF",
    size: "840 KB",
    uploadedAt: "Aug 07, 2026",
    status: "ACTIVE"
  },
  {
    id: 4,
    name: "Company Policy.docx",
    category: "Policy",
    employee: "Company",
    type: "DOCX",
    size: "560 KB",
    uploadedAt: "Aug 05, 2026",
    status: "ACTIVE"
  }
];


/*
=========================================================
DOCUMENT TYPE ICON
=========================================================
*/

const DocumentTypeIcon = ({
  type
}) => {

  if (
    type === "PDF"
  ) {

    return (
      <PictureAsPdfOutlinedIcon
        color="error"
      />
    );

  }


  if (
    type === "DOCX"
  ) {

    return (
      <ArticleOutlinedIcon
        color="primary"
      />
    );

  }


  if (
    type === "XLSX"
  ) {

    return (
      <TableChartOutlinedIcon
        color="success"
      />
    );

  }


  return (
    <DescriptionOutlinedIcon />
  );

};


/*
=========================================================
PAGE
=========================================================
*/

const Document = () => {

  const [
    documents,
    setDocuments
  ] = useState(
    initialDocuments
  );


  const [
    search,
    setSearch
  ] = useState("");


  const [
    category,
    setCategory
  ] = useState("ALL");


  const [
    message,
    setMessage
  ] = useState("");


  /*
  =======================================================
  FILTER
  =======================================================
  */

  const filteredDocuments =
    useMemo(() => {

      const searchValue =
        search
          .trim()
          .toLowerCase();


      return documents.filter(
        document => {

          const matchesSearch =
            !searchValue ||
            document.name
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            document.category
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            document.employee
              .toLowerCase()
              .includes(
                searchValue
              );


          const matchesCategory =
            category === "ALL" ||
            document.category ===
              category;


          return (
            matchesSearch &&
            matchesCategory
          );

        }
      );

    }, [
      documents,
      search,
      category
    ]);


  /*
  =======================================================
  UPLOAD
  =======================================================
  */

  const handleUpload =
    event => {

      const file =
        event.target.files?.[0];


      if (!file) {
        return;
      }


      const extension =
        file.name
          .split(".")
          .pop()
          ?.toUpperCase() ||
        "FILE";


      const newDocument = {

        id:
          Date.now(),

        name:
          file.name,

        category:
          "Other",

        employee:
          "Current User",

        type:
          extension,

        size:
          `${(
            file.size /
            1024 /
            1024
          ).toFixed(2)} MB`,

        uploadedAt:
          new Date()
            .toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "2-digit",
                year: "numeric"
              }
            ),

        status:
          "ACTIVE"

      };


      setDocuments(
        previous => [
          newDocument,
          ...previous
        ]
      );


      setMessage(
        `${file.name} added successfully.`
      );


      event.target.value =
        "";

    };


  /*
  =======================================================
  DELETE
  =======================================================
  */

  const handleDelete =
    id => {

      setDocuments(
        previous =>
          previous.filter(
            document =>
              document.id !== id
          )
      );


      setMessage(
        "Document removed successfully."
      );

    };


  /*
  =======================================================
  STATS
  =======================================================
  */

  const totalDocuments =
    documents.length;


  const pdfDocuments =
    documents.filter(
      document =>
        document.type === "PDF"
    ).length;


  const activeDocuments =
    documents.filter(
      document =>
        document.status === "ACTIVE"
    ).length;


  const categories =
    [
      "ALL",
      ...new Set(
        documents.map(
          document =>
            document.category
        )
      )
    ];


  return (

    <Box
      sx={{
        width: "100%"
      }}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <Box
        sx={{
          mb: 3
        }}
      >

        <Stack
          direction={{
            xs: "column",
            sm: "row"
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            sm: "center"
          }}
          spacing={2}
        >

          <Box>

            <Typography
              variant="h4"
              fontWeight={900}
              sx={{
                letterSpacing:
                  "-0.5px"
              }}
            >
              Documents
            </Typography>


            <Typography
              color="text.secondary"
              sx={{
                mt: 0.5
              }}
            >
              Securely manage employee,
              company and HR documents.
            </Typography>

          </Box>


          <Button
            component="label"
            variant="contained"
            startIcon={
              <UploadFileOutlinedIcon />
            }
            sx={{
              borderRadius: 2,
              fontWeight: 800,
              px: 2.5
            }}
          >

            Upload Document

            <input
              hidden
              type="file"
              onChange={
                handleUpload
              }
            />

          </Button>

        </Stack>

      </Box>


      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {message && (

        <Alert
          severity="success"
          onClose={() =>
            setMessage("")
          }
          sx={{
            mb: 2,
            borderRadius: 2
          }}
        >
          {message}
        </Alert>

      )}


      {/* =================================================
          STATISTICS
      ================================================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)"
          },
          gap: 2,
          mb: 3
        }}
      >

        <StatCard
          title="Total Documents"
          value={totalDocuments}
          icon={
            <FolderOutlinedIcon />
          }
        />


        <StatCard
          title="PDF Documents"
          value={pdfDocuments}
          icon={
            <PictureAsPdfOutlinedIcon />
          }
        />


        <StatCard
          title="Active Documents"
          value={activeDocuments}
          icon={
            <DescriptionOutlinedIcon />
          }
        />


        <StatCard
          title="Storage Status"
          value="Healthy"
          icon={
            <UploadFileOutlinedIcon />
          }
          status
        />

      </Box>


      {/* =================================================
          DOCUMENT CARD
      ================================================= */}

      <Card
        elevation={0}
        sx={{
          border:
            "1px solid",
          borderColor:
            "divider",
          borderRadius: 3
        }}
      >

        <CardContent
          sx={{
            p: 0
          }}
        >

          {/* FILTER BAR */}

          <Box
            sx={{
              p: 2.5
            }}
          >

            <Stack
              direction={{
                xs: "column",
                md: "row"
              }}
              spacing={2}
            >

              <TextField
                fullWidth
                size="small"
                placeholder="Search documents..."
                value={search}
                onChange={event =>
                  setSearch(
                    event.target.value
                  )
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                    >
                      <SearchOutlinedIcon
                        fontSize="small"
                      />
                    </InputAdornment>
                  )
                }}
              />


              <Select
                size="small"
                value={category}
                onChange={event =>
                  setCategory(
                    event.target.value
                  )
                }
                sx={{
                  minWidth: {
                    xs: "100%",
                    md: 180
                  }
                }}
              >

                {categories.map(
                  item => (

                    <MenuItem
                      key={item}
                      value={item}
                    >
                      {item === "ALL"
                        ? "All Categories"
                        : item}
                    </MenuItem>

                  )
                )}

              </Select>

            </Stack>

          </Box>


          <Divider />


          {/* =================================================
              DOCUMENT LIST
          ================================================= */}

          {filteredDocuments.length ===
            0 ? (

            <Box
              sx={{
                py: 10,
                px: 3,
                textAlign: "center"
              }}
            >

              <FolderOutlinedIcon
                sx={{
                  fontSize: 64,
                  color:
                    "text.disabled",
                  mb: 2
                }}
              />


              <Typography
                variant="h6"
                fontWeight={800}
              >
                No documents found
              </Typography>


              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.5
                }}
              >
                Try changing your
                search or category filter.
              </Typography>

            </Box>

          ) : (

            <Box>

              {filteredDocuments.map(
                (document, index) => (

                  <Box
                    key={
                      document.id
                    }
                    sx={{
                      px: 2.5,
                      py: 2,
                      borderBottom:
                        index <
                        filteredDocuments.length -
                          1
                          ? "1px solid"
                          : "none",
                      borderColor:
                        "divider"
                    }}
                  >

                    <Stack
                      direction={{
                        xs: "column",
                        md: "row"
                      }}
                      spacing={2}
                      alignItems={{
                        xs: "flex-start",
                        md: "center"
                      }}
                      justifyContent="space-between"
                    >

                      {/* FILE */}

                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        sx={{
                          minWidth: 0
                        }}
                      >

                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            bgcolor:
                              "action.hover",
                            display: "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            flexShrink: 0
                          }}
                        >

                          <DocumentTypeIcon
                            type={
                              document.type
                            }
                          />

                        </Box>


                        <Box
                          sx={{
                            minWidth: 0
                          }}
                        >

                          <Typography
                            fontWeight={800}
                            noWrap
                            sx={{
                              maxWidth: {
                                xs: 220,
                                md: 360
                              }
                            }}
                          >
                            {document.name}
                          </Typography>


                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {document.employee}
                            {" • "}
                            {document.size}
                            {" • "}
                            {document.uploadedAt}
                          </Typography>

                        </Box>

                      </Stack>


                      {/* CATEGORY */}

                      <Chip
                        label={
                          document.category
                        }
                        size="small"
                        variant="outlined"
                        sx={{
                          fontWeight: 700
                        }}
                      />


                      {/* STATUS */}

                      <Chip
                        label={
                          document.status
                        }
                        size="small"
                        color="success"
                        sx={{
                          fontWeight: 750
                        }}
                      />


                      {/* ACTIONS */}

                      <Stack
                        direction="row"
                        spacing={0.5}
                      >

                        <Tooltip
                          title="View"
                        >

                          <IconButton
                            size="small"
                            onClick={() =>
                              setMessage(
                                `Viewing ${document.name}`
                              )
                            }
                          >

                            <VisibilityOutlinedIcon
                              fontSize="small"
                            />

                          </IconButton>

                        </Tooltip>


                        <Tooltip
                          title="Download"
                        >

                          <IconButton
                            size="small"
                            onClick={() =>
                              setMessage(
                                `Download requested for ${document.name}`
                              )
                            }
                          >

                            <DownloadOutlinedIcon
                              fontSize="small"
                            />

                          </IconButton>

                        </Tooltip>


                        <Tooltip
                          title="Delete"
                        >

                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              handleDelete(
                                document.id
                              )
                            }
                          >

                            <DeleteOutlineOutlinedIcon
                              fontSize="small"
                            />

                          </IconButton>

                        </Tooltip>

                      </Stack>

                    </Stack>

                  </Box>

                )
              )}

            </Box>

          )}

        </CardContent>

      </Card>


      {/* =================================================
          STORAGE INDICATOR
      ================================================= */}

      <Paper
        elevation={0}
        sx={{
          mt: 2,
          p: 2,
          border:
            "1px solid",
          borderColor:
            "divider",
          borderRadius: 3
        }}
      >

        <Stack
          direction="row"
          justifyContent="space-between"
          mb={1}
        >

          <Typography
            variant="body2"
            fontWeight={750}
          >
            Document Storage
          </Typography>


          <Typography
            variant="body2"
            color="text.secondary"
          >
            24% used
          </Typography>

        </Stack>


        <LinearProgress
          variant="determinate"
          value={24}
          sx={{
            height: 7,
            borderRadius: 999
          }}
        />

      </Paper>

    </Box>

  );

};


/*
=========================================================
STAT CARD
=========================================================
*/

const StatCard = ({
  title,
  value,
  icon,
  status = false
}) => {

  return (

    <Card
      elevation={0}
      sx={{
        border:
          "1px solid",
        borderColor:
          "divider",
        borderRadius: 3
      }}
    >

      <CardContent>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >

          <Box>

            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={650}
            >
              {title}
            </Typography>


            <Typography
              variant="h5"
              fontWeight={900}
              sx={{
                mt: 0.5
              }}
            >
              {value}
            </Typography>

          </Box>


          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              bgcolor:
                status
                  ? "success.light"
                  : "action.hover",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color:
                status
                  ? "success.main"
                  : "primary.main"
            }}
          >

            {icon}

          </Box>

        </Stack>

      </CardContent>

    </Card>

  );

};


export default Document;