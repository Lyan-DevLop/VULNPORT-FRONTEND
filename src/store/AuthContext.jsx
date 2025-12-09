import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Estados para la fase 2 del login (2FA)
  const [twoFAPending, setTwoFAPending] = useState(false);
  const [twoFAUserId, setTwoFAUserId] = useState(null);
  const [twoFAMethods, setTwoFAMethods] = useState([]);

  // ======================================================
  // 🟢 CARGAR USUARIO AL RECARGAR PÁGINA
  // ======================================================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setReady(true);
      return;
    }

    axiosClient
      .get("/users/me")
      .then((res) => {
        setUser(res.data);

        // Si ya está logueado, no pedimos 2FA otra vez
        setTwoFAPending(false);
        setTwoFAUserId(null);
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  // ======================================================
  // 🔐 LOGIN — FASE 1
  // ======================================================
  async function login(username, password) {
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    const res = await axiosClient.post("/auth/login", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    // Requiere 2FA
    if (res.data.needs_2fa === true) {
      setTwoFAPending(true);
      setTwoFAUserId(res.data.user_id);
      setTwoFAMethods(res.data.methods);
      return { needs2FA: true };
    }

    // Login normal
    localStorage.setItem("token", res.data.access_token);
    localStorage.setItem("refresh_token", res.data.refresh_token);

    const me = await axiosClient.get("/users/me");
    setUser(me.data);

    return { needs2FA: false };
  }

  // ======================================================
  // 🔑 LOGIN — FASE 2 (VERIFICAR CÓDIGO)
  // ======================================================
  async function verify2FA(code, method) {
    const res = await axiosClient.post("/auth/login/2fa", {
      user_id: twoFAUserId,
      code,
      method,
    });

    // Guardar tokens
    localStorage.setItem("token", res.data.access_token);
    localStorage.setItem("refresh_token", res.data.refresh_token);

    // Cargar usuario ya autenticado
    const me = await axiosClient.get("/users/me");
    setUser(me.data);

    // limpiar estado 2FA
    setTwoFAPending(false);
    setTwoFAUserId(null);

    return true;
  }

  // ======================================================
  // 📝 REGISTRO
  // ======================================================
  async function register(username, email, password) {
    const res = await axiosClient.post("/users/", {
      username,
      email,
      password,
    });

    return res.data;
  }

  // ======================================================
  // 🚪 LOGOUT
  // ======================================================
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");

    setUser(null);
    setTwoFAPending(false);
    setTwoFAUserId(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        ready,
        login,
        logout,
        register,
        verify2FA,
        twoFAPending,
        twoFAUserId,
        twoFAMethods,
        setUser, // 👉 importante para actualizar user desde el setup 2FA
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
