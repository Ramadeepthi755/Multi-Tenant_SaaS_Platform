import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography
} from "@mui/material";

import ConstructionOutlinedIcon
  from "@mui/icons-material/ConstructionOutlined";

import ArrowBackOutlinedIcon
  from "@mui/icons-material/ArrowBackOutlined";

import { useNavigate } from "react-router-dom";


const ModulePlaceholder = ({
  title = "Module",
  description = "This module is being prepared.",
  icon: Icon = ConstructionOutlinedIcon
}) => {

  const navigate = useNavigate();


  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >

      <Card
        sx={{
          width: "100%",
          maxWidth: 620,
          textAlign: "center"
        }}
      >

        <CardContent
          sx={{
            p: {
              xs: 4,
              md: 6
            }
          }}
        >

          <Box
            sx={{
              width: 76,
              height: 76,
              mx: "auto",
              mb: 3,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "primary.50",
              color: "primary.main"
            }}
          >

            <Icon
              sx={{
                fontSize: 38
              }}
            />

          </Box>


          <Typography
            variant="h4"
            fontWeight={800}
            gutterBottom
          >
            {title}
          </Typography>


          <Typography
            color="text.secondary"
            sx={{
              maxWidth: 500,
              mx: "auto",
              mb: 4,
              lineHeight: 1.7
            }}
          >
            {description}
          </Typography>


          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
          >

            <Button
              variant="outlined"
              startIcon={
                <ArrowBackOutlinedIcon />
              }
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Back to Dashboard
            </Button>

          </Stack>

        </CardContent>

      </Card>

    </Box>
  );
};


export default ModulePlaceholder;