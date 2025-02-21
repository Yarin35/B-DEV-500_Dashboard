import React from "react";
import { Typography } from "@mui/material";

const GoogleCalendarEventsWidget = ({ data }) => {
  return (
    <div>
      <Typography variant="h4" style={{ color: "black" }}>Google Calendar Events</Typography>
      {data.items.map((event, index) => (
        <div key={index}>
          <Typography variant="h6" style={{ color: "black" }}>{event.summary}</Typography>
          <Typography variant="body1" style={{ color: "black" }}>{event.start.dateTime}</Typography>
        </div>
      ))}
    </div>
  );
};

export default GoogleCalendarEventsWidget;