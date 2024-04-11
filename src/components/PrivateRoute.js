import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthProvider";

export default function PrivateRoute(props) {
  const { currentUser } = useAuth();
  const { Component } = props; 
  return currentUser ? <Component /> :<Navigate to="/login" /> ;
}
