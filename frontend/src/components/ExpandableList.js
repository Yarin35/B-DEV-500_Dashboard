import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  List,
  ListItem,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import DraggableWidget from "./DraggableWidget.js";

const ExpandableList = ({ title, items }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <Box sx={{ bgcolor: "gray.200", borderRadius: 1, mb: 1 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={1}
      >
        <Typography variant="h6" sx={{ color: "gray" }}>
          {title}
        </Typography>
        <IconButton onClick={handleToggle}>
          {expanded ? (
            <ExpandLess sx={{ color: "gray" }} />
          ) : (
            <ExpandMore sx={{ color: "gray" }} />
          )}
        </IconButton>
      </Box>
      <Collapse in={expanded}>
        <List>
          {items.map((item, index) => (
            <ListItem key={index}>
              <DraggableWidget widget={item} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Box>
  );
};

export default ExpandableList;
