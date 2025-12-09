import { useEffect, useState } from "react";
import { getSummary } from "../../api/summary.api";

export default function SummaryTable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getSummary()
      .then((data) =>
        data.sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0))
      )
      .then(setRows)
      .catch((err) => console.error("Error cargando summary:", err));
  }, []);

  const riskBadge = (level) => {
    if (!level) return <span className="badge bg-secondary">N/A</span>;
    const l = level.toLowerCase();

    if (l === "critical") return <span className="badge bg-danger">Crítico</span>;
    if (l === "high") return <span className="badge bg-danger">Alto</span>;
    if (l === "medium") return <span className="badge bg-warning text-dark">Medio</span>;
    if (l === "low") return <span className="badge bg-info">Bajo</span>;

    return <span className="badge bg-secondary">N/A</span>;
  };

  return (
    <div className="card bg-dark text-white shadow-lg mt-4">
      <div className="card-header border-secondary d-flex justify-content-between align-items-center">
        <h5 className="m-0">
          <i className="bi bi-diagram-3 text-success me-2"></i>
          Resumen de Red
        </h5>

        <span className="badge bg-secondary">{rows.length} host(s)</span>
      </div>

      <div className="table-responsive">
        <table className="table theme-table table-hover table-striped table-bordered align-middle mb-0">
          <thead
            className="sticky-top"
            style={{
              background: "var(--card-bg)",
              borderBottom: "1px solid var(--card-border)",
              color: "var(--text)",
            }}
          >
            <tr>
              <th>IP</th>
              <th className="text-center">Puertos</th>
              <th className="text-center">Vulnerabilidades</th>
              <th className="text-center">Riesgo</th>
              <th>Último Escaneo</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  No hay datos del resumen aún.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="fw-bold text-info">{r.ip_address}</div>
                  </td>

                  <td className="text-center fw-bold">
                    {r.total_ports ?? 0}
                  </td>

                  <td className="text-center fw-bold">
                    {r.total_vulns ?? 0}
                  </td>

                  <td className="text-center">{riskBadge(r.risk_level)}</td>

                  <td>
                    {r.scan_date ? (
                      <>
                        {new Date(r.scan_date).toLocaleDateString()}
                        <br />
                        <small className="text-muted">
                          {new Date(r.scan_date).toLocaleTimeString()}
                        </small>
                      </>
                    ) : (
                      <span className="text-muted">Nunca</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
