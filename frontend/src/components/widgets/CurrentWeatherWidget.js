import React from "react";
import { Typography } from "@mui/material";

const CurrentWeatherWidget = ({ data }) => {
  const temperature = data.main.temp - 273.15; // Convert from Kelvin to Celsius
  const condition = data.weather[0].description;

  return (
    <div>
      <Typography variant="h4">Current Weather</Typography>
      <Typography variant="h6">Temperature: {temperature.toFixed(2)}°C</Typography>
      <Typography variant="body1">Condition: {condition}</Typography>
    </div>
  );
};

export default CurrentWeatherWidget;