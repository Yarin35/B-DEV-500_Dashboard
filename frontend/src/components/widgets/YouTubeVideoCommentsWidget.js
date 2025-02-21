import React from "react";
import { Typography } from "@mui/material";

const YouTubeVideoCommentsWidget = ({ data }) => {
  console.log('data:', data);
  return ( 
    <div>
      <Typography variant="h4" style={{ color: "black" }}>YouTube Video Comments</Typography>
      {data.map((comment, index) => (
        <Typography key={index} variant="body1" style={{ color: "black" }} dangerouslySetInnerHTML={{ __html: comment }} />
      ))}
    </div>
  );
};

export default YouTubeVideoCommentsWidget;