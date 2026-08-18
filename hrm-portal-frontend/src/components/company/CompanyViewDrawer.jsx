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

import EmailOutlinedIcon
  from "@mui/icons-material/EmailOutlined";

import PhoneOutlinedIcon
  from "@mui/icons-material/PhoneOutlined";


import CompanyStatusChip
  from "./CompanyStatusChip";


import {
  getCompanyInitials,
  formatCompanyDate
} from "../../utils/companyUtils";


const CompanyViewDrawer = ({
  open,
  company,
  onClose
}) => {

  if (!company) {
    return null;
  }


  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={
        onClose
      }
      PaperProps={{
        sx: {
          width: {
            xs: "100%",
            sm: 460
          }
        }
      }}
    >

      {/* ======================================================
          HEADER
      ====================================================== */}

      <Box
        sx={{
          p: 2.5
        }}
      >

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >

          <Typography
            variant="h6"
            fontWeight={900}
          >
            Company Details
          </Typography>


          <IconButton
            onClick={
              onClose
            }
          >
            <CloseOutlinedIcon />
          </IconButton>

        </Stack>

      </Box>


      <Divider />


      {/* ======================================================
          COMPANY IDENTITY
      ====================================================== */}

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
              color: "primary.contrastText",
              fontSize: 22,
              fontWeight: 900
            }}
          >
            {
              getCompanyInitials(
                company.companyName
              )
            }
          </Box>


          <Typography
            variant="h5"
            fontWeight={900}
          >
            {
              company.companyName
            }
          </Typography>


          <Chip
            label={
              company.companyCode ||
              "No Code"
            }
            size="small"
            sx={{
              fontWeight: 800
            }}
          />


          <CompanyStatusChip
            status={
              company.status
            }
            active={
              company.active
            }
          />

        </Stack>

      </Box>


      <Divider />


      {/* ======================================================
          DETAILS
      ====================================================== */}

      <Box
        sx={{
          p: 3
        }}
      >

        <Stack
          spacing={2.5}
        >

          <DetailRow
            icon={
              <BusinessOutlinedIcon />
            }
            label="Company Code"
            value={
              company.companyCode ||
              "—"
            }
          />


          <DetailRow
            icon={
              <EmailOutlinedIcon />
            }
            label="Email"
            value={
              company.email ||
              "—"
            }
          />


          <DetailRow
            icon={
              <PhoneOutlinedIcon />
            }
            label="Phone"
            value={
              company.phone ||
              "—"
            }
          />


          <DetailRow
            label="Created"
            value={
              formatCompanyDate(
                company.createdDate
              )
            }
          />


          <DetailRow
            label="Last Updated"
            value={
              formatCompanyDate(
                company.updatedDate
              )
            }
          />

        </Stack>

      </Box>

    </Drawer>
  );
};


// ============================================================
// DETAIL ROW
// ============================================================

const DetailRow = ({
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


export default CompanyViewDrawer;