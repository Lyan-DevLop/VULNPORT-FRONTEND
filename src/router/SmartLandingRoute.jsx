import { Navigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import Landing from "../pages/Landing/Landing";

export default function SmartLandingRoute() {
  const { user, ready } = useAuth();
  const token = localStorage.getItem("token");

  if (!ready) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
        <div className="text-center">
          <div className="spinner-border mb-3" />
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  // Si está logueado, lo manda al dashboard
  if (token && user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Caso contrario muestra la landing
  return <Landing />;
}
