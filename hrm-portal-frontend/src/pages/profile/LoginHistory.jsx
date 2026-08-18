import {
  Alert,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";


import HistoryOutlinedIcon
  from "@mui/icons-material/HistoryOutlined";


import {
  useEffect,
  useState
} from "react";


import profileService
  from "../../services/profileService";


import ProfileSection
  from "../../components/profile/ProfileSection";


const LoginHistory = () => {

  const [
    history,
    setHistory
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState("");


  useEffect(() => {

    const load =
      async () => {

        try {

          const response =
            await profileService
              .getLoginHistory();


          const items =
            Array.isArray(
              response
            )
              ? response
              : response?.content ||
                response?.data ||
                response?.items ||
                [];


          setHistory(
            items
          );

        } catch (requestError) {

          setError(
            requestError?.response?.data?.message ||
            "Unable to load login history."
          );

        } finally {

          setLoading(false);

        }

      };


    load();

  }, []);


  return (
    <Paper
      elevation={0}
      sx={{
        p: {
          xs: 2,
          md: 3
        },
        border:
          "1px solid",
        borderColor:
          "divider",
        borderRadius: 3
      }}
    >

      <ProfileSection

        title="Login History"

        description="Review recent authentication activity on your account."

        icon={
          <HistoryOutlinedIcon />
        }

      >

        {error && (

          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: 2
            }}
          >
            {error}
          </Alert>

        )}


        {loading ? (

          <Typography
            color="text.secondary"
          >
            Loading login history...
          </Typography>

        ) : history.length === 0 ? (

          <Typography
            color="text.secondary"
          >
            No login history available.
          </Typography>

        ) : (

          <TableContainer>

            <Table
              size="small"
            >

              <TableHead>

                <TableRow>

                  <TableCell>
                    Date
                  </TableCell>

                  <TableCell>
                    IP Address
                  </TableCell>

                  <TableCell>
                    Device
                  </TableCell>

                  <TableCell>
                    Status
                  </TableCell>

                </TableRow>

              </TableHead>


              <TableBody>

                {history.map(
                  (item, index) => (

                    <TableRow
                      key={
                        item.id ??
                        item.loginId ??
                        index
                      }
                      hover
                    >

                      <TableCell>
                        {
                          item.loginAt ??
                          item.createdAt ??
                          item.timestamp ??
                          "-"
                        }
                      </TableCell>


                      <TableCell>
                        {
                          item.ipAddress ??
                          item.ip ??
                          "-"
                        }
                      </TableCell>


                      <TableCell>
                        {
                          item.device ??
                          item.userAgent ??
                          "-"
                        }
                      </TableCell>


                      <TableCell>

                        <Chip
                          size="small"
                          label={
                            item.success === false
                              ? "Failed"
                              : "Successful"
                          }
                          color={
                            item.success === false
                              ? "error"
                              : "success"
                          }
                          variant="outlined"
                        />

                      </TableCell>

                    </TableRow>

                  )
                )}

              </TableBody>

            </Table>

          </TableContainer>

        )}

      </ProfileSection>

    </Paper>
  );
};


export default LoginHistory;