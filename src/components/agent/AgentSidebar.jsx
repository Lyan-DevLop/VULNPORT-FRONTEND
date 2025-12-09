export default function AgentSidebar({
  agents,
  hosts,
  selectedAgent,
  selectAgent,
}) {
  return (
    <div className="card p-3" style={{ background: "var(--card-bg)", color: "var(--text)" }}>

      <h6 className="fw-bold mb-2" style={{ color: "var(--link-active)" }}>
        <i className="bi bi-cpu me-2"></i>Agentes
      </h6>

      {agents.map((a) => (
        <div
          key={a.id}
          className="p-2 rounded border mb-2"
          style={{
            cursor: "pointer",
            borderColor:
              selectedAgent?.id === a.id
                ? "var(--link-active)"
                : "var(--card-border)",
            backgroundColor:
              selectedAgent?.id === a.id
                ? "rgba(56,139,255,0.12)"
                : "transparent",
          }}
          onClick={() => selectAgent(a)}
        >
          <div className="d-flex justify-content-between">
            <strong>{a.id}</strong>

            <span
              className="badge"
              style={{
                backgroundColor:
                  a.status === "ONLINE" ? "var(--bs-success)" : "var(--bs-secondary)",
                color: "#fff",
              }}
            >
              {a.status}
            </span>
          </div>

          <small className="text-muted">{a.os_type} • {a.last_seen}</small>
        </div>
      ))}

      <hr className="my-3" style={{ borderColor: "var(--card-border)" }} />

      <h6 className="fw-bold mb-2" style={{ color: "var(--link-active)" }}>
        <i className="bi bi-diagram-3 me-2"></i>Hosts
      </h6>

      {hosts.map((h) => (
        <div
          key={h.id}
          className="p-2 rounded border mb-2"
          style={{
            borderColor:
              selectedAgent?.id === h.agent_id
                ? "var(--link-active)"
                : "var(--card-border)",
            backgroundColor:
              selectedAgent?.id === h.agent_id
                ? "rgba(56,139,255,0.12)"
                : "transparent",
            color: "var(--text)",
          }}
        >
          <strong>{h.hostname}</strong>
          <br />
          <small className="text-muted">IP: {h.ip_address}</small>
        </div>
      ))}
    </div>
  );
}
