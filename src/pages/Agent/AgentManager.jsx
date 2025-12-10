import { useEffect, useState, useCallback, useMemo } from "react";
import axiosClient from "../../api/axiosClient";

import AgentSidebar from "../../components/agent/AgentSidebar";
import AgentSummary from "../../components/agent/AgentSummary";
import PortFilters from "../../components/agent/PortFilters";
import PortModal from "../../components/agent/PortModal";
import Toast from "../../components/agent/Toast";
import AgenPortsTable from "../../components/tables/AgenPortsTable";

const CRITICAL_PORTS = [22, 23, 80, 443, 445, 3389, 1433, 3306, 5432];

export default function AgentManager() {
  const [agents, setAgents] = useState([]);
  const [hosts, setHosts] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [ports, setPorts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [details, setDetails] = useState(null);
  const [toast, setToast] = useState(null);

  // Modal de confirmación
  const [confirmData, setConfirmData] = useState(null);

  const [search, setSearch] = useState("");
  const [filterCritical, setFilterCritical] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const safeRequest = async (fn) => {
    try {
      return await fn();
    } catch (error) {
      console.error(error);
      showToast("Error al comunicarse con el agente", "danger");
      return null;
    }
  };

  const loadAgents = useCallback(async () => {
    const r = await safeRequest(() => axiosClient.get("/agent/list"));
    setAgents(r?.data || []);
  }, []);

  const loadHosts = useCallback(async () => {
    const r = await safeRequest(() => axiosClient.get("/hosts/me"));
    setHosts(r?.data || []);
  }, []);

  const loadPorts = useCallback(async (agent) => {
    setLoading(true);
    const r = await safeRequest(() =>
      axiosClient.get(`/agent/reports/${agent.id}`)
    );
    setPorts(r?.data?.ports || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAgents();
    loadHosts();
  }, []);

  const selectAgent = (agent) => {
    setSelectedAgent(agent);
    loadPorts(agent);
    setPage(1);
  };

  const hostLinked = hosts.find((h) => h.agent_id === selectedAgent?.id);

  const filteredPorts = useMemo(() => {
    let list = ports;

    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        (p) =>
          String(p.port).includes(s) ||
          (p.process_name || "").toLowerCase().includes(s) ||
          (p.user || "").toLowerCase().includes(s)
      );
    }

    if (filterCritical) {
      list = list.filter((p) => CRITICAL_PORTS.includes(p.port));
    }

    return list;
  }, [ports, search, filterCritical]);

  const totalPages = Math.ceil(filteredPorts.length / pageSize);
  const pageData = filteredPorts.slice((page - 1) * pageSize, page * pageSize);

  //  FUNCIÓN REAL QUE CIERRA EL PUERTO (BACKEND)
  const performClosePort = async (port) => {
    if (!selectedAgent) return;

    const r = await safeRequest(() =>
      axiosClient.post(
        `/agent/command/close-port?agent_id=${selectedAgent.id}&port=${port}`
      )
    );

    if (r) {
      // Eliminar visualmente el puerto hasta el nuevo reporte
      setPorts((prev) => prev.filter((p) => p.port !== port));

      if (details?.port === port) setDetails(null);

      showToast(`Puerto ${port} cerrado correctamente`, "success");
    }
  };

  //  Abre modal de confirmación
  const requestClosePort = (port) => {
    setConfirmData({ port });
  };

  //  Confirmación aceptada
  const confirmClose = () => {
    if (confirmData?.port) performClosePort(confirmData.port);
    setConfirmData(null);
  };

  return (
    <div className="container-fluid py-3">

      <Toast toast={toast} />

      <div className="row g-3">
        <div className="col-lg-4">
          <AgentSidebar
            agents={agents}
            hosts={hosts}
            selectedAgent={selectedAgent}
            selectAgent={selectAgent}
          />
        </div>

        <div className="col-lg-8">
          {!selectedAgent ? (
            <div className="card p-5 text-center">
              <h5 className="text-muted">Selecciona un agente para continuar</h5>
            </div>
          ) : (
            <div className="card p-4">

              <AgentSummary
                ports={ports}
                hostLinked={hostLinked}
                agent={selectedAgent}
                CRITICAL_PORTS={CRITICAL_PORTS}
              />

              <PortFilters
                search={search}
                setSearch={setSearch}
                filterCritical={filterCritical}
                setFilterCritical={setFilterCritical}
              />

              <AgenPortsTable
                loading={loading}
                ports={pageData}
                page={page}
                totalPages={totalPages}
                setPage={setPage}
                openDetails={setDetails}
                closePort={requestClosePort}
                CRITICAL_PORTS={CRITICAL_PORTS}
              />

            </div>
          )}
        </div>
      </div>

      {/* MODAL DE DETALLES */}
      {details && (
        <PortModal
          details={details}
          close={setDetails}
          closePort={requestClosePort}
          CRITICAL_PORTS={CRITICAL_PORTS}
        />
      )}

      {/* MODAL DE CONFIRMACIÓN AL CERRAR PUERTO */}
      {confirmData && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white border border-danger">

              <div className="modal-header border-danger">
                <h5 className="modal-title">
                  Confirmar cierre
                </h5>
                <button className="btn-close btn-close-white" onClick={() => setConfirmData(null)} />
              </div>

              <div className="modal-body">
                <p>
                  ¿Estás seguro de que deseas cerrar el puerto{" "}
                  <strong className="text-danger">{confirmData.port}</strong>?
                </p>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setConfirmData(null)}
                >
                  Cancelar
                </button>

                <button
                  className="btn btn-danger"
                  onClick={confirmClose}
                >
                  Sí, cerrar puerto
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
