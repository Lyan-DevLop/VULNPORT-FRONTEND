import { useEffect, useState } from "react";

import SummaryTable from "../../components/tables/SummaryTable";
import HostSummaryTable from "../../components/tables/HostSummaryTable";

import RiskPieChart from "../../components/charts/RiskPieChart";
import PortsBarChart from "../../components/charts/PortsBarChart";
import HostsTimelineChart from "../../components/charts/HostsTimeLineChart";

import { getMyHosts } from "../../api/hosts.api";
import { getVulnerabilities } from "../../api/vulnerabilities.api";

export default function Dashboard() {
  const [hosts, setHosts] = useState([]);
  const [vulns, setVulns] = useState([]);
  const [openSection, setOpenSection] = useState(null); // ⭐ controla las tarjetas

  useEffect(() => {
    getMyHosts().then(setHosts).catch(console.error);
    getVulnerabilities().then(setVulns).catch(console.error);
  }, []);

  const toggleSection = (key) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  const totalHosts = hosts.length;
  const totalPorts = hosts.reduce((acc, h) => acc + (h.total_ports || 0), 0);
  const totalCritical = hosts.reduce(
    (acc, h) => acc + (h.high_risk_count || 0),
    0
  );
  const avgRisk =
    totalHosts === 0 ? 0 : Math.round((totalCritical / totalHosts) * 10) / 10;

  return (
    <div className="container-fluid mt-4 text-white">
      <h2 className="mb-4">Dashboard</h2>

      {/* ================= TARJETAS RESUMEN ================= */}
      <div className="row g-3 mb-4">

        <div className="col-md-3">
          <div className="card bg-dark p-3 shadow-sm border border-secondary">
            <h6 className="text-muted text-uppercase small">Hosts Escaneados</h6>
            <h2 className="text-info">{totalHosts}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-dark p-3 shadow-sm border border-secondary">
            <h6 className="text-muted text-uppercase small">Puertos Totales</h6>
            <h2 className="text-warning">{totalPorts}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-dark p-3 shadow-sm border border-secondary">
            <h6 className="text-muted text-uppercase small">
              Vulnerabilidades Detectadas
            </h6>
            <h2 className="text-danger">{vulns.length}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-dark p-3 shadow-sm border border-secondary">
            <h6 className="text-muted text-uppercase small">Riesgo Promedio</h6>
            <h2 className="text-primary">{avgRisk}</h2>
          </div>
        </div>

      </div>

      {/* ================= GRÁFICOS ================= */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <RiskPieChart hosts={hosts} />
        </div>

        <div className="col-md-4">
          <PortsBarChart hosts={hosts} />
        </div>

        <div className="col-md-4">
          <HostsTimelineChart hosts={hosts} />
        </div>
      </div>

      {/* ================= ACORDEÓN DE TABLAS ================= */}
      <div className="accordion" id="dashboardAccordion">

        {/* === TABLA DE VULNERABILIDADES === */}
        <div className="card bg-dark border-secondary mb-3">
          <div
            className="card-header d-flex justify-content-between align-items-center"
            style={{ cursor: "pointer" }}
            onClick={() => toggleSection("vulns")}
          >
            <h5 className="m-0">
              <i className="bi bi-bug text-danger me-2"></i>
              Vulnerabilidades Detectadas
            </h5>

            <i
              className={`bi bi-chevron-${
                openSection === "vulns" ? "up" : "down"
              } text-white transition`}
            ></i>
          </div>

          {openSection === "vulns" && (
            <div className="card-body">
              <SummaryTable />
            </div>
          )}
        </div>

        {/* === TABLA DE HOSTS === */}
        <div className="card bg-dark border-secondary mb-3">
          <div
            className="card-header d-flex justify-content-between align-items-center"
            style={{ cursor: "pointer" }}
            onClick={() => toggleSection("hosts")}
          >
            <h5 className="m-0">
              <i className="bi bi-pc-display text-info me-2"></i>
              Mis Hosts Escaneados
            </h5>

            <i
              className={`bi bi-chevron-${
                openSection === "hosts" ? "up" : "down"
              } text-white transition`}
            ></i>
          </div>

          {openSection === "hosts" && (
            <div className="card-body">
              <HostSummaryTable />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}


