import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { scanSingle, scanRange, autoScanRest } from "../../api/scanner.api";

export default function Scanner() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("single");

  const [ip, setIP] = useState("");
  const [cidr, setCIDR] = useState("192.168.1.0/24");
  const [ports, setPorts] = useState("1-1024");

  const [status, setStatus] = useState("Listo");
  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState([]);

  const [summaryModal, setSummaryModal] = useState(null);


  // PROGRESO SIMULADO
  const simulateProgress = () => {
    setProgress(0);
    let p = 0;

    const interval = setInterval(() => {
      p += Math.random() * 8;
      if (p >= 100) {
        setProgress(100);
        clearInterval(interval);
      } else {
        setProgress(Math.round(p));
      }
    }, 200);
  };

  // MANEJADORES DE ESCANEO
  const finalizeScan = (hosts, type) => {
    const labels = {
      single: "Escaneo Individual terminado exitosamente",
      range: "Escaneo de Rango terminado exitosamente",
      auto: "Auto-Scan terminado exitosamente",
    };

    setSummaryModal({
      count: hosts.length,
      title: labels[type],
      mode: type,
    });
  };

  // SINGLE SCAN
  const handleSingleREST = async () => {
    if (!ip) return;

    setStatus(`Escaneando ${ip}...`);
    setLoading(true);
    simulateProgress();

    try {
      const res = await scanSingle(ip, ports);
      const hosts = Array.isArray(res) ? res : res?.hosts || [];

      finalizeScan(hosts, "single");
      setStatus("Escaneo individual completado");
    } catch {
      setStatus("Error en escaneo individual");
      setLog((prev) => [
        { type: "error", message: "Error ejecutando escaneo individual" },
        ...prev,
      ]);
    }

    setLoading(false);
  };

  // RANGE SCAN
  const handleRangeREST = async () => {
    if (!cidr) return;

    setStatus(`Escaneando red ${cidr}...`);
    setLoading(true);
    simulateProgress();

    try {
      const res = await scanRange(cidr, ports);
      const hosts = Array.isArray(res) ? res : res?.hosts || [];

      finalizeScan(hosts, "range");
      setStatus("Escaneo de rango completado");
    } catch {
      setStatus("Error en escaneo de rango");
      setLog((prev) => [
        { type: "error", message: "Error ejecutando escaneo de rango" },
        ...prev,
      ]);
    }

    setLoading(false);
  };

  // AUTO SCAN
  const handleAutoREST = async () => {
    setStatus("Auto-Scan en ejecución...");
    setLoading(true);
    simulateProgress();

    try {
      const res = await autoScanRest();
      const hosts = Array.isArray(res) ? res : res?.hosts || [];

      finalizeScan(hosts, "auto");
      setStatus("Auto-scan completado");
    } catch {
      setStatus("Error en auto-scan");
      setLog((prev) => [
        { type: "error", message: "Error ejecutando auto-scan" },
        ...prev,
      ]);
    }

    setLoading(false);
  };

  // CONFIG
  const modeTitle = {
    single: "Escaneo Individual (REST)",
    range: "Escaneo de Rango (REST)",
    auto: "Auto-Scan Automático (REST)",
  };

  const modeIcon = {
    single: "bi-wifi",
    range: "bi-diagram-3",
    auto: "bi-lightning-charge",
  };

  const modeColor = {
    single: "primary",
    range: "warning",
    auto: "info",
  };

  // RENDER
  return (
    <div className="container-fluid mt-4" style={{ color: "var(--text)" }}>
      
      {/* TÍTULO */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">
          <i className="bi bi-broadcast-pin text-info me-2"></i>
          Escáner de Red (REST)
        </h2>
        <p className="text-muted">
          Escaneá hosts, puertos y rangos usando llamadas HTTP.
        </p>
      </div>

      {/* TABS */}
      <div
        className="card p-3 shadow-sm rounded-3"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        <ul className="nav nav-pills nav-fill">
          {["single", "range", "auto"].map((m) => (
            <li className="nav-item" key={m}>
              <button
                className={`nav-link fw-semibold ${
                  mode === m ? "active text-black" : ""
                }`}
                style={{
                  borderRadius: "10px",
                  padding: "10px",
                  background:
                    mode === m ? "var(--accent)" : "var(--card-bg-secondary)",
                  color: mode === m ? "black" : "var(--text-muted)",
                }}
                onClick={() => setMode(m)}
              >
                <i className={`bi ${modeIcon[m]} me-2`}></i>
                {modeTitle[m]}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* PANEL */}
      <div
        className="card shadow-lg p-4 mt-4 rounded-3"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--card-border)",
          borderLeft: "4px solid var(--accent)",
        }}
      >
        <h4 className="fw-bold mb-3">
          <i className={`bi ${modeIcon[mode]} text-${modeColor[mode]} me-2`}></i>
          {modeTitle[mode]}
        </h4>

        {mode === "single" && (
          <div className="row mt-3 g-3">
            <div className="col-md-4">
              <label className="form-label">IP</label>
              <input
                className="form-control"
                style={{
                  background: "var(--input-bg)",
                  color: "var(--input-text)",
                  borderColor: "var(--input-border)",
                }}
                placeholder="192.168.1.10"
                value={ip}
                onChange={(e) => setIP(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Puertos</label>
              <input
                className="form-control"
                style={{
                  background: "var(--input-bg)",
                  color: "var(--input-text)",
                  borderColor: "var(--input-border)",
                }}
                placeholder="1-1024,80,443"
                value={ports}
                onChange={(e) => setPorts(e.target.value)}
              />
            </div>

            <div className="col-md-4 d-flex align-items-end">
              <button
                className="btn btn-info w-100 fw-bold"
                onClick={handleSingleREST}
                disabled={loading}
              >
                {loading ? "Escaneando..." : "Escanear"}
              </button>
            </div>
          </div>
        )}

        {mode === "range" && (
          <div className="row mt-3 g-3">
            <div className="col-md-4">
              <label className="form-label">CIDR</label>
              <input
                className="form-control"
                style={{
                  background: "var(--input-bg)",
                  color: "var(--input-text)",
                  borderColor: "var(--input-border)",
                }}
                value={cidr}
                onChange={(e) => setCIDR(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Puertos</label>
              <input
                className="form-control"
                style={{
                  background: "var(--input-bg)",
                  color: "var(--input-text)",
                  borderColor: "var(--input-border)",
                }}
                value={ports}
                onChange={(e) => setPorts(e.target.value)}
              />
            </div>

            <div className="col-md-4 d-flex align-items-end">
              <button
                className="btn btn-warning fw-bold w-100"
                onClick={handleRangeREST}
                disabled={loading}
              >
                {loading ? "Escaneando..." : "Escanear Rango"}
              </button>
            </div>
          </div>
        )}

        {mode === "auto" && (
          <div className="mt-3">
            <button
              className="btn btn-outline-info fw-bold px-4"
              onClick={handleAutoREST}
              disabled={loading}
            >
              <i className="bi bi-lightning-charge-fill me-2"></i>
              {loading ? "Auto-scan..." : "Ejecutar Auto-Scan"}
            </button>
          </div>
        )}
      </div>

      {/* PROGRESO */}
      <div
        className="card mt-4 p-3 rounded-3"
        style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
      >
        <h5 className="fw-bold">Progreso</h5>

        <div className="progress" style={{ height: "22px" }}>
          <div
            className="progress-bar progress-bar-striped progress-bar-animated bg-info fw-bold"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>

        <p className="mt-2 small" style={{ color: "var(--text-muted)" }}>
          <strong>Estado:</strong> {status}
        </p>
      </div>

      {/* LOG */}
      <div
        className="card p-3 mt-4 rounded-3 shadow-sm"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--card-border)",
          maxHeight: 300,
          overflowY: "auto",
        }}
      >
        <h5 className="fw-bold">Log</h5>

        {log.length === 0 ? (
          <p className="text-muted small">Sin mensajes aún.</p>
        ) : (
          <ul className="small">
            {log.map((entry, idx) => (
              <li
                key={idx}
                className={`text-${
                  entry.type === "error" ? "danger" : "success"
                }`}
              >
                <strong>{entry.type.toUpperCase()}:</strong> {entry.message}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* MODAL FINAL DEL ESCANEO */}
      {summaryModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setSummaryModal(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-content"
              style={{
                background: "var(--card-bg)",
                color: "var(--text)",
                border: "1px solid var(--card-border)",
                borderRadius: "14px",
              }}
            >
              <div
                className="modal-header"
                style={{ borderBottom: "1px solid var(--card-border)" }}
              >
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-check-circle-fill text-success me-2 fs-4"></i>
                  {summaryModal.title}
                </h5>
                <button
                  className="btn-close"
                  style={{ filter: "invert(1)" }}
                  onClick={() => setSummaryModal(null)}
                ></button>
              </div>

              <div
                className="modal-footer d-flex justify-content-between"
                style={{ borderTop: "1px solid var(--card-border)" }}
              >
                <button
                  className="btn btn-secondary"
                  onClick={() => setSummaryModal(null)}
                >
                  Cerrar
                </button>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-info fw-bold"
                    onClick={() => navigate("/hosts")}
                  >
                    <i className="bi bi-list-ul me-2"></i>
                    Ver Hosts
                  </button>

                  <button
                    className="btn btn-primary fw-bold"
                    onClick={() => navigate("/")}
                  >
                    <i className="bi bi-speedometer2 me-2"></i>
                    Ir al Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
