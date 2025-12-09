import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import axiosClient from "../../api/axiosClient";

export default function TwoFactorPage() {
  const { verify2FA, twoFAMethods, twoFAUserId } = useAuth();
  const navigate = useNavigate();

  const [method, setMethod] = useState("totp");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const [validating, setValidating] = useState(false);
  const [valid, setValid] = useState(null);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(600);
  const [emailSent, setEmailSent] = useState(false);

  const isEmail = method === "email";

  // Seleccionar método inicial
  useEffect(() => {
    if (twoFAMethods.length > 0) {
      setMethod(twoFAMethods[0]);
    }
  }, [twoFAMethods]);

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text");
    if (/^\d{6}$/.test(text)) {
      const digits = text.split("");
      setOtp(digits);
      inputsRef.current[5]?.focus();
    }
  };

  const code = otp.join("");

  // Temporizador SOLO si el correo ya fue enviado
  useEffect(() => {
    if (!isEmail || !emailSent) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isEmail, emailSent]);

  // Ya NO enviamos el correo automáticamente
  // (Antes aquí se enviaba, ahora ya no)

  // Validación realtime
  useEffect(() => {
    if (code.length !== 6 || !twoFAUserId) {
      setValid(null);
      return;
    }

    const delay = setTimeout(async () => {
      setValidating(true);
      try {
        const res = await axiosClient.post("/auth/check-2fa", {
          user_id: twoFAUserId,
          method,
          code,
        });
        setValid(res.data.valid);
      } catch {
        setValid(false);
      }
      setValidating(false);
    }, 350);

    return () => clearTimeout(delay);
  }, [code, method, twoFAUserId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await verify2FA(code, method);
      navigate("/", { replace: true });
    } catch {
      setError("Código incorrecto.");
    }

    setLoading(false);
  }

  // Enviar código al correo MANUALMENTE
  async function sendEmailCode() {
    if (!twoFAUserId) return;

    try {
      await axiosClient.post("/auth/login/email/send", {
        user_id: twoFAUserId,
      });

      setSecondsLeft(600);
      setEmailSent(true);
      setError("");
    } catch {
      setError("No se pudo enviar el código al correo.");
    }
  }

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-dark">
      <div className="card p-4 shadow" style={{ width: 420 }}>
        <h3 className="text-center mb-3 fw-bold">
          <i className="bi bi-shield-lock-fill me-2"></i> Verificación 2FA
        </h3>

        <form onSubmit={handleSubmit}>

          {/* Método */}
          <label className="form-label fw-semibold">Método</label>
          <select
            className="form-select mb-3"
            value={method}
            onChange={(e) => {
              setMethod(e.target.value);
              setOtp(["", "", "", "", "", ""]);
              setValid(null);
              setError("");

              if (e.target.value === "email") {
                setEmailSent(false);
                setSecondsLeft(600);
              }
            }}
          >
            {twoFAMethods.includes("totp") && (
              <option value="totp">App Authenticator</option>
            )}
            {twoFAMethods.includes("email") && (
              <option value="email">Correo electrónico</option>
            )}
          </select>

          {/* SI EL MÉTODO ES EMAIL Y AÚN NO SE HA ENVIADO EL CÓDIGO */}
          {isEmail && !emailSent && (
            <div className="text-center my-3">
              <button
                type="button"
                className="btn btn-secondary w-100 fw-bold"
                onClick={sendEmailCode}
              >
                <i className="bi bi-envelope-fill me-2"></i>
                Enviar código al correo
              </button>
            </div>
          )}

          {/* SOLO MOSTRAR INPUTS DESPUÉS DE ENVIAR EL CORREO */}
          {(!isEmail || emailSent) && (
            <>
              <label className="form-label fw-semibold">Código de 6 dígitos</label>

              <div className="d-flex justify-content-between mb-3" onPaste={handlePaste}>
                {otp.map((v, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    className="form-control text-center"
                    style={{ width: "50px", fontSize: "1.5rem" }}
                    maxLength={1}
                    value={v}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                  />
                ))}
              </div>

              {code.length === 6 && (
                <div className="text-center mb-2">
                  {validating ? (
                    <div className="spinner-border text-info"></div>
                  ) : valid === true ? (
                    <i className="bi bi-check-circle-fill text-success fs-3"></i>
                  ) : valid === false ? (
                    <i className="bi bi-x-circle-fill text-danger fs-3"></i>
                  ) : null}
                </div>
              )}

              {isEmail && (
                <div className="text-center mb-3 text-muted">
                  Código expira en:{" "}
                  <span className="fw-bold">
                    {Math.floor(secondsLeft / 60)}:
                    {String(secondsLeft % 60).padStart(2, "0")}
                  </span>

                  {secondsLeft === 0 && emailSent && (
                    <button
                      type="button"
                      className="btn btn-link text-info ms-2"
                      onClick={sendEmailCode}
                    >
                      Reenviar código
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {error && <div className="alert alert-danger">{error}</div>}

          <button
            className="btn btn-info w-100 fw-bold"
            disabled={code.length !== 6 || loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Verificando...
              </>
            ) : (
              <>
                <i className="bi bi-unlock-fill me-2"></i>
                Ingresar
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
