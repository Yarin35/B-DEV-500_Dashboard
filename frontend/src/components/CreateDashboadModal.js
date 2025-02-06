import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import Modal from "./Modal.js";

const CreateDashboardModal = ({ open, onClose, onCreate }) => {
    const [dashboardName, setDashboardName] = useState("");

    const handleCreate = () => {
        onCreate(dashboardName);
        setDashboardName("");
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Typography variant="h6" component="h2">
                Create New Dashboard
            </Typography>
            <TextField
                label="Dashboard Name"
                fullWidth
                margin="normal"
                value={dashboardName}
                onChange={(e) => setDashboardName(e.target.value)}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleCreate}
            >
                Create
            </Button>
        </Modal>
    );
};

export default CreateDashboardModal;