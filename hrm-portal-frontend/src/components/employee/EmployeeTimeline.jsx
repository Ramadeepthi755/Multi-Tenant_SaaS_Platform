import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography
} from "@mui/material";

import CheckCircleOutlineOutlinedIcon
  from "@mui/icons-material/CheckCircleOutlineOutlined";

import WorkOutlineOutlinedIcon
  from "@mui/icons-material/WorkOutlineOutlined";

import BusinessOutlinedIcon
  from "@mui/icons-material/BusinessOutlined";

import BadgeOutlinedIcon
  from "@mui/icons-material/BadgeOutlined";

import EventOutlinedIcon
  from "@mui/icons-material/EventOutlined";

import PersonAddAltOutlinedIcon
  from "@mui/icons-material/PersonAddAltOutlined";

import SwapHorizOutlinedIcon
  from "@mui/icons-material/SwapHorizOutlined";

import AccessTimeOutlinedIcon
  from "@mui/icons-material/AccessTimeOutlined";


// ============================================================
// DATE HELPERS
// ============================================================

const parseDate = (
  value
) => {

  if (!value) {
    return null;
  }


  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }


  return date;
};


const formatDate = (
  value
) => {

  const date =
    parseDate(value);


  if (!date) {
    return "Date unavailable";
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


// ============================================================
// TIMELINE EVENT BUILDER
// ============================================================

const buildTimelineEvents = (
  employee
) => {

  if (!employee) {
    return [];
  }


  /*
   * If backend already provides timeline/history,
   * use that data first.
   */

  const backendTimeline =
    employee.timeline ||
    employee.events ||
    employee.history ||
    employee.employeeTimeline;


  if (
    Array.isArray(
      backendTimeline
    ) &&
    backendTimeline.length > 0
  ) {

    return backendTimeline
      .map(
        (event, index) => {

          const eventType =
            String(
              event.type ||
              event.eventType ||
              event.action ||
              ""
            ).toUpperCase();


          let icon =
            EventOutlinedIcon;


          if (
            eventType.includes(
              "JOIN"
            ) ||
            eventType.includes(
              "CREATE"
            )
          ) {
            icon =
              PersonAddAltOutlinedIcon;
          }


          if (
            eventType.includes(
              "DEPARTMENT"
            )
          ) {
            icon =
              BusinessOutlinedIcon;
          }


          if (
            eventType.includes(
              "DESIGNATION"
            ) ||
            eventType.includes(
              "ROLE"
            )
          ) {
            icon =
              BadgeOutlinedIcon;
          }


          if (
            eventType.includes(
              "STATUS"
            ) ||
            eventType.includes(
              "ACTIV"
            )
          ) {
            icon =
              CheckCircleOutlineOutlinedIcon;
          }


          if (
            eventType.includes(
              "TRANSFER"
            ) ||
            eventType.includes(
              "CHANGE"
            )
          ) {
            icon =
              SwapHorizOutlinedIcon;
          }


          return {

            id:
              event.id ??
              event.eventId ??
              index,

            title:
              event.title ||
              event.eventName ||
              event.action ||
              "Employee Update",

            description:
              event.description ||
              event.details ||
              event.message ||
              "",

            date:
              event.date ||
              event.eventDate ||
              event.createdDate ||
              event.createdAt ||
              null,

            icon,

            status:
              event.status ||
              "COMPLETED"

          };

        }
      )
      .sort(
        (a, b) => {

          const dateA =
            parseDate(a.date);

          const dateB =
            parseDate(b.date);


          if (
            !dateA &&
            !dateB
          ) {
            return 0;
          }


          if (!dateA) {
            return 1;
          }


          if (!dateB) {
            return -1;
          }


          return (
            dateB.getTime() -
            dateA.getTime()
          );

        }
      );

  }


  // ==========================================================
  // FALLBACK TIMELINE
  // ==========================================================

  const events = [];


  const employeeName =
    employee.fullName ||
    employee.name ||
    "Employee";


  const employeeCode =
    employee.employeeCode ||
    employee.employeeNumber ||
    employee.empCode ||
    "";


  const joiningDate =
    employee.joiningDate ||
    employee.dateOfJoining;


  const department =
    employee.departmentName ||
    employee.department?.name ||
    employee.department?.departmentName ||
    "";


  const designation =
    employee.designationName ||
    employee.designation?.name ||
    employee.designation?.designationName ||
    "";


  const createdDate =
    employee.createdDate ||
    employee.createdAt;


  const status =
    employee.status ||
    (
      employee.active === true
        ? "ACTIVE"
        : "INACTIVE"
    );


  // ==========================================================
  // CREATED
  // ==========================================================

  if (createdDate) {

    events.push({

      id: "created",

      title:
        "Employee record created",

      description:
        employeeCode
          ? `${employeeName} was added to the HRM system with employee code ${employeeCode}.`
          : `${employeeName} was added to the HRM system.`,

      date:
        createdDate,

      icon:
        PersonAddAltOutlinedIcon,

      status:
        "COMPLETED"

    });

  }


  // ==========================================================
  // JOINING
  // ==========================================================

  if (joiningDate) {

    events.push({

      id: "joining",

      title:
        "Joined the organization",

      description:
        department
          ? `Employee joined the organization and was assigned to ${department}.`
          : "Employee officially joined the organization.",

      date:
        joiningDate,

      icon:
        WorkOutlineOutlinedIcon,

      status:
        "COMPLETED"

    });

  }


  // ==========================================================
  // DEPARTMENT
  // ==========================================================

  if (department) {

    events.push({

      id: "department",

      title:
        "Department assigned",

      description:
        `Assigned to ${department}.`,

      date:
        joiningDate ||
        createdDate,

      icon:
        BusinessOutlinedIcon,

      status:
        "COMPLETED"

    });

  }


  // ==========================================================
  // DESIGNATION
  // ==========================================================

  if (designation) {

    events.push({

      id: "designation",

      title:
        "Designation assigned",

      description:
        `Current designation: ${designation}.`,

      date:
        joiningDate ||
        createdDate,

      icon:
        BadgeOutlinedIcon,

      status:
        "COMPLETED"

    });

  }


  // ==========================================================
  // CURRENT STATUS
  // ==========================================================

  events.push({

    id: "status",

    title:
      status === "ACTIVE"
        ? "Employee account active"
        : "Employee account inactive",

    description:
      status === "ACTIVE"
        ? "The employee currently has an active account."
        : "The employee account is currently inactive.",

    date:
      employee.updatedDate ||
      employee.updatedAt ||
      new Date(),

    icon:
      status === "ACTIVE"
        ? CheckCircleOutlineOutlinedIcon
        : AccessTimeOutlinedIcon,

    status:
      status === "ACTIVE"
        ? "COMPLETED"
        : "INACTIVE"

  });


  return events
    .filter(
      event =>
        event.date
    )
    .sort(
      (a, b) => {

        const dateA =
          parseDate(a.date);

        const dateB =
          parseDate(b.date);


        if (!dateA) {
          return 1;
        }


        if (!dateB) {
          return -1;
        }


        return (
          dateB.getTime() -
          dateA.getTime()
        );

      }
    );

};


// ============================================================
// TIMELINE ITEM
// ============================================================

const TimelineItem = ({
  event,
  isLast
}) => {

  const Icon =
    event.icon ||
    EventOutlinedIcon;


  const completed =
    String(
      event.status ||
      ""
    ).toUpperCase() !==
    "INACTIVE";


  return (
    <Box
      sx={{
        display: "flex",
        position: "relative"
      }}
    >

      {/* ======================================================
          LEFT TIMELINE
      ====================================================== */}

      <Box
        sx={{
          width: 52,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >

        {/* ICON */}

        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            bgcolor:
              completed
                ? "primary.50"
                : "action.hover",

            color:
              completed
                ? "primary.main"
                : "text.secondary",

            border:
              "1px solid",

            borderColor:
              completed
                ? "primary.100"
                : "divider",

            zIndex: 2
          }}
        >

          <Icon
            sx={{
              fontSize: 20
            }}
          />

        </Box>


        {/* CONNECTOR */}

        {!isLast && (

          <Box
            sx={{
              width: 2,
              flex: 1,
              minHeight: 54,
              bgcolor:
                "divider",
              my: .5
            }}
          />

        )}

      </Box>



      {/* ======================================================
          CONTENT
      ====================================================== */}

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          pb:
            isLast
              ? 0
              : 3
        }}
      >

        <Stack
          direction={{
            xs: "column",
            sm: "row"
          }}
          justifyContent="space-between"
          spacing={1}
        >

          <Box>

            <Typography
              variant="body1"
              fontWeight={850}
            >
              {
                event.title
              }
            </Typography>


            {event.description && (

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: .45,
                  lineHeight: 1.6
                }}
              >
                {
                  event.description
                }
              </Typography>

            )}

          </Box>


          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={750}
            sx={{
              whiteSpace:
                "nowrap",
              pt: .25
            }}
          >
            {
              formatDate(
                event.date
              )
            }
          </Typography>

        </Stack>


        {event.status && (

          <Chip
            size="small"
            label={
              String(
                event.status
              ).replace(
                /_/g,
                " "
              )
            }
            variant="outlined"
            sx={{
              mt: 1,
              fontSize: 11,
              fontWeight: 800,
              textTransform:
                "capitalize"
            }}
          />

        )}

      </Box>

    </Box>
  );
};


// ============================================================
// EMPTY TIMELINE
// ============================================================

const EmptyTimeline = () => {

  return (
    <Box
      sx={{
        py: 5,
        textAlign: "center"
      }}
    >

      <Box
        sx={{
          width: 58,
          height: 58,
          mx: "auto",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "action.hover",
          color: "text.secondary"
        }}
      >

        <EventOutlinedIcon
          sx={{
            fontSize: 28
          }}
        />

      </Box>


      <Typography
        variant="body1"
        fontWeight={800}
        sx={{
          mt: 1.5
        }}
      >
        No timeline events
      </Typography>


      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mt: .5
        }}
      >
        Employee activity will appear here.
      </Typography>

    </Box>
  );
};


// ============================================================
// EMPLOYEE TIMELINE
// ============================================================

const EmployeeTimeline = ({
  employee
}) => {

  const events =
    buildTimelineEvents(
      employee
    );


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
            HEADER
        ==================================================== */}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{
            mb: 2
          }}
        >

          <Box>

            <Typography
              variant="h6"
              fontWeight={900}
              sx={{
                lineHeight: 1.2
              }}
            >
              Employee Timeline
            </Typography>


            <Typography
              variant="caption"
              color="text.secondary"
            >
              Important employee milestones and updates
            </Typography>

          </Box>


          <Chip
            size="small"
            label={
              `${events.length} ${
                events.length === 1
                  ? "event"
                  : "events"
              }`
            }
            variant="outlined"
            sx={{
              fontWeight: 800
            }}
          />

        </Stack>


        <Divider
          sx={{
            mb: 3
          }}
        />


        {/* ====================================================
            TIMELINE
        ==================================================== */}

        {events.length > 0 ? (

          <Stack>

            {events.map(
              (event, index) => (

                <TimelineItem
                  key={
                    event.id ??
                    index
                  }

                  event={
                    event
                  }

                  isLast={
                    index ===
                    events.length - 1
                  }
                />

              )
            )}

          </Stack>

        ) : (

          <EmptyTimeline />

        )}

      </CardContent>

    </Card>
  );
};


export default EmployeeTimeline;