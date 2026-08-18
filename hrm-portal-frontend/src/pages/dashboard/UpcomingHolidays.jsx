import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

import { getDashboard } from "../../services/dashboardService";

const UpcomingHolidays = () => {
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    loadHolidays();
  }, []);

  const loadHolidays = async () => {
    try {
      const dashboard = await getDashboard();
      setHolidays(dashboard.upcomingHolidays);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Upcoming Holidays
        </Typography>

        <List>
          {holidays.length === 0 ? (
            <Typography>No Upcoming Holidays</Typography>
          ) : (
            holidays.map((holiday, index) => (
              <div key={index}>
                <ListItem>
                  <ListItemText
                    primary={holiday.holidayName}
                    secondary={holiday.holidayDate}
                  />
                </ListItem>

                <Divider />
              </div>
            ))
          )}
        </List>
      </CardContent>
    </Card>
  );
};

export default UpcomingHolidays;