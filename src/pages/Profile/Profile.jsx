import { useAuth } from "../../store/AuthContext";
import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";

export default function Profile() {
  const { user, logout } = useAuth();

  // CAMPOS DEL PERFIL
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");

  // CONTRASEÑA
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 2FA
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const [method, setMethod] = useState("totp");
  const [twofaCode, setTwofaCode] = useState("");
  const [validating, setValidating] = useState(false);
  const [valid, setValid] = useState(null);

  const [secondsLeft, setSecondsLeft] = useState(600);
  const [emailSent, setEmailSent] = useState(false);

  const [status, setStatus] = useState(null);

  // TIMER correo 2FA
  useEffect(() => {
    if (method !== "email" || !show2FAModal) return;
    if (secondsLeft === 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [method, show2FAModal, secondsLeft]);

  // VALIDACIÓN CODE
  useEffect(() => {
    if (twofaCode.length !== 6) {
      setValid(null);
      return;
    }

    const timer = setTimeout(async () => {
      setValidating(true);
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
      setValidating(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [twofaCode, method]);

  // ABRIR MODAL
  function askFor2FA(action) {
    if (action === "password") {
      if (!currentPassword || !newPassword || !confirmPassword) {
        return setStatus({
          type: "error",
          msg: "Todos los campos son obligatorios.",
        });
      }

      if (newPassword !== confirmPassword) {
        return setStatus({
          type: "error",
          msg: "Las nuevas contraseñas no coinciden.",
        });
      }
    }

    setPendingAction(action);
    setTwofaCode("");
    setValid(null);
    setSecondsLeft(600);
    setEmailSent(false);
    setShow2FAModal(true);
  }

  // EJECUTAR ACCIÓN
  async function processAction() {
    try {
      if (pendingAction === "profile") {
        const res = await axiosClient.put("/users/me", { username, email });
        localStorage.setItem("user", JSON.stringify(res.data));
        setStatus({ type: "success", msg: "Perfil actualizado." });
      } else if (pendingAction === "password") {
        await axiosClient.post("/auth/change-password", {
          current_password: currentPassword,
          new_password: newPassword,
          twofa_code: twofaCode,
          method,
        });

        setStatus({
          type: "success",
          msg: "Contraseña cambiada correctamente.",
        });

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }

      setShow2FAModal(false);
    } catch (err) {
      setStatus({
        type: "error",
        msg: err.response?.data?.detail || "Error al procesar acción.",
      });
    }
  }

  // REENVIAR CORREO
  async function sendEmailCode() {
    try {
      await axiosClient.post("/twofa/email/send");
      setEmailSent(true);
      setSecondsLeft(600);
      setStatus({ type: "success", msg: "Código enviado al correo." });
    } catch {
      setStatus({ type: "error", msg: "No se pudo enviar el código." });
    }
  }

  //  UI
  return (
    <div className="container-fluid mt-4" style={{ color: "var(--text)" }}>
      <h2 className="fw-bold">
        <i className="bi bi-person-circle me-2 text-info"></i> Mi Perfil
      </h2>

      <p className="text-muted mb-4">
        Gestiona tu cuenta, seguridad y autenticación.
      </p>

      {/* ALERTA */}
      {status && (
        <div
          className={`alert mt-3 shadow-sm ${
            status.type === "success" ? "alert-success" : "alert-danger"
          }`}
        >
          {status.msg}
        </div>
      )}

      {/* SECCIÓN: INFORMACIÓN BÁSICA */}
      <div
        className="card p-4 mt-3 shadow-sm"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
        }}
      >
        <h4 className="fw-bold mb-3">
          <i className="bi bi-person-badge-fill me-2 text-info"></i>
          Información básica
        </h4>

        <div className="mb-3">
          <label className="form-label">Nombre de usuario</label>
          <input
            className="form-control"
            style={{
              background: "var(--input-bg)",
              color: "var(--input-text)",
              borderColor: "var(--input-border)",
            }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            style={{
              background: "var(--input-bg)",
              color: "var(--input-text)",
              borderColor: "var(--input-border)",
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          className="btn btn-info mt-3 w-100 fw-bold"
          onClick={() => askFor2FA("profile")}
        >
          Guardar cambios
        </button>
      </div>

      {/* SECCIÓN: CONTRASEÑA */}
      <div
        className="card p-4 mt-4 shadow-sm"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
        }}
      >
        <h4 className="fw-bold mb-3">
          <i className="bi bi-shield-lock-fill text-warning me-2"></i>
          Seguridad: Cambiar contraseña
        </h4>

        {/* Contraseña actual */}
        <div className="mb-3 position-relative">
          <label className="form-label">Contraseña actual</label>
          <input
            type={showCurrent ? "text" : "password"}
            className="form-control"
            style={{
              background: "var(--input-bg)",
              color: "var(--input-text)",
              borderColor: "var(--input-border)",
            }}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <i
            className={`bi ${
              showCurrent ? "bi-eye-slash" : "bi-eye"
            } text-info`}
            style={{
              position: "absolute",
              right: 12,
              top: 40,
              cursor: "pointer",
            }}
            onClick={() => setShowCurrent(!showCurrent)}
          />
        </div>

        {/* Nueva */}
        <div className="mb-3 position-relative">
          <label className="form-label">Nueva contraseña</label>
          <input
            type={showNew ? "text" : "password"}
            className="form-control"
            style={{
              background: "var(--input-bg)",
              color: "var(--input-text)",
              borderColor: "var(--input-border)",
            }}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <i
            className={`bi ${showNew ? "bi-eye-slash" : "bi-eye"} text-info`}
            style={{
              position: "absolute",
              right: 12,
              top: 40,
              cursor: "pointer",
            }}
            onClick={() => setShowNew(!showNew)}
          />
        </div>

        {/* Confirmación */}
        <div className="mb-3 position-relative">
          <label className="form-label">Confirmar nueva</label>
          <input
            type={showConfirm ? "text" : "password"}
            className="form-control"
            style={{
              background: "var(--input-bg)",
              color: "var(--input-text)",
              borderColor: "var(--input-border)",
            }}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <i
            className={`bi ${showConfirm ? "bi-eye-slash" : "bi-eye"} text-info`}
            style={{
              position: "absolute",
              right: 12,
              top: 40,
              cursor: "pointer",
            }}
            onClick={() => setShowConfirm(!showConfirm)}
          />
        </div>

        <button
          className="btn btn-warning fw-bold w-100"
          onClick={() => askFor2FA("password")}
        >
          <i className="bi bi-key me-2"></i>
          Cambiar contraseña
        </button>
      </div>

      {/* LOGOUT */}
      <button className="btn btn-danger w-100 mt-4 fw-bold" onClick={logout}>
        <i className="bi bi-box-arrow-right me-2"></i>
        Cerrar sesión
      </button>

      {/* ============================
          MODAL 2FA
      ============================ */}
      {show2FAModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content text-white"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
              }}
            >
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-shield-lock-fill text-info me-2"></i>
                  Validación 2FA
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShow2FAModal(false)}
                />
              </div>

              <div className="modal-body">

                {/* Método */}
                <label className="form-label">Método de validación</label>
                <select
                  className="form-select mb-3"
                  style={{
                    background: "var(--input-bg)",
                    color: "var(--input-text)",
                    borderColor: "var(--input-border)",
                  }}
                  value={method}
                  onChange={(e) => {
                    setMethod(e.target.value);
                    setTwofaCode("");
                    setValid(null);
                    setSecondsLeft(600);
                    setEmailSent(false);
                  }}
                >
                  <option value="totp">App Authenticator</option>
                  <option value="email">Correo electrónico</option>
                </select>

                {method === "email" && (
                  <>
                    <button
                      className="btn btn-secondary w-100 fw-bold mb-3"
                      onClick={sendEmailCode}
                    >
                      <i className="bi bi-envelope me-2"></i>
                      Enviar código al correo
                    </button>

                    {emailSent && (
                      <div className="text-center text-muted mb-3">
                        Código expira en{" "}
                        <span className="fw-bold">
                          {Math.floor(secondsLeft / 60)}:
                          {String(secondsLeft % 60).padStart(2, "0")}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Código */}
                <label className="form-label">Código 2FA</label>
                <div className="position-relative">
                  <input
                    type="text"
                    maxLength={6}
                    className="form-control"
                    style={{
                      background: "var(--input-bg)",
                      color: "var(--input-text)",
                      borderColor: "var(--input-border)",
                    }}
                    value={twofaCode}
                    onChange={(e) => setTwofaCode(e.target.value)}
                  />

                  {twofaCode.length === 6 && (
                    <div style={{ position: "absolute", right: 12, top: 8 }}>
                      {validating ? (
                        <div className="spinner-border spinner-border-sm text-info" />
                      ) : valid ? (
                        <i className="bi bi-check-circle-fill text-success fs-4" />
                      ) : (
                        <i className="bi bi-x-circle-fill text-danger fs-4" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer border-secondary">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShow2FAModal(false)}
                >
                  Cancelar
                </button>

                <button
                  className="btn btn-info fw-bold"
                  disabled={twofaCode.length !== 6 || !valid}
                  onClick={processAction}
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
