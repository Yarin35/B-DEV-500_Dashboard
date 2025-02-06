import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from "../services/api";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { NotificationContext } from '../context/NotificationContext.js';

const Register = () => {
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();
  const { showNotification } = React.userContext(NotificationContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { email, username, password };
      const response = await registerUser(data);
      localStorage.setItem("token", response.token);
      showNotification("Registration successful", "success");
      navigate("/home");
    } catch (error) {
        showNotification("Registration failed: " + error.response.data, "error");
        console.log('Error registering user:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h2" gutterBottom>
        Register
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
          label="Username"
          type="text"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
            Register
        </Button>
      </form>
    </Container>
  );
};

export default Register;
