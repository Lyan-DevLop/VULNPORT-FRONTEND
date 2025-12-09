import axiosClient from "./axiosClient";

export async function getPorts() {
  const res = await axiosClient.get("/ports");
  return res.data;
}

export async function getPortsByHost(host_id) {
  const res = await axiosClient.get(`/ports?host_id=${host_id}`);
  return res.data;
}


