import {
  Box,
  Link,
  Stack,
  Typography,
} from "@mui/material";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        py: 2,
        px: {
          xs: 2,
          sm: 3,
          lg: 4,
        },

        borderTop: "1px solid",
        borderColor: "divider",

        bgcolor: "background.paper",
      }}
    >
      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        justifyContent="space-between"
        alignItems="center"
        spacing={1.5}
      >
        {/* COPYRIGHT */}

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
        >
          © {currentYear} HRM Portal.
          All Rights Reserved.
        </Typography>

        {/* LINKS */}

        <Stack
          direction="row"
          spacing={{
            xs: 1.5,
            sm: 3,
          }}
          flexWrap="wrap"
          justifyContent="center"
        >
          <Link
            href="/privacy"
            underline="hover"
            color="text.secondary"
            variant="body2"
          >
            Privacy Policy
          </Link>

          <Link
            href="/terms"
            underline="hover"
            color="text.secondary"
            variant="body2"
          >
            Terms of Service
          </Link>

          <Link
            href="/help"
            underline="hover"
            color="text.secondary"
            variant="body2"
          >
            Help Center
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Footer;