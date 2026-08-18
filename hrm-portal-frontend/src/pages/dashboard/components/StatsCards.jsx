import Grid from "@mui/material/Grid";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonIcon from "@mui/icons-material/Person";
import ApartmentIcon from "@mui/icons-material/Apartment";
import WorkIcon from "@mui/icons-material/Work";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import PaymentsIcon from "@mui/icons-material/Payments";
import CelebrationIcon from "@mui/icons-material/Celebration";

import StatCard from "../StatCard";

const StatsCards = ({ data }) => {

  const cards = [
    {
      title: "Total Employees",
      value: data.totalEmployees,
      icon: <PeopleAltIcon fontSize="large" />,
      color: "#1976d2",
    },
    {
      title: "Active Employees",
      value: data.activeEmployees,
      icon: <PersonIcon fontSize="large" />,
      color: "#2e7d32",
    },
    {
      title: "Departments",
      value: data.totalDepartments,
      icon: <ApartmentIcon fontSize="large" />,
      color: "#ef6c00",
    },
    {
      title: "Designations",
      value: data.totalDesignations,
      icon: <WorkIcon fontSize="large" />,
      color: "#8e24aa",
    },
    {
      title: "Today's Attendance",
      value: data.todayAttendance,
      icon: <HowToRegIcon fontSize="large" />,
      color: "#00897b",
    },
    {
      title: "Today's Leaves",
      value: data.todayLeaves,
      icon: <EventBusyIcon fontSize="large" />,
      color: "#d32f2f",
    },
    {
      title: "Payroll",
      value: `$${Number(data.currentMonthPayroll || 0).toLocaleString()}`,
      icon: <PaymentsIcon fontSize="large" />,
      color: "#1565c0",
    },
    {
      title: "Holidays",
      value: data.totalHolidays,
      icon: <CelebrationIcon fontSize="large" />,
      color: "#f9a825",
    },
  ];

  return (
    <Grid container spacing={3}>

      {cards.map((card, index) => (

        <Grid
          key={index}
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >

          <StatCard
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
          />

        </Grid>

      ))}

    </Grid>
  );
};

export default StatsCards;