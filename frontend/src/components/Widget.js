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
          `http://localhost:3001/widgets/${config.widget_id}/data`,
          {
            params: { ...config.config, commentCount: config.config.commentCount },
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

  console.log("Widget config:", config);
  const renderWidget = () => {
    switch (config.widget_id) {
      case 5:
        return <CurrentWeatherWidget data={data} />;
      case 6:
        return <ForecastWeatherWidget data={data} />;
      case 1:
        return <GoogleCalendarWidget data={data} />;
      case 2:
        return <YouTubeSubscribersWidget data={data} />;
      case 3:
        return <YouTubeVideoViewsWidget data={data} />;
      case 4:
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
