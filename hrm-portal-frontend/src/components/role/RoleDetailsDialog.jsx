import {
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography
} from "@mui/material";


import CloseOutlinedIcon
  from "@mui/icons-material/CloseOutlined";


import RoleStatusChip
  from "./RoleStatusChip";


import {
  getPermissionLabel,
  getRoleLabel
} from "../../utils/roleUtils";


const RoleDetailsDialog = ({
  open,
  role,
  onClose
}) => {

  if (!role) {
    return null;
  }


  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >

      <DialogTitle>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >

          <Box
            sx={{
              minWidth: 0
            }}
          >

            <Typography
              variant="h6"
              fontWeight={900}
            >
              {
                role.displayName ||
                getRoleLabel(
                  role.name
                )
              }
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {role.name}
            </Typography>

          </Box>


          <IconButton
            onClick={onClose}
          >
            <CloseOutlinedIcon />
          </IconButton>

        </Stack>

      </DialogTitle>


      <DialogContent
        dividers
      >

        <Stack
          spacing={2.5}
        >

          <Stack
            direction={{
              xs: "column",
              sm: "row"
            }}
            spacing={2}
          >

            <RoleStatusChip
              active={
                role.active
              }
            />

            <Chip
              label={
                role.systemRole
                  ? "System Role"
                  : "Custom Role"
              }
              variant="outlined"
              sx={{
                fontWeight: 800
              }}
            />

          </Stack>


          <Typography
            color="text.secondary"
          >
            {
              role.description ||
              "No description available."
            }
          </Typography>


          <Divider />


          <Typography
            fontWeight={900}
          >
            Assigned Permissions
          </Typography>


          <Stack
            direction="row"
            flexWrap="wrap"
            gap={1}
          >

            {role.permissions?.length
              ? role.permissions.map(
                  permission => (

                    <Chip
                      key={
                        permission
                      }
                      size="small"
                      label={
                        getPermissionLabel(
                          permission
                        )
                      }
                      variant="outlined"
                      sx={{
                        fontWeight: 700
                      }}
                    />

                  )
                )
              : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  No permissions assigned.
                </Typography>
              )}

          </Stack>

        </Stack>

      </DialogContent>

    </Dialog>
  );
};


export default RoleDetailsDialog;