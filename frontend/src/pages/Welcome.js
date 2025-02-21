import React from "react";
import Login from "../components/Login";
import Container from "@mui/material/Container";
import LinkButton from "../components/LinkButton";
import { Box, Typography, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "10px",
          mt: 10,
        }}
      >
        <LinkButton to="/register" color="primary">
          Register
        </LinkButton>
      </Box>
      <Box sx={{ flexGrow: 1, mt: 10 }}>
        <Login />
      </Box>
      <Box
        sx={{
          textAlign: "center",
          padding: "16px",
          backgroundColor: "#f0f0f0",
        }}
      >
        <Typography variant="body1" sx={{ mt: 2, color: "black" }}>
          This application allows you to create and manage dashboards with
          various widgets. You can integrate services like Google Calendar,
          YouTube, and Weather if you agree on giving the required access to your accounts (e.g. such as read mail to get a list of your mail).
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <MuiLink component={Link} to="/privacy-policy" target="_blank" rel="noopener">
            Privacy Policy
          </MuiLink>
        </Typography>
      </Box>
    </Container>
  );
};

export default Welcome;
