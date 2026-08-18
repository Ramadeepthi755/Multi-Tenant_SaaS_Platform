// src/pages/dashboard/AttendanceChart.jsx

import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import { getDashboard } from "../../services/dashboardService";

const COLORS = [
  "#2e7d32",
  "#1976d2",
  "#ed6c02",
  "#9c27b0",
  "#d32f2f",
];

const AttendanceChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const dashboard = await getDashboard();

      setData(
        dashboard.genderDistribution.map((item) => ({
          name: item.gender,
          value: item.count,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          fontWeight={600}
          mb={2}
        >
          Gender Distribution
        </Typography>

        <ResponsiveContainer
          width="100%"
          height={320}
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AttendanceChart;