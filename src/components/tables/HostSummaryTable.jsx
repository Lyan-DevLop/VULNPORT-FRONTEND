import { useEffect, useState } from "react";
import { getMyHosts } from "../../api/hosts.api";
import * as XLSX from "xlsx";

export default function HostSummaryTable() {
  const [hosts, setHosts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedHost, setSelectedHost] = useState(null);

  const [filterOS, setFilterOS] = useState("all");
  const [filterRisk, setFilterRisk] = useState("all");
  const [minPorts, setMinPorts] = useState("");
  const [maxPorts, setMaxPorts] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    getMyHosts().then(setHosts).catch(console.error);
  }, []);

  const osIcon = (os) => {
    if (!os) return "bi-question-circle text-secondary";
    os = os.toLowerCase();
    if (os.includes("windows")) return "bi-windows text-primary";
    if (os.includes("linux")) return "bi-terminal text-warning";
    if (os.includes("mac")) return "bi-apple text-light";
    return "bi-cpu text-secondary";
  };

  const riskBadge = (count) => {
    if (count >= 2) return <span className="badge bg-danger">Alto ({count})</span>;
    if (count === 1) return <span className="badge bg-warning text-dark">Medio</span>;
    return <span className="badge bg-info text-dark">Bajo</span>;
  };

  const filtered = hosts.filter((h) => {
    const text = search.toLowerCase();

    const matchText =
      h.ip_address?.toLowerCase().includes(text) ||
      (h.hostname || "").toLowerCase().includes(text);

    const matchOS =
      filterOS === "all" ||
      (filterOS === "windows" && h.os_detected?.toLowerCase().includes("windows")) ||
      (filterOS === "linux" && h.os_detected?.toLowerCase().includes("linux")) ||
      (filterOS === "mac" && h.os_detected?.toLowerCase().includes("mac")) ||
      (filterOS === "unknown" && (!h.os_detected || h.os_detected === ""));

    const risk =
      h.high_risk_count >= 2 ? "alto" : h.high_risk_count === 1 ? "medio" : "bajo";

    const matchRisk = filterRisk === "all" || filterRisk === risk;

    const matchPorts =
      (!minPorts || h.total_ports >= parseInt(minPorts)) &&
      (!maxPorts || h.total_ports <= parseInt(maxPorts));

    const scanDate = h.scan_date ? new Date(h.scan_date) : null;
    const matchDate =
      (!dateFrom || scanDate >= new Date(dateFrom)) &&
      (!dateTo || scanDate <= new Date(dateTo));

    return matchText && matchOS && matchRisk && matchPorts && matchDate;
  });

  function exportExcel() {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Hosts");
    XLSX.writeFile(wb, "hosts.xlsx");
  }

  function exportPDF() {
    const content = filtered
      .map(
        (h) =>
          `${h.ip_address} | ${h.hostname} | SO: ${h.os_detected} | Puertos: ${
            h.total_ports
          } | Riesgo: ${h.high_risk_count}`
      )
      .join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "hosts.pdf";
    a.click();
  }

  return (
    <div className="card bg-dark text-white mt-4 shadow-lg">
      <div className="card-header border-secondary">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="m-0">
            <i className="bi bi-pc-display text-info me-2"></i>
            Mis Hosts Escaneados
          </h5>

          <div className="d-flex gap-2">
            <button className="btn btn-success btn-sm" onClick={exportExcel}>
              <i className="bi bi-file-earmark-excel-fill me-1"></i>
              Excel
            </button>

            <button className="btn btn-danger btn-sm" onClick={exportPDF}>
              <i className="bi bi-file-earmark-pdf-fill me-1"></i>
              PDF
            </button>

            <input
              className="form-control form-control-sm w-25"
              placeholder="Buscar IP / Hostname..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ====================== FILTROS ====================== */}
        <div className="mt-3 d-flex flex-wrap gap-2">

          {/* === SELECT SO === */}
          <select
            className="form-select form-select-sm w-auto"
            style={{
              background: "var(--input-bg)",
              color: "var(--input-text)",
              borderColor: "var(--input-border)",
            }}
            value={filterOS}
            onChange={(e) => setFilterOS(e.target.value)}
          >
            <option value="all">SO (Todos)</option>
            <option value="windows">Windows</option>
            <option value="linux">Linux</option>
            <option value="mac">Mac</option>
            <option value="unknown">Desconocido</option>
          </select>

          {/* === SELECT RIESGO === */}
          <select
            className="form-select form-select-sm w-auto"
            style={{
              background: "var(--input-bg)",
              color: "var(--input-text)",
              borderColor: "var(--input-border)",
            }}
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
          >
            <option value="all">Riesgo (Todos)</option>
            <option value="alto">Alto</option>
            <option value="medio">Medio</option>
            <option value="bajo">Bajo</option>
          </select>

          {/* === INPUT PUERTOS MÍN === */}
          <input
            type="number"
            className="form-control form-control-sm w-auto bg-dark text-white border-secondary"
            placeholder="Puertos mín"
            value={minPorts}
            onChange={(e) => setMinPorts(e.target.value)}
          />

          <input
            type="number"
            className="form-control form-control-sm w-auto bg-dark text-white border-secondary"
            placeholder="Puertos máx"
            value={maxPorts}
            onChange={(e) => setMaxPorts(e.target.value)}
          />

          <input
            type="date"
            className="form-control form-control-sm bg-dark text-white border-secondary"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />

          <input
            type="date"
            className="form-control form-control-sm bg-dark text-white border-secondary"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
      </div>

      {/* ========== TABLA ========== */}
      <div className="table-responsive">
        <table className="table theme-table table-striped table-hover align-middle mb-0">
          <thead
            className="sticky-top"
            style={{
              background: "var(--card-bg)",
              borderBottom: "1px solid var(--card-border)",
              color: "var(--text)",
            }}
          >
            <tr>
              <th>Host</th>
              <th>SO</th>
              <th className="text-center">Puertos</th>
              <th className="text-center">Riesgo</th>
              <th>Último Escaneo</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  No hay resultados para los filtros.
                </td>
              </tr>
            ) : (
              filtered.map((h) => (
                <tr key={h.id}>
                  <td>
                    <div className="fw-bold text-info">{h.ip_address}</div>
                    <div className="small text-muted">{h.hostname || "—"}</div>
                  </td>

                  <td>
                    <i className={`bi ${osIcon(h.os_detected)} me-2`}></i>
                    {h.os_detected || "Desconocido"}
                  </td>

                  <td className="fw-bold text-center">{h.total_ports ?? 0}</td>

                  <td className="text-center">{riskBadge(h.high_risk_count)}</td>

                  <td>
                    {h.scan_date ? (
                      <>
                        {new Date(h.scan_date).toLocaleDateString()}
                        <br />
                        <small className="text-muted">
                          {new Date(h.scan_date).toLocaleTimeString()}
                        </small>
                      </>
                    ) : (
                      <span className="text-muted">Nunca</span>
                    )}
                  </td>

                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => setSelectedHost(h)}
                    >
                      <i className="bi bi-eye-fill"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedHost && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(3px)",
          }}
          onClick={() => setSelectedHost(null)}
        >
          <div
            className="modal-dialog modal-xl modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-content text-white"
              style={{ background: "#1e1f22", borderRadius: "12px" }}
            >
              <div
                className="modal-header"
                style={{
                  borderBottom: "1px solid #2c2d30",
                  background: "#1c1d20",
                }}
              >
                <h4 className="modal-title fw-bold">
                  <i className="bi bi-server me-2 text-info"></i>
                  Detalles del Host
                </h4>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedHost(null)}
                ></button>
              </div>

              <div
                className="modal-body"
                style={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                <h3 className="text-info fw-bold">{selectedHost.ip_address}</h3>
                <p className="text-muted">{selectedHost.hostname || "—"}</p>

                <hr className="border-secondary" />

                <h6 className="fw-bold">Sistema Operativo</h6>
                <p className="mb-3">{selectedHost.os_detected || "Desconocido"}</p>

                <hr className="border-secondary" />

                <h5 className="fw-bold mb-3">
                  <i className="bi bi-ethernet me-2"></i> Puertos y Vulnerabilidades
                </h5>

                {selectedHost.ports?.length > 0 ? (
                  selectedHost.ports.map((port) => (
                    <div
                      key={port.id}
                      className="p-3 mb-3 rounded"
                      style={{ background: "#26272b", borderLeft: "4px solid #0dcaf0" }}
                    >
                      <h6 className="fw-bold">
                        {port.port_number}/{port.protocol} —{" "}
                        <span className="text-warning">{port.service_name || "Desconocido"}</span>
                      </h6>

                      {port.vulnerabilities?.length > 0 ? (
                        <ul className="mt-2">
                          {port.vulnerabilities.map((v) => (
                            <li key={v.id} className="mb-1">
                              <a
                                href={`https://nvd.nist.gov/vuln/detail/${v.cve_id}`}
                                className="text-info fw-bold"
                                target="_blank"
                                rel="noreferrer"
                              >
                                {v.cve_id}
                              </a>{" "}
                              — {v.severity}{" "}
                              <span className="text-muted">(CVSS: {v.cvss_score})</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted small m-0">
                          No hay vulnerabilidades para este puerto.
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No se encontraron puertos.</p>
                )}
              </div>

              <div className="modal-footer" style={{ borderTop: "1px solid #2c2d30" }}>
                <button className="btn btn-secondary" onClick={() => setSelectedHost(null)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
