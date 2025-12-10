import { useEffect, useState } from "react";
import { getPorts } from "../../api/ports.api";
import { getMyHosts } from "../../api/hosts.api";

export default function Ports() {
  const [ports, setPorts] = useState([]);
  const [hosts, setHosts] = useState([]);

  const [search, setSearch] = useState("");
  const [filterProtocol, setFilterProtocol] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterHost, setFilterHost] = useState("all");
  const [filterService, setFilterService] = useState("");
  const [portRange, setPortRange] = useState({ min: "", max: "" });

  useEffect(() => {
    getPorts().then(setPorts);
    getMyHosts().then(setHosts);
  }, []);

  const getHostInfo = (id) => hosts.find((h) => h.id === id);

  const filtered = ports.filter((p) => {
    const host = getHostInfo(p.host_id);
    const text = search.toLowerCase();

    if (filterProtocol !== "all" && p.protocol !== filterProtocol) return false;
    if (filterStatus !== "all" && p.status !== filterStatus) return false;
    if (filterHost !== "all" && p.host_id.toString() !== filterHost) return false;

    if (filterService && !(p.service_name || "").toLowerCase().includes(filterService.toLowerCase()))
      return false;

    if (portRange.min && p.port_number < Number(portRange.min)) return false;
    if (portRange.max && p.port_number > Number(portRange.max)) return false;

    return (
      p.port_number.toString().includes(text) ||
      p.protocol.toLowerCase().includes(text) ||
      (p.service_name || "").toLowerCase().includes(text) ||
      p.status.toLowerCase().includes(text) ||
      (host &&
        (host.ip_address.toLowerCase().includes(text) ||
         (host.hostname || "").toLowerCase().includes(text)))
    );
  });

  const statusBadge = (status) => {
    const colors = {
      open: "var(--bs-success)",
      filtered: "var(--bs-warning)",
      closed: "var(--bs-danger)",
    };
    const textColor = status === "filtered" ? "#000" : "#fff";

    return (
      <span className="badge" style={{ background: colors[status], color: textColor }}>
        {status === "open" ? "Abierto" : status === "filtered" ? "Filtrado" : "Cerrado"}
      </span>
    );
  };

  const icon = (service) => {
    if (!service) return "bi-plugin";
    const s = service.toLowerCase();
    if (s.includes("http")) return "bi-globe";
    if (s.includes("ssh")) return "bi-lock";
    if (s.includes("ftp")) return "bi-upload";
    if (s.includes("sql")) return "bi-database";
    if (s.includes("mail")) return "bi-envelope";
    if (s.includes("rdp")) return "bi-windows";
    return "bi-terminal";
  };

  return (
    <div className="container-fluid mt-4" style={{ color: "var(--text)" }}>
      <h2 className="mb-2">
        <i className="bi bi-ethernet me-2" style={{ color: "var(--link-active)" }}></i>
        Puertos Detectados
      </h2>

      {/* CARD FILTROS */}
      <div
        className="card p-3 mt-3 shadow-sm"
        style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
      >
        <h5 className="mb-3" style={{ color: "var(--link-active)" }}>
          <i className="bi bi-funnel me-2"></i>Filtros avanzados
        </h5>

        {/* TODOS TUS FILTROS AQUÍ */}
        <div className="row g-3">

          {/* Protocolo */}
          <div className="col-md-2">
            <label className="form-label">Protocolo</label>
            <select
              className="form-select form-select-sm"
              style={{
                background: "var(--input-bg)",
                color: "var(--input-text)",
                borderColor: "var(--input-border)"
              }}
              value={filterProtocol}
              onChange={(e) => setFilterProtocol(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="tcp">TCP</option>
              <option value="udp">UDP</option>
            </select>
          </div>

          {/* Estado */}
          <div className="col-md-2">
            <label className="form-label">Estado</label>
            <select
              className="form-select form-select-sm"
              style={{
                background: "var(--input-bg)",
                color: "var(--input-text)",
                borderColor: "var(--input-border)"
              }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="open">Abierto</option>
              <option value="closed">Cerrado</option>
              <option value="filtered">Filtrado</option>
            </select>
          </div>

          {/* Host */}
          <div className="col-md-3">
            <label className="form-label">Host</label>
            <select
              className="form-select form-select-sm"
              style={{
                background: "var(--input-bg)",
                color: "var(--input-text)",
                borderColor: "var(--input-border)"
              }}
              value={filterHost}
              onChange={(e) => setFilterHost(e.target.value)}
            >
              <option value="all">Todos</option>
              {hosts.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.ip_address} ({h.hostname || "sin nombre"})
                </option>
              ))}
            </select>
          </div>

          {/* Servicio */}
          <div className="col-md-2">
            <label className="form-label">Servicio</label>
            <input
              type="text"
              className="form-control form-control-sm"
              style={{
                background: "var(--input-bg)",
                color: "var(--input-text)",
                borderColor: "var(--input-border)"
              }}
              placeholder="http, ssh, ftp..."
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
            />
          </div>

          {/* Rango de puertos */}
          <div className="col-md-3">
            <label className="form-label">Rango de puertos</label>
            <div className="d-flex gap-2">
              <input
                type="number"
                placeholder="Min"
                className="form-control form-control-sm"
                style={{
                  background: "var(--input-bg)",
                  color: "var(--input-text)",
                  borderColor: "var(--input-border)"
                }}
                value={portRange.min}
                onChange={(e) => setPortRange({ ...portRange, min: e.target.value })}
              />

              <input
                type="number"
                placeholder="Max"
                className="form-control form-control-sm"
                style={{
                  background: "var(--input-bg)",
                  color: "var(--input-text)",
                  borderColor: "var(--input-border)"
                }}
                value={portRange.max}
                onChange={(e) => setPortRange({ ...portRange, max: e.target.value })}
              />
            </div>
          </div>

        </div>

        {/* Buscador global */}
        <div className="mt-3">
          <input
            type="text"
            className="form-control form-control-sm"
            style={{
              background: "var(--input-bg)",
              color: "var(--input-text)",
              borderColor: "var(--input-border)"
            }}
            placeholder="Buscar por IP, puerto, servicio, estado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLA */}
      <div className="card shadow mt-4" style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
        <div
          className="card-header d-flex justify-content-between"
          style={{ background: "var(--card-bg)", borderBottom: "1px solid var(--card-border)" }}
        >
          <h5 className="m-0" style={{ color: "var(--link-active)" }}>
            <i className="bi bi-list-ul me-2"></i>
            Resultados
          </h5>

          <span className="badge bg-secondary">{filtered.length} puertos</span>
        </div>

        <div className="table-responsive" style={{ maxHeight: "600px" }}>
          <table className="table theme-table table-hover table-striped table-bordered align-middle mb-0">
            <thead className="sticky-top">
              <tr>
                <th>Puerto</th>
                <th>Protocolo</th>
                <th>Servicio</th>
                <th>Estado</th>
                <th>Host</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-muted">
                    <i className="bi bi-database-slash me-2"></i>
                    No se encontraron resultados
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const host = getHostInfo(p.host_id);

                  return (
                    <tr key={p.id}>
                      <td className="fw-bold">{p.port_number}</td>
                      <td>{p.protocol.toUpperCase()}</td>

                      <td>
                        <i
                          className={`bi ${icon(p.service_name)} me-1`}
                          style={{ color: "var(--link-active)" }}
                        ></i>
                        {p.service_name || "—"}
                      </td>

                      <td>{statusBadge(p.status)}</td>

                      <td>
                        {host ? (
                          <>
                            <span className="fw-bold">{host.ip_address}</span>
                            <br />
                            <span className="text-muted small">{host.hostname || "—"}</span>
                          </>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
