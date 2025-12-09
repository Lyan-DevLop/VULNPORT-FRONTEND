import axiosClient from "./axiosClient";

// ==================================================
// LOGIN (FASE 1)
// ==================================================
export async function login(username, password) {
  const data = new FormData();
  data.append("username", username);
  data.append("password", password);

  const res = await axiosClient.post("/auth/login", data);

  // Si el backend dice que necesita 2FA, NO guardamos token todavía
  if (res.data.needs_2fa) {
    return {
      needs_2fa: true,
      user_id: res.data.user_id,
      methods: res.data.methods,
    };
  }

  // LOGIN NORMAL (sin 2FA)
  if (res.data.access_token) {
    localStorage.setItem("token", res.data.access_token);
    localStorage.setItem("refresh_token", res.data.refresh_token);
  }

  return res.data;
}

// ==================================================
// LOGIN (FASE 2) - VALIDAR CÓDIGO 2FA
// ==================================================
export async function verify2FA(user_id, method, code) {
  const res = await axiosClient.post("/auth/login/2fa", {
    user_id,
    method,
    code,
  });

  if (res.data.access_token) {
    localStorage.setItem("token", res.data.access_token);
    localStorage.setItem("refresh_token", res.data.refresh_token);
  }

  return res.data;
}

// ==================================================
// LOGOUT
// ==================================================
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
}

// ==================================================
// REGISTRO
// ==================================================
export async function register(username, email, password) {
  const data = new FormData();
  data.append("username", username);
  data.append("email", email);
  data.append("password", password);

  const res = await axiosClient.post("/users/", data);
  return res.data;
}

// ==================================================
// CAMBIO DE CONTRASEÑA CON 2FA
// ==================================================
export async function changePassword(currentPassword, newPassword, twofaCode, method = "email") {
  const res = await axiosClient.post("/auth/change-password", {
    current_password: currentPassword,
    new_password: newPassword,
    twofa_code: twofaCode,
    method,
  });

  return res.data;
}



