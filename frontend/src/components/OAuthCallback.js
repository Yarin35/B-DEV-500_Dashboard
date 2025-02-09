import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../context/NotificationContext";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { showNotification } = useContext(NotificationContext);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const userId = urlParams.get("userId");
    const accessToken = urlParams.get("accessToken");
    const dashboardId = urlParams.get("dashboardId");

    console.log('urlParams are: ', urlParams);
    if (token && userId && accessToken) {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("accessToken", accessToken);
      showNotification("Login successful", "success");
      if (dashboardId) {
        navigate(`/dashboard/${dashboardId}`);
      } else {
        navigate('/home');
      }
    }
  }, [navigate, showNotification]);

  return <div>Loading...</div>;
};

export default OAuthCallback;