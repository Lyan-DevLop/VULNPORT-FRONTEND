import { useAuth } from "../store/AuthContext";

export default function TwoFAStatus() {
  const { user } = useAuth();

  if (!user) return null;

  const enabled = user.is_2fa_enabled;

  return (
    <div
      className="mt-3 p-3"
      style={{
        borderRadius: "12px",
        backgroundColor: enabled ? "#e6ffed" : "#ffeaea",
        border: `1px solid ${enabled ? "#2ecc71" : "#e74c3c"}`,
      }}
    >
      <div className="d-flex align-items-center">
        <i
          className={`bi ${
            enabled
              ? "bi-shield-lock-fill text-success"
              : "bi-shield-slash text-danger"
          } me-2`}
          style={{ fontSize: "1.3rem" }}
        ></i>

        <strong className={enabled ? "text-success" : "text-danger"}>
          {enabled
            ? "La autenticación 2FA está activada"
            : "La autenticación 2FA está desactivada"}
        </strong>
      </div>
    </div>
  );
}
