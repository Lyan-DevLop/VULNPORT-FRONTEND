export default function AgentSummary({ ports, hostLinked, agent, CRITICAL_PORTS }) {
  return (
    <div className="row text-center mb-4">

      <div className="col-md-3">
        <div className="card p-3">
          <h4>{ports.length}</h4>
          <small className="text-muted">Puertos Totales</small>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card p-3">
          <h4 style={{ color: "var(--bs-danger)" }}>
            {ports.filter((p) => CRITICAL_PORTS.includes(p.port)).length}
          </h4>
          <small className="text-muted">Críticos</small>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card p-3">
          <h6>{hostLinked?.hostname || "N/A"}</h6>
          <small className="text-muted">Host vinculado</small>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card p-3">
          <h6>{agent.os_type}</h6>
          <small className="text-muted">Sistema</small>
        </div>
      </div>

    </div>
  );
}

