import React from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const LinkButton = ({ to, children, ...props }) => {
  return (
    <Button variant="contained" component={Link} to={to} {...props}>
      {children}
    </Button>
  );
};

export default LinkButton;