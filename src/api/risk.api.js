import axiosClient from "./axiosClient";

export async function getRiskStatus() {
  return (await axiosClient.get("/risk/status")).data;
}

export async function createRisk(hostId) {
  return (await axiosClient.post("/risk", { host_id: hostId })).data;
}

export async function getRisks() {
  return (await axiosClient.get("/risk")).data;
}


