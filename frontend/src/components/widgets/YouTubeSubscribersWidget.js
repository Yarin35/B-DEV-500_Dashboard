import React from "react";
import { Typography } from "@mui/material";

const YouTubeSubscribersWidget = ({ data }) => {
  return (
    <div>
      <Typography variant="h4">YouTube Subscribers</Typography>
      <Typography variant="h6">Subscribers: {data.subscriberCount}</Typography>
    </div>
  );
};

export default YouTubeSubscribersWidget;