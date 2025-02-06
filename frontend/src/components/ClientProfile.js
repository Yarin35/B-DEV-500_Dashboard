import React from "react";
import { Box, Avatar, Typography } from "@mui/material";

const ClientProfile = () => {
  return (
    <Box p={2} textAlign="center">
      <Avatar
        alt="Client Name"
        src="/static/images/avatar/1.jpg"
        sx={{ margin: "auto" }}
      />
      <Typography variant="h6">Client Name</Typography>
      <Typography variant="body2" color="textSecondary">
        Client Email
      </Typography>
    </Box>
  );
};

export default ClientProfile;
