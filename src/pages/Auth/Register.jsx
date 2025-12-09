import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!name || !email || !password) {
      setError("Todos los campos son obligatorios.");
      setLoading(false);
      return;
    }

    try {
      await register(name, email, password);
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError("No se pudo registrar. Verifica los datos.");
    } finally {
      setLoading(false);
    }
  }

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
          boxShadow:
            "0 0 20px rgba(0, 238, 255, 0.15), 0 0 40px rgba(0, 238, 255, 0.05)",
          border: "1px solid rgba(0, 238, 255, 0.25)",
        }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <i
            className="bi bi-person-plus-fill"
            style={{ fontSize: 48, color: "#00eaff" }}
          ></i>

          <h2 className="fw-bold mt-2" style={{ letterSpacing: 1 }}>
            Crear Cuenta
          </h2>

          <p className="text-secondary small mt-1">
            Regístrate para acceder al sistema VULNPORTS
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-danger text-center py-2 small">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <label className="form-label fw-semibold">Nombre</label>
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
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <label className="form-label fw-semibold">
            Correo Electrónico
          </label>
          <div className="input-group mb-3">
            <span
              className="input-group-text"
              style={{
                background: "#0f172a",
                color: "#00eaff",
                border: "1px solid rgba(0,238,255,0.3)",
              }}
            >
              <i className="bi bi-envelope-fill"></i>
            </span>

            <input
              type="email"
              className="form-control text-white"
              style={{
                background: "#0f172a",
                border: "1px solid rgba(0,238,255,0.3)",
              }}
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          {/* Submit */}
          <button
            type="submit"
            className="btn w-100 fw-bold"
            disabled={loading}
            style={{
              background: "#00eaff",
              color: "#0a0f1f",
              borderRadius: 10,
              transition: "0.2s",
            }}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Creando cuenta...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle-fill me-2"></i>
                Registrarme
              </>
            )}
          </button>
        </form>

        {/* Login redirect */}
        <div className="text-center mt-3">
          <Link
            to="/login"
            className="fw-semibold"
            style={{ color: "#00eaff" }}
          >
            ¿Ya tienes cuenta? Inicia sesión →
          </Link>
        </div>
      </div>
    </div>
  );
}
