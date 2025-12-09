import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  return (
    <div 
      className="app-wrapper d-flex"
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
        color: "var(--text)",
      }}
    >
      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENIDO PRINCIPAL */}
      <div 
        className="flex-grow-1 d-flex flex-column"
        style={{ minHeight: "100vh" }}
      >
        <Topbar />

        <main 
          className="flex-grow-1 p-3"
          style={{
            backgroundColor: "var(--bg)",
            color: "var(--text)",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}




