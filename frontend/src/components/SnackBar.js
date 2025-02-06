import React, { useContext } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { NotificationContext } from "../context/NotificationContext.js";

const SnackBar = () => {
  const { notification, hideNotification } = useContext(NotificationContext);

  return (
    <Snackbar open={notification.open} autoHideDuration={5000} onClose={hideNotification}>
      <Alert onClose={hideNotification} severity={notification.severity} sx={{ width: "100%" }}>
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default SnackBar;