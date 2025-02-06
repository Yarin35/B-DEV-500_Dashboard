import React from "react";
import { Box, Typography } from "@mui/material";
import SideBar from "../components/SideBar.js";
import DraggableArea from "../components/DraggableArea.js";

const Dashboard = () => {
  return (
    <Box display="flex">
      <SideBar version="dashboard" />
      <Box flexGrow={1} p={3}>
        <Typography variant="h4">Dashboard</Typography>
        <DraggableArea />
      </Box>
    </Box>
  );
};

export default Dashboard;