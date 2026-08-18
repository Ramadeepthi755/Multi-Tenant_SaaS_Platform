import { Box, Typography } from "@mui/material";

import PayrollList from "./PayrollList";

const Payroll = () => {

  return (

    <Box>

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
      >
        Payroll Management
      </Typography>

      <PayrollList />

    </Box>

  );

};

export default Payroll;