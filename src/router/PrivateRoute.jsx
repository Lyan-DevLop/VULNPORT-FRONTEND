import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, ready, twoFAPending } = useAuth();
  const token = localStorage.getItem("token");
  const location = useLocation();

  // Esperar carga inicial del contexto
  if (!ready) {
    return (
      <div className="text-center text-white p-5">
        <div className="spinner-border text-info"></div>
        <p className="mt-2">Cargando sesión...</p>
      </div>
    );
  }

  // ⛔ El usuario NO tiene token → login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 🔐 Usuario hizo login fase 1 pero falta 2FA → redirigir
  if (twoFAPending && location.pathname !== "/2fa") {
    return <Navigate to="/2fa" replace />;
  }

  // ⏳ Hay token pero user aún no carga → esperar
  if (token && !user) {
    return (
      <div className="text-center text-white p-5">
        <div className="spinner-border text-info"></div>
        <p className="mt-2">Verificando sesión...</p>
      </div>
    );
  }

  // 🎉 Usuario autenticado
  return children;
}




