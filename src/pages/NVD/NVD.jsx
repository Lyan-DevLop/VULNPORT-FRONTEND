import { useEffect, useState } from "react";
import { getVulnerabilities } from "../../api/vulnerabilities.api";

export default function NVD() {
  const [vulns, setVulns] = useState([]);

  // Filtros 
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [minScore, setMinScore] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [hostFilter, setHostFilter] = useState("all");
  const [portFilter, setPortFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    getVulnerabilities()
      .then(setVulns)
      .catch((err) => console.error("Error cargando vulnerabilidades:", err));
  }, []);

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString();
  };

  // Hosts y puertos únicos 
  const hosts = [...new Set(vulns.map((v) => v.port?.host?.ip_address).filter(Boolean))];
  const ports = [...new Set(vulns.map((v) => v.port?.port_number).filter(Boolean))];

  // FILTRO PRINCIPAL 
  const filtered = vulns.filter((v) => {
    const text = search.toLowerCase();

    if (
      text &&
      !(
        (v.cve_id || "").toLowerCase().includes(text) ||
        (v.description || "").toLowerCase().includes(text) ||
        (v.port?.service_name || "").toLowerCase().includes(text) ||
        (v.port?.host?.ip_address || "").toLowerCase().includes(text)
      )
    ) {
      return false;
    }

    if (severityFilter !== "all" && v.severity !== severityFilter) return false;

    if (minScore && v.cvss_score < Number(minScore)) return false;
    if (maxScore && v.cvss_score > Number(maxScore)) return false;

    if (hostFilter !== "all" && v.port?.host?.ip_address !== hostFilter)
      return false;

    if (portFilter && v.port?.port_number !== Number(portFilter)) return false;

    if (dateFilter) {
      const vulnDate = new Date(v.published_date);
      const filterDate = new Date(dateFilter);
      if (vulnDate < filterDate) return false;
    }

    return true;
  });

  // BADGES POR SEVERIDAD
  const severityBadge = (sev) => {
    const base = "badge text-dark";

    switch (sev) {
      case "CRITICAL":
      case "HIGH":
        return <span className="badge" style={{ background: "var(--bs-danger)", color: "#fff" }}>{sev}</span>;

      case "MEDIUM":
        return <span className="badge" style={{ background: "var(--bs-warning)" }}>{sev}</span>;

      case "LOW":
        return <span className="badge" style={{ background: "var(--bs-info)" }}>{sev}</span>;

      default:
        return <span className="badge bg-secondary">N/A</span>;
    }
  };

  return (
    <div className="container-fluid mt-4" style={{ color: "var(--text)" }}>

      <h2 className="mb-2" style={{ color: "var(--text)" }}>
        <i className="bi bi-shield-exclamation" style={{ color: "var(--bs-danger)" }}></i>{" "}
        Vulnerabilidades Detectadas (NVD)
      </h2>

      <p className="text-muted">
        CVEs detectados en los servicios y puertos encontrados durante los escaneos.
      </p>

      {/* FILTROS */}
      <div
        className="card p-3 mt-3 shadow-sm"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          color: "var(--text)",
        }}
      >
        <h5 className="mb-3" style={{ color: "var(--link-active)" }}>
          <i className="bi bi-funnel me-2"></i> Filtros avanzados
        </h5>

        <div className="row g-3">

          {/* Buscador */}
          <div className="col-md-4">
            <label className="form-label">Buscar</label>
            <input
              type="text"
              className="form-control form-control-sm"
              style={{
                background: "var(--input-bg)",
                color: "var(--input-text)",
                borderColor: "var(--input-border)",
              }}
              placeholder="Buscar CVE, descripción, host, servicio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Severidad */}
          <div className="col-md-2">
            <label className="form-label">Severidad</label>
            <select
              className="form-select form-select-sm"
              style={{
                background: "var(--input-bg)",
                color: "var(--input-text)",
                borderColor: "var(--input-border)",
              }}
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
            >
              <option value="all">Todas</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>

          {/* CVSS */}
          <div className="col-md-3">
            <label className="form-label">CVSS</label>
            <div className="d-flex gap-2">
              <input
                type="number"
                min="0"
                max="10"
                className="form-control form-control-sm"
                style={{
                  background: "var(--input-bg)",
                  color: "var(--input-text)",
                  borderColor: "var(--input-border)",
                }}
                placeholder="Min"
                value={minScore}
                onChange={(e) => setMinScore(e.target.value)}
              />
              <input
                type="number"
                min="0"
                max="10"
                className="form-control form-control-sm"
                style={{
                  background: "var(--input-bg)",
                  color: "var(--input-text)",
                  borderColor: "var(--input-border)",
                }}
                placeholder="Max"
                value={maxScore}
                onChange={(e) => setMaxScore(e.target.value)}
              />
            </div>
          </div>

          {/* Host */}
          <div className="col-md-3">
            <label className="form-label">Host afectado</label>
            <select
              className="form-select form-select-sm"
              style={{
                background: "var(--input-bg)",
                color: "var(--input-text)",
                borderColor: "var(--input-border)",
              }}
              value={hostFilter}
              onChange={(e) => setHostFilter(e.target.value)}
            >
              <option value="all">Todos</option>
              {hosts.map((h, i) => (
                <option key={i} value={h}>{h}</option>
              ))}
            </select>
          </div>

          {/* Puerto */}
          <div className="col-md-2">
            <label className="form-label">Puerto</label>
            <select
              className="form-select form-select-sm"
              style={{
                background: "var(--input-bg)",
                color: "var(--input-text)",
                borderColor: "var(--input-border)",
              }}
              value={portFilter}
              onChange={(e) => setPortFilter(e.target.value)}
            >
              <option value="">Todos</option>
              {ports.map((p, i) => (
                <option key={i} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Fecha mínima */}
          <div className="col-md-3">
            <label className="form-label">Fecha mínima</label>
            <input
              type="date"
              className="form-control form-control-sm"
              style={{
                background: "var(--input-bg)",
                color: "var(--input-text)",
                borderColor: "var(--input-border)",
              }}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* TABLA DE VULNERABILIDADES */}
      <div
        className="card p-3 mt-4 shadow"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          color: "var(--text)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="m-0" style={{ color: "var(--link-active)" }}>
            <i className="bi bi-bug me-2"></i>
            Resultados
          </h5>
          <span className="badge bg-secondary">{filtered.length} vulnerabilidades</span>
        </div>

        <div className="table-responsive" style={{ maxHeight: "650px" }}>
          <table className="table theme-table table-hover table-sm mb-0">
            <thead
              className="sticky-top"
              style={{
                background: "var(--card-bg)",
                borderBottom: "1px solid var(--card-border)",
              }}
            >
              <tr>
                <th>CVE</th>
                <th>Descripción</th>
                <th>CVSS</th>
                <th>Severidad</th>
                <th>Host</th>
                <th>Puerto</th>
                <th>Servicio</th>
                <th>Fecha</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-muted">
                    <i className="bi bi-database-slash me-2"></i>
                    No se encontraron vulnerabilidades.
                  </td>
                </tr>
              )}

              {filtered.map((v) => {
                const host = v.port?.host;
                const port = v.port;

                return (
                  <tr key={v.id}>
                    <td>
                      <a
                        href={`https://nvd.nist.gov/vuln/detail/${v.cve_id}`}
                        className="text-decoration-none"
                        style={{ color: "var(--link-active)" }}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {v.cve_id} <i className="bi bi-box-arrow-up-right"></i>
                      </a>
                    </td>

                    <td style={{ maxWidth: "380px" }}>{v.description}</td>

                    <td>{v.cvss_score ?? "—"}</td>

                    <td>{severityBadge(v.severity)}</td>

                    <td>{host?.ip_address || "—"}</td>

                    <td>{port?.port_number || "—"}</td>

                    <td>{port?.service_name || "—"}</td>

                    <td>{formatDate(v.published_date)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
