export default function PortModal({ details, close, closePort, CRITICAL_PORTS }) {
  return (
    <div className="modal fade show"
      style={{ display: "block", background: "rgba(0,0,0,0.6)" }}>
      
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div
          className="modal-content"
          style={{
            background: "var(--card-bg)",
            color: "var(--text)",
            border: "1px solid var(--card-border)",
          }}
        >

          <div className="modal-header" style={{ borderColor: "var(--card-border)" }}>
            <h5 className="modal-title">Puerto {details.port}</h5>
            <button className="btn-close" onClick={() => close(null)}></button>
          </div>

          <div className="modal-body">
            <p><strong>PID:</strong> {details.pid}</p>
            <p><strong>Proceso:</strong> {details.process_name}</p>
            <p><strong>Usuario:</strong> {details.user}</p>

            <p>
              <strong>Crítico:</strong>{" "}
              {CRITICAL_PORTS.includes(details.port) ? "Sí" : "No"}
            </p>
          </div>

          <div className="modal-footer" style={{ borderColor: "var(--card-border)" }}>
            <button
              className="btn btn-danger"
              onClick={() => closePort(details.port)}
            >
              Cerrar Puerto
            </button>
            <button className="btn btn-secondary" onClick={() => close(null)}>
              Cancelar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
