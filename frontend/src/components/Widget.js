import React, { useEffect, useState } from "react";
import axios from "axios";
import CurrentWeatherWidget from "./widgets/CurrentWeatherWidget.js";
import ForecastWeatherWidget from "./widgets/ForecastWeatherWidget.js";
import GoogleCalendarWidget from "./widgets/GoogleCalendarWidget.js";
import YouTubeSubscribersWidget from "./widgets/YouTubeSubscribersWidget.js";
import YouTubeVideoViewsWidget from "./widgets/YouTubeVideoViewsWidget.js";
import YouTubeVideoCommentsWidget from "./widgets/YouTubeVideoCommentsWidget.js";
import { Box } from "@mui/material";

const Widget = ({ config }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `http://localhost:3001/widgets/${config.id}/data`,
          {
            params: config.config,
            headers: {
              Authorization: `Bearer ${token}`,
              "X-User-Id": userId,
            },
          }
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching widget data:", error);
      }
    };

    fetchData();
  }, [config]);

  console.log("Config is: ", config);
  const renderWidget = () => {
    switch (config.name) {
      case "Current Weather":
        return <CurrentWeatherWidget data={data} />;
      case "Forecast Weather":
        return <ForecastWeatherWidget data={data} />;
      case "Google Calendar":
        return <GoogleCalendarWidget data={data} />;
      case "YouTube Subscribers":
        return <YouTubeSubscribersWidget data={data} />;
      case "YouTube Video Views":
        return <YouTubeVideoViewsWidget data={data} />;
      case "YouTube Video Comments":
        return <YouTubeVideoCommentsWidget data={data} />;
      default:
        return <div>Widget not found</div>;
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f0f0f0",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        height: "100%",
        width: "100%",
        overflow: "auto",
      }}
    >
      {data ? renderWidget() : "Loading..."}
    </Box>
  );
};

export default Widget;
