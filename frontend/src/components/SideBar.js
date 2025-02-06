import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import { Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const SideBar = ({ version }) => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleHomeClick = () => {
    navigate("/home");
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
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
        {version === "home" ? (
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={selectedTab}
            onChange={handleTabChange}
            sx={{ mb: 2 }}
          >
            <Tab label="Dashboards" />
            <Tab label="Doc" />
            <Tab label="Settings" />
          </Tabs>
        ) : (
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={selectedTab}
            onChange={handleTabChange}
            sx={{ mb: 2 }}
          >
            <Tab label="Drop Down 1" />
            <Tab label="Drop Down 2" />
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
    </Box>
  );
};

export default SideBar;
