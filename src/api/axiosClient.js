import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
  withCredentials: false,
});

// Axios aislado para refresh token
const axiosRefresh = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
});

// INYECTAR ACCESS TOKEN
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers.Accept = "application/json";

  return config;
});

// INTERCEPTOR REFRESH TOKEN
axiosClient.interceptors.response.use(
  (res) => res,

  async (error) => {
    const original = error.config;

    // Si no es 401 → error normal
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Evitar loops infinitos
    if (original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) throw new Error("No hay refresh token");

      const res = await axiosRefresh.post("/auth/refresh", {
        refresh_token: refreshToken,
      });

      const newToken = res.data.access_token;

      // Guardar nuevo token
      localStorage.setItem("token", newToken);

      // Reintentar la request original
      original.headers.Authorization = `Bearer ${newToken}`;
      return axiosClient(original);

    } catch (err) {
      console.error("Refresh falló. Cerrando sesión.");

      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");

      window.location.href = "/login";
      return Promise.reject(err);
    }
  }
);

export default axiosClient;
