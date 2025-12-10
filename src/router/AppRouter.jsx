import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "../store/AuthContext";

import Layout from "../components/layout/Layout";

import Landing from "../pages/Landing/Landing";
import Dashboard from "../pages/Dashboard/Dashboard";
import Hosts from "../pages/Hosts/Hosts";
import Scanner from "../pages/Scanner/Scanner";
import Ports from "../pages/Ports/Ports";
import NVD from "../pages/NVD/NVD";
import Reports from "../pages/Reports/Reports";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Profile from "../pages/Profile/Profile";
import AgentManager from "../pages/Agent/AgentManager";

import TwoFactorPage from "../pages/Auth/TwoFactorPage";
import TwoFASetupPage from "../pages/Profile/TwoFASetupPage";

import SmartLandingRoute from "./SmartLandingRoute";
import { ThemeProvider } from "../utils/ThemeContext";


function PrivateRoute({ children }) {
  const { user, ready } = useAuth();
  const token = localStorage.getItem("token");

  if (!ready) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
        <div className="text-center">
          <div className="spinner-border mb-3" />
          <p>Cargando sesión...</p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>

            {/* SMART LANDING (Dependiendo del estado) */}
            <Route path="/" element={<SmartLandingRoute />} />

            {/* PÚBLICAS */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/2fa" element={<TwoFactorPage />} />

            {/* PRIVADAS */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Layout><Dashboard /></Layout>
                </PrivateRoute>
              }
            />

            <Route
              path="/hosts"
              element={
                <PrivateRoute>
                  <Layout><Hosts /></Layout>
                </PrivateRoute>
              }
            />

            <Route
              path="/scanner"
              element={
                <PrivateRoute>
                  <Layout><Scanner /></Layout>
                </PrivateRoute>
              }
            />

            <Route
              path="/ports"
              element={
                <PrivateRoute>
                  <Layout><Ports /></Layout>
                </PrivateRoute>
              }
            />

            <Route
              path="/nvd"
              element={
                <PrivateRoute>
                  <Layout><NVD /></Layout>
                </PrivateRoute>
              }
            />

            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <Layout><Reports /></Layout>
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Layout><Profile /></Layout>
                </PrivateRoute>
              }
            />

            <Route
              path="/profile/2fa"
              element={
                <PrivateRoute>
                  <Layout><TwoFASetupPage /></Layout>
                </PrivateRoute>
              }
            />

            <Route
              path="/agent"
              element={
                <PrivateRoute>
                  <Layout><AgentManager /></Layout>
                </PrivateRoute>
              }
            />

            {/* Fallback → si no existe, manda a landing */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}