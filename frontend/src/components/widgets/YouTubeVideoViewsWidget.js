import React from "react";
import { Typography } from "@mui/material";

const YouTubeVideoViewsWidget = ({ data }) => {
  return (
    <div>
      <Typography variant="h4" style={{ color: "black" }}>YouTube Video Views</Typography>
      <Typography variant="h6" style={{ color: "black" }}>Views: {data}</Typography>
    </div>
  );
};

export default YouTubeVideoViewsWidget;