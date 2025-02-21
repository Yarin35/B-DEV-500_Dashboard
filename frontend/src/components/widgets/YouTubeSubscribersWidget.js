import React from "react";
import { Typography } from "@mui/material";

const YouTubeSubscribersWidget = ({ data }) => {
  return (
    <div>
      <Typography variant="h4" style={{ color: "black" }}>YouTube Subscribers</Typography>
      <Typography variant="h6" style={{ color: "black" }}>Subscribers: {data}</Typography>
    </div>
  );
};

export default YouTubeSubscribersWidget;