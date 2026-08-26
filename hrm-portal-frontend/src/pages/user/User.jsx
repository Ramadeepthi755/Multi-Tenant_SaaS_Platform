import { useEffect, useState } from "react";

import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

import UserList from "./UserList";
import companyService from "../../services/companyService";

const User = () => {

  const [companies, setCompanies] = useState([]);

  const [loading, setLoading] = useState(true);

  const loadCompanies = async () => {

    try {

      const data =
        await companyService.getCompanies();

      setCompanies(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
            ? data.content
            : []
      );

    } catch (error) {

      console.error(
        "Failed to load companies",
        error
      );

      setCompanies([]);

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