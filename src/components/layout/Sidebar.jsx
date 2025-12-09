import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Server,
  Network,
  Radio,
  FileWarning,
  FileText,
  Bot,
  Menu,
  X,
} from "lucide-react";
import { useState, useContext } from "react";
import { ThemeContext } from "../../utils/ThemeContext";

export default function Sidebar() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useContext(ThemeContext);

  const menu = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { path: "/hosts", label: "Hosts", icon: <Server size={18} /> },
    { path: "/ports", label: "Puertos", icon: <Network size={18} /> },
    { path: "/scanner", label: "Escáner", icon: <Radio size={18} /> },
    { path: "/nvd", label: "NVD", icon: <FileWarning size={18} /> },
    { path: "/reports", label: "Reportes", icon: <FileText size={18} /> },
    { path: "/agent", label: "Agentes", icon: <Bot size={18} /> },
  ];

  return (
    <div
      className="sidebar d-flex flex-column p-3 shadow"
      style={{
        width: collapsed ? 70 : 230,        // 👈 NO CAMBIO TUS TAMAÑOS
        minHeight: "100vh",
        transition: "0.3s",
        position: "relative",

        // 🎨 Adaptado al tema (sin tocar tamaños)
        backgroundColor: "var(--sidebar-bg)",
        borderRight: "1px solid var(--sidebar-border)",
        color: "var(--text)",
      }}
    >
      {/* BOTÓN COLAPSAR */}
      <button
        className="btn btn-sm btn-outline-secondary mb-3 align-self-end"
        onClick={() => setCollapsed(!collapsed)}
        style={{
          color: "var(--text)",
          borderColor: "var(--card-border)",
        }}
      >
        {collapsed ? <Menu size={20} /> : <X size={20} />}
      </button>

      {/* LOGO */}
      {!collapsed && (
        <h4 className="text-center mb-4 fw-bold" style={{ color: "var(--text)" }}>
          VULNPORTS
        </h4>
      )}

      {/* MENU */}
      <ul className="nav flex-column">
        {menu.map((m) => {
          const active = pathname === m.path;

          return (
            <li key={m.path} className="nav-item mb-2">
              <Link
                to={m.path}
                className={`nav-link d-flex align-items-center gap-2 px-2 py-2 rounded
                  ${active ? "active" : ""}
                `}
                style={{
                  // 🎨 Se adapta al tema
                  color: active ? "var(--link-active)" : "var(--link)",
                  backgroundColor: active
                    ? "rgba(59,130,246,0.12)"  // tono del link-active
                    : "transparent",

                  fontSize: collapsed ? "0" : "14px", // 👈 NO CAMBIADO
                  transition: "0.2s",
                }}
              >
                {/* Icono siempre visible */}
                <span className="sidebar-icon" style={{ color: "var(--text)" }}>
                  {m.icon}
                </span>

                {/* Texto solo si NO está colapsado */}
                {!collapsed && <span>{m.label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
