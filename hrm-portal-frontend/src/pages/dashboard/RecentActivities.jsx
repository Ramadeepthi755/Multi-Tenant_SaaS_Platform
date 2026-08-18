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

const RecentActivities = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const dashboard = await getDashboard();
      setEmployees(dashboard.recentEmployees);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Recent Employees
        </Typography>

        <List>
          {employees.length === 0 ? (
            <Typography>No Employees Found</Typography>
          ) : (
            employees.map((emp) => (
              <div key={emp.employeeId}>
                <ListItem>
                  <ListItemText
                    primary={`${emp.fullName} (${emp.employeeCode})`}
                    secondary={
                      <>
                        {emp.department} • {emp.designation}
                        <br />
                        Joined: {emp.joiningDate}
                      </>
                    }
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

export default RecentActivities;