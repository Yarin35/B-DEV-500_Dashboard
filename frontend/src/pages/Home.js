import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Link as MuiLink,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar.js";
import {
  createDashboard,
  getDashboards,
  updateDashboard,
  deleteDashboard,
} from "../services/dashboard.js";
import CreateDashboardModal from "../components/CreateDashboadModal.js";

const Home = () => {
  const userId = localStorage.getItem("userId");
  const [dashboards, setDashboards] = useState([]);
  const [editDashboardId, setEditDashboardId] = useState(null);
  const [editDashboardName, setEditDashboardName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboards = async () => {
      const data = await getDashboards(userId);
      setDashboards(data);
    };
    fetchDashboards();
  }, [userId]);

  const handleCreateDashboard = async (name) => {
    const newDashboard = await createDashboard({
      name,
      userId,
    });
    setDashboards([...dashboards, newDashboard]);
  };

  const handleUpdateDashboard = async (id) => {
    await updateDashboard(id, { name: editDashboardName });
    setDashboards(
      dashboards.map((d) =>
        d.id === id ? { ...d, name: editDashboardName } : d
      )
    );
    setEditDashboardId(null);
    setEditDashboardName("");
  };

  const handleDeleteDashboard = async (id) => {
    await deleteDashboard(id);
    setDashboards(dashboards.filter((d) => d.id !== id));
  };

  const handleDashboardClick = (id) => {
    navigate(`/dashboard/${id}`);
  };

  return (
    <Box display="flex">
      <SideBar version="home" />
      <Box flexGrow={1} p={3}>
        <Typography variant="h4">Welcome to your home page.</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          This application allows you to create and manage dashboards with
          various widgets. You can integrate services like Google Calendar,
          YouTube, and Weather if you agree on giving the required access to your accounts (e.g. such as read mail to get a list of your mail).
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <MuiLink component={Link} to="/privacy-policy" target="_blank" rel="noopener">
            Privacy Policy
          </MuiLink>
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsModalOpen(true)}
          sx={{ mt: 2 }}
        >
          Create Dashboard
        </Button>
        <List>
          {dashboards.map((dashboard) => (
            <ListItem key={dashboard.id}>
              {editDashboardId === dashboard.id ? (
                <TextField
                  value={editDashboardName}
                  onChange={(e) => setEditDashboardName(e.target.value)}
                  onBlur={() => handleUpdateDashboard(dashboard.id)}
                />
              ) : (
                <ListItemText
                  primary={dashboard.name}
                  onClick={() => handleDashboardClick(dashboard.id)}
                  sx={{ cursor: "pointer" }}
                />
              )}
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  setEditDashboardId(dashboard.id);
                  setEditDashboardName(dashboard.name);
                }}
              >
                <Edit />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteDashboard(dashboard.id);
                }}
              >
                <Delete />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <CreateDashboardModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateDashboard}
        />
      </Box>
    </Box>
  );
};

export default Home;
