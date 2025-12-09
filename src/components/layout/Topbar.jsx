import { useAuth } from "../../store/AuthContext";
import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../utils/ThemeContext";

export default function Topbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const username = user?.username || "Usuario";
  const email = user?.email || "Sin correo";
  const avatarLetter = username.charAt(0).toUpperCase();

  // Cierra dropdown al hacer click afuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="px-3 shadow d-flex justify-content-between align-items-center"
      style={{
        height: "64px",               // 🔥 Mantiene altura consistente
        background: "var(--navbar-bg)",
        borderBottom: "1px solid var(--navbar-border)",
        color: "var(--text)",
        transition: "0.25s",
      }}
    >
      {/* BRAND */}
      <span className="h4 m-0" style={{ color: "var(--text)" }}>
        VULNPORTS Panel
      </span>

      <div className="d-flex align-items-center gap-3">

        {/* 🔆🌙 TOGGLE TEMA */}
        <button
          onClick={toggleTheme}
          className="btn d-flex align-items-center"
          style={{
            borderRadius: "8px",
            padding: "6px 12px",
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            color: "var(--text)",
            fontSize: "0.9rem",
          }}
        >
          {theme === "dark" ? (
            <>
              <i className="bi bi-sun-fill"></i>
              <span className="ms-2">Claro</span>
            </>
          ) : (
            <>
              <i className="bi bi-moon-stars-fill"></i>
              <span className="ms-2">Oscuro</span>
            </>
          )}
        </button>

        {/* AVATAR + DROPDOWN */}
        <div
          className="d-flex align-items-center position-relative"
          ref={dropdownRef}
          style={{ color: "var(--text)" }}
        >
          {/* Avatar */}
          <div
            onClick={() => setOpen(!open)}
            className="d-flex justify-content-center align-items-center bg-info text-dark fw-bold rounded-circle"
            style={{
              width: 38,         // 🔥 Mantiene tamaño original
              height: 38,
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            {avatarLetter}
          </div>

          <span
            className="ms-2 small"
            style={{ cursor: "pointer", userSelect: "none" }}
            onClick={() => setOpen(!open)}
          >
            {username}
          </span>

          {/* Dropdown */}
          {open && (
            <div
              className="position-absolute border rounded shadow-lg"
              style={{
                top: "50px",
                right: 0,
                minWidth: "220px",
                background: "var(--card-bg)",
                borderColor: "var(--card-border)",
                color: "var(--text)",
                zIndex: 50,
              }}
            >
              {/* Header */}
              <div
                className="p-3 border-bottom"
                style={{ borderColor: "var(--card-border)" }}
              >
                <strong>{username}</strong>
                <br />
                <span className="text-muted small">{email}</span>
              </div>

              <button
                className="dropdown-item py-2 px-3"
                style={{ color: "var(--text)" }}
                onClick={() => {
                  setOpen(false);
                  navigate("/profile");
                }}
              >
                <i className="bi bi-person me-2"></i> Perfil
              </button>

              <button
                className="dropdown-item py-2 px-3"
                style={{ color: "var(--text)" }}
                onClick={() => alert("Configuración próximamente")}
              >
                <i className="bi bi-gear me-2"></i> Configuración
              </button>

              <button
                className="dropdown-item py-2 px-3 d-flex align-items-center"
                style={{ color: "var(--text)" }}
                onClick={() => {
                  setOpen(false);
                  navigate("/profile/2fa");
                }}
              >
                <i
                  className={`bi ${
                    user?.is_2fa_enabled
                      ? "bi-shield-lock-fill text-success"
                      : "bi-shield-slash text-warning"
                  } me-2`}
                  style={{ fontSize: "1.1rem" }}
                ></i>

                {user?.is_2fa_enabled ? "2FA Activado" : "Configurar 2FA"}
              </button>

              <button
                className="dropdown-item text-danger py-2 px-3 border-top"
                style={{ borderColor: "var(--card-border)" }}
                onClick={logout}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
