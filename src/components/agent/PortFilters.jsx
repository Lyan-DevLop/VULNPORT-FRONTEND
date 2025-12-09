export default function PortFilters({ search, setSearch, filterCritical, setFilterCritical }) {
  return (
    <div className="d-flex gap-2 mb-3">

      <input
        type="text"
        className="form-control"
        placeholder="Buscar..."
        style={{
          background: "var(--input-bg)",
          color: "var(--input-text)",
          borderColor: "var(--input-border)",
        }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button
        className={`btn ${filterCritical ? "btn-danger" : "btn-outline-danger"}`}
        onClick={() => setFilterCritical(!filterCritical)}
      >
        Críticos
      </button>

    </div>
  );
}



