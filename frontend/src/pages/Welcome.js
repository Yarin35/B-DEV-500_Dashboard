import React from "react";
import Login from "../components/Login";
import Container from "@mui/material/Container";
import LinkButton from "../components/LinkButton";

const Welcome = () => {
  return (
    <Container>
      <div
        style={{ display: "flex", justifyContent: "flex-end", margin: "10px" }}
      >
        <LinkButton to="/register" color="primary">
          Register
        </LinkButton>
      </div>
      <Login />
    </Container>
  );
};

export default Welcome;
