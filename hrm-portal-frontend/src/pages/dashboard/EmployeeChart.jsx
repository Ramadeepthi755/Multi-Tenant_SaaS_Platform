// src/pages/dashboard/EmployeeChart.jsx

import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { getDashboard } from "../../services/dashboardService";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const EmployeeChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadChart();
  }, []);

  const loadChart = async () => {
    try {
      const dashboard = await getDashboard();

      const chartData = MONTHS.map((month, index) => ({
        month,
        employees: 0,
      }));

      dashboard.employeeGrowth.forEach((item) => {
        const monthIndex = item.month - 1;

        if (monthIndex >= 0 && monthIndex < 12) {
          chartData[monthIndex].employees = item.count;
        }
      });

      setData(chartData);
    } catch (error) {
      console.error(error);
    }
  };

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
          Employee Growth
        </Typography>

        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="employees"
              name="Employees"
              fill="#1976d2"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EmployeeChart;