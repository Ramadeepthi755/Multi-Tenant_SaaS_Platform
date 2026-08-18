// src/pages/dashboard/StatCard.jsx

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const StatCard = ({
  title,
  value,
  icon,
  color = "primary.main",
  trend = 0,
  subtitle = "",
}) => {
  const positive = trend >= 0;

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
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
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              mt={1}
            >
              {value}
            </Typography>

            {subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                mt={0.5}
              >
                {subtitle}
              </Typography>
            )}

          </Box>

          <Avatar
            sx={{
              bgcolor: color,
              width: 60,
              height: 60,
            }}
          >
            {icon}
          </Avatar>

        </Stack>

        <Box mt={3}>

          <Chip
            color={positive ? "success" : "error"}
            icon={
              positive
                ? <TrendingUpIcon />
                : <TrendingDownIcon />
            }
            label={`${positive ? "+" : ""}${trend}%`}
          />

        </Box>

      </CardContent>
    </Card>
  );
};

export default StatCard;