import {
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography
} from "@mui/material";


import NavigateNextOutlinedIcon
  from "@mui/icons-material/NavigateNextOutlined";


import {
  useLocation,
  useNavigate
} from "react-router-dom";


const labels = {

  dashboard: "Dashboard",

  companies: "Companies",

  departments: "Departments",

  designations: "Designations",

  employees: "Employees",

  attendance: "Attendance",

  leave: "Leave Management",

  payroll: "Payroll",

  holidays: "Holidays",

  documents: "Documents",

  reports: "Reports",

  users: "User Management",

  profile: "My Profile",

  settings: "Settings"

};


const Breadcrumbs = () => {

  const location =
    useLocation();


  const navigate =
    useNavigate();


  const parts =
    location.pathname
      .split("/")
      .filter(Boolean);


  if (
    parts.length === 0 ||
    location.pathname ===
      "/dashboard"
  ) {

    return null;

  }


  return (
    <MuiBreadcrumbs

      separator={
        <NavigateNextOutlinedIcon
          fontSize="small"
        />
      }

      sx={{
        mb: 1.5
      }}

    >

      <Link

        component="button"

        underline="hover"

        color="text.secondary"

        onClick={() =>
          navigate(
            "/dashboard"
          )
        }

        sx={{
          border: 0,
          bgcolor:
            "transparent",
          cursor: "pointer",
          fontSize: 13
        }}

      >
        Dashboard
      </Link>


      {parts.map(
        (part, index) => {

          const path =
            "/" +
            parts
              .slice(
                0,
                index + 1
              )
              .join("/");


          const label =
            labels[
              part
            ] ||
            formatLabel(
              part
            );


          const last =
            index ===
            parts.length - 1;


          return last ? (

            <Typography
              key={
                path
              }
              variant="body2"
              fontWeight={750}
              color="text.primary"
            >
              {label}
            </Typography>

          ) : (

            <Link

              key={
                path
              }

              component="button"

              underline="hover"

              color="text.secondary"

              onClick={() =>
                navigate(
                  path
                )
              }

              sx={{
                border: 0,
                bgcolor:
                  "transparent",
                cursor:
                  "pointer",
                fontSize: 13
              }}

            >
              {label}
            </Link>

          );

        }
      )}

    </MuiBreadcrumbs>
  );
};


const formatLabel =
  value => {

    return value
      .replaceAll(
        "-",
        " "
      )
      .replace(
        /\b\w/g,
        character =>
          character.toUpperCase()
      );

  };


export default Breadcrumbs;