export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
      <div
        className={`alert alert-${toast.type} shadow`}
        style={{
          background: "var(--card-bg)",
          color: "var(--text)",
          borderColor: "var(--card-border)",
        }}
      >
        {toast.msg}
      </div>
    </div>
  );
}

