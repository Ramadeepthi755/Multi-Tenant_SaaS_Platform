import {
  Box,
  Grid,
  Skeleton,
  Stack
} from "@mui/material";


const PageSkeleton = ({
  rows = 6
}) => {

  return (
    <Stack
      spacing={2.5}
    >

      <Stack
        spacing={1}
      >

        <Skeleton
          variant="text"
          width="30%"
          height={42}
        />

        <Skeleton
          variant="text"
          width="50%"
          height={24}
        />

      </Stack>


      <Grid
        container
        spacing={2}
      >

        {Array.from(
          {
            length: 4
          }
        ).map(
          (_, index) => (

            <Grid
              key={index}
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}
            >

              <Skeleton
                variant="rounded"
                height={115}
              />

            </Grid>

          )
        )}

      </Grid>


      <Box>

        {Array.from(
          {
            length: rows
          }
        ).map(
          (_, index) => (

            <Skeleton
              key={index}
              variant="rounded"
              height={55}
              sx={{
                mb: 1
              }}
            />

          )
        )}

      </Box>

    </Stack>
  );
};


export default PageSkeleton;