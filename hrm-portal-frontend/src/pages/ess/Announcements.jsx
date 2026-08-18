import { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  Campaign,
  Search,
} from "@mui/icons-material";

import { getAnnouncements } from "../../services/essService";

const priorityColors = {
  HIGH: "error",
  MEDIUM: "warning",
  LOW: "success",
};

const ITEMS_PER_PAGE = 6;

const Announcements = () => {

  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");

  const [page, setPage] = useState(1);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  useEffect(() => {

    const filtered = announcements.filter((announcement) =>
      announcement.title
        ?.toLowerCase()
        .includes(keyword.toLowerCase()) ||
      announcement.message
        ?.toLowerCase()
        .includes(keyword.toLowerCase())
    );

    setFilteredAnnouncements(filtered);
    setPage(1);

  }, [keyword, announcements]);

  const loadAnnouncements = async () => {

    try {

      setLoading(true);

      const response = await getAnnouncements();

      setAnnouncements(response || []);

      setFilteredAnnouncements(response || []);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  const totalPages = Math.ceil(
    filteredAnnouncements.length / ITEMS_PER_PAGE
  );

  const paginatedData =
    filteredAnnouncements.slice(
      (page - 1) * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE
    );

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
        Company Announcements
      </Typography>

      <TextField
        fullWidth
        placeholder="Search announcements..."
        value={keyword}
        onChange={(e) =>
          setKeyword(e.target.value)
        }
        InputProps={{
          startAdornment: (
            <Search
              sx={{
                mr: 1,
                color: "text.secondary",
              }}
            />
          ),
        }}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={3}>

        {paginatedData.map((announcement) => (

          <Grid
            item
            xs={12}
            md={6}
            lg={4}
            key={announcement.id}
          >

            <Card
              sx={{
                height: "100%",
              }}
            >

              <CardContent>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >

                  <Campaign
                    color="primary"
                  />

                  <Chip
                    label={
                      announcement.priority ||
                      "LOW"
                    }
                    color={
                      priorityColors[
                        announcement.priority
                      ] || "default"
                    }
                    size="small"
                  />

                </Stack>

                <Typography
                  variant="h6"
                  gutterBottom
                >
                  {announcement.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    minHeight: 90,
                  }}
                >
                  {announcement.message}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mt={2}
                >
                  Published :
                  {" "}
                  {announcement.publishDate}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  By :
                  {" "}
                  {announcement.createdBy}
                </Typography>

              </CardContent>

            </Card>

          </Grid>

        ))}

        {paginatedData.length === 0 && (

          <Grid item xs={12}>

            <Typography
              align="center"
              color="text.secondary"
            >
              No announcements found.
            </Typography>

          </Grid>

        )}

      </Grid>

      {totalPages > 1 && (

        <Box
          display="flex"
          justifyContent="center"
          mt={4}
        >

          <Pagination
            page={page}
            count={totalPages}
            color="primary"
            onChange={(event, value) =>
              setPage(value)
            }
          />

        </Box>

      )}

    </Box>

  );

};

export default Announcements;