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


import PersonOutlineOutlinedIcon
  from "@mui/icons-material/PersonOutlineOutlined";

import ComputerOutlinedIcon
  from "@mui/icons-material/ComputerOutlined";

import PublicOutlinedIcon
  from "@mui/icons-material/PublicOutlined";

import ScheduleOutlinedIcon
  from "@mui/icons-material/ScheduleOutlined";


import {
  formatDateTime,
  getActionLabel,
  getModuleLabel
} from "../../utils/securityUtils";


import AuditLogStatusChip
  from "../../components/security/AuditLogStatusChip";


const AuditLogDetails = ({
  log,
  open,
  onClose
}) => {

  if (!log) {
    return null;
  }


  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={
        onClose
      }
      slotProps={{
        paper: {
          sx: {
            width: {
              xs: "100%",
              sm: 470
            }
          }
        }
      }}
    >

      <Stack
        sx={{
          height: "100%"
        }}
      >

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            p: 2.5
          }}
        >

          <Box>

            <Typography
              variant="h6"
              fontWeight={900}
            >
              Audit Details
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Security event information
            </Typography>

          </Box>


          <IconButton
            onClick={
              onClose
            }
          >
            <CloseOutlinedIcon />
          </IconButton>

        </Stack>


        <Divider />


        <Stack
          spacing={2.5}
          sx={{
            p: 2.5,
            overflowY: "auto"
          }}
        >

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >

            <Chip
              label={
                getModuleLabel(
                  log.module
                )
              }
              variant="outlined"
              sx={{
                fontWeight: 800
              }}
            />


            <Chip
              label={
                getActionLabel(
                  log.action
                )
              }
              variant="outlined"
              sx={{
                fontWeight: 800
              }}
            />

            <AuditLogStatusChip
              status={
                log.status
              }
            />

          </Stack>


          <Typography
            variant="h6"
            fontWeight={850}
          >
            {
              log.description ||
              "Audit event"
            }
          </Typography>


          <Divider />


          <DetailRow
            icon={
              <PersonOutlineOutlinedIcon />
            }
            label="User"
            value={
              log.userName
            }
          />


          <DetailRow
            icon={
              <ComputerOutlinedIcon />
            }
            label="IP Address"
            value={
              log.ipAddress
            }
          />


          <DetailRow
            icon={
              <ComputerOutlinedIcon />
            }
            label="Device"
            value={
              log.device
            }
          />


          <DetailRow
            icon={
              <PublicOutlinedIcon />
            }
            label="Location"
            value={
              log.location
            }
          />


          <DetailRow
            icon={
              <ScheduleOutlinedIcon />
            }
            label="Date & Time"
            value={
              formatDateTime(
                log.createdAt
              )
            }
          />


          <Box>

            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={750}
            >
              User Agent
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.5,
                wordBreak:
                  "break-word"
              }}
            >
              {
                log.userAgent
              }
            </Typography>

          </Box>


          {(log.oldValue ||
            log.newValue) && (

            <Box>

              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={750}
              >
                Changes
              </Typography>


              {log.oldValue && (

                <Box
                  sx={{
                    mt: 1,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor:
                      "error.lighter"
                  }}
                >

                  <Typography
                    variant="caption"
                    fontWeight={800}
                  >
                    Previous value
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      mt: 0.5,
                      wordBreak:
                        "break-word"
                    }}
                  >
                    {
                      typeof log.oldValue ===
                      "object"
                        ? JSON.stringify(
                            log.oldValue,
                            null,
                            2
                          )
                        : String(
                            log.oldValue
                          )
                    }
                  </Typography>

                </Box>

              )}


              {log.newValue && (

                <Box
                  sx={{
                    mt: 1,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor:
                      "success.lighter"
                  }}
                >

                  <Typography
                    variant="caption"
                    fontWeight={800}
                  >
                    New value
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      mt: 0.5,
                      wordBreak:
                        "break-word"
                    }}
                  >
                    {
                      typeof log.newValue ===
                      "object"
                        ? JSON.stringify(
                            log.newValue,
                            null,
                            2
                          )
                        : String(
                            log.newValue
                          )
                    }
                  </Typography>

                </Box>

              )}

            </Box>

          )}

        </Stack>

      </Stack>

    </Drawer>
  );
};


const DetailRow = ({
  icon,
  label,
  value
}) => (

  <Stack
    direction="row"
    spacing={1.5}
    alignItems="flex-start"
  >

    <Box
      sx={{
        color:
          "text.secondary",
        mt: 0.2
      }}
    >
      {icon}
    </Box>


    <Box>

      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={750}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        fontWeight={700}
        sx={{
          mt: 0.25
        }}
      >
        {value || "-"}
      </Typography>

    </Box>

  </Stack>

);


export default AuditLogDetails;