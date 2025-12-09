export default function AgenPortsTable({
  loading,
  ports,
  page,
  totalPages,
  setPage,
  openDetails,
  closePort,
  CRITICAL_PORTS,
}) {
  return (
    <>
      <table className="table theme-table table-hover">
        <thead>
          <tr>
            <th>Puerto</th>
            <th>PID</th>
            <th>Proceso</th>
            <th>Usuario</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="text-center">Cargando...</td>
            </tr>
          ) : ports.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center">Sin datos</td>
            </tr>
          ) : (
            ports.map((p, i) => (
              <tr key={i}>
                <td>
                  {p.port}
                  {CRITICAL_PORTS.includes(p.port) && (
                    <span className="badge bg-danger ms-2">crítico</span>
                  )}
                </td>

                <td>{p.pid || "N/A"}</td>
                <td>{p.process_name || "N/A"}</td>
                <td>{p.user || "N/A"}</td>

                <td className="text-end d-flex justify-content-end gap-2">

                  {/* BADGE VER */}
                  <span
                    onClick={() => openDetails(p)}
                    className="badge bg-primary d-flex align-items-center justify-content-center"
                    style={{
                      width: "32px",
                      height: "32px",
                      cursor: "pointer",
                      borderRadius: "12px",
                    }}
                  >
                    <i className="bi bi-eye"></i>
                  </span>

                  {/* BADGE CERRAR */}
                  <span
                    onClick={() => closePort(p.port)}
                    className="badge bg-danger d-flex align-items-center justify-content-center"
                    style={{
                      width: "32px",
                      height: "32px",
                      cursor: "pointer",
                      borderRadius: "12px",
                    }}
                  >
                    <i className="bi bi-lock-fill"></i>
                  </span>

                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* PAGINACIÓN */}
      <div className="d-flex justify-content-between align-items-center mt-2">
        <button
          className="btn btn-outline-secondary btn-sm"
          style={{
            color: "var(--text)",
            borderColor: "var(--card-border)",
          }}
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          <i className="bi bi-chevron-left"></i>
        </button>

        <span className="text-muted">Página {page} / {totalPages || 1}</span>

        <button
          className="btn btn-outline-secondary btn-sm"
          style={{
            color: "var(--text)",
            borderColor: "var(--card-border)",
          }}
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    </>
  );
}
