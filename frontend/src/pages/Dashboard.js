import React, { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import SideBar from "../components/SideBar.js";
import DraggableArea from "../components/DraggableArea.js";
import axios from "axios";
import { useParams } from "react-router-dom";

const Dashboard = () => {
  const { id } = useParams();
  const [widgets, setWidgets] = useState([]);

  useEffect(() => {
    const fetchWidgets = async () => {
      try {
        const response = await axios.get("http://localhost:3001/widgets");
        setWidgets(response.data);
      } catch (error) {
        console.error("Error fetching widgets:", error);
      }
    };
    fetchWidgets();
  }, []);

  useEffect(() => {}, [widgets]);

  useEffect(() => {
    const fetchDashboardContent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/dashboard/${id}/content`
        );
        setWidgets(response.data);
      } catch (error) {
        console.error("Error fetching dashboard content:", error);
      }
    };
    fetchDashboardContent();
  }, [id]);

  const handleSaveDashboard = async () => {
    try {
      await axios.post(`http://localhost:3001/dashboard/${id}/widgets`, {
        widgetId: widgets.map(widget => widget.id),
      });
      console.log("Dashboard content saved successfully");
    } catch (error) {
      console.error("Error saving dashboard content:", error);
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
          <DraggableArea dashboardId={id}widgets={widgets} />
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveDashboard}
          sx={{ mt: 2 }}
        >
          Save Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
