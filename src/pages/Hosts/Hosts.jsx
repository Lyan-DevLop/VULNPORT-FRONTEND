import HostSummaryTable from "../../components/tables/HostSummaryTable";

export default function Hosts() {
  return (
    <div
      className="container mt-4"
      style={{ color: "var(--text)" }}   // ← se adapta al tema
    >
      <h2 style={{ color: "var(--text)" }}>Mis Hosts</h2>

      <HostSummaryTable />
    </div>
  );
}




