// src/pages/Landing/Landing.jsx
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="landing-wrapper">
      {/* Fondo animado minimal */}
      <div className="landing-bg">
        <div className="landing-orbit orbit-1"></div>
        <div className="landing-orbit orbit-2"></div>
        <div className="landing-orbit orbit-3"></div>

        <div className="landing-particles">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container landing-content">
        <div className="row align-items-center gy-4">
          {/* LADO IZQUIERDO: TEXTO / INFO DEL PROYECTO */}
          <div className="col-lg-6">
            <div className="landing-hero">
              <span className="badge landing-badge">
                <i className="bi bi-shield-lock-fill me-2"></i>
                Plataforma de Seguridad de Red
              </span>

              <h1 className="landing-title mt-3 mb-3">
                VULNPORTS
                <span className="landing-title-accent"> Security</span>
              </h1>

              <p className="landing-subtitle mb-4">
                Monitorea tu infraestructura, detecta servicios expuestos,
                vincula vulnerabilidades NVD y evalúa el riesgo de cada host.
                Todo centralizado en un panel con soporte para agentes
                instalados en endpoints.
              </p>

              <div className="landing-highlights row g-3 mb-4">
                <div className="col-sm-6">
                  <div className="landing-highlight-card">
                    <i className="bi bi-radar me-2"></i>
                    Escaneo de red, puertos y servicios
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="landing-highlight-card">
                    <i className="bi bi-bug-fill me-2"></i>
                    Integración con NVD (CVE, CVSS, severidad)
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="landing-highlight-card">
                    <i className="bi bi-diagram-3-fill me-2"></i>
                    Perfil de riesgo por host y resumen de red
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="landing-highlight-card">
                    <i className="bi bi-robot me-2"></i>
                    Agente para control remoto de puertos
                  </div>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-3">
                <a
                  href="/public/VulnPortsAgent.zip" // .exe del agente
                  className="btn btn-primary landing-btn-main"
                  download
                >
                  <i className="bi bi-download me-2"></i>
                  Descargar Agente (.exe)
                </a>

                <Link
                  to="/login"
                  className="btn btn-outline-light landing-btn-secondary"
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Ir al Panel de Control
                </Link>
              </div>

              <p className="landing-note mt-3 text-muted small">
                El agente permite reportar procesos, puertos abiertos y aplicar
                acciones remotas desde el panel VULNPORTS.
              </p>
            </div>
          </div>

          {/* LADO DERECHO: TARJETA DE ACCESO RÁPIDO */}
          <div className="col-lg-5 offset-lg-1">
            <div className="landing-card shadow-lg">
              <div className="landing-card-header d-flex align-items-center mb-3">
                <div className="landing-avatar me-3">
                  <i className="bi bi-shield-check"></i>
                </div>
                <div>
                  <h5 className="m-0">Centro de Acceso</h5>
                  <small className="text-muted">
                    Gestiona tu red desde un solo lugar
                  </small>
                </div>
              </div>

              <ul className="landing-feature-list mb-4">
                <li>
                  <i className="bi bi-check-circle-fill me-2 text-success"></i>
                  Escaneo REST de hosts, rangos y auto-scan inteligente
                </li>
                <li>
                  <i className="bi bi-check-circle-fill me-2 text-success"></i>
                  Visualización de puertos, servicios y sistemas operativos
                </li>
                <li>
                  <i className="bi bi-check-circle-fill me-2 text-success"></i>
                  Vinculación de CVEs, severidad y CVSS por puerto
                </li>
                <li>
                  <i className="bi bi-check-circle-fill me-2 text-success"></i>
                  Autenticación 2FA (TOTP / correo) para acceso seguro
                </li>
              </ul>

              <div className="d-grid gap-2 mb-3">
                <Link
                  to="/login"
                  className="btn btn-primary fw-semibold landing-cta"
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Iniciar sesión en VULNPORTS
                </Link>

                <Link
                  to="/register"
                  className="btn btn-outline-light fw-semibold"
                >
                  <i className="bi bi-person-plus-fill me-2"></i>
                  Crear cuenta
                </Link>
              </div>

              <div className="landing-metadata small text-muted">
                <div className="d-flex justify-content-between">
                  <span>
                    <i className="bi bi-hdd-network me-1"></i>
                    Monitoreo continuo
                  </span>
                  <span>
                    <i className="bi bi-lock-fill me-1"></i>
                    Datos protegidos con 2FA
                  </span>
                </div>
              </div>
            </div>

            <p className="text-muted small text-center mt-3">
              Para vincular un endpoint, instala el agente, ejecútalo y luego
              visualiza la información desde el panel de{" "}
              <strong>Hosts</strong> y <strong>Agentes</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
