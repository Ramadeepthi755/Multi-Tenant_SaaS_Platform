import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography
} from "@mui/material";

import PersonOutlineOutlinedIcon
  from "@mui/icons-material/PersonOutlineOutlined";

import ContactPhoneOutlinedIcon
  from "@mui/icons-material/ContactPhoneOutlined";

import WorkOutlineOutlinedIcon
  from "@mui/icons-material/WorkOutlineOutlined";

import BusinessOutlinedIcon
  from "@mui/icons-material/BusinessOutlined";

import EmailOutlinedIcon
  from "@mui/icons-material/EmailOutlined";

import LocationOnOutlinedIcon
  from "@mui/icons-material/LocationOnOutlined";

import CalendarMonthOutlinedIcon
  from "@mui/icons-material/CalendarMonthOutlined";

import BadgeOutlinedIcon
  from "@mui/icons-material/BadgeOutlined";

import AccountCircleOutlinedIcon
  from "@mui/icons-material/AccountCircleOutlined";


// ============================================================
// SMALL INFORMATION ITEM
// ============================================================

const InfoItem = ({
  icon: Icon,
  label,
  value,
  fullWidth = false
}) => {

  return (
    <Box
      sx={{
        gridColumn: fullWidth
          ? {
              xs: "span 1",
              md: "span 2"
            }
          : "auto"
      }}
    >

      <Stack
        direction="row"
        spacing={1.5}
        alignItems="flex-start"
      >

        <Box
          sx={{
            width: 38,
            height: 38,
            flexShrink: 0,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "action.hover",
            color: "primary.main"
          }}
        >

          {Icon && (
            <Icon
              sx={{
                fontSize: 20
              }}
            />
          )}

        </Box>


        <Box
          sx={{
            minWidth: 0,
            flex: 1
          }}
        >

          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={750}
            sx={{
              display: "block",
              textTransform: "uppercase",
              letterSpacing: ".04em"
            }}
          >
            {label}
          </Typography>


          <Typography
            variant="body2"
            fontWeight={750}
            sx={{
              mt: .35,
              wordBreak: "break-word"
            }}
          >
            {
              value ||
              "Not available"
            }
          </Typography>

        </Box>

      </Stack>

    </Box>
  );
};


// ============================================================
// SECTION CARD
// ============================================================

const InformationSection = ({
  icon: Icon,
  title,
  subtitle,
  children
}) => {

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper"
      }}
    >

      <CardContent
        sx={{
          p: {
            xs: 2,
            sm: 2.5
          },

          "&:last-child": {
            pb: {
              xs: 2,
              sm: 2.5
            }
          }
        }}
      >

        {/* ====================================================
            SECTION HEADER
        ==================================================== */}

        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{
            mb: 2.5
          }}
        >

          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2.2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "primary.50",
              color: "primary.main"
            }}
          >

            {Icon && (
              <Icon
                sx={{
                  fontSize: 21
                }}
              />
            )}

          </Box>


          <Box>

            <Typography
              variant="h6"
              fontWeight={900}
              sx={{
                lineHeight: 1.2
              }}
            >
              {title}
            </Typography>


            {subtitle && (

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {subtitle}
              </Typography>

            )}

          </Box>

        </Stack>


        <Divider
          sx={{
            mb: 2.5
          }}
        />


        {children}

      </CardContent>

    </Card>
  );
};


// ============================================================
// EMPLOYEE INFO CARD
// ============================================================

const EmployeeInfoCard = ({
  employee
}) => {

  // ==========================================================
  // SAFETY
  // ==========================================================

  if (!employee) {
    return null;
  }


  // ==========================================================
  // PERSONAL INFORMATION
  // ==========================================================

  const firstName =
    employee.firstName ||
    "";

  const middleName =
    employee.middleName ||
    "";

  const lastName =
    employee.lastName ||
    "";

  const fullName =
    employee.fullName ||
    employee.name ||
    [
      firstName,
      middleName,
      lastName
    ]
      .filter(Boolean)
      .join(" ") ||
    "Not available";


  const gender =
    employee.gender ||
    employee.sex ||
    "";


  const dateOfBirth =
    employee.dateOfBirth ||
    employee.dob ||
    "";


  const maritalStatus =
    employee.maritalStatus ||
    "";


  const bloodGroup =
    employee.bloodGroup ||
    "";


  // ==========================================================
  // CONTACT INFORMATION
  // ==========================================================

  const workEmail =
    employee.email ||
    employee.workEmail ||
    employee.companyEmail ||
    "";


  const personalEmail =
    employee.personalEmail ||
    employee.personalEmailAddress ||
    "";


  const phone =
    employee.phone ||
    employee.mobile ||
    employee.mobileNumber ||
    employee.phoneNumber ||
    "";


  const alternatePhone =
    employee.alternatePhone ||
    employee.alternateMobile ||
    "";


  // ==========================================================
  // EMPLOYMENT INFORMATION
  // ==========================================================

  const employeeCode =
    employee.employeeCode ||
    employee.employeeNumber ||
    employee.empCode ||
    "";


  const joiningDate =
    employee.joiningDate ||
    employee.dateOfJoining ||
    "";


  const employmentType =
    employee.employmentType ||
    employee.employeeType ||
    "";


  const reportingManager =
    employee.reportingManagerName ||
    employee.managerName ||
    employee.reportingManager?.fullName ||
    employee.manager?.fullName ||
    "";


  const workLocation =
    employee.workLocation ||
    employee.location ||
    employee.officeLocation ||
    "";


  // ==========================================================
  // ORGANIZATION
  // ==========================================================

  const company =
    employee.companyName ||
    employee.company?.companyName ||
    employee.company?.name ||
    "";


  const department =
    employee.departmentName ||
    employee.department?.departmentName ||
    employee.department?.name ||
    employee.department ||
    "";


  const designation =
    employee.designationName ||
    employee.designation?.designationName ||
    employee.designation?.name ||
    employee.designation ||
    "";


  const employeeStatus =
    employee.status ||
    (
      employee.active === true
        ? "ACTIVE"
        : "INACTIVE"
    );


  // ==========================================================
  // ADDRESS
  // ==========================================================

  const addressLine1 =
    employee.addressLine1 ||
    employee.address ||
    "";

  const addressLine2 =
    employee.addressLine2 ||
    "";

  const city =
    employee.city ||
    "";

  const state =
    employee.state ||
    employee.stateName ||
    "";

  const country =
    employee.country ||
    "India";

  const postalCode =
    employee.postalCode ||
    employee.zipCode ||
    employee.pincode ||
    "";


  const fullAddress = [
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country
  ]
    .filter(Boolean)
    .join(", ");


  // ==========================================================
  // EMERGENCY CONTACT
  // ==========================================================

  const emergencyName =
    employee.emergencyContactName ||
    employee.emergencyContact?.name ||
    "";

  const emergencyPhone =
    employee.emergencyContactPhone ||
    employee.emergencyContact?.phone ||
    "";

  const emergencyRelation =
    employee.emergencyContactRelation ||
    employee.emergencyContact?.relation ||
    "";


  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formatDate = (
    value
  ) => {

    if (!value) {
      return "";
    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }


    return new Intl.DateTimeFormat(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    ).format(date);
  };


  return (
    <Stack
      spacing={2}
    >

      {/* ======================================================
          PERSONAL INFORMATION
      ====================================================== */}

      <InformationSection
        icon={
          PersonOutlineOutlinedIcon
        }
        title="Personal Information"
        subtitle="Basic employee information"
      >

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))"
            },
            gap: 2.5
          }}
        >

          <InfoItem
            icon={
              PersonOutlineOutlinedIcon
            }
            label="Full Name"
            value={
              fullName
            }
          />


          <InfoItem
            icon={
              BadgeOutlinedIcon
            }
            label="Employee ID"
            value={
              employeeCode
            }
          />


          <InfoItem
            icon={
              CalendarMonthOutlinedIcon
            }
            label="Date of Birth"
            value={
              formatDate(
                dateOfBirth
              )
            }
          />


          <InfoItem
            icon={
              PersonOutlineOutlinedIcon
            }
            label="Gender"
            value={
              gender
            }
          />


          <InfoItem
            icon={
              AccountCircleOutlinedIcon
            }
            label="Marital Status"
            value={
              maritalStatus
            }
          />


          <InfoItem
            icon={
              BadgeOutlinedIcon
            }
            label="Blood Group"
            value={
              bloodGroup
            }
          />

        </Box>

      </InformationSection>



      {/* ======================================================
          CONTACT INFORMATION
      ====================================================== */}

      <InformationSection
        icon={
          ContactPhoneOutlinedIcon
        }
        title="Contact Information"
        subtitle="Employee communication details"
      >

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))"
            },
            gap: 2.5
          }}
        >

          <InfoItem
            icon={
              EmailOutlinedIcon
            }
            label="Work Email"
            value={
              workEmail
            }
          />


          <InfoItem
            icon={
              EmailOutlinedIcon
            }
            label="Personal Email"
            value={
              personalEmail
            }
          />


          <InfoItem
            icon={
              ContactPhoneOutlinedIcon
            }
            label="Primary Phone"
            value={
              phone
            }
          />


          <InfoItem
            icon={
              ContactPhoneOutlinedIcon
            }
            label="Alternate Phone"
            value={
              alternatePhone
            }
          />

        </Box>

      </InformationSection>



      {/* ======================================================
          EMPLOYMENT INFORMATION
      ====================================================== */}

      <InformationSection
        icon={
          WorkOutlineOutlinedIcon
        }
        title="Employment Information"
        subtitle="Employee role and employment details"
      >

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))"
            },
            gap: 2.5
          }}
        >

          <InfoItem
            icon={
              BadgeOutlinedIcon
            }
            label="Employee Code"
            value={
              employeeCode
            }
          />


          <InfoItem
            icon={
              CalendarMonthOutlinedIcon
            }
            label="Joining Date"
            value={
              formatDate(
                joiningDate
              )
            }
          />


          <InfoItem
            icon={
              WorkOutlineOutlinedIcon
            }
            label="Employment Type"
            value={
              employmentType
            }
          />


          <InfoItem
            icon={
              AccountCircleOutlinedIcon
            }
            label="Reporting Manager"
            value={
              reportingManager
            }
          />


          <InfoItem
            icon={
              BusinessOutlinedIcon
            }
            label="Work Location"
            value={
              workLocation
            }
          />


          <InfoItem
            icon={
              AccountCircleOutlinedIcon
            }
            label="Employment Status"
            value={
              employeeStatus
            }
          />

        </Box>

      </InformationSection>



      {/* ======================================================
          ORGANIZATION
      ====================================================== */}

      <InformationSection
        icon={
          BusinessOutlinedIcon
        }
        title="Organization"
        subtitle="Company hierarchy and assignment"
      >

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, minmax(0, 1fr))"
            },
            gap: 2.5
          }}
        >

          <InfoItem
            icon={
              BusinessOutlinedIcon
            }
            label="Company"
            value={
              company
            }
          />


          <InfoItem
            icon={
              BusinessOutlinedIcon
            }
            label="Department"
            value={
              department
            }
          />


          <InfoItem
            icon={
              BadgeOutlinedIcon
            }
            label="Designation"
            value={
              designation
            }
          />

        </Box>

      </InformationSection>



      {/* ======================================================
          ADDRESS
      ====================================================== */}

      <InformationSection
        icon={
          LocationOnOutlinedIcon
        }
        title="Address"
        subtitle="Current residential address"
      >

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))"
            },
            gap: 2.5
          }}
        >

          <InfoItem
            icon={
              LocationOnOutlinedIcon
            }
            label="Address"
            value={
              fullAddress
            }
            fullWidth
          />


          <InfoItem
            icon={
              LocationOnOutlinedIcon
            }
            label="City"
            value={
              city
            }
          />


          <InfoItem
            icon={
              LocationOnOutlinedIcon
            }
            label="State"
            value={
              state
            }
          />

        </Box>

      </InformationSection>



      {/* ======================================================
          EMERGENCY CONTACT
      ====================================================== */}

      {(emergencyName ||
        emergencyPhone ||
        emergencyRelation) && (

        <InformationSection
          icon={
            ContactPhoneOutlinedIcon
          }
          title="Emergency Contact"
          subtitle="Emergency contact information"
        >

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, minmax(0, 1fr))"
              },
              gap: 2.5
            }}
          >

            <InfoItem
              icon={
                PersonOutlineOutlinedIcon
              }
              label="Contact Name"
              value={
                emergencyName
              }
            />


            <InfoItem
              icon={
                ContactPhoneOutlinedIcon
              }
              label="Phone"
              value={
                emergencyPhone
              }
            />


            <InfoItem
              icon={
                AccountCircleOutlinedIcon
              }
              label="Relationship"
              value={
                emergencyRelation
              }
            />

          </Box>

        </InformationSection>

      )}

    </Stack>
  );
};


export default EmployeeInfoCard;