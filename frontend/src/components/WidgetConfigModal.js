import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import axios from "axios";

const WidgetConfigModal = ({ open, onClose, onSave, widget }) => {
  const [config, setConfig] = useState({});
  const [fields, setFields] = useState([]);

  useEffect(() => {
    if (widget) {
      const fetchWidgetConfig = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3001/widgets/${widget.id}/config`
          );
          setFields(response.data.fields);
        } catch (error) {
          console.error("Error fetching widget config: ", error);
        }
      };
      fetchWidgetConfig();
    }
  }, [widget]);

  const handleChange = (field, value) => {
    setConfig((prevConfig) => ({ ...prevConfig, [field]: value }));
  };

  const handleSave = () => {
    onSave({ ...widget, config });
  };

  return (
    <Modal open={open} onClose={onClose}>
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
          Configure {widget?.name}
        </Typography>
        {fields.map((field) => (
          <TextField
            key={field}
            label={field}
            fullWidth
            margin="normal"
            value={config[field] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        ))}
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default WidgetConfigModal;
