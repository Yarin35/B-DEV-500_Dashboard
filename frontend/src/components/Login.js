import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import GoogleLoginButton from "./GoogleLoginButton";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SnackBar from "./SnackBar.js";
import { NotificationContext } from "../context/NotificationContext.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { showNotification } = useContext(NotificationContext);

  useEffect (() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const userId = urlParams.get("userId");
    if (token && userId) {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      showNotification("Login successful", "success");
      navigate("/home");
    };
  }, [navigate, showNotification]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { email, password };
      const response = await loginUser(data);
      localStorage.setItem("token", response.token);
      localStorage.setItem("userId", response.userId);
      showNotification("Login successful", "success");
      navigate("/home");
    } catch (error) {
      showNotification("Login failed: " + error.response.data, "error");
      console.log("Error logging in:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h2" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
      </form>
      <div style={{ margin: "10px" }}>or</div>
      <GoogleOAuthProvider>
        <GoogleLoginButton />
      </GoogleOAuthProvider>
      <SnackBar />
    </Container>
  );
};

export default Login;
