import React from "react";
import { Box } from "@mui/material";

const DraggableArea = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "80vh",
        border: "2px dashed gray",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f0f0",
      }}
    >
      <Box
        sx={{
          width: "90%",
          height: "90%",
          border: "2px dotted gray",
        }}
      />
    </Box>
  );
};

export default DraggableArea;