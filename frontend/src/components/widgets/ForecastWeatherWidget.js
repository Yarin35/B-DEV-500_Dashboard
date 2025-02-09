import React from "react";
import { Box, Typography } from "@mui/material";
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiThunderstorm } from "react-icons/wi";

const getWeatherIcon = (condition) => {
  switch (condition.toLowerCase()) {
    case "clear":
    case "sunny":
      return <WiDaySunny size={48} />;
    case "clouds":
    case "cloudy":
      return <WiCloud size={48} />;
    case "rain":
    case "drizzle":
      return <WiRain size={48} />;
    case "snow":
      return <WiSnow size={48} />;
    case "thunderstorm":
      return <WiThunderstorm size={48} />;
    default:
      return <WiCloud size={48} />;
  }
};

const ForecastWeatherWidget = ({ data }) => {
  const forecast = data.list.slice(0, 5).map((item) => ({
    date: item.dt_txt,
    temperature: item.main.temp - 273.15, // Convert from Kelvin to Celsius
    condition: item.weather[0].main,
  }));

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        5-Day Forecast
      </Typography>
      <Box display="flex" justifyContent="space-between">
        {forecast.map((day, index) => (
          <Box
            key={index}
            sx={{
              width: "18%",
              backgroundColor: "#f0f0f0",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              textAlign: "center",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography variant="h6">{day.date.split(" ")[0]}</Typography>
            {getWeatherIcon(day.condition)}
            <Typography variant="body1">
              {day.temperature.toFixed(2)}°C
            </Typography>
            <Typography variant="body1">{day.condition}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

ForecastWeatherWidget.defaultWidth = 600;
ForecastWeatherWidget.defaultHeight = 300;
export default ForecastWeatherWidget;