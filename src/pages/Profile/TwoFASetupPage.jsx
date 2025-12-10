import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import TwoFAStatus from "../../components/TwoFAStatus";
import QRCode from "react-qr-code";
import { useAuth } from "../../store/AuthContext";

export default function TwoFASetupPage() {
  const { user } = useAuth();

  const [secret, setSecret] = useState(null);
  const [totpUri, setTotpUri] = useState(null);
  const [method, setMethod] = useState("totp");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [validating, setValidating] = useState(false);
  const [totpValid, setTotpValid] = useState(null);

  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  const [showDisable, setShowDisable] = useState(false);
  const [loadingDisable, setLoadingDisable] = useState(false);

  // ESTADO INICIAL
  useEffect(() => {
    axiosClient.get("/twofa/status").then((res) => {
      setTwoFAEnabled(res.data.is_enabled);
    });
  }, []);

  // GENERAR SECRETO TOTP + URI PARA QR
  async function generateSecret() {
    const res = await axiosClient.post("/twofa/generate-secret");

    const newSecret = res.data.secret;
    setSecret(newSecret);

    const uri = `otpauth://totp/VULNPORTS:${encodeURIComponent(
      user.email
    )}?secret=${newSecret}&issuer=VULNPORTS&digits=6&period=30`;

    setTotpUri(uri);
    setMsg("Código secreto generado. Escanea el QR.");
  }

  // ENVIAR CÓDIGO POR EMAIL
  async function sendEmailCode() {
    await axiosClient.post("/twofa/email/send");
    setMsg("Código enviado al correo.");
  }

  // ACTIVAR 2FA
  async function verify() {
    try {
      const res = await axiosClient.post("/twofa/verify", {
        method,
        code,
      });

      setMsg(res.data.message);
      setTwoFAEnabled(true);
      setCode("");
      setTotpValid(null);
      setTotpUri(null);
      setSecret(null);
    } catch {
      setMsg("Código incorrecto.");
    }
  }

  // DESACTIVAR 2FA
  async function disable2FA() {
    setLoadingDisable(true);

    try {
      const res = await axiosClient.post("/twofa/disable", { code });

      setMsg(res.data.message);
      setTwoFAEnabled(false);
      setSecret(null);
      setTotpUri(null);
      setCode("");
      setShowDisable(false);
    } catch {
      setMsg("Código inválido. No se pudo desactivar.");
    }

    setLoadingDisable(false);
  }

  // VALIDACIÓN REALTIME — SOLO TOTP
  useEffect(() => {
    if (method !== "totp") return setTotpValid(null);
    if (code.length !== 6) return setTotpValid(null);

    const timer = setTimeout(async () => {
      setValidating(true);

      try {
        const res = await axiosClient.post("/auth/check-2fa", {
          user_id: user.id,
          method: "totp",
          code,
        });

        setTotpValid(res.data.valid);
      } catch {
        setTotpValid(false);
      }

      setValidating(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [code, method]);

  return (
    <div className="container py-4 text-white">
      <h2 className="fw-bold mb-4">
        <i className="bi bi-shield-lock-fill text-info me-2"></i>
        Configuración de Autenticación 2FA
      </h2>

      <TwoFAStatus />

      <div
        className="card p-4 mt-4 shadow-lg"
        style={{
          background: "rgba(15,23,42,0.85)",
          borderRadius: 18,
          border: "1px solid rgba(0,238,255,0.25)",
        }}
      >
        {/* 2FA ACTIVADO */}
        {twoFAEnabled ? (
          <>
            <h4 className="fw-bold mb-3 text-success">
              <i className="bi bi-shield-check me-2"></i>
              Autenticación 2FA Activa
            </h4>

            <p className="text-muted">
              Tu cuenta está protegida con autenticación de dos factores.
            </p>

            <button
              className="btn btn-danger fw-bold w-100 mt-3"
              onClick={() => setShowDisable(true)}
            >
              <i className="bi bi-shield-slash me-2"></i>
              Desactivar 2FA
            </button>
          </>
        ) : (
          <>
            {/* ==== Generar Secreto ==== */}
            <h4 className="fw-bold mb-3">
              <i className="bi bi-phone text-info me-1"></i>
              1. Activar con App Authenticator
            </h4>

            <button
              className="btn btn-info fw-bold w-100 mb-3"
              onClick={generateSecret}
            >
              <i className="bi bi-qr-code-scan me-2"></i>
              Generar Código Secreto
            </button>

            {/* ==== Mostrar QR generado ==== */}
            {totpUri && (
              <div className="text-center my-3">
                <div className="p-3 rounded bg-dark border border-info d-inline-block">
                  <QRCode value={totpUri} size={220} />
                </div>

                <p className="text-info mt-2">
                  Escanea este código con Authy / Google Authenticator
                </p>

                {/* ==== Mostrar secreto manual ==== */}
                {secret && (
                  <div className="mt-3 text-center">
                    <p className="text-info mb-1">
                      O ingresa este código manualmente:
                    </p>

                    <div
                      className="d-flex justify-content-between align-items-center px-3 py-2 mx-auto"
                      style={{
                        maxWidth: 280,
                        background: "#0f172a",
                        border: "1px solid rgba(0,238,255,0.3)",
                        borderRadius: 10,
                        color: "#00eaff",
                        fontFamily: "monospace",
                        fontSize: "1.1rem",
                      }}
                    >
                      <span>{secret}</span>

                      <button
                        className="btn btn-sm btn-outline-info ms-2"
                        onClick={() => navigator.clipboard.writeText(secret)}
                      >
                        <i className="bi bi-clipboard"></i>
                      </button>
                    </div>

                    <p className="text-secondary mt-2 small">
                      Puedes escribir este código manualmente en Authy / Google
                      Authenticator.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ==== Confirmación ==== */}
            <hr className="border-secondary my-4" />

            <h4 className="fw-bold mb-3">
              <i className="bi bi-key-fill text-warning me-1"></i>
              2. Confirmar Activación
            </h4>

            <select
              className="form-select mb-3"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="totp">App Authenticator</option>
              <option value="email">Código por correo</option>
            </select>

            {method === "email" && (
              <button
                className="btn btn-secondary fw-bold mb-3"
                onClick={sendEmailCode}
              >
                <i className="bi bi-envelope me-2"></i>
                Enviar Código por correo
              </button>
            )}

            <input
              type="text"
              maxLength={6}
              className="form-control text-center fs-4"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            {code.length === 6 && method === "totp" && (
              <div className="text-center my-2">
                {validating ? (
                  <div className="spinner-border text-info"></div>
                ) : totpValid ? (
                  <i className="bi bi-check-circle-fill text-success fs-3"></i>
                ) : (
                  <i className="bi bi-x-circle-fill text-danger fs-3"></i>
                )}
              </div>
            )}

            <button className="btn btn-success w-100 fw-bold" onClick={verify}>
              Activar 2FA
            </button>
          </>
        )}

        {msg && <div className="alert alert-info mt-4">{msg}</div>}
      </div>

      {/* ===== Modal Desactivar ===== */}
      {showDisable && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title text-danger">
                  Desactivar Autenticación 2FA
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowDisable(false)}
                ></button>
              </div>

              <div className="modal-body">
                Ingresa tu código 2FA:
                <input
                  className="form-control mt-2"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDisable(false)}
                >
                  Cancelar
                </button>

                <button
                  className="btn btn-danger"
                  onClick={disable2FA}
                  disabled={loadingDisable}
                >
                  {loadingDisable ? "Desactivando..." : "Desactivar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
