import {
  Box,
  Chip,
  Paper,
  Stack,
  Typography
} from "@mui/material";


import ProfileAvatar
  from "./ProfileAvatar";


const ProfileHeader = ({
  profile,
  profilePhotoUrl,
  onUpload
}) => {

  const fullName =
    profile?.fullName ||
    "User";


  return (
    <Paper
      elevation={0}
      sx={{
        p: {
          xs: 2.5,
          md: 3
        },
        mb: 2.5,
        border:
          "1px solid",
        borderColor:
          "divider",
        borderRadius: 3
      }}
    >

      <Stack
        direction={{
          xs: "column",
          sm: "row"
        }}
        spacing={2.5}
        alignItems="center"
      >

        <ProfileAvatar
          name={
            fullName
          }
          image={
            profilePhotoUrl
          }
          onUpload={
            onUpload
          }
        />


        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            textAlign: {
              xs: "center",
              sm: "left"
            }
          }}
        >

          <Typography
            variant="h5"
            fontWeight={950}
          >
            {fullName}
          </Typography>


          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5
            }}
          >
            {profile?.email ||
              "No email available"}
          </Typography>


          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
            justifyContent={{
              xs: "center",
              sm: "flex-start"
            }}
            sx={{
              mt: 1.5
            }}
          >

            <Chip
              label={
                profile?.role ||
                "USER"
              }
              size="small"
              color="primary"
              variant="outlined"
              sx={{
                fontWeight: 800
              }}
            />


            {profile?.companyName && (

              <Chip
                label={
                  profile.companyName
                }
                size="small"
                variant="outlined"
              />

            )}

          </Stack>

        </Box>

      </Stack>

    </Paper>
  );
};


export default ProfileHeader;