import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const loggedIn = !!localStorage.getItem("authToken"); // Check if authToken exists

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_APP}/api/v1/auth/logout`);
      localStorage.removeItem("authToken"); // Ensure the key is correct
      toast.success("Logout successful");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error); // More detailed error logging
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <Box
      width={"100%"}
      backgroundColor={theme.palette.background.alt}
      p="1rem 6%"
      textAlign={"center"}
      sx={{ boxShadow: 3, mb: 2 }}
    >
      <Typography variant="h1" color="primary" fontWeight="bold">
        AI GPT3 Clone
      </Typography>
      {loggedIn ? (
        <>
          <NavLink to="/" style={{ padding: "0 1rem" }}>
            Home
          </NavLink>
          <NavLink
            to="/login"
            onClick={handleLogout}
            style={{ padding: "0 1rem" }}
          >
            Logout
          </NavLink>
        </>
      ) : (
        <>
          <NavLink to="/register" style={{ padding: "0 1rem" }}>
            Sign Up
          </NavLink>
          <NavLink to="/login" style={{ padding: "0 1rem" }}>
            Sign In
          </NavLink>
        </>
      )}
    </Box>
  );
};

export default Navbar;
