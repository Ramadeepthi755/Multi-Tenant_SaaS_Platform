import {
  Component
} from "react";


import {
  Box,
  Button,
  Paper,
  Stack,
  Typography
} from "@mui/material";


import ErrorOutlineOutlinedIcon
  from "@mui/icons-material/ErrorOutlineOutlined";


class AppErrorBoundary
  extends Component {

  constructor(props) {

    super(props);

    this.state = {
      hasError: false,
      error: null
    };

  }


  static getDerivedStateFromError(
    error
  ) {

    return {
      hasError: true,
      error
    };

  }


  componentDidCatch(
    error,
    errorInfo
  ) {

    console.error(
      "HRM Portal UI Error:",
      error
    );

    console.error(
      "Component Stack:",
      errorInfo?.componentStack
    );

  }


  handleReload =
    () => {

      window.location.reload();

    };


  handleReset =
    () => {

      this.setState({
        hasError: false,
        error: null
      });

    };


  render() {

    if (
      !this.state.hasError
    ) {

      return this.props.children;

    }


    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3
        }}
      >

        <Paper
          elevation={0}
          sx={{
            maxWidth: 520,
            width: "100%",
            p: 4,
            border:
              "1px solid",
            borderColor:
              "divider",
            borderRadius: 4,
            textAlign: "center"
          }}
        >

          <Stack
            spacing={2}
            alignItems="center"
          >

            <ErrorOutlineOutlinedIcon
              color="error"
              sx={{
                fontSize: 58
              }}
            />


            <Typography
              variant="h5"
              fontWeight={950}
            >
              Something went wrong
            </Typography>


            <Typography
              color="text.secondary"
              sx={{
                lineHeight: 1.7
              }}
            >
              An unexpected application error
              occurred. Your session and data are
              safe. Try the page again.
            </Typography>

            {this.state.error && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "error.50",
                  color: "error.dark",
                  borderRadius: 2,
                  fontSize: 13,
                  textAlign: "left",
                  maxHeight: 200,
                  overflow: "auto",
                  fontFamily: "monospace",
                  width: "100%"
                }}
              >
                <strong>Error:</strong> {this.state.error.toString()}
                {this.state.error.stack && (
                  <pre style={{ margin: "8px 0 0 0", fontSize: 11, whiteSpace: "pre-wrap" }}>
                    {this.state.error.stack}
                  </pre>
                )}
              </Box>
            )}


            <Stack
              direction="row"
              spacing={1.5}
            >

              <Button
                variant="outlined"
                onClick={
                  this.handleReset
                }
                sx={{
                  fontWeight: 800
                }}
              >
                Try Again
              </Button>


              <Button
                variant="contained"
                onClick={
                  this.handleReload
                }
                sx={{
                  fontWeight: 850
                }}
              >
                Reload Portal
              </Button>

            </Stack>

          </Stack>

        </Paper>

      </Box>
    );

  }

}


export default AppErrorBoundary;