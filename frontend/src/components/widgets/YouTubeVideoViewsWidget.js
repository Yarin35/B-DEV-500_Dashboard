import React from "react";
import { Typography } from "@mui/material";

const YouTubeVideoViewsWidget = ({ data }) => {
  return (
    <div>
      <Typography variant="h4">YouTube Video Views</Typography>
      <Typography variant="h6">Views: {data.viewCount}</Typography>
    </div>
  );
};

export default YouTubeVideoViewsWidget;