import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Stack,
  Typography
} from "@mui/material";


import ExpandMoreOutlinedIcon
  from "@mui/icons-material/ExpandMoreOutlined";


import {
  getPermissionAction,
  getPermissionLabel,
  getPermissionModule,
  groupPermissionsByModule,
  sortPermissions
} from "../../utils/roleUtils";


const ACTION_ORDER = [
  "CREATE",
  "READ",
  "UPDATE",
  "DELETE",
  "APPROVE",
  "REJECT",
  "UPLOAD",
  "DOWNLOAD",
  "VIEW",
  "EXPORT",
  "IMPORT",
  "ACCESS"
];


const PermissionMatrix = ({
  permissions = [],
  selectedPermissions = [],
  onChange,
  disabled = false
}) => {

  const groups =
    groupPermissionsByModule(
      sortPermissions(
        permissions
      )
    );


  const selected =
    new Set(
      selectedPermissions
    );


  const togglePermission =
    permission => {

      const next =
        new Set(selected);

      if (
        next.has(
          permission
        )
      ) {
        next.delete(
          permission
        );
      } else {
        next.add(
          permission
        );
      }

      onChange(
        Array.from(next)
      );

    };


  const toggleModule =
    modulePermissions => {

      const allSelected =
        modulePermissions.every(
          permission =>
            selected.has(
              permission
            )
        );


      const next =
        new Set(selected);


      if (allSelected) {

        modulePermissions.forEach(
          permission =>
            next.delete(
              permission
            )
        );

      } else {

        modulePermissions.forEach(
          permission =>
            next.add(
              permission
            )
        );

      }


      onChange(
        Array.from(next)
      );

    };


  const selectAll = () => {

    onChange(
      [...permissions]
    );

  };


  const clearAll = () => {

    onChange([]);

  };


  const sortModulePermissions =
    modulePermissions => {

      return [...modulePermissions].sort(
        (a, b) => {

          const actionA =
            getPermissionAction(
              a
            );

          const actionB =
            getPermissionAction(
              b
            );

          const indexA =
            ACTION_ORDER.indexOf(
              actionA
            );

          const indexB =
            ACTION_ORDER.indexOf(
              actionB
            );

          if (
            indexA === -1 &&
            indexB === -1
          ) {
            return a.localeCompare(
              b
            );
          }

          if (indexA === -1) {
            return 1;
          }

          if (indexB === -1) {
            return -1;
          }

          return indexA - indexB;

        }
      );

    };


  return (
    <Stack
      spacing={1.5}
    >

      <Stack
        direction={{
          xs: "column",
          sm: "row"
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center"
        }}
        spacing={1}
      >

        <Box>

          <Typography
            fontWeight={900}
          >
            Permission Matrix
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Select the permissions
            available to this role.
          </Typography>

        </Box>


        <Stack
          direction="row"
          spacing={1}
        >

          <Button
            size="small"
            variant="outlined"
            onClick={selectAll}
            disabled={
              disabled ||
              !permissions.length
            }
          >
            Select All
          </Button>

          <Button
            size="small"
            variant="text"
            onClick={clearAll}
            disabled={
              disabled ||
              !selectedPermissions.length
            }
          >
            Clear All
          </Button>

        </Stack>

      </Stack>


      <Divider />


      {Object.entries(groups).map(
        ([
          module,
          modulePermissions
        ]) => {

          const sorted =
            sortModulePermissions(
              modulePermissions
            );


          const allSelected =
            sorted.every(
              permission =>
                selected.has(
                  permission
                )
            );


          const someSelected =
            sorted.some(
              permission =>
                selected.has(
                  permission
                )
            );


          return (
            <Accordion
              key={module}
              defaultExpanded
              disableGutters
              elevation={0}
              sx={{
                border:
                  "1px solid",
                borderColor:
                  "divider",
                borderRadius:
                  "2px !important",

                "&:before": {
                  display: "none"
                }
              }}
            >

              <AccordionSummary
                expandIcon={
                  <ExpandMoreOutlinedIcon />
                }
              >

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{
                    width: "100%"
                  }}
                >

                  <Checkbox
                    size="small"
                    disabled={
                      disabled
                    }
                    checked={
                      allSelected
                    }
                    indeterminate={
                      !allSelected &&
                      someSelected
                    }
                    onClick={event =>
                      event.stopPropagation()
                    }
                    onChange={() =>
                      toggleModule(
                        sorted
                      )
                    }
                  />


                  <Typography
                    fontWeight={900}
                  >
                    {module
                      .replace(
                        /_/g,
                        " "
                      )
                      .replace(
                        /\b\w/g,
                        char =>
                          char.toUpperCase()
                      )}
                  </Typography>


                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {sorted.length} permissions
                  </Typography>

                </Stack>

              </AccordionSummary>


              <AccordionDetails>

                <Grid
                  container
                  spacing={1}
                >

                  {sorted.map(
                    permission => (

                      <Grid
                        key={
                          permission
                        }
                        size={{
                          xs: 12,
                          sm: 6,
                          md: 4
                        }}
                      >

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                selected.has(
                                  permission
                                )
                              }
                              disabled={
                                disabled
                              }
                              onChange={() =>
                                togglePermission(
                                  permission
                                )
                              }
                            />
                          }
                          label={
                            <Typography
                              variant="body2"
                              fontWeight={650}
                            >
                              {
                                getPermissionLabel(
                                  permission
                                )
                              }
                            </Typography>
                          }
                        />

                      </Grid>

                    )
                  )}

                </Grid>

              </AccordionDetails>

            </Accordion>
          );

        }
      )}

    </Stack>
  );
};


export default PermissionMatrix;