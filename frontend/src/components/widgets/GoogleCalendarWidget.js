import React from "react";
import { Typography } from "@mui/material";

const GoogleCalendarWidget = ({ data }) => {
  return (
    <div>
      <Typography variant="h4">Google Calendar Events</Typography>
      {data.items.map((event, index) => (
        <div key={index}>
          <Typography variant="h6">{event.summary}</Typography>
          <Typography variant="body1">{event.start.dateTime}</Typography>
        </div>
      ))}
    </div>
  );
};

export default GoogleCalendarWidget;