import {
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography
} from "@mui/material";

import CloseOutlinedIcon
  from "@mui/icons-material/CloseOutlined";

import BusinessOutlinedIcon
  from "@mui/icons-material/BusinessOutlined";

import AccountTreeOutlinedIcon
  from "@mui/icons-material/AccountTreeOutlined";

import GroupsOutlinedIcon
  from "@mui/icons-material/GroupsOutlined";

import DesignationStatusChip
  from "./DesignationStatusChip";


/*
|--------------------------------------------------------------------------
| LOCAL HELPERS
|--------------------------------------------------------------------------
|
| No designationUtils.js dependency.
|
|--------------------------------------------------------------------------
*/


const formatDesignationDate = (
  value
) => {

  if (!value) {
    return "—";
  }


  try {

    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return String(value);
    }


    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );

  } catch {
    return String(value);
  }

};


const getDesignationInitials = (
  name
) => {

  if (!name) {
    return "NA";
  }


  const words =
    String(name)
      .trim()
      .split(/\s+/)
      .filter(Boolean);


  if (words.length === 1) {

    return words[0]
      .substring(0, 2)
      .toUpperCase();

  }


  return (
    words[0][0] +
    words[1][0]
  ).toUpperCase();

};


/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

const DesignationViewDrawer = ({
  open,
  designation,
  onClose
}) => {

  /*
  |--------------------------------------------------------------------------
  | NO DATA
  |--------------------------------------------------------------------------
  */

  if (!designation) {
    return null;
  }


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (

    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: {
            xs: "100%",
            sm: 460
          }
        }
      }}
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <Box
        sx={{
          p: 2.5
        }}
      >

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >

          <Typography
            variant="h6"
            fontWeight={900}
          >
            Designation Details
          </Typography>


          <IconButton
            onClick={onClose}
          >
            <CloseOutlinedIcon />
          </IconButton>

        </Stack>

      </Box>


      <Divider />


      {/* =====================================================
          IDENTITY
      ===================================================== */}

      <Box
        sx={{
          p: 3
        }}
      >

        <Stack
          alignItems="center"
          spacing={1.5}
          textAlign="center"
        >

          {/* INITIALS */}

          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor:
                "primary.main",
              color:
                "primary.contrastText",
              fontSize: 22,
              fontWeight: 900
            }}
          >
            {
              getDesignationInitials(
                designation.designationName
              )
            }
          </Box>


          {/* NAME */}

          <Typography
            variant="h5"
            fontWeight={900}
          >
            {
              designation.designationName ||
              "Unnamed Designation"
            }
          </Typography>


          {/* CODE */}

          <Chip
            size="small"
            label={
              designation.designationCode ||
              "No Code"
            }
            sx={{
              fontWeight: 800
            }}
          />


          {/* STATUS */}

          <DesignationStatusChip
            status={
              designation.status
            }
            active={
              designation.active
            }
          />

        </Stack>

      </Box>


      <Divider />


      {/* =====================================================
          DETAILS
      ===================================================== */}

      <Box
        sx={{
          p: 3
        }}
      >

        <Stack
          spacing={2.5}
        >

          {/* COMPANY */}

          <Detail
            icon={
              <BusinessOutlinedIcon />
            }
            label="Company"
            value={
              designation.companyName ||
              designation.company?.companyName ||
              "—"
            }
          />


          {/* DEPARTMENT */}

          <Detail
            icon={
              <AccountTreeOutlinedIcon />
            }
            label="Department"
            value={
              designation.departmentName ||
              designation.department?.departmentName ||
              "—"
            }
          />


          {/* EMPLOYEES */}

          <Detail
            icon={
              <GroupsOutlinedIcon />
            }
            label="Employees"
            value={
              designation.employeeCount !==
                undefined &&
              designation.employeeCount !==
                null
                ? String(
                    designation.employeeCount
                  )
                : "0"
            }
          />


          {/* DESCRIPTION */}

          <Detail
            label="Description"
            value={
              designation.description ||
              "No description provided."
            }
          />


          {/* CREATED */}

          <Detail
            label="Created"
            value={
              formatDesignationDate(
                designation.createdDate ||
                designation.createdAt
              )
            }
          />


          {/* UPDATED */}

          <Detail
            label="Last Updated"
            value={
              formatDesignationDate(
                designation.updatedDate ||
                designation.updatedAt
              )
            }
          />

        </Stack>

      </Box>

    </Drawer>

  );

};


/*
|--------------------------------------------------------------------------
| DETAIL COMPONENT
|--------------------------------------------------------------------------
*/

const Detail = ({
  icon,
  label,
  value
}) => {

  return (

    <Stack
      direction="row"
      spacing={1.5}
      alignItems="flex-start"
    >

      {icon && (

        <Box
          sx={{
            color:
              "text.secondary",
            mt: 0.25
          }}
        >
          {icon}
        </Box>

      )}


      <Box
        sx={{
          flex: 1,
          minWidth: 0
        }}
      >

        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={700}
        >
          {label}
        </Typography>


        <Typography
          variant="body2"
          fontWeight={750}
          sx={{
            mt: 0.25,
            overflowWrap:
              "anywhere"
          }}
        >
          {value}
        </Typography>

      </Box>

    </Stack>

  );

};


export default DesignationViewDrawer;