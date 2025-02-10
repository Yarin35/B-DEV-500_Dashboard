import React, { useRef } from "react";
import { Box, Button } from "@mui/material";
import SideBar from "../components/SideBar.js";
import DraggableArea from "../components/DraggableArea.js";
import { useParams } from "react-router-dom";

const Dashboard = () => {
  const { id } = useParams();
  const draggableAreaRef = useRef(null);

  const handleSaveDashboard = () => {
    if (draggableAreaRef.current) {
      draggableAreaRef.current.saveDashboard();
      console.log('Dashboard saved');
    }
  };

  return (
    <Box display="flex" width="100%" height="100vh">
      <SideBar version="dashboard" dashboardId={id} />
      <Box
        flexGrow={1}
        p={3}
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ marginLeft: "250px " }}
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
          <DraggableArea
            dashboardId={id}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSaveDashboard}
          sx={{ ml: 2 }}
        >
          Save Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
