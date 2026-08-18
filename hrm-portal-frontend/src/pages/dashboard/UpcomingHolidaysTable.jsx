// src/pages/dashboard/UpcomingHolidays.jsx

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";

import CelebrationIcon from "@mui/icons-material/Celebration";

const holidays = [
  {
    id: 1,
    name: "Independence Day",
    date: "15 Aug 2026",
    day: "Saturday",
    remaining: "20 Days",
  },
  {
    id: 2,
    name: "Ganesh Chaturthi",
    date: "27 Aug 2026",
    day: "Thursday",
    remaining: "32 Days",
  },
  {
    id: 3,
    name: "Gandhi Jayanti",
    date: "02 Oct 2026",
    day: "Friday",
    remaining: "68 Days",
  },
  {
    id: 4,
    name: "Diwali",
    date: "08 Nov 2026",
    day: "Sunday",
    remaining: "105 Days",
  },
];

const UpcomingHolidays = () => {
  return (
    <Card
      sx={{
        borderRadius: 3,
        height: "100%",
      }}
    >
      <CardContent>

        <Typography
          variant="h6"
          fontWeight={600}
          mb={2}
        >
          Upcoming Holidays
        </Typography>

        <List>

          {holidays.map((holiday, index) => (
            <Box key={holiday.id}>

              <ListItem>

                <ListItemAvatar>

                  <Avatar
                    sx={{
                      bgcolor: "warning.main",
                    }}
                  >
                    <CelebrationIcon />
                  </Avatar>

                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Typography fontWeight={600}>
                      {holiday.name}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {holiday.date} • {holiday.day}
                      </Typography>
                    </>
                  }
                />

                <Chip
                  color="primary"
                  label={holiday.remaining}
                  size="small"
                />

              </ListItem>

              {index !== holidays.length - 1 && (
                <Divider variant="inset" />
              )}

            </Box>
          ))}

        </List>

      </CardContent>
    </Card>
  );
};

export default UpcomingHolidays;