import axiosClient from "./axiosClient";

// REST: Escaneo Individual
export async function scanSingle(ip, ports) {
  return (
    await axiosClient.post("/scan/single", {
      ip,
      ports: ports || null,
    })
  ).data;
}

// REST: Escaneo de Rango
export async function scanRange(network, ports) {
  return (
    await axiosClient.post("/scan/range", {
      network,
      ports: ports || null,
    })
  ).data;
}

// REST: Auto-Scan
export async function autoScanRest() {
  return (await axiosClient.get("/scan/auto")).data;
}

// WS: Auto Scan
// (WebSocket con token, oficial)
export function connectAutoScanWS(onMessage, onClose) {
  const token = localStorage.getItem("token");

  const ws = new WebSocket(
    `ws://127.0.0.1:8000/scan/auto/ws?token=${token}`
  );

  ws.onmessage = onMessage;
  ws.onclose = onClose;

  return ws;
}

export const connectScanWS = connectAutoScanWS;





