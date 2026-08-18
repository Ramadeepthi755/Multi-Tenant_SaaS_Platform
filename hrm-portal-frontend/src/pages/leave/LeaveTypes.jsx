import {
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

import leaveService from "../../services/leaveService";

function LeaveTypes() {
  const [leaveTypes, setLeaveTypes] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadLeaveTypes =
    async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await leaveService.getLeaveTypes();

        if (Array.isArray(data)) {
          setLeaveTypes(data);
        } else if (
          Array.isArray(
            data?.content
          )
        ) {
          setLeaveTypes(
            data.content
          );
        } else if (
          Array.isArray(
            data?.data
          )
        ) {
          setLeaveTypes(
            data.data
          );
        } else {
          setLeaveTypes([]);
        }
      } catch (err) {
        console.error(
          "Failed to load leave types:",
          err
        );

        setError(
          err?.response?.data
            ?.message ||
            "Failed to load leave types."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadLeaveTypes();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 400,
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: {
          xs: 2,
          md: 3,
        },
      }}
    >
      <Typography
        variant="h4"
        fontWeight={800}
      >
        Leave Types
      </Typography>

      <Typography
        color="text.secondary"
        mb={3}
      >
        Available leave categories in the organization.
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {leaveTypes.length ===
      0 ? (
        <Card
          sx={{
            borderRadius: 3,
            boxShadow:
              "none",
            border: "1px solid",
            borderColor:
              "divider",
          }}
        >
          <CardContent
            sx={{
              py: 6,
              textAlign:
                "center",
            }}
          >
            <Typography
              fontWeight={700}
            >
              No leave types found
            </Typography>

            <Typography
              color="text.secondary"
              mt={1}
            >
              No leave types are currently available.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid
          container
          spacing={3}
        >
          {leaveTypes.map(
            (
              type,
              index
            ) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={
                  type.leaveTypeId ??
                  type.id ??
                  index
                }
              >
                <Card
                  sx={{
                    height:
                      "100%",
                    borderRadius: 3,
                    border:
                      "1px solid",
                    borderColor:
                      "divider",
                    boxShadow:
                      "none",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      fontWeight={800}
                    >
                      {type.leaveTypeName ||
                        type.name ||
                        type.typeName ||
                        "Leave"}
                    </Typography>

                    <Divider
                      sx={{
                        my: 2,
                      }}
                    />

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {type.description ||
                        "No description available."}
                    </Typography>

                    <Box mt={2}>
                      <Chip
                        size="small"
                        label={
                          type.active ===
                            false ||
                          type.status ===
                            "INACTIVE"
                            ? "INACTIVE"
                            : "ACTIVE"
                        }
                        color={
                          type.active ===
                            false ||
                          type.status ===
                            "INACTIVE"
                            ? "default"
                            : "success"
                        }
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )
          )}
        </Grid>
      )}
    </Box>
  );
}

export default LeaveTypes;