import React from "react";
import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { userStore } from "./userStore";

const ProtectedRoute = observer(({ children }) => {
  return userStore.isLogin ? children : <Navigate to="/login" replace />;
});

export default ProtectedRoute;
