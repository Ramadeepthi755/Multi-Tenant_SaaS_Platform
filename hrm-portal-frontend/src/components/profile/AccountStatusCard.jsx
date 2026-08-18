import {
  Chip,
  Paper,
  Stack,
  Typography
} from "@mui/material";


import CheckCircleOutlineOutlinedIcon
  from "@mui/icons-material/CheckCircleOutlineOutlined";


const AccountStatusCard = ({
  active = true,
  accountLocked = false,
  role = "USER",
  companyName = ""
}) => {

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border:
          "1px solid",
        borderColor:
          "divider",
        borderRadius: 3
      }}
    >

      <Typography
        variant="subtitle1"
        fontWeight={900}
        sx={{
          mb: 2
        }}
      >
        Account Status
      </Typography>


      <Stack
        spacing={1.5}
      >

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Status
          </Typography>


          <Chip
            size="small"
            icon={
              <CheckCircleOutlineOutlinedIcon />
            }
            label={
              accountLocked
                ? "Locked"
                : active
                  ? "Active"
                  : "Inactive"
            }
            color={
              accountLocked
                ? "error"
                : active
                  ? "success"
                  : "default"
            }
          />

        </Stack>


        <Stack
          direction="row"
          justifyContent="space-between"
        >

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Role
          </Typography>


          <Typography
            variant="body2"
            fontWeight={800}
          >
            {role}
          </Typography>

        </Stack>


        {companyName && (

          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={2}
          >

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Company
            </Typography>


            <Typography
              variant="body2"
              fontWeight={800}
              textAlign="right"
            >
              {companyName}
            </Typography>

          </Stack>

        )}

      </Stack>

    </Paper>
  );
};


export default AccountStatusCard;