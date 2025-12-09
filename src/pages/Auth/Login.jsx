import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(username, password);

      // 🔐 Si requiere 2FA
      if (res.needs2FA) {
        navigate("/2fa", { replace: true });
        return;
      }

      // 🔓 Login normal
      navigate("/", { replace: true });

    } catch (err) {
      console.error(err);
      setError("Credenciales inválidas o error de servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="vh-100 d-flex justify-content-center align-items-center"
      style={{
        background:
          "radial-gradient(circle at top left, #0f172a, #0a0f1f, #020617)",
      }}
    >
      <div
        className="card text-white p-4 shadow-lg"
        style={{
          width: 380,
          borderRadius: 18,
          background: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(0, 238, 255, 0.25)",
        }}
      >
        <div className="text-center mb-4">
          <i
            className="bi bi-shield-lock-fill"
            style={{ fontSize: 48, color: "#00eaff" }}
          ></i>

          <h2 className="fw-bold mt-2">VULNPORTS</h2>

          <p className="text-secondary small">
            Sistema de Seguridad y Escaneo de Puertos
          </p>
        </div>

        {error && (
          <div className="alert alert-danger text-center py-2 small">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="form-label fw-semibold">Nombre de usuario</label>
          <div className="input-group mb-3">
            <span
              className="input-group-text"
              style={{
                background: "#0f172a",
                color: "#00eaff",
                border: "1px solid rgba(0,238,255,0.3)",
              }}
            >
              <i className="bi bi-person-fill"></i>
            </span>
            <input
              type="text"
              className="form-control text-white"
              style={{
                background: "#0f172a",
                border: "1px solid rgba(0,238,255,0.3)",
              }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              placeholder="admin"
            />
          </div>

          <label className="form-label fw-semibold">Contraseña</label>
          <div className="input-group mb-3">
            <span
              className="input-group-text"
              style={{
                background: "#0f172a",
                color: "#00eaff",
                border: "1px solid rgba(0,238,255,0.3)",
              }}
            >
              <i className="bi bi-lock-fill"></i>
            </span>

            <input
              type={showPass ? "text" : "password"}
              className="form-control text-white"
              style={{
                background: "#0f172a",
                border: "1px solid rgba(0,238,255,0.3)",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
            />

            <span
              className="input-group-text"
              style={{
                background: "#0f172a",
                color: "#00eaff",
                border: "1px solid rgba(0,238,255,0.3)",
                cursor: "pointer",
              }}
              onClick={() => setShowPass(!showPass)}
            >
              <i className={`bi ${showPass ? "bi-eye-slash" : "bi-eye"}`}></i>
            </span>
          </div>

          <button
            className="btn w-100 fw-bold mt-2"
            disabled={loading}
            style={{
              background: "#00eaff",
              color: "#0a0f1f",
              borderRadius: 10,
            }}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Ingresando...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Ingresar
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/register" className="fw-semibold" style={{ color: "#00eaff" }}>
            ¿No tienes cuenta? Crear cuenta →
          </Link>
        </div>
      </div>
    </div>
  );
}
