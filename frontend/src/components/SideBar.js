import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Modal,
  Typography,
  Button,
  Tooltip,
} from "@mui/material";
import { Home, Warning } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getServices, getUserServices } from "../services/services.js";
import ExpandableList from "./ExpandableList.js";
import axios from "axios";
import { NotificationContext } from "../context/NotificationContext.js";

const SideBar = ({ version, dashboardId }) => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [services, setServices] = useState([]);
  const [userServices, setUserServices] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [expandedService, setExpandedService] = useState(null);
  const userId = localStorage.getItem("userId");
  const { showNotification } = useContext(NotificationContext);

  useEffect(() => {
    const fetchServices = async () => {
      const allServices = await getServices();
      const userServices = await getUserServices(userId);
      setServices(allServices);
      setUserServices(userServices);
    };
    fetchServices();
  }, [userId]);

  const handleHomeClick = () => {
    navigate("/home");
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    const service = services[newValue];
    if (!isServiceSubscribed(service.id)) {
      setSelectedService(service);
      setOpenModal(true);
    } else {
      setExpandedService(service.id === expandedService ? null : service.id);
    }
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
    handleMenuClose();
  };

  const handleServiceClick = (service) => {
    if (!isServiceSubscribed(service.id)) {
      setSelectedService(service);
      setOpenModal(true);
    } else {
      setExpandedService(service.id === expandedService ? null : service.id);
    }
  };

  const isServiceSubscribed = (serviceId) => {
    const service = services.find((service) => service.id === serviceId);
    if (service && !service.registration_required) {
      return true;
    }
    return userServices.some((service) => service.id === serviceId);
  };

  const handleSubscribe = async () => {
    if (!selectedService) {
      console.error("No service selected");
      return;
    }

    const serviceId = selectedService.id;
    const userId = localStorage.getItem("userId");

    if (selectedService.name === "Intra Epitech") {
      try {
        const response = await axios.get(
          `http://localhost:8080/auth/microsoft`,
          {
            params: { serviceId, userId, dashboardId },
          }
        );

        if (response.data && response.data.authUrl) {
          console.log(
            "Redirecting to Microsoft OAuth URL:",
            response.data.authUrl
          );
          window.location.href = response.data.authUrl;
        } else {
          console.error("Failed to retrieve Microsoft OAuth URL");
        }
      } catch (error) {
        console.error("Error subscribing to service:", error);
      }
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/auth/google`, {
        params: { serviceId, userId, dashboardId },
      });

      if (response.data && response.data.authUrl) {
        console.log("Redirecting to OAuth URL:", response.data.authUrl);
        window.location.href = response.data.authUrl;
      } else {
        console.error("Failed to retrieve OAuth URL");
      }
    } catch (error) {
      console.error("Error subscribing to service:", error);
    }
  };

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const userId = urlParams.get("userId");
    const accessToken = urlParams.get("accessToken");
    const dashboardId = urlParams.get("dashboardId");

    if (token && userId && accessToken) {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("accessToken", accessToken);
      setUserServices([...userServices, { id: selectedService.id }]);
      showNotification("Subscription successful", "success");
      navigate(`/dashboard/${dashboardId}`); // Redirect to dashboard or any other page
    }
  }, [
    navigate,
    showNotification,
    setUserServices,
    selectedService,
    userServices,
  ]);

  return (
    <Box
      sx={{
        width: 250,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        bgcolor: "background.paper",
        boxShadow: 3,
        position: "fixed",
        left: 0,
        top: 0,
        p: 2,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <IconButton color="primary" onClick={handleHomeClick} sx={{ mb: 2 }}>
          <Home />
        </IconButton>
        {version === "dashboard" && (
          <Box sx={{ mb: 2 }}>
            {services.map((service) => (
              <Tooltip
                key={service.id}
                title={
                  !isServiceSubscribed(service.id)
                    ? "Service unavailable. Please subscribe"
                    : ""
                }
                placement="right"
              >
                <Box>
                  {isServiceSubscribed(service.id) ? (
                    <ExpandableList
                      title={service.name}
                      items={service.widgets}
                      sx={{ bgcolor: "gray.100" }}
                    />
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        bgcolor: "gray.100",
                        p: 1,
                        mb: 1,
                        borderRadius: 1,
                        color: "gray",
                      }}
                      onClick={() => handleServiceClick(service)}
                    >
                      <Typography>{service.name}</Typography>
                      <Warning color="error" />
                    </Box>
                  )}
                </Box>
              </Tooltip>
            ))}
          </Box>
        )}
        {version === "home" && (
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={selectedTab}
            onChange={handleTabChange}
            sx={{ mb: 2 }}
          >
            <Tab label="Dashboard" />
            <Tab label="Settings" />
            <Tab label="Documentation" />
          </Tabs>
        )}
      </Box>
      <Box>
        <IconButton onClick={handleProfileClick}>
          <Avatar alt="Client Name" src="/static/images/avatar/1.jpg" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleProfile}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Subscribe to {selectedService?.name}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubscribe}
            sx={{ mt: 2 }}
          >
            Subscribe
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default SideBar;
