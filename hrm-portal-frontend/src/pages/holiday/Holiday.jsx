import { Box, Typography } from "@mui/material";

import HolidayList from "./HolidayList";

const Holiday = () => {

  return (

    <Box>

      <Typography
        variant="h4"
        fontWeight={700}
        mb={3}
      >
        Holiday Management
      </Typography>

      <HolidayList />

    </Box>

  );

};

export default Holiday;