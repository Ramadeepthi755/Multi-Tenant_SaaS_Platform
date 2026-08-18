import { useEffect, useState } from "react";

import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

import UserList from "./UserList";
import { getCompanies } from "../../services/companyService";

const User = () => {

  const [companies, setCompanies] = useState([]);

  const [loading, setLoading] = useState(true);

  const loadCompanies = async () => {

    try {

      const data = await getCompanies();

      // Supports both Page<> and List<>
      setCompanies(data.content || data);

    } catch (error) {

      console.error(
        "Failed to load companies",
        error
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadCompanies();

  }, []);

  if (loading) {

    return (

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >

        <CircularProgress />

      </Box>

    );

  }

  return (

    <Box>

      <Typography
        variant="h4"
        fontWeight={700}
        mb={3}
      >
        User Management
      </Typography>

      <UserList
        companies={companies}
      />

    </Box>

  );

};

export default User;