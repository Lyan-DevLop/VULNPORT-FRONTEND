import { useAuth } from "../../store/AuthContext";
import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";

export default function Profile() {
  const { user, logout } = useAuth();

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [open, setOpen] = useState({
    account: true,
    security: false,
    session: false,
  });

  const [status, setStatus] = useState(null);

  const [show2FAModal, setShow2FAModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [method, setMethod] = useState("totp");
  const [twofaCode, setTwofaCode] = useState("");
  const [valid, setValid] = useState(null);

  /* VALIDACIÓN 2FA */
  useEffect(() => {
    if (twofaCode.length !== 6) {
      setValid(null);
      return;
    }

    const t = setTimeout(async () => {
      try {
        const res = await axiosClient.post("/auth/check-2fa", {
          user_id: user.id,
          method,
          code: twofaCode,
        });
        setValid(res.data.valid);
      } catch {
        setValid(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [twofaCode, method, user.id]);

  function toggle(section) {
    setOpen((prev) => ({ ...prev, [section]: !prev[section] }));
  }

  function open2FA(action) {
    if (action === "password") {
      if (!currentPassword || !newPassword || !confirmPassword) {
        return setStatus({ type: "error", msg: "Completa todos los campos." });
      }
      if (newPassword !== confirmPassword) {
        return setStatus({ type: "error", msg: "Las contraseñas no coinciden." });
      }
    }

    setPendingAction(action);
    setTwofaCode("");
    setValid(null);
    setShow2FAModal(true);
  }

  async function confirmAction() {
    try {
      if (pendingAction === "profile") {
        const res = await axiosClient.put("/users/me", { username, email });
        localStorage.setItem("user", JSON.stringify(res.data));
        setStatus({ type: "success", msg: "Datos actualizados." });
      }

      if (pendingAction === "password") {
        await axiosClient.post("/auth/change-password", {
          current_password: currentPassword,
          new_password: newPassword,
          twofa_code: twofaCode,
          method,
        });

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setStatus({ type: "success", msg: "Contraseña actualizada." });
      }

      setShow2FAModal(false);
    } catch (e) {
      setStatus({
        type: "error",
        msg: e.response?.data?.detail || "Error inesperado.",
      });
    }
  }

  return (
    <div className="container mt-4" style={{ maxWidth: 900 }}>
      <header className="mb-4">
        <h2 className="fw-bold mb-1">Mi perfil</h2>
        <p className="text-muted mb-0">
          Configuración de cuenta y seguridad
        </p>
      </header>

      {status && (
        <div
          className={`alert py-2 ${
            status.type === "success" ? "alert-success" : "alert-danger"
          }`}
        >
          {status.msg}
        </div>
      )}

      {/* ACORDIÓN */}

      {/* CUENTA */}
      <div className="card accordion-card mb-3 shadow-sm">
        <div
          className="card-header accordion-header d-flex justify-content-between align-items-center"
          onClick={() => toggle("account")}
        >
          <div>
            <h6 className="mb-0 fw-bold">Datos de la cuenta</h6>
            <small className="text-muted">Usuario y correo</small>
          </div>
          <i
            className={`bi bi-chevron-down accordion-icon ${
              open.account ? "open" : ""
            }`}
          />
        </div>

        <div
          className={`accordion-body ${
            open.account ? "open" : "closed"
          }`}
        >
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small">Usuario</label>
                <input
                  className="form-control form-control-sm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small">Correo electrónico</label>
                <input
                  type="email"
                  className="form-control form-control-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="text-end mt-3">
              <button
                className="btn btn-primary btn-sm px-4"
                onClick={() => open2FA("profile")}
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SEGURIDAD */}
      <div className="card accordion-card mb-3 shadow-sm">
        <div
          className="card-header accordion-header d-flex justify-content-between align-items-center"
          onClick={() => toggle("security")}
        >
          <div>
            <h6 className="mb-0 fw-bold">Seguridad</h6>
            <small className="text-muted">Contraseña y protección</small>
          </div>
          <i
            className={`bi bi-chevron-down accordion-icon ${
              open.security ? "open" : ""
            }`}
          />
        </div>

        <div
          className={`accordion-body ${
            open.security ? "open" : "closed"
          }`}
        >
          <div className="card-body">
            {[
              ["Contraseña actual", "current", currentPassword, setCurrentPassword],
              ["Nueva contraseña", "new", newPassword, setNewPassword],
              ["Confirmar nueva", "confirm", confirmPassword, setConfirmPassword],
            ].map(([label, key, value, setter]) => (
              <div key={key} className="mb-3">
                <label className="form-label small">{label}</label>
                <div className="position-relative">
                  <input
                    type={show[key] ? "text" : "password"}
                    className="form-control form-control-sm pe-5"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                  />
                  <span
                    className="password-eye"
                    onClick={() =>
                      setShow((s) => ({ ...s, [key]: !s[key] }))
                    }
                  >
                    <i
                      className={`bi ${
                        show[key] ? "bi-eye-slash" : "bi-eye"
                      }`}
                    />
                  </span>
                </div>
              </div>
            ))}

            <div className="text-end">
              <button
                className="btn btn-warning btn-sm px-4"
                onClick={() => open2FA("password")}
              >
                Cambiar contraseña
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SESIÓN */}
      <div className="card accordion-card shadow-sm border-danger">
        <div
          className="card-header accordion-header d-flex justify-content-between align-items-center"
          onClick={() => toggle("session")}
        >
          <div>
            <h6 className="mb-0 fw-bold text-danger">Sesión</h6>
            <small className="text-muted">Acciones críticas</small>
          </div>
          <i
            className={`bi bi-chevron-down accordion-icon ${
              open.session ? "open" : ""
            }`}
          />
        </div>

        <div
          className={`accordion-body ${
            open.session ? "open" : "closed"
          }`}
        >
          <div className="card-body d-flex justify-content-between align-items-center">
            <span className="text-muted small">
              Cerrar la sesión en este dispositivo
            </span>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={logout}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 2FA */}
      {show2FAModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,.6)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content theme-modal">
              <div className="modal-header theme-modal-header">
                <h6 className="modal-title fw-bold">
                  Verificación de seguridad
                </h6>
                <button
                  className="btn-close theme-modal-close"
                  onClick={() => setShow2FAModal(false)}
                />
              </div>

              <div className="modal-body">
                <label className="form-label small">Método</label>
                <select
                  className="form-select form-select-sm mb-3"
                  value={method}
                  onChange={(e) => {
                    setMethod(e.target.value);
                    setTwofaCode("");
                    setValid(null);
                  }}
                >
                  <option value="totp">Authenticator</option>
                  <option value="email">Correo</option>
                </select>

                <input
                  className="form-control form-control-sm text-center fw-bold"
                  maxLength={6}
                  value={twofaCode}
                  onChange={(e) => setTwofaCode(e.target.value)}
                />
              </div>

              <div className="modal-footer theme-modal-footer">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShow2FAModal(false)}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  disabled={!valid}
                  onClick={confirmAction}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
