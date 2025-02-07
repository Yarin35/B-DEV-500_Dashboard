import React from "react";
import { Box } from "@mui/material";
import SideBar from "../components/SideBar.js";
import DraggableArea from "../components/DraggableArea.js";

const Dashboard = () => {
  return (
    <Box display="flex" width="100%" height="100vh">
      <SideBar version="dashboard" />
      <Box
        flexGrow={1}
        p={3}
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ marginLeft: "250px "}}
      >
        <Box
          width="80%"
          height="80vh"
          border="2px dashed gray"
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor="#f0f0f0"
          sx={{ backgroundColor: "transparent" }}
        >
          <DraggableArea />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
