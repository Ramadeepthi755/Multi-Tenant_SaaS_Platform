// src/components/security/AuditLogTable.jsx

import {
  Box,
  Chip,
  IconButton,
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

import VisibilityOutlinedIcon
  from "@mui/icons-material/VisibilityOutlined";

import SecurityOutlinedIcon
  from "@mui/icons-material/SecurityOutlined";


/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const safeValue = (
  value,
  fallback = "—"
) => {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  return String(value);

};


const formatDateTime = (
  value
) => {

  if (!value) {
    return "—";
  }


  try {

    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return String(value);

    }


    return date.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }
    );

  } catch {

    return String(value);

  }

};


const getStatusColor = (
  status
) => {

  const normalized =
    String(
      status || ""
    ).toUpperCase();


  if (
    normalized === "SUCCESS" ||
    normalized === "SUCCESSFUL" ||
    normalized === "COMPLETED"
  ) {

    return "success";

  }


  if (
    normalized === "FAILED" ||
    normalized === "FAILURE" ||
    normalized === "ERROR"
  ) {

    return "error";

  }


  if (
    normalized === "WARNING" ||
    normalized === "WARN"
  ) {

    return "warning";

  }


  return "default";

};


/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

const AuditLogTable = ({
  logs = [],
  onView
}) => {

  return (

    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden"
      }}
    >

      <Table
        sx={{
          minWidth: 950
        }}
      >

        {/* =====================================================
            HEADER
        ===================================================== */}

        <TableHead>

          <TableRow
            sx={{
              bgcolor:
                "action.hover"
            }}
          >

            <TableCell
              sx={{
                fontWeight: 900
              }}
            >
              Date & Time
            </TableCell>


            <TableCell
              sx={{
                fontWeight: 900
              }}
            >
              User
            </TableCell>


            <TableCell
              sx={{
                fontWeight: 900
              }}
            >
              Module
            </TableCell>


            <TableCell
              sx={{
                fontWeight: 900
              }}
            >
              Action
            </TableCell>


            <TableCell
              sx={{
                fontWeight: 900
              }}
            >
              Description
            </TableCell>


            <TableCell
              sx={{
                fontWeight: 900
              }}
            >
              Status
            </TableCell>


            <TableCell
              align="center"
              sx={{
                fontWeight: 900
              }}
            >
              Action
            </TableCell>

          </TableRow>

        </TableHead>


        {/* =====================================================
            BODY
        ===================================================== */}

        <TableBody>

          {logs.map(
            (
              log,
              index
            ) => {

              const logId =
                log.id ??
                log.auditLogId ??
                log.logId ??
                index;


              const userName =
                log.userName ??
                log.fullName ??
                log.username ??
                log.email ??
                "Unknown User";


              const module =
                log.module ??
                log.moduleName ??
                "—";


              const action =
                log.action ??
                log.actionName ??
                "—";


              const description =
                log.description ??
                log.message ??
                log.details ??
                "—";


              const status =
                log.status ??
                "—";


              const createdAt =
                log.createdAt ??
                log.timestamp ??
                log.createdDate ??
                log.date;


              return (

                <TableRow
                  key={logId}
                  hover
                >

                  {/* =================================================
                      DATE
                  ================================================= */}

                  <TableCell>

                    <Typography
                      variant="body2"
                      fontWeight={700}
                      sx={{
                        whiteSpace:
                          "nowrap"
                      }}
                    >
                      {
                        formatDateTime(
                          createdAt
                        )
                      }
                    </Typography>

                  </TableCell>


                  {/* =================================================
                      USER
                  ================================================= */}

                  <TableCell>

                    <Stack
                      direction="row"
                      spacing={1.25}
                      alignItems="center"
                    >

                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor:
                            "primary.main",
                          color:
                            "primary.contrastText",
                          flexShrink: 0
                        }}
                      >

                        <SecurityOutlinedIcon
                          sx={{
                            fontSize: 18
                          }}
                        />

                      </Box>


                      <Box
                        sx={{
                          minWidth: 0
                        }}
                      >

                        <Typography
                          variant="body2"
                          fontWeight={800}
                          noWrap
                        >
                          {
                            safeValue(
                              userName,
                              "Unknown User"
                            )
                          }
                        </Typography>


                        {log.email && (

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                          >
                            {
                              log.email
                            }
                          </Typography>

                        )}

                      </Box>

                    </Stack>

                  </TableCell>


                  {/* =================================================
                      MODULE
                  ================================================= */}

                  <TableCell>

                    <Chip
                      size="small"
                      label={
                        safeValue(
                          module
                        )
                      }
                      sx={{
                        fontWeight: 800
                      }}
                    />

                  </TableCell>


                  {/* =================================================
                      ACTION
                  ================================================= */}

                  <TableCell>

                    <Typography
                      variant="body2"
                      fontWeight={800}
                    >
                      {
                        safeValue(
                          action
                        )
                      }
                    </Typography>

                  </TableCell>


                  {/* =================================================
                      DESCRIPTION
                  ================================================= */}

                  <TableCell
                    sx={{
                      maxWidth: 320
                    }}
                  >

                    <Tooltip
                      title={
                        safeValue(
                          description
                        )
                      }
                    >

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow:
                            "hidden",
                          textOverflow:
                            "ellipsis",
                          whiteSpace:
                            "nowrap"
                        }}
                      >
                        {
                          safeValue(
                            description
                          )
                        }
                      </Typography>

                    </Tooltip>

                  </TableCell>


                  {/* =================================================
                      STATUS
                  ================================================= */}

                  <TableCell>

                    <Chip
                      size="small"
                      label={
                        safeValue(
                          status
                        )
                      }
                      color={
                        getStatusColor(
                          status
                        )
                      }
                      variant="outlined"
                      sx={{
                        fontWeight: 800
                      }}
                    />

                  </TableCell>


                  {/* =================================================
                      VIEW
                  ================================================= */}

                  <TableCell
                    align="center"
                  >

                    <Tooltip
                      title="View audit details"
                    >

                      <IconButton
                        size="small"
                        onClick={() => {

                          if (
                            onView
                          ) {

                            onView(
                              log
                            );

                          }

                        }}
                      >

                        <VisibilityOutlinedIcon
                          fontSize="small"
                        />

                      </IconButton>

                    </Tooltip>

                  </TableCell>

                </TableRow>

              );

            }
          )}

        </TableBody>

      </Table>

    </TableContainer>

  );

};


/*
|--------------------------------------------------------------------------
| DEFAULT EXPORT
|--------------------------------------------------------------------------
*/

export default AuditLogTable;