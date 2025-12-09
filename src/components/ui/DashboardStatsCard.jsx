import { useEffect, useState } from "react";
import { getMyHosts } from "../../api/hosts.api";
import { getPorts } from "../../api/ports.api";
import { getVulnerabilities } from "../../api/vulnerabilities.api";

export default function DashboardStatsCard() {
  const [hosts, setHosts] = useState([]);
  const [ports, setPorts] = useState([]);
  const [vulns, setVulns] = useState([]);

  useEffect(() => {
    getMyHosts().then(setHosts);
    getPorts().then(setPorts);
    getVulnerabilities().then(setVulns);
  }, []);

  const totalHosts = hosts.length;
  const vulnerableHosts = hosts.filter((h) => h.high_risk_count > 0).length;
  const totalPorts = ports.length;
  const totalVulns = vulns.length;

  const cards = [
    {
      title: "Hosts Escaneados",
      value: totalHosts,
      icon: "bi-hdd-network",
      color: "text-info",
    },
    {
      title: "Hosts Vulnerables",
      value: vulnerableHosts,
      icon: "bi-exclamation-triangle",
      color: vulnerableHosts > 0 ? "text-danger" : "text-success",
    },
    {
      title: "Puertos Detectados",
      value: totalPorts,
      icon: "bi-ethernet",
      color: "text-warning",
    },
    {
      title: "Vulnerabilidades",
      value: totalVulns,
      icon: "bi-bug",
      color: totalVulns > 0 ? "text-danger" : "text-secondary",
    },
  ];

  return (
    <div className="row g-4 mb-4">
      {cards.map((c, i) => (
        <div className="col-md-3" key={i}>
          <div className="card bg-dark text-white shadow-sm p-3 border border-secondary h-100">
            <div className="d-flex align-items-center">
              <i className={`bi ${c.icon} fs-2 me-3 ${c.color}`} />

              <div>
                <div className="text-muted small">{c.title}</div>
                <div className="fs-4 fw-bold">{c.value}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
